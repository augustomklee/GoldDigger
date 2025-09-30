import fs from 'fs/promises';
import path from 'node:path';

export async function getInvestments() {
    try {
        const pathJSON = path.join('data', 'investmentsData.json');
        const data = await fs.readFile(pathJSON, 'utf-8');
        const parsedData = JSON.parse(data);
        return parsedData;
    } catch (error) {
        console.log('Error reading investments data:', error);
        throw new Error(`Failed to get investments: ${error.message}`);
    }
}
