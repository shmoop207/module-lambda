import {define, lazy, inject, singleton} from '@appolo/inject';
import {LambdaProvider} from "./lambdaProvider";

@define()
export class Lambda<T extends { [index: string]: any } = any, K = any> {

    private _lambda: string
    private _params: { [index: string]: any }


    @lazy() private lambdaProvider: LambdaProvider;

    public lambda(lambda: string): this {
        this._lambda = lambda;
        return this
    }
    public params(params: T): this {
        this._params = params;
        return this
    }

    public run(): Promise<K> {
        return this.lambdaProvider.run({lambda: this._lambda, params: this._params})
    }

    public runAsync(): Promise<{ status: number, requestId: string }> {
        return this.lambdaProvider.runAsync({lambda: this._lambda, params: this._params})
    }
}
