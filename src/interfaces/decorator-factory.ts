import Decorator from "../types/decorator";

export default interface DecoratorFactory {
  create: () => Decorator;
}
