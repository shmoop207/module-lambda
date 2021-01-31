"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = require("@appolo/engine");
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
        let data = await app.injector.get(index_1.LambdaProvider)
            .create()
            .params({ type: "test", params: { test: 3, err: false } })
            .run();
        data.params.test.should.be.eq(4);
        data.result.should.be.eq(3);
    });
});
//# sourceMappingURL=spec.js.map