import http from 'node:http'
import serveStatic from './utils/serveStatic.js';
import { handleGoldPrices, handlePost } from './handlers/routeHandlers.js';

const PORT = 3000;
const __dirname = import.meta.dirname;

const server = http.createServer(async (req, res) => {
    
    if (req.url === '/api' && req.method === 'POST') {
        await handlePost(req, res);
    } else if (req.url === '/api/gold-price') {

        return await handleGoldPrices(req, res);

    } else if (!req.url.startsWith('/api')) {

        await serveStatic(req, res, __dirname);

    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});