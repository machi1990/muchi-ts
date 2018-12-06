const logs = Symbol();

export const TYPE = {
  log: Symbol("log"),
  info: Symbol("info"),
  warn: Symbol("warn"),
  error: Symbol("error")
};

export class Logger {
  public [logs]: Array<any>;

  constructor() {
    this[logs] = new Array<any>();
  }

  public addLog(type: Symbol, ...logEntry: Array<any>) {
    this[logs].push({
      type,
      logEntry
    });
  }

  public append(logger: Logger) {
    if (!logger) return;

    this[logs] = [...this[logs], ...logger[logs]];
  }

  public log(): void {
    this[logs].forEach(({ type, logEntry }) => {
      if (type === TYPE.log) {
        console.log.apply(undefined, logEntry);
      } else if (type === TYPE.info) {
        console.info.apply(undefined, logEntry);
      } else if (type === TYPE.error) {
        console.error.apply(undefined, logEntry);
      } else if (type === TYPE.warn) {
        console.warn.apply(undefined, logEntry);
      }
    });
  }
}
