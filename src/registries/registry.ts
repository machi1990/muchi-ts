import { Setup } from "../interfaces/setup";

const elements = Symbol("elements");
const counter = Symbol("counter");

export default class Registry<T extends Setup> implements Iterator<T> {
  private [elements]: Array<T>;
  private [counter]: number = 0;

  constructor() {
    this[elements] = new Array<T>();
  }

  public register(afterSetup: T): number {
    return this[elements].push(afterSetup);
  }

  public find(predicate: (T) => boolean): T {
    return this[elements].find(predicate);
  }

  public keepOnly(predicate: (T) => boolean): Registry<T> {
    this[elements] = this[elements].filter(predicate);
    return this;
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

  feed<R extends Registry<T>>(destination: R): R {
    for (const setup of this[elements]) {
      destination.register(setup);
    }

    return destination;
  }
}
