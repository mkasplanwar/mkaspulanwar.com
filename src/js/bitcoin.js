async function fetchBitcoinPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=idr');
        const data = await response.json();
        return data.bitcoin.idr;
    } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        return null;
    }
}

async function calculateBalance() {
    const satsAmount = 100000;
    const satToBtc = satsAmount / 100000000;

    const bitcoinPriceInIDR = await fetchBitcoinPrice();
    if (bitcoinPriceInIDR === null) {
        document.getElementById('balance-idr').textContent = 'Failed to load';
        return;
    }

    const balanceInIDR = satToBtc * bitcoinPriceInIDR;
    document.getElementById('balance-idr').textContent = `Rp ${balanceInIDR.toLocaleString('id-ID')}`;
    
    // Update last update time
    const now = new Date();
    document.getElementById('last-update').textContent = `Last update: ${now.toLocaleString()}`;
}

function updateTimeAgo() {
    const purchaseDate = new Date('2024-08-28T11:38:23');
    const now = new Date();
    const diffTime = Math.abs(now - purchaseDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const remainingDays = diffDays % 30;
    
    let timeAgoText = '';
    if (months > 0) {
        timeAgoText += `${months} month${months > 1 ? 's' : ''} `;
    }
    if (remainingDays > 0) {
        timeAgoText += `${remainingDays} day${remainingDays > 1 ? 's' : ''} ago`;
    }
    
    document.getElementById('time-ago').textContent = timeAgoText;
}

// Initial calculations
calculateBalance();
updateTimeAgo();

// Update price and time every 60 seconds
setInterval(() => {
    calculateBalance();
    updateTimeAgo();
}, 60000);