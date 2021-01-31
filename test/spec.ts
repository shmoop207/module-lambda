import {App, createApp} from '@appolo/engine'
import {define} from '@appolo/inject'
import {Lambda, LambdaModule, LambdaProvider} from '../index'
import {Promises} from "@appolo/utils";

let should = require('chai').should();


describe("Lambda module Spec", function () {

    let app: App;

    beforeEach(async () => {

        app = createApp({root: process.cwd() + '/test/mock/', environment: "production"});

        app.module.use(LambdaModule.for({
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

        @define()
        class Test extends Lambda<{type:string, params:{test: number, err: boolean} },{ result: number, type: string, params: { test: number } }>{

        }

        let data = await app.injector.get<LambdaProvider>(LambdaProvider)
            .create(Test)
            .params({type: "test", params: {test: 3, err: false}})
            .run()

        data.params.test.should.be.eq(4)
        data.result.should.be.eq(3)

    });

});

