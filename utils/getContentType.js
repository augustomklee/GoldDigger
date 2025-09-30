const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain',
    '.webp': 'image/webp',
    '.avif': 'image/avif'
};

export default function getContentType(ext) {
    return types[ext.toLowerCase()] || 'text/html';
}