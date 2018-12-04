type Decorator = PropertyDecorator | MethodDecorator | ClassDecorator;
type MuchiTsDecorator = Decorator | ((...args) => Decorator);

export default MuchiTsDecorator;
