import {define, lazy, inject, singleton} from '@appolo/inject';
import {LambdaProvider} from "./lambdaProvider";
import {ILambdaOptions} from "./interfaces/IOptions";

export type LambdaParamsType<T extends Lambda<P, S>, P = any, S = any> = T extends Lambda<infer P, S> ? P : any;
export type LambdaResultsType<T extends Lambda<P, S>, P = any, S = any> = T extends Lambda<P, infer S> ? S : any;

@define()
export class Lambda<T extends { [index: string]: any } = any, K = any> {

    protected _lambda: string;
    protected _timeout: number;
    protected _params: { [index: string]: any } = {}


    @lazy() private lambdaProvider: LambdaProvider;

    public lambda(lambda: string): this {
        this._lambda = lambda;
        return this
    }

    public params(params: T): this {
        this._params = params;
        return this
    }

    public timeout(timeout: number): this {
        this._timeout = timeout;
        return this
    }

    public toJSON(): ILambdaOptions<T> {
        return {
            lambda: this._lambda,
            params: {...this._params} as T,
            timeout: this._timeout
        }
    }

    public run(): Promise<K> {
        return this.lambdaProvider.run({lambda: this._lambda, params: this._params})
    }

    public runAsync(): Promise<{ status: number, requestId: string }> {
        return this.lambdaProvider.runAsync({lambda: this._lambda, params: this._params})
    }
}
