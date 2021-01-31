"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const engine_1 = require("@appolo/engine");
const inject_1 = require("@appolo/inject");
const index_1 = require("../index");
let should = require('chai').should();
describe("Lambda module Spec", function () {
    let app;
    beforeEach(async () => {
        app = engine_1.createApp({ root: process.cwd() + '/test/mock/', environment: "production" });
        app.module.use(index_1.LambdaModule.for({
            "region": process.env.region,
            "accessKeyId": process.env.accessKeyId,
            "secretAccessKey": process.env.secretAccessKey,
            defaultLambda: process.env.defaultLambda
        }));
        await app.launch();
    });
    afterEach(async () => {
        await app.reset();
    });
    it('should get data', async () => {
        let Test = class Test extends index_1.Lambda {
        };
        Test = tslib_1.__decorate([
            inject_1.define()
        ], Test);
        let data = await app.injector.get(index_1.LambdaProvider)
            .create(Test)
            .params({ type: "test", params: { test: 3, err: false } })
            .run();
        data.params.test.should.be.eq(4);
        data.result.should.be.eq(3);
    });
});
//# sourceMappingURL=spec.js.map