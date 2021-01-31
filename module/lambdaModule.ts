import {Module, module, IModuleParams} from "@appolo/engine";
import {IOptions, LambdaProvider} from "../index";

@module()
export class LambdaModule extends Module<IOptions> {

    protected readonly Defaults: Partial<IOptions> = {id:"lambdaProvider"};


    public static for(options: IOptions): IModuleParams {
        return {type: LambdaModule, options}
    }

    public get exports()  {
        return [{type:LambdaProvider,id:this.moduleOptions.id}]
    }
}
