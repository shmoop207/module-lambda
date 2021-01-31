"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lambda = void 0;
const tslib_1 = require("tslib");
const inject_1 = require("@appolo/inject");
let Lambda = class Lambda {
    lambda(lambda) {
        this._lambda = lambda;
        return this;
    }
    params(params) {
        this._params = params;
        return this;
    }
    run() {
        return this.lambdaProvider.run({ lambda: this._lambda, params: this._params });
    }
    runAsync() {
        return this.lambdaProvider.runAsync({ lambda: this._lambda, params: this._params });
    }
};
tslib_1.__decorate([
    inject_1.lazy()
], Lambda.prototype, "lambdaProvider", void 0);
Lambda = tslib_1.__decorate([
    inject_1.define()
], Lambda);
exports.Lambda = Lambda;
//# sourceMappingURL=lambda.js.map