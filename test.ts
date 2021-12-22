import { App } from './mod.ts';
import { Logger } from "https://deno.land/x/waterlog@v1.0.0/mod.ts";

const app = new App();
app.useLogger(new Logger("app", true));
const mainLogger = new Logger("main", true);

app.get(/^\/$/, async (match, req) => {
    await req.respondWith(new Response("At home! ūnīcōdē", {status: 200}));
});

app.get(/^\/other-path$/, async (match, req) => {
    await req.respondWith(new Response('Hi', {status: 200}));
});

app.use404(async (req) => {
    await req.respondWith(new Response(`
<!doctype html>
<html>
<head>
    <title>404 Not Found</title>
    <style>
        body {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            text-transform: uppercase;
            font-family: sans-serif;
        }
        html, body {
            height: 100%;
            width: 100%;
            padding: 0;
            margin: 0;
        }
        span.errcode {
            border-right: 1px solid black;
            padding: 5px;
            margin-right: 5px;
        }
    </style>
</head>
<body>
    <span class="errcode">404</span>
    <span>Not Found</span>
</body>
</html>
    `, {status: 404, headers: {'Content-Type': 'text/html'}}));
})

app.serve({port: 8081});
mainLogger.info("Started server.");