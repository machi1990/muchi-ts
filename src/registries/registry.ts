import { Setup } from "../interfaces/setup";

const elements = Symbol();

export default class Registry<T extends Setup>
  implements Iterable<T>, Iterator<T> {
  private [elements]: Array<T>;
  private counter: number = 0;

  constructor() {
    this[elements] = new Array<T>();
  }

  public register(afterSetup: T): number {
    return this[elements].push(afterSetup);
  }

  public find(predicate: (T) => boolean): T {
    return this[elements].find(predicate);
  }

  public get(index: number): T {
    return this[elements][index];
  }

  public size(): number {
    return this[elements].length;
  }

  protected sortBy(comparator: (prev: T, next: T) => number) {
    this[elements].sort(comparator);
  }

  public [Symbol.iterator]() {
    let counter: number = 0;
    let registeredElements = this[elements];
    return {
      next(): IteratorResult<T> {
        const done: boolean = counter === registeredElements.length;
        return {
          done,
          value: done ? null : registeredElements[counter++]
        };
      }
    };
  }

  next(): IteratorResult<T> {
    const done = this.counter === this.size();
    return {
      done,
      value: done ? null : this.get(this.counter++)
    };
  }
}
