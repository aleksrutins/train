import { ServerRequest } from "https://deno.land/std/http/mod.ts";
export type Middleware = (pathMatch: RegExpMatchArray, req: ServerRequest) => Promise<void> | void;
export type PredefinedMiddleware = {method: string, path: RegExp, mw: Middleware};