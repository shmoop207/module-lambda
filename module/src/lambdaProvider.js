"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaProvider = void 0;
const tslib_1 = require("tslib");
const inject_1 = require("@appolo/inject");
const index_1 = require("../../index");
const client_lambda_1 = require("@aws-sdk/client-lambda");
const lambda_1 = require("./lambda");
let LambdaProvider = class LambdaProvider {
    _initialize() {
        this.lambdaClient = new client_lambda_1.LambdaClient({
            credentials: {
                accessKeyId: this.moduleOptions.accessKeyId,
                secretAccessKey: this.moduleOptions.secretAccessKey
            },
            region: this.moduleOptions.region,
        });
    }
    create(klass, ...runtimeArgs) {
        let instance = this.injector.wire(klass, runtimeArgs);
        return instance;
    }
    createLambda() {
        return this.createLambdaFn();
    }
    async runAsync(options) {
        let lambda = options.lambda || this.moduleOptions.defaultLambda;
        const params = new client_lambda_1.InvokeCommand({
            FunctionName: lambda,
            Payload: this._preparePayLoad(options.params),
            InvocationType: "Event"
        });
        let result = await this.lambdaClient.send(params);
        this._checkLambdaResult(result, lambda, options);
        return {
            status: result.$metadata.httpStatusCode,
            requestId: result.$metadata.requestId
        };
    }
    async run(options) {
        let lambda = options.lambda || this.moduleOptions.defaultLambda;
        const params = new client_lambda_1.InvokeCommand({
            FunctionName: lambda,
            Payload: this._preparePayLoad(options.params),
            InvocationType: "RequestResponse"
        });
        let result = await this.lambdaClient.send(params);
        let payload = new TextDecoder().decode(result.Payload);
        this._checkLambdaResult(result, lambda, options);
        let data = JSON.parse(payload);
        this._checkLambdaDataResult(data, lambda, options);
        return data === null || data === void 0 ? void 0 : data.body;
    }
    _checkLambdaResult(result, lambda, options) {
        let statusCode = result.StatusCode || result.$metadata.httpStatusCode;
        if (statusCode < 400) {
            return;
        }
        throw new index_1.LambdaError()
            .msg(`failed to execute lambda ${lambda} ${statusCode}`)
            .data(options.params);
    }
    _checkLambdaDataResult(data, lambda, options) {
        let statusCode = data === null || data === void 0 ? void 0 : data.statusCode;
        if (statusCode < 400) {
            return;
        }
        let body = data.body;
        let err = new index_1.LambdaError(Object.assign({}, data.body))
            .msg(`failed to execute lambda ${lambda} ${statusCode}`)
            .error(new Error(body.error))
            .errorMsg(body.msg);
        throw err;
    }
    _preparePayLoad(params) {
        return new TextEncoder().encode(JSON.stringify(params));
    }
};
tslib_1.__decorate([
    inject_1.inject()
], LambdaProvider.prototype, "moduleOptions", void 0);
tslib_1.__decorate([
    inject_1.inject()
], LambdaProvider.prototype, "injector", void 0);
tslib_1.__decorate([
    inject_1.factoryMethod(lambda_1.Lambda)
], LambdaProvider.prototype, "createLambdaFn", void 0);
tslib_1.__decorate([
    inject_1.init()
], LambdaProvider.prototype, "_initialize", null);
LambdaProvider = tslib_1.__decorate([
    inject_1.define(),
    inject_1.singleton()
], LambdaProvider);
exports.LambdaProvider = LambdaProvider;
//# sourceMappingURL=lambdaProvider.js.map