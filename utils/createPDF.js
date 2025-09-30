import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'node:path';

export function generateInvestmentReport(investments) {
  const doc = new PDFDocument({ 
    margin: 50,
    info: {
      Title: 'Gold Investment Report',
      Author: 'Investment Tracker',
      Subject: 'Investment Summary and Analysis'
    }
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `investment-report-${timestamp}.pdf`;
  const outputPath = path.resolve('reports', filename);
  doc.pipe(fs.createWriteStream(outputPath));
  
 // Calculate summary statistics with null checks
  const validInvestments = investments.filter(inv => 
    inv.amount != null && inv.goldSold != null && inv.price != null
  );
  
  if (validInvestments.length === 0) {
    throw new Error('No valid investment data found');
  }
  
  const totalAmount = validInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalGold = validInvestments.reduce((sum, inv) => sum + inv.goldSold, 0);
  const averagePrice = validInvestments.reduce((sum, inv) => sum + inv.price, 0) / validInvestments.length;
  const minPrice = Math.min(...validInvestments.map(inv => inv.price));
  const maxPrice = Math.max(...validInvestments.map(inv => inv.price));
  const firstInvestment = new Date(investments[0].timestamp);
  const lastInvestment = new Date(investments[investments.length - 1].timestamp);
  
  // Header
  doc.fontSize(24)
     .font('Helvetica-Bold')
     .fillColor('#2c3e50')
     .text('GOLD INVESTMENT REPORT', 50, 50);
  
  doc.fontSize(12)
     .font('Helvetica')
     .fillColor('#7f8c8d')
     .text(`Generated on ${new Date().toLocaleDateString('en-US', { 
       year: 'numeric', 
       month: 'long', 
       day: 'numeric',
       hour: '2-digit',
       minute: '2-digit'
     })}`, 50, 85);
  
  // Summary Section
  let yPos = 120;
  
  // Summary box background
  doc.rect(40, yPos - 10, 520, 140)
     .fillAndStroke('#ecf0f1', '#bdc3c7');
  
  doc.fontSize(16)
     .font('Helvetica-Bold')
     .fillColor('#2c3e50')
     .text('INVESTMENT SUMMARY', 50, yPos);
  
  yPos += 30;
  
  // Summary stats in two columns
  const leftCol = 50;
  const rightCol = 300;
  
  doc.fontSize(12)
     .font('Helvetica-Bold')
     .fillColor('#34495e');
  
  // Left column
  doc.text('Total Invested:', leftCol, yPos)
     .text('Total Gold Acquired:', leftCol, yPos + 20)
     .text('Number of Transactions:', leftCol, yPos + 40)
     .text('Investment Period:', leftCol, yPos + 60);
  
  // Right column  
  doc.text('Average Gold Price:', rightCol, yPos)
     .text('Average per Transaction:', rightCol, yPos + 20)
     .text('Average Gold per Oz:', rightCol, yPos + 40);
  
  // Values
  doc.font('Helvetica')
     .fillColor('#2c3e50');
  
  // Left column values
  doc.text(`${totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}`, leftCol + 150, yPos)
     .text(`${totalGold.toFixed(4)} oz`, leftCol + 150, yPos + 20)
     .text(`${investments.length}`, leftCol + 150, yPos + 40)
     .text(`${firstInvestment.toLocaleDateString()} - ${lastInvestment.toLocaleDateString()}`, leftCol + 150, yPos + 60);

  // Right column values
  doc.text(`${averagePrice.toFixed(2)}`, rightCol + 150, yPos)
     .text(`${(totalAmount / investments.length).toFixed(2)}`, rightCol + 150, yPos + 20)
     .text(`${(totalAmount / totalGold).toFixed(2)}`, rightCol + 150, yPos + 40);
  
  // Detailed Transactions Table
  yPos = 300;
  
  doc.fontSize(16)
     .font('Helvetica-Bold')
     .fillColor('#2c3e50')
     .text('DETAILED TRANSACTIONS', 50, yPos);
  
  yPos += 30;
  
  // Table headers
  const tableTop = yPos;
  const colWidths = [100, 80, 100, 80];
  const colPositions = [50, 170, 275, 400];
  const headers = ['Date/Time', 'Price/oz ($/oz)', 'Amount ($)', 'Gold (oz)'];
  
  // Header background
  doc.rect(45, tableTop, 465, 25)
     .fillAndStroke('#34495e', '#2c3e50');
  
  doc.fontSize(10)
     .font('Helvetica-Bold')
     .fillColor('white');
  
  headers.forEach((header, i) => {
    doc.text(header, colPositions[i], tableTop + 8, {
      width: colWidths[i],
      align: 'center'
    });
  });
  
  yPos = tableTop + 25;
  
  // Table rows
  doc.fontSize(9)
     .font('Helvetica')
     .fillColor('#2c3e50');
  
  investments.forEach((investment, index) => {
    const date = new Date(investment.timestamp);
    const rowColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
    
    // Row background
    doc.rect(45, yPos, 465, 30)
       .fillAndStroke(rowColor, '#ecf0f1');
    
    // Safe number formatting with null checks
    const price = investment.price != null ? investment.price : 0;
    const amount = investment.amount != null ? investment.amount : 0;
    const goldSold = investment.goldSold != null ? investment.goldSold : 0;
    
    // Row data
    const rowData = [
      `${date.toLocaleDateString()}\n${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
      price != null ? `${price.toFixed(2)}` : 'N/A',
      amount != null ? `${amount.toLocaleString()}` : 'N/A',
      goldSold != null ? `${goldSold.toFixed(4)}` : 'N/A',
    ];
    
    rowData.forEach((data, i) => {
      doc.fillColor('#2c3e50');
      doc.text(data, colPositions[i], yPos + 4, {
        width: colWidths[i] - 10,
        align: 'center',
        lineGap: 1
      });
    //   + (align === 'right' ? colWidths[i] - 5 : 5)
    });
    
    yPos += 30;
    
    // Check for page break
    if (yPos > 720) {
      doc.addPage();
      yPos = 50;
    }
  });
  
  // Performance Analysis Section (if space allows)
  if (yPos < 600) {
    yPos += 30;
    
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text('PERFORMANCE INSIGHTS', 50, yPos);
    
    yPos += 25;
    
    // Calculate some insights
    const priceVariation = ((maxPrice - minPrice) / minPrice * 100).toFixed(1);
    const averageTransactionSize = (totalAmount / investments.length).toFixed(2);
    const largestTransaction = Math.max(...investments.map(inv => inv.amount));
    const smallestTransaction = Math.min(...investments.map(inv => inv.amount));
    
    const insights = [
      `Price volatility during investment period: ${priceVariation}%`,
      `Largest single investment: $${largestTransaction.toLocaleString()}`,
      `Smallest single investment: $${smallestTransaction.toLocaleString()}`,
      `Average transaction size: $${averageTransactionSize}`,
      `Total portfolio value at average price: $${(totalGold * averagePrice).toFixed(2)}`
    ];
    
    doc.fontSize(11)
       .font('Helvetica')
       .fillColor('#2c3e50');
    
    insights.forEach(insight => {
      doc.text(`• ${insight}`, 60, yPos);
      yPos += 18;
    });
  }
  
  // Footer
  const footerY = doc.page.height - 60;
  doc.fontSize(8)
     .font('Helvetica')
     .fillColor('#95a5a6')
     .text('This report is generated for informational purposes only. Past performance does not guarantee future results.', 
           50, footerY, { width: 500, align: 'center' });
  
  doc.end();
  
  console.log(`Investment report generated: ${outputPath}`);
  return outputPath;
};