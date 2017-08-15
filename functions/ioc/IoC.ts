import "reflect-metadata";
import {makeProvideDecorator, makeFluentProvideDecorator} from "inversify-binding-decorators";
import {Container} from "inversify";
import {ClassTransformer} from "class-transformer";
import {Validator} from "class-validator";
import SYMBOLS from "./Symbols";

let container = new Container();
let provide = makeProvideDecorator(container);
let fluentProvider = makeFluentProvideDecorator(container);
let provideNamed = function (identifier: symbol, name: string) {
    return fluentProvider(identifier)
    .whenTargetNamed(name)
    .done();
};

let provideSingleton = function (identifier: any) {
    return fluentProvider(identifier)
    .inSingletonScope()
    .done();
};

container.bind<ClassTransformer>(SYMBOLS.ClassTransformer).toConstantValue(new ClassTransformer());
container.bind<Validator>(SYMBOLS.Validator).toConstantValue(new Validator());

export {container, provide, provideNamed, provideSingleton};
