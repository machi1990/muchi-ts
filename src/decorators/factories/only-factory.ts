import MuchiTsDecorator from "../../../types/muchi-ts-decorator";
import DecoratorFactory from "../../interfaces/muchi-ts-decorator-factory";

export default class OnlyDecoratorFactory implements DecoratorFactory {
  constructor() {}

  public create(): MuchiTsDecorator {
    return (): ClassDecorator => testClass => {};
  }
}
