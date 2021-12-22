export type Middleware = (
  pathMatch: RegExpMatchArray,
  req: Deno.RequestEvent,
) => Promise<void> | void;
export type PredefinedMiddleware = {
  method: string;
  path: RegExp;
  mw: Middleware;
};
export type ErrorMiddleware = (req: Deno.RequestEvent) => Promise<void> | void;
