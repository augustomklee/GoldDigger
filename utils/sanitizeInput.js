import sanitizeHtml from 'sanitize-html'

export function sanitizeInput(input) {
    const sanitized = {}
    
    for (const [key, value] of Object.entries(input)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeHtml(value, {
                allowedTags: [],
                allowedAttributes: {}
            })
        } else {
            sanitized[key] = value
        }
}
    return sanitized
}