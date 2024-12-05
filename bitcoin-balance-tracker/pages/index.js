import { useState, useEffect } from 'react';
import axios from 'axios';

let lastFetched = 0; // Mendefinisikan variabel lastFetched di luar komponen

export async function getServerSideProps() {
    const walletAddress = "bc1q8y5pnaxvk3pq2564cpl7u63n075pye25h7nx3j";
    const currentTime = Date.now();

    let cachedBalance = 0;
    let cachedRate = 0;

    // Cek jika sudah lebih dari 1 menit
    if (currentTime - lastFetched > 60000) {
        try {
            // Mendapatkan saldo dari BlockCypher
            const balanceResponse = await axios.get(`https://api.blockcypher.com/v1/btc/main/addrs/${walletAddress}/balance`);
            cachedBalance = balanceResponse.data.balance;  // Menyimpan saldo dalam satoshi

            // Mendapatkan kurs BTC ke IDR dari CoinGecko
            const rateResponse = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=idr`);
            cachedRate = rateResponse.data.bitcoin.idr;

            lastFetched = currentTime; // Simpan waktu terakhir permintaan data
        } catch (error) {
            console.error('Error fetching data:', error);
            cachedBalance = 0;
            cachedRate = 0;
        }
    }

    return {
        props: {
            balanceSatoshi: cachedBalance,
            btcToIdrRate: cachedRate,
        },
    };
}

const BitcoinBalance = ({ balanceSatoshi, btcToIdrRate }) => {
    const [balanceBTC, setBalanceBTC] = useState(0);
    const [balanceIDR, setBalanceIDR] = useState(0);

    useEffect(() => {
        // Konversi saldo satoshi ke BTC
        const btcAmount = balanceSatoshi / 100000000; // 1 BTC = 100.000.000 satoshi
        setBalanceBTC(btcAmount.toFixed(8)); // Menampilkan saldo BTC dengan 8 desimal

        // Konversi saldo BTC ke IDR
        const idrAmount = btcAmount * btcToIdrRate;
        setBalanceIDR(idrAmount.toFixed(2)); // Menampilkan saldo IDR dengan 2 desimal
    }, [balanceSatoshi, btcToIdrRate]);

    return (
        <div>
            <h1>Bitcoin Wallet</h1>
            <p>Saldo BTC: {balanceBTC} BTC</p>
            <p>Saldo Satoshi: {balanceSatoshi} Satoshi</p>
            <p>Saldo Rupiah: Rp {balanceIDR}</p>
        </div>
    );
};

export default BitcoinBalance;
