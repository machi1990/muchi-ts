import MuchiTsDecorator from "../types/muchi-ts-decorator";

export default interface DecoratorFactory {
  create: () => MuchiTsDecorator;
}
