import path from 'node:path';
import fs from 'node:fs/promises';
import sendResponse from './sendResponse.js';
import getContentType from './getContentType.js';

export default async function serveStatic(req, res, baseDir) {
    const publicDir = path.join(baseDir, 'public');
    const filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    const contentType = getContentType(ext);

    try {
        const content = await fs.readFile(filePath);
        sendResponse(res, 200, contentType, content);
    }
    catch (err) {
        const content = await fs.readFile(path.join(publicDir, '404.html'));
        sendResponse(res, 404, 'text/html', content);
        return;
    }
}