export interface Logger {
  info(msg: string): void;
  warn(msg: string): void;
  err(msg: string): void;
  debug(msg: string): void;
}

export class StubLogger implements Logger {
  info(_msg: string): void {
  }
  warn(_msg: string): void {
  }
  err(_msg: string): void {
  }
  debug(_msg: string): void {
  }
}
