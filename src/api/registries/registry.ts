import { Setup } from "../interfaces/setup";

const counter = Symbol("counter");
const elements = Symbol("elements");

export default class Registry<T extends Setup>
  implements Iterator<T>, IterableIterator<T> {
  private [elements]: Array<T>;
  private [counter]: number = 0;

  constructor() {
    this[elements] = new Array<T>();
  }

  public register(setup: T): number {
    return this[elements].push(setup);
  }

  public find(predicate: (arg: T) => boolean): T {
    return this[elements].find(predicate);
  }

  public filter(predicate: (arg: T) => boolean): Registry<T> {
    const registry = new Registry<T>();
    this[elements]
      .filter(predicate)
      .forEach(element => registry.register(element));
    return registry;
  }

  public map<R>(transformer: (x: T) => R): Array<R> {
    return this[elements].map(transformer);
  }

  public get(index: number): T {
    return this[elements][index];
  }

  public size(): number {
    return this[elements].length;
  }

  public next(): IteratorResult<T> {
    const done = this[counter] === this.size();
    return {
      done,
      value: done ? null : this.get(this[counter]++)
    };
  }

  public [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  feed<R extends Registry<T>>(destination: R): R {
    for (const setup of this[elements]) {
      destination.register(setup);
    }

    return destination;
  }
}
