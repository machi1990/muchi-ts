import { Logger } from "../utils/logger";
import {
  BeforeSetupRunner,
  AfterSetupRunner
} from "../decorators/factories/setup-runner";

export default interface RunnerOpts {
  message: string;
  ignore: boolean;
  level: number;
  logger: Logger;
  contextInstance: any;
  contextClazz: any;
  beforeRunner: BeforeSetupRunner;
  afterRunner: AfterSetupRunner;
  timeOut: number;
  hasOnly: () => boolean;
}
