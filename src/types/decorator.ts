type Decorator = ((...args) => void) | ((...args) => Decorator);
export default Decorator;
