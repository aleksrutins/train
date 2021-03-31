import { App } from './mod.ts';
import { Logger } from "https://deno.land/x/waterlog@v1.0.0/mod.ts";

const app = new App();
app.useLogger(new Logger("app", true));
const mainLogger = new Logger("main", true);

app.get(/^\/$/, (match, req) => {
    req.respond({status: 200, body: "At home!"});
});

app.get(/^\/other-path$/, (match, req) => {
    req.respond({status: 200, body: "At other path!"});
});

app.serve({port: 8081});
mainLogger.info("Started server.");