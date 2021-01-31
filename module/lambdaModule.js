"use strict";
var LambdaModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaModule = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("@appolo/engine");
const index_1 = require("../index");
let LambdaModule = LambdaModule_1 = class LambdaModule extends engine_1.Module {
    constructor() {
        super(...arguments);
        this.Defaults = { id: "lambdaProvider" };
    }
    static for(options) {
        return { type: LambdaModule_1, options };
    }
    get exports() {
        return [{ type: index_1.LambdaProvider, id: this.moduleOptions.id }];
    }
};
LambdaModule = LambdaModule_1 = tslib_1.__decorate([
    engine_1.module()
], LambdaModule);
exports.LambdaModule = LambdaModule;
//# sourceMappingURL=lambdaModule.js.map