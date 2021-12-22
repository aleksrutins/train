# Train
> A very small Express clone for Deno.

**IMPORTANT:** This does not yet support TLS or many other Express things.

## Usage
First, import it:
```typescript
import { App } from "https://deno.land/x/train/mod.ts";
```
Also, you may want to use logging:
```typescript
import { Logger } from "https://deno.land/x/waterlog/mod.ts";
```
Then, instantiate an `App` object:
```typescript
const app = new App();
```
And set the logger:
```typescript
app.useLogger(new Logger("app", true));
```
Then, you can add routes with `useCustom`, `get`, and `post` (which take regular expressions for paths):
```typescript
app.get(/^\/$/, (match, req) => { // HTTP GET /, match is the RegExpMatchArray for the URL, and req is a Deno.RequestEvent object
    // Handle the request.
});
app.post(/^\/post-test$/, (match, req) => { // HTTP POST /post-test
    return new Promise((res, rej) => {
        // Handle the request asynchronously, if you wish.
    });
});
app.useCustom(/^\/custom-test$/, async (match, req) => {
    // You can even return an async function!
}, 'PUT'); // Method goes way down here
```
You can add custom error pages using `use404` and `use500`. These take an `ErrorMiddleware` handler, which takes no path match array:
```typescript
app.use404(async (req) => {
    // send a response
});
app.use500(async (req) => {
    // send a response
});
```
Then, start the server:
```typescript
app.serve({port: 8000});
```
It will print out a debug message once it is started.