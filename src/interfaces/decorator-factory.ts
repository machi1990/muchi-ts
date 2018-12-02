import Decorator from "../types/ts-muchi-decorator";

export default interface DecoratorFactory {
  create: () => Decorator;
}
