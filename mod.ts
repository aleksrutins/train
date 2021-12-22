import { Middleware, PredefinedMiddleware, ErrorMiddleware } from "./middleware.ts";
import { Logger, StubLogger } from "./logger.ts";

/**
 * Class for web applications.
 */
export class App {
  #md: PredefinedMiddleware[] = [];
  #logger: Logger = new StubLogger();
  #err404: ErrorMiddleware = (req) => req.respondWith(new Response('404 Not Found', {status: 404}));
  #err500: ErrorMiddleware = (req) => req.respondWith(new Response('500 Internal Server Error', {status: 500}));

  /**
   * Use a custom piece of middleware.
   * @param path Path that this middleware applies to
   * @param mw The middleware
   * @param method The HTTP method this middleware applies to
   */
  useCustom(path: RegExp, mw: Middleware, method: string) {
    this.#md.push({ mw, path, method });
  }
  /**
   * Use a predefined piece of middleware.
   * @param mw The middleware
   */
  use(mw: PredefinedMiddleware) {
    this.#md.push(mw);
  }

  use404(mw: ErrorMiddleware) {
      this.#err404 = mw;
  }
  use500(mw: ErrorMiddleware) {
      this.#err500 = mw;
  }
  /**
   * Add a piece of middleware for HTTP GET requests.
   * @param path The path that this middleware applies to
   * @param mw The middleware
   */
  get(path: RegExp, mw: Middleware) {
    this.useCustom(path, mw, "GET");
  }
  /**
   * Add a piece of middleware for HTTP POST requests.
   * @param path The path that this middleware applies to
   * @param mw The middleware
   */
  post(path: RegExp, mw: Middleware) {
    this.useCustom(path, mw, "POST");
  }
  /**
   * Use a logger. You may want to do this, or it will not print anything.
   * @param logger The logger to use. This logger conforms to the interface of Waterlog.
   */
  useLogger(logger: Logger) {
    this.#logger = logger;
  }
  async #handle(conn: Deno.Conn) {
    const httpConn = Deno.serveHttp(conn);
    for await (const reqEv of httpConn) {
      const req = reqEv.request;
      try {
      let hasRunAnything = false;
      for (const mw of this.#md) {
          const url = new URL(req.url);
        this.#logger.debug(`${req.method} ${url.pathname}`);
        const match = url.pathname.match(mw.path);
        if (match && req.method == mw.method) {
            hasRunAnything = true;
          await mw.mw(match, reqEv);
        }
      }
      if(!hasRunAnything) {
          await this.#err404(reqEv);
      }
    } catch(_e) {
        await this.#err500(reqEv);
    }
    }
  }
  /**
   * Start the server.
   * @param opts Options to pass to std/http#serve.
   */
  serve(opts: Deno.ListenOptions) {
    const server = Deno.listen(opts);
    (async () => {
        for await (const conn of server) {
            this.#handle(conn);
        }
    })();
    this.#logger.debug(
      `Serving on http://${opts.hostname ?? "0.0.0.0"}:${opts.port}`,
    );
  }
}
