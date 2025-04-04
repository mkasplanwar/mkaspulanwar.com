// Constants for global use
const EXCHANGE_RATES = {
    USD_TO_IDR: 16725,
    USDC_TO_IDR: 16725
};

const BTC_CONSTANTS = {
    PRICE_IDR: 1365182222.68,  // BTC price in IDR
    SATS_TO_BTC: 100000000     // Conversion from satoshis to BTC
};

// Bitcoin Collateral Strategy Configuration
const BITCOIN_STRATEGY = {
    COLLATERAL_SATS: 61472,         
    USDC_BORROWED: 27,              
    LIQUIDATION_LTV: 91,            
    INTEREST_RATE: 6.93,             
    BTC_YIELD_RATE: 0.27,           
    LIQUIDATION_PRICE_USD: 48268.31 
};

// Format currency for general use
function formatCurrency(amount) {
    return 'Rp. ' + amount.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// Format USD price display
function formatUSDPrice(amount) {
    return '$ ' + amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Format currency for total equity
function formatTotalEquity(amount) {
    return 'Rp. ' + amount.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// Convert IDR to USD
function convertIDRtoUSD(idrAmount) {
    return idrAmount / EXCHANGE_RATES.USD_TO_IDR;
}

// Function to parse share quantity from string format
function parseShareQuantity(shareStr) {
    if (!shareStr) return 0;
    // Extract numeric part from strings like "0.0384 shares"
    const match = shareStr.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
}

// Asset data with integrated US stock prices
const assets = [
    {
        name: "Farmland",
        icon: "/myasset/icon/coin.png",
        balance: "1.445 m²",
        invested: 20000000,
        avgPrice: 13840.8305, 
        currentPrice: 13840.8305, 
        currency: "IDR",
        type: "non-liquid",
        sector: "Real Estate",
        company: "Private Ownership",
    },
    {
        name: "Bitcoin",
        icon: "/myasset/icon/bitcoin.png",
        balance: "61.472 sats",
        invested: 922080,
        avgPrice: 1500000000, // Harga dalam Rupiah, dikonversi dari USD
        currentPrice: BTC_CONSTANTS.PRICE_IDR, // Using global constant now
        currency: "IDR",
        type: "liquid",
        sector: "Store of Value",
        company: "Collateral Asset"
    },
    {
        name: "USDC: Funding",
        icon: "/myasset/icon/usdc.png",
        balance: "Rp. 565.602",
        invested: 565602,
        avgPrice: 1,
        currentPrice: 1,
        currency: "IDR",
        type: "liquid",
        sector: "Collateral Starategy",
        company: "Pendanaan dari Loan Bitcon Collteral Strategy"
    },
    {
        name: "IDX: PGEO",
        icon: "/myasset/icon/pgeo4.png",
        balance: "700 lembar",
        invested: 875000,
        avgPrice: 1250,
        currentPrice: 805,
        currency: "IDR",
        type: "liquid",
        sector: "Green Energy",
        company: "PT. Pertamina Geothermal Energy. Tbk",
    },
    {
        name: "AAPL",
        icon: "/myasset/icon/apple.png",
        balance: "0.0384 shares",
        invested: 131428, // Precalculated value in IDR (will be recalculated in calculation function)
        avgPrice: 204.43, // Price in USD
        currentPrice: 204, // Price in USD
        currency: "USD",
        type: "liquid",
        sector: "Technology",
        company: "Apple Inc."
    },
    {
        name: "Pisang Jago",
        icon: "/myasset/icon/banana.png",
        balance: "Bussiness",
        invested: 30000,
        avgPrice: 1,
        currentPrice: 1,
        currency: "IDR",
        type: "liquid",
        sector: "Business",
        company: "-",
    },
    
    /*
    {
        name: "GOOGL",
        icon: "/myasset/icon/google.png",
        balance: "0 shares",
        invested: 0, // No shares owned
        avgPrice: 147.68, // Price in USD
        currentPrice: 159.99, // Price in USD
        currency: "USD",
        type: "liquid",
        sector: "Technology",
        company: "Alphabet Inc."
    },
    
    {
        name: "IDX: TLKM",
        icon: "/myasset/icon/tlkm.png",
        balance: "0 lembar",
        invested: 0,
        avgPrice: 1,
        currentPrice: 1,
        currency: "IDR",
        type: "liquid",
        sector: "Technology",
        company: "PT. Telkom Indonesia (persero). Tbk",
    },
    
    {
        name: "IDX: MERK",
        icon: "/myasset/icon/merk.png",
        balance: "0 lembar",
        invested: 0,
        avgPrice: 1,
        currentPrice: 1,
        currency: "IDR",
        type: "liquid",
        sector: "Farmasi & Riset Kesehatan",
        company: "PT. Merck. Tbk (Induk: Merck KGaA)",
    }
    */
];

// Calculate market value and return for each asset
function calculateAssetValues() {
    return assets.map(asset => {
        let marketValue;

        if (asset.name === "Pisang Jago") {
            // For business assets, use the invested amount as market value
            marketValue = asset.invested;
        } else if (asset.currency === "USD") {
            // For USD assets (US stocks), calculate market value in IDR
            const shares = parseShareQuantity(asset.balance);
            const investedIDR = shares * asset.avgPrice * EXCHANGE_RATES.USD_TO_IDR;
            const marketValueIDR = shares * asset.currentPrice * EXCHANGE_RATES.USD_TO_IDR;
            
            // Update the invested amount with the actual calculation
            asset.invested = Math.round(investedIDR);
            marketValue = Math.round(marketValueIDR);
        } else {
            // For IDR assets, calculate market value based on price change
            marketValue = asset.invested * (asset.currentPrice / asset.avgPrice);
        }

        // Calculate return percentage
        const returnPercent = asset.invested > 0 ? 
            ((marketValue - asset.invested) / asset.invested) * 100 : 0;

        return {
            ...asset,
            marketValue: Math.round(marketValue),
            returnPercent: isNaN(returnPercent) ? 0 : returnPercent
        };
    });
}

// Format price display based on asset type
function formatPriceDisplay(asset, isAvgPrice = false) {
    const price = isAvgPrice ? asset.avgPrice : asset.currentPrice;
    
    if (asset.currency === "USD") {
        // Format for USD assets
        return formatUSDPrice(price);
    } else if (asset.name === "Bitcoin") {
        // Format for Bitcoin (in millions of rupiah)
        return `Rp. ${(price / 1000000).toLocaleString('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })} jt`;
    } else if (asset.name === "Farmland") {
        // Format for Property (price per m²)
        return `Rp. ${price.toLocaleString('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}/m²`;
    } else if (asset.name === "RDN: Rupiah") {
        // Format for Rupiah
        return `Rp. 1,00`;
    } else if (asset.name === "Pisang Jago") {
        // Format for Pisang Jago (business)
        return isAvgPrice ? `N/A` : `Valuasi saat ini`;
    } else {
        // Format for other assets (in normal rupiah)
        return `Rp. ${price.toLocaleString('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }
}

// Populate asset table
function populateAssetTable() {
    const tableBody = document.getElementById('assetTableBody');
    tableBody.innerHTML = '';

    const calculatedAssets = calculateAssetValues();

    calculatedAssets.forEach(asset => {
        const row = document.createElement('tr');

        // Format return class
        const returnClass = asset.returnPercent > 0 ? 'positive' : 
                            asset.returnPercent < 0 ? 'negative' : '';
                            
        // Format return sign
        const returnSign = asset.returnPercent > 0 ? '+ ' : 
                          asset.returnPercent < 0 ? '- ' : '';

        row.innerHTML = `
            <td>
                <span class="asset-icon">
                    <img src="${asset.icon}" alt="${asset.name}">
                </span>
                <span class="asset-name">${asset.name}</span>
            </td>
            <td>${asset.balance}</td>
            <td>${formatCurrency(asset.invested)}</td>
            <td>${formatPriceDisplay(asset, true)}</td>
            <td>${formatPriceDisplay(asset)}</td>
            <td>${formatCurrency(asset.marketValue)}</td>
            <td class="${returnClass}">${returnSign}${Math.abs(asset.returnPercent).toFixed(2)}%</td>
            <td>${asset.sector}</td>
            <td>${asset.company}</td>
        `;

        tableBody.appendChild(row);
    });

    return calculatedAssets;
}

// Calculate and display portfolio summary
function updatePortfolioSummary(calculatedAssets) {
    // Separate liquid and non-liquid assets
    const liquidAssets = calculatedAssets.filter(asset => asset.type === "liquid");
    const nonLiquidAssets = calculatedAssets.filter(asset => asset.type === "non-liquid");

    // Calculate totals
    const totalLiquidInvested = liquidAssets.reduce((sum, asset) => sum + asset.invested, 0);
    const totalLiquidMarketValue = liquidAssets.reduce((sum, asset) => sum + asset.marketValue, 0);

    const totalNonLiquidInvested = nonLiquidAssets.reduce((sum, asset) => sum + asset.invested, 0);
    const totalNonLiquidMarketValue = nonLiquidAssets.reduce((sum, asset) => sum + asset.marketValue, 0);

    const totalInvested = totalLiquidInvested;
    const totalMarketValue = totalLiquidMarketValue + totalNonLiquidMarketValue;

    const totalPnL = totalMarketValue - totalNonLiquidInvested - totalInvested;
    const totalPercentage = (totalPnL / totalInvested) * 100;
    
    const debtAmount = BITCOIN_STRATEGY.USDC_BORROWED * EXCHANGE_RATES.USDC_TO_IDR;
    
    // In your updatePortfolioSummary function, modify the DER part with this code

// Calculate DER (Debt to Equity Ratio)
const der = debtAmount / (totalLiquidMarketValue - debtAmount) || 0;

// Determine DER status and color based on the ratio
let derStatus, derStatusClass;
if (der <= 0.2) {
    derStatus = "Sehat";
    derStatusClass = "status-healthy";
} else if (der <= 0.5) {
    derStatus = "Peringatan";
    derStatusClass = "status-warning";
} else {
    derStatus = "Bahaya";
    derStatusClass = "status-danger";
}

// Update the DER ratio display with status
document.getElementById('derRatio').innerHTML = `${der.toFixed(2)} <span class="status-indicator ${derStatusClass}">${derStatus}</span>`;

// Now add these CSS classes to your style section

    // Convert total market value to USD
    const usdEquivalent = convertIDRtoUSD(totalMarketValue);

    // Calculate non-liquid assets percentage of total
    const nonLiquidPercentage = (totalNonLiquidMarketValue / totalMarketValue) * 100;

    // Update summary values
    document.getElementById('totalEquity').textContent = formatTotalEquity(totalMarketValue);
    document.getElementById('usdEquivalent').textContent = `≈ $ ${usdEquivalent.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
    document.getElementById('totalInvested').textContent = formatCurrency(totalInvested);
    document.getElementById('totalPnL').textContent = `${totalPnL >= 0 ? '+ ' : '- '}${formatCurrency(Math.abs(totalPnL))}`;
    document.getElementById('totalDebt').textContent = formatCurrency(debtAmount);
    // Update the DER ratio display with status
document.getElementById('derRatio').innerHTML = `${der.toFixed(2)} <span class="status-indicator ${derStatusClass}">${derStatus}</span>`;
    document.getElementById('nonLiquidAssets').textContent = formatCurrency(totalNonLiquidMarketValue);
    document.getElementById('nonLiquidPercentage').textContent = `${nonLiquidPercentage.toFixed(2)}%`;

    const percentageElement = document.getElementById('totalPercentage');
    percentageElement.textContent = `${totalPercentage >= 0 ? '+ ' : '- '}${Math.abs(totalPercentage).toFixed(2)}%`;
    percentageElement.className = 'stat-value ' + (totalPercentage >= 0 ? 'positive' : 'negative');

    const pnlElement = document.getElementById('totalPnL');
    pnlElement.className = 'stat-value ' + (totalPnL >= 0 ? 'positive' : 'negative');

    return { totalMarketValue, totalInvested, totalLiquidMarketValue, totalNonLiquidMarketValue };
}

// Create donut chart with enhanced color palette
function createDonutChart(calculatedAssets) {
    const ctx = document.getElementById('donutChart').getContext('2d');

    // Filter out Property Land and assets with 0 market value
    const filteredAssets = calculatedAssets.filter(asset => 
        asset.name !== "Farmland" && asset.marketValue > 0
    );

    // Calculate percentages for the chart (based on filtered assets only)
    const totalFilteredValue = filteredAssets.reduce((sum, asset) => sum + asset.marketValue, 0);
    const data = filteredAssets.map(asset => asset.marketValue);
    const labels = filteredAssets.map(asset => asset.name);

    const colors = [
        'rgba(240, 78, 66, 0.9)',    // merah
        'rgba(255, 200, 87, 0.9)',   // kuning 
        'rgba(22, 163, 74, 0.9)',    // hijau
        'rgba(0, 108, 229, 0.9)',    // biru
        'rgba(155, 89, 182, 0.9)',   // ungu 
        
    ];

    // Create the chart
    const donutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: '#ffffff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage = ((value / totalFilteredValue) * 100).toFixed(1);
                            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });

    // Create custom legend
    const legendContainer = document.getElementById('donutLegend');
    legendContainer.innerHTML = '';

    filteredAssets.forEach((asset, index) => {
        const percentage = ((asset.marketValue / totalFilteredValue) * 100).toFixed(1);
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${colors[index % colors.length]}"></div>
            <div class="legend-text">${asset.name} (${percentage}%)</div>
        `;
        
        legendContainer.appendChild(legendItem);
    });
}

// Create wallet QR code
function createWalletQR() {
    const walletAddress = 'bc1qn9fn2z22rdtuy66ta3p2he2pdhtvvkucunljgh';
    const qrCodeContainer = document.getElementById('walletQR');

    // Generate QR code
    new QRCode(qrCodeContainer, {
        text: walletAddress,
        width: 180,
        height: 180,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

// Initialize Bitcoin Collateral Strategy
function initializeBitcoinCollateralStrategy() {
    // Get values from constants
    const { COLLATERAL_SATS, USDC_BORROWED, LIQUIDATION_LTV, INTEREST_RATE, 
            BTC_YIELD_RATE, LIQUIDATION_PRICE_USD } = BITCOIN_STRATEGY;
    
    // Calculations
    const btcCollateralBtc = COLLATERAL_SATS / BTC_CONSTANTS.SATS_TO_BTC;
    const btcValueIdr = btcCollateralBtc * BTC_CONSTANTS.PRICE_IDR;
    const usdcValueIdr = USDC_BORROWED * EXCHANGE_RATES.USDC_TO_IDR;
    
    // Calculate current LTV
    const currentLTV = (usdcValueIdr / btcValueIdr) * 100;
    
    const usdcliquidationPrice = EXCHANGE_RATES.USDC_TO_IDR * (LIQUIDATION_LTV / currentLTV);

    // Update DOM elements
    document.getElementById('btcCollateral').textContent = `${COLLATERAL_SATS.toLocaleString()} sats`;
    document.getElementById('btcValueIDR').textContent = `Rp. ${btcValueIdr.toLocaleString('id-ID', {maximumFractionDigits: 0})}`;
    
    document.getElementById('usdcBorrowed').textContent = `${USDC_BORROWED.toFixed(2)} USDC`;
    document.getElementById('usdcValueIDR').textContent = `Rp. ${usdcValueIdr.toLocaleString('id-ID', {maximumFractionDigits: 0})}`;
    
    document.getElementById('interestRate').textContent = `${INTEREST_RATE.toFixed(2)}%`;
    document.getElementById('btcYieldRate').textContent = `${BTC_YIELD_RATE.toFixed(2)}%`;
    document.getElementById('liquidationPrice').textContent = `$${LIQUIDATION_PRICE_USD.toLocaleString('en-US', {maximumFractionDigits: 2})}`;
    document.getElementById('usdcliquidationPrice').textContent = `Rp. ${usdcliquidationPrice.toLocaleString('id-ID', {maximumFractionDigits: 2})}`;

    // Update LTV indicators
    document.getElementById('currentLTV').textContent = `${currentLTV.toFixed(2)}%`;
    document.getElementById('liquidationLTV').textContent = `${LIQUIDATION_LTV.toFixed(2)}%`;
    
    // Set the progress bar width to match current LTV
    const progressBar = document.getElementById('ltvProgressBar');
    progressBar.style.width = `${currentLTV}%`;
    
    // Set the danger zone width
    const dangerZone = document.querySelector('.ltv-danger-zone');
    dangerZone.style.width = `${100 - LIQUIDATION_LTV}%`;
    
    // Update LTV status color based on proximity to liquidation
    const ltvStatusIndicator = document.getElementById('ltvStatusIndicator');
    const ltvRatio = currentLTV / 100;
    
    if (ltvRatio <= 0.55) {
        progressBar.style.backgroundColor = '#28a745'; // Green - Safe
        ltvStatusIndicator.style.backgroundColor = '#28a745';
        ltvStatusIndicator.textContent = 'Status: Healthy';
    } else if (ltvRatio <= 0.7) {
        progressBar.style.backgroundColor = '#ffc107'; // Yellow - Caution
        ltvStatusIndicator.style.backgroundColor = '#ffc107';
        ltvStatusIndicator.style.color = '#000000';
        ltvStatusIndicator.textContent = 'Status: Caution';
    } else {
        progressBar.style.backgroundColor = '#dc3545'; // Red - Warning
        ltvStatusIndicator.style.backgroundColor = '#dc3545';
        ltvStatusIndicator.textContent = 'Status: Warning';
    }
}

// Update last update timestamp
function updateLastUpdate() {
    // If you need to dynamically update the timestamp, implement this function
    // Currently the timestamp is hardcoded in the HTML
}

// Initialize the dashboard
function initializeDashboard() {
    // Calculate asset values
    const calculatedAssets = populateAssetTable();

    // Update portfolio summary
    const summaryData = updatePortfolioSummary(calculatedAssets);

    // Create donut chart
    createDonutChart(calculatedAssets);

    // Create wallet QR code
    createWalletQR();

    // Initialize Bitcoin collateral strategy
    initializeBitcoinCollateralStrategy();

    // Update last update timestamp
    updateLastUpdate();
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', initializeDashboard);