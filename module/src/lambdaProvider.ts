"use strict";
import {define, init, inject, singleton, factoryMethod, FactoryFn, Injector} from '@appolo/inject';
import {ILambdaResult, IOptions, LambdaError} from "../../index";
import {LambdaClient, InvokeCommand, InvokeCommandOutput} from "@aws-sdk/client-lambda"
import {Lambda} from "./lambda";
import {ILambdaErrorParams} from "./errors/lambdaError";

@define()
@singleton()
export class LambdaProvider {

    @inject() private moduleOptions: IOptions;
    @inject() private injector: Injector;
    @factoryMethod(Lambda) private createLambdaFn: FactoryFn<typeof Lambda>;

    private lambdaClient: LambdaClient;

    @init()
    private _initialize() {
        this.lambdaClient = new LambdaClient({

            credentials: {
                accessKeyId: this.moduleOptions.accessKeyId,
                secretAccessKey: this.moduleOptions.secretAccessKey
            },
            region: this.moduleOptions.region,

        });
    }

    public create<T extends new (...args: any) => Lambda<P, S>, P, S>(klass: T, ...runtimeArgs: ConstructorParameters<T>): InstanceType<T> {
        let instance = this.injector.wire(klass, runtimeArgs);

        return instance;
    }

    public createLambda<T extends { [index: string]: any } = any, K = any>(): Lambda<T, K> {
        return this.createLambdaFn() as Lambda<T, K>;
    }

    public async runAsync<T extends { [index: string]: any }>(options: { lambda?: string, params: T }): Promise<{ status: number, requestId: string }> {

        let lambda = options.lambda || this.moduleOptions.defaultLambda;

        const params = new InvokeCommand({
            FunctionName: lambda,
            Payload: this._preparePayLoad(options.params),
            InvocationType: "Event"
        });

        let result = await this.lambdaClient.send(params);

        this._checkLambdaResult(result, lambda, options)

        return {
            status: result.$metadata.httpStatusCode,
            requestId: result.$metadata.requestId
        }
    }

    public async run<K, T extends { [index: string]: any }>(options: { lambda?: string, params: T }): Promise<K> {

        let lambda = options.lambda || this.moduleOptions.defaultLambda;


        const params = new InvokeCommand({
            FunctionName: lambda,
            Payload: this._preparePayLoad(options.params),
            InvocationType: "RequestResponse"
        });

        let result = await this.lambdaClient.send(params)

        let payload = new TextDecoder().decode(result.Payload);

        this._checkLambdaResult(result, lambda, options);

        let data: ILambdaResult<K> = JSON.parse(payload);

        this._checkLambdaDataResult(data, lambda, options)

        return data?.body;


    }

    private _checkLambdaResult(result: InvokeCommandOutput, lambda: string, options: { lambda?: string, params: any }) {
        let statusCode = result.StatusCode || result.$metadata.httpStatusCode;

        if (statusCode < 400) {
            return;
        }

        throw new LambdaError()
            .msg(`failed to execute lambda ${lambda} ${statusCode}`)
            .data(options.params)

    }

    private _checkLambdaDataResult(data: ILambdaResult<any>, lambda: string, options: { lambda?: string, params: any }) {
        let statusCode = data?.statusCode;

        if (statusCode < 400) {
            return;
        }

        let body: ILambdaErrorParams<any> = data.body;

        let err = new LambdaError({...data.body})
            .msg(`failed to execute lambda ${lambda} ${statusCode}`)
            .error(new Error(body.error as string))
            .errorMsg(body.msg);

        throw err;
    }

    private _preparePayLoad(params: { [index: string]: any }): Uint8Array {
        return new TextEncoder().encode(JSON.stringify(params));
    }


}

