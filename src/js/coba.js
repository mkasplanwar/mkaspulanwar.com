const bitcoinAddress = 'bc1q8y5pnaxvk3pq2564cpl7u63n075pye25h7nx3j'; // Ganti dengan alamat yang valid
const blockCypherApiUrl = `https://api.blockcypher.com/v1/btc/main/addrs/${bitcoinAddress}`;
const coinGeckoApiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=idr`;

async function fetchBitcoinData() {
  try {
    // Mengambil data dari BlockCypher API untuk alamat Bitcoin
    const response = await fetch(blockCypherApiUrl);
    if (!response.ok) {
      throw new Error('Gagal mengambil data dari BlockCypher');
    }
    const data = await response.json();

    // Memeriksa apakah ada saldo
    if (data.balance === undefined) {
      document.getElementById('balance').textContent = 'Tidak ada saldo';
    } else {
      document.getElementById('address').textContent = bitcoinAddress;
      document.getElementById('balance').textContent = (data.balance / 100).toFixed(0); // Saldo dalam satoshi
    }

    // Mengambil konversi harga dari CoinGecko
    fetchConversion(data.balance);
    document.getElementById('explorerLink').href = `https://www.blockcypher.com/btc/address/${bitcoinAddress}`;
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data Bitcoin:', error);
    document.getElementById('balance').textContent = 'Error';
  }
}

async function fetchConversion(satoshi) {
  try {
    // Mengambil harga BTC ke IDR dari CoinGecko
    const response = await fetch(coinGeckoApiUrl);
    if (!response.ok) {
      throw new Error('Gagal mengambil data harga dari CoinGecko');
    }

    const data = await response.json();
    const btcToIdr = data.bitcoin.idr;
    const satoshiToIdr = (satoshi / 100000000) * btcToIdr; // Konversi Satoshi ke IDR

    document.getElementById('converted').textContent = satoshiToIdr.toLocaleString(); // Menampilkan IDR
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data harga BTC:', error);
    document.getElementById('converted').textContent = 'Error';
  }
}

// Memanggil fungsi untuk mengambil data saat halaman dimuat
fetchBitcoinData();
