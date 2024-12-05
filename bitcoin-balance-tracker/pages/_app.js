// pages/_app.js
import './styles.css'; // Pastikan path sesuai dengan lokasi file Anda
import React from 'react';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
