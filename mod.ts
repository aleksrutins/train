import {listenAndServe, HTTPOptions} from "https://deno.land/std/http/mod.ts";
import { Middleware, PredefinedMiddleware } from "./middleware.ts";
import { Logger, StubLogger } from "./logger.ts";

/**
 * Class for web applications.
 */
export class App {
    private md: PredefinedMiddleware[] = [];
    private logger: Logger = new StubLogger();

    /**
     * Use a custom piece of middleware.
     * @param path Path that this middleware applies to
     * @param mw The middleware
     * @param method The HTTP method this middleware applies to
     */
    useCustom(path: RegExp, mw: Middleware, method: string) {
        this.md.push({mw, path, method});
    }
    /**
     * Use a predefined piece of middleware.
     * @param mw The middleware
     */
    use(mw: PredefinedMiddleware) {
        this.md.push(mw);
    }
    /**
     * Add a piece of middleware for HTTP GET requests.
     * @param path The path that this middleware applies to
     * @param mw The middleware
     */
    get(path: RegExp, mw: Middleware) {
        this.useCustom(path, mw, 'GET');
    }
    /**
     * Add a piece of middleware for HTTP POST requests.
     * @param path The path that this middleware applies to
     * @param mw The middleware
     */
    post(path: RegExp, mw: Middleware) {
        this.useCustom(path, mw, 'POST');
    }
    /**
     * Use a logger. You may want to do this, or it will not print anything.
     * @param logger The logger to use. This logger conforms to the interface of Waterlog.
     */
    useLogger(logger: Logger) {
        this.logger = logger;
    }
    /**
     * Start the server.
     * @param opts Options to pass to std/http#serve.
     */
    serve(opts: HTTPOptions) {
        listenAndServe(opts, async (req) => {
            for(const mw of this.md) {
                this.logger.debug(`${req.method} ${req.url}`)
                const match = req.url.match(mw.path);
                if(match && req.method == mw.method) {
                    await mw.mw(match, req);
                }
            }
        });
        this.logger.debug(`Serving on http://${opts.hostname ?? '0.0.0.0'}:${opts.port}`);
    }
}