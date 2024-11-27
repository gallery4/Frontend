import { handler } from './build/handler.js';
import express from 'express';
import 'dotenv/config';
import proxy from 'express-http-proxy';

const app = express();

console.log('backend', process.env.BACKEND_URL)
// add a route that lives separately from the SvelteKit app
app.get('/healthcheck', (req, res) => {
    res.end('ok');
});

app.use(/^\/download/, proxy(process.env.BACKEND_URL, {
    proxyReqPathResolver: (req) => `/download${req.url}`,
}));

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);

app.listen(3000, () => {
    console.log('listening on port 3000');
});