const CONFIG = {
    BTC_AMOUNT: 0.001,
    ADDRESS: 'bc1q8y5pnaxvk3pq2564cpl7u63n075pye25h7nx3j',
    API_ENDPOINT: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=idr'
};

function formatIDR(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

function updateDateTime() {
    const now = new Date();
    document.getElementById('update-time').textContent = now.toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta'
    });
}

async function updateBitcoinPrice() {
    try {
        const response = await fetch(CONFIG.API_ENDPOINT);
        const data = await response.json();
        const btcPriceIDR = data.bitcoin.idr;
        const totalValueIDR = CONFIG.BTC_AMOUNT * btcPriceIDR;
        document.getElementById('fiat-value').textContent = formatIDR(totalValueIDR);
        updateDateTime();
    } catch (error) {
        console.error('Error fetching price:', error);
        document.getElementById('fiat-value').textContent = 'Error loading price';
    }
}

function copyAddress() {
    navigator.clipboard.writeText(CONFIG.ADDRESS)
        .then(() => {
            const button = document.querySelector('.action-button');
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Copied!';
            
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy address. Please try again.');
        });
}

function openExplorer() {
    window.open(`https://bitaps.com/${CONFIG.ADDRESS}`, '_blank');
}

function calculateHoldingPeriod() {
    const purchaseDate = new Date('2024-08-28T11:38:23');
    const now = new Date();
    const diffTime = Math.abs(now - purchaseDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const remainingDays = diffDays % 30;

    document.querySelector('.info-row:nth-child(2) .info-value').textContent = 
        `${months} months ${remainingDays} days`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateBitcoinPrice();
    calculateHoldingPeriod();
    
    // Update price every minute
    setInterval(updateBitcoinPrice, 60000);
    
    // Update holding period every hour
    setInterval(calculateHoldingPeriod, 3600000);
});

// Add error handling for external resources
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==';
    }
}, true);

// Add mobile touch feedback
document.querySelectorAll('.action-button').forEach(button => {
    button.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
    });
    
    button.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
    });
});