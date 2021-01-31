"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaError = void 0;
class LambdaError extends Error {
    constructor(params = {}) {
        super(params.msg);
        this._params = params;
        Object.setPrototypeOf(this, LambdaError.prototype);
    }
    statusCode(statusCode) {
        this._params.statusCode = statusCode;
        return this;
    }
    msg(msg) {
        this._params.msg = msg;
        return this;
    }
    code(code) {
        this._params.code = code;
        return this;
    }
    data(data) {
        this._params.data = data;
        return this;
    }
    error(err) {
        this._params.error = err;
        return this;
    }
    errorMsg(err) {
        this._params.errorMsg = err;
        return this;
    }
    get params() {
        return this._params;
    }
    toJSON() {
        let dto = Object.assign({}, this._params);
        if (this._params.error) {
            let err = this._params.error;
            dto.error = err.stack || err.message || err.toString();
        }
        return dto;
    }
    static serializeError(e) {
        let err;
        if (e instanceof LambdaError) {
            err = e;
        }
        else {
            err = new LambdaError()
                .msg(e.message)
                .error(e)
                .statusCode(500);
        }
        return {
            statusCode: err.params.statusCode || 500,
            body: err.toJSON()
        };
    }
}
exports.LambdaError = LambdaError;
//# sourceMappingURL=lambdaError.js.map