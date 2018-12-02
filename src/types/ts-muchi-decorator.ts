type Decorator = PropertyDecorator | MethodDecorator | ClassDecorator;
type TsMuchiDecorator = Decorator | ((...args) => Decorator);

export default TsMuchiDecorator;
