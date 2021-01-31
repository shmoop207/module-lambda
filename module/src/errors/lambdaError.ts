import {ILambdaResult} from "../interfaces/ILambdaResult";

export interface ILambdaErrorParams<T> {
    statusCode?: number,
    msg?: string,
    error?: Error | string,
    errorMsg?: string,
    data?: T,
    code?: number
}

export class LambdaError<T> extends Error {

    private readonly _params: ILambdaErrorParams<T>

    constructor(params: ILambdaErrorParams<T> = {}) {
        super(params.msg);

        this._params = params;

        Object.setPrototypeOf(this, LambdaError.prototype);
    }

    public statusCode(statusCode: number): this {
        this._params.statusCode = statusCode;
        return this;
    }

    public msg(msg: string): this {
        this._params.msg = msg;
        return this;
    }

    public code(code: number): this {
        this._params.code = code;
        return this;
    }

    public data(data: T): this {
        this._params.data = data;
        return this;
    }

    public error(err: Error): this {
        this._params.error = err;
        return this;
    }

    public errorMsg(err: string): this {
        this._params.errorMsg = err;
        return this;
    }

    public get params() {
        return this._params;
    }

    public toJSON(): ILambdaErrorParams<T> {

        let dto: any = {...this._params};

        if (this._params.error) {
            let err = (this._params.error as Error)
            dto.error = err.stack || err.message || err.toString();
        }

        return dto;
    }

    public static serializeError<T>(e: Error): ILambdaResult<ILambdaErrorParams<T>> {

        let err: LambdaError<any>;

        if (e instanceof LambdaError) {
            err = e;
        } else {
            err = new LambdaError()
                .msg(e.message)
                .error(e)
                .statusCode(500)
        }

        return {
            statusCode: err.params.statusCode || 500,
            body: err.toJSON()
        }
    }
}
