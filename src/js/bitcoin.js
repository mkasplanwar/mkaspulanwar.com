        async function fetchBitcoinPrice() {
            try {
                // Ambil harga Bitcoin dari API CoinGecko
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=idr');
                const data = await response.json();
                return data.bitcoin.idr; // Harga Bitcoin dalam Rupiah
            } catch (error) {
                console.error('Error fetching Bitcoin price:', error);
                return null; // Jika gagal, kembalikan null
            }
        }
    
        async function calculateBalance() {
            const satsAmount = 102975// Jumlah Satoshi 
            const satToBtc = satsAmount / 100000000; // Konversi Satoshi ke Bitcoin (1 BTC = 100 juta sats)
    
            // Ambil harga Bitcoin dalam Rupiah
            const bitcoinPriceInIDR = await fetchBitcoinPrice();
            if (bitcoinPriceInIDR === null) {
                document.getElementById('balance-idr').textContent = 'Failed to load';
                return;
            }
    
            // Hitung nilai dalam Rupiah
            const balanceInIDR = satToBtc * bitcoinPriceInIDR;
            document.getElementById('balance-idr').textContent = `Rp ${balanceInIDR.toLocaleString('id-ID')}`;
        }
    
        // Panggil fungsi saat halaman dimuat
        calculateBalance();