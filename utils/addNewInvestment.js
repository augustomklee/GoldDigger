import fs from 'node:fs/promises';
import path from 'node:path';
import { getInvestments } from './getInvestments.js';

export async function addNewInvestment(investment) {
    try {
        const investments = await getInvestments();
        investments.push(investment);

        const pathJSON = path.join('data', 'investmentsData.json');

        await fs.writeFile(pathJSON, JSON.stringify(investments, null, 2), 'utf-8');

    } catch (error) {   
        throw new Error(`Failed to add new investment: ${error.message}`);
    }
}
