# GoldDigger

A real-time gold investment tracking application built with vanilla Node.js, featuring live price updates via Server-Sent Events (SSE) and automated PDF report generation.

## Overview

GoldDigger enables users to track gold investments with real-time price updates, calculate gold quantities based on current market rates, and automatically generate comprehensive investment reports in PDF format.

https://github.com/user-attachments/assets/56977dd7-d403-4902-b39d-df4d7272b70c

## Core Features

- **Real-Time Price Updates**: Live gold prices streamed using Server-Sent Events (SSE) with automatic reconnection handling
- **Investment Tracking**: Record investment transactions with timestamp, price, amount, and gold quantity
- **Automated PDF Reports**: Generate detailed investment reports with summary statistics, transaction tables, and performance insights
- **Input Sanitization**: Secure handling of user input with HTML sanitization
- **Static File Serving**: Custom implementation for serving static assets
- **Responsive UI**: Clean, accessible interface with proper ARIA labels and semantic HTML

## Technology Stack

### Backend
- **Node.js (Native HTTP Module)**: Pure Node.js implementation without Express or other frameworks
- **ES Modules**: Modern JavaScript module system with `import/export` syntax
- **File System Operations**: Async file handling with `fs/promises` for data persistence
- **PDFKit**: Professional PDF document generation with custom styling and layouts

### Frontend
- **Vanilla JavaScript**: No frontend frameworks - pure DOM manipulation and Fetch API
- **Server-Sent Events (EventSource)**: Real-time unidirectional data streaming for live price updates
- **CSS Custom Properties**: Theme system using CSS variables
- **Dialog API**: Native HTML5 modal dialogs for user feedback

### Security & Validation
- **sanitize-html**: Input sanitization to prevent XSS attacks
- **Form Validation**: Client and server-side validation for investment amounts

## Project Structure

```
golddigger/
├── data/
│   └── investmentsData.json    # Investment data storage
├── handlers/
│   └── routeHandlers.js        # API endpoint handlers
├── public/
│   ├── index.html              # Main application page
│   ├── 404.html                # Custom error page
│   ├── index.css               # Application styles
│   ├── index.js                # Client-side logic
│   └── gold.png                # Assets
├── reports/                     # Generated PDF reports
├── utils/
│   ├── addNewInvestment.js     # Investment data persistence
│   ├── createPDF.js            # PDF generation logic
│   ├── getContentType.js       # MIME type resolver
│   ├── getInvestments.js       # Data retrieval
│   ├── parseJSONBody.js        # Request body parser
│   ├── sanitizeInput.js        # Input sanitization
│   ├── sendResponse.js         # Response helper
│   └── serveStatic.js          # Static file server
├── server.js                    # Main server entry point
└── package.json
```

## API Endpoints

### `POST /api`
Records a new investment transaction
- **Request Body**: `{ timestamp, price, amount, goldSold }`
- **Response**: Sanitized investment data (201 Created)
- **Side Effect**: Generates PDF report automatically

### `GET /api/gold-price`
SSE endpoint for real-time gold price updates
- **Headers**: `text/event-stream`
- **Updates**: Every 4 seconds
- **Format**: `{ event: 'gold-price-update', goldPrice: <value> }`

## Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd golddigger

# Install dependencies
npm install

# Start the server
npm start
```

The application will be available at `http://localhost:3000`

## Key Implementation Details

### Server-Sent Events (SSE)
The application uses SSE for real-time price updates, providing efficient one-way communication from server to client. The implementation includes:
- Proper SSE headers (`text/event-stream`, `no-cache`, `keep-alive`)
- Automatic price updates every 4 seconds
- Client-side error handling and reconnection

### PDF Report Generation
Automated reports include:
- Investment summary with total amounts and statistics
- Detailed transaction tables with pagination
- Performance insights and price volatility analysis
- Professional formatting with custom typography and colors

### Custom HTTP Server
Built without Express, demonstrating:
- Manual routing and request handling
- Stream-based request body parsing
- Custom static file serving with proper MIME types
- Error handling and 404 pages

## Dependencies

```json
{
  "pdfkit": "^0.17.2",        // PDF document generation
  "sanitize-html": "^2.17.0"  // HTML sanitization
}
```

## Development Notes

- Uses ES modules (`"type": "module"` in package.json)
- Minimum investment amount: £10
- Price simulation: £1700-1800 per troy ounce
- All monetary values in GBP (£)
- Gold measured in troy ounces (ozt)

## Future Enhancements

- Database integration for better data persistence
- User authentication and multi-user support
- Historical price charts
- Export data in multiple formats (CSV, JSON)
- WebSocket integration for more efficient real-time updates

## Author

Augusto MK Lee

## License

ISC
