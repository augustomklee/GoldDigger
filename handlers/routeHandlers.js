import sendResponse from "../utils/sendResponse.js";
import { parseJSONBody } from "../utils/parseJSONBody.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";
import { addNewInvestment } from "../utils/addNewInvestment.js";
import { getInvestments } from '../utils/getInvestments.js';
import { generateInvestmentReport } from "../utils/createPDF.js";


export async function handlePost(req, res) {
    try {
        const parsedBody = await parseJSONBody(req);
        const sanitizedBody = sanitizeInput(parsedBody);
        await addNewInvestment(sanitizedBody);
        const investments = await getInvestments();
        generateInvestmentReport(investments);
        sendResponse(res, 201, 'application/json', JSON.stringify(sanitizedBody));
    } catch (error) {
        console.log('I failed here:', error);
        sendResponse(res, 400, 'application/json', JSON.stringify({ error: error }));
    }
}

export async function handleGoldPrices(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendGoldPrice = () => {
        const newGoldPrice = (1700 + Math.random() * 100).toFixed(2);
        res.write(
            `data: ${JSON.stringify({
                event: 'gold-price-update',
                goldPrice: newGoldPrice
            })}\n\n`);
    };

    sendGoldPrice();

    setInterval(sendGoldPrice, 4000);
}