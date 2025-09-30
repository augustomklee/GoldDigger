// Invest button functionality
const investBtn = document.getElementById('invest-btn');
const dialog = document.querySelector('dialog');
const investmentSummary = document.getElementById('investment-summary');
const dialogCloseBtn = dialog.querySelector('button');

dialogCloseBtn.addEventListener('click', () => {
    dialog.close();
});

investBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    const timestamp = new Date().toISOString();
    const price = document.getElementById('price-display').textContent;
    const amount = document.getElementById('investment-amount').value;
    const goldSold = (amount / price).toFixed(4); 
    
    const investment = {
        timestamp: timestamp,
        price: parseFloat(price),
        amount: parseFloat(amount),
        goldSold: parseFloat(goldSold)
    };

    if (amount && !isNaN(amount) && amount >= 10) {
        try {
            const response = await fetch('/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(investment)
            });
            if (response.ok) {
                document.getElementById('investment-amount').value = '';
                investmentSummary.textContent = `You just bought ${goldSold} ounces (ozt) for £${amount}. \n You will receive documentation shortly.`;
                dialog.showModal();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        alert('Please enter a valid amount. £10 or more is required.');
    }
});

// Live gold price updates
const eventSource = new EventSource('/api/gold-price');

const priceDisplay = document.getElementById('price-display');

eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const goldPrice = data.goldPrice;
    priceDisplay.textContent = goldPrice;
};

eventSource.onerror = (err) => {
    console.error('Connection lost:', err);
    priceDisplay.textContent = 'Connection lost. Please refresh the page.';
};