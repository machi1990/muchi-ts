const EventEmitter = require("events");
global["muchi-ts-test-counter"] =
  global["muchi-ts-test-counter"] || new EventEmitter();
