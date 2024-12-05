// Alamat Bitcoin yang ingin dicek
const bitcoinAddress = 'bc1q8y5pnaxvk3pq2564cpl7u63n075pye25h7nx3j';

// URL BlockCypher API
const apiUrl = `https://api.blockcypher.com/v1/btc/main/addrs/${bitcoinAddress}`;

// Fungsi untuk mengambil data dari BlockCypher
async function fetchBitcoinData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Failed to fetch data');
    
    const data = await response.json();

    // Update elemen HTML dengan data API
    document.getElementById('address').textContent = bitcoinAddress;
    document.getElementById('balance').textContent = `${(data.balance / 100000000).toFixed(8)} BTC`;
    document.getElementById('explorerLink').href = `https://live.blockcypher.com/btc/address/${bitcoinAddress}`;
  } catch (error) {
    console.error('Error fetching Bitcoin data:', error);
    document.getElementById('address').textContent = 'Error loading address';
    document.getElementById('balance').textContent = 'Error loading balance';
  }
}

// Panggil fungsi saat halaman dimuat
fetchBitcoinData();

// Refresh data setiap 30 detik
setInterval(fetchBitcoinData, 30000);
