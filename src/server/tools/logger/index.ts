import { Console } from 'console';

export default class Logger extends Console {
  private name: string;

  private constructor(name: string) {
    super({
      stdout: process.stdout,
      stderr: process.stderr,
    });
    this.name = name;
  }

  log(...args: any[]) {
    return super.log(`[${new Date().toJSON()}] [${this.name}]`, ...args);
  }

  error(...args: any[]) {
    return super.error(`[${new Date().toJSON()}] [${this.name}]`, ...args);
  }

  warn(...args: any[]) {
    return super.warn(`[${new Date().toJSON()}] [${this.name}]`, ...args);
  }

  info(...args: any[]) {
    return super.info(`[${new Date().toJSON()}] [${this.name}]`, ...args);
  }

  private static instances: { [id: string]: Logger } = {};

  static instance(name: string) {
    if (!Logger.instances[name]) {
      Logger.instances[name] = new Logger(name);
    }
    return Logger.instances[name];
  }

  childInstance(name: string) {
    const fullName = `${this.name}.${name}`;
    return Logger.instance(fullName);
  }
}
