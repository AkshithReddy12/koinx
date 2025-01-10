const cron = require('node-cron');
const fetchCryptoData = require('./services/getdata');
const Crypto = require('./models/crypto');

// saving data to db
const saveCryptoData = async (data) => {
  try {
    const cryptoData = [
      {
        coin: 'bitcoin',
        price_usd: data.bitcoin.usd,
        market_cap_usd: data.bitcoin.usd_market_cap,
        change_24h: data.bitcoin.usd_24h_change,
      },
      {
        coin: 'matic-network',
        price_usd: data['matic-network'].usd,
        market_cap_usd: data['matic-network'].usd_market_cap,
        change_24h: data['matic-network'].usd_24h_change,
      },
      {
        coin: 'ethereum',
        price_usd: data.ethereum.usd,
        market_cap_usd: data.ethereum.usd_market_cap,
        change_24h: data.ethereum.usd_24h_change,
      },
    ];

    await Crypto.insertMany(cryptoData);
    console.log('Crypto data saved to MongoDB');
  } catch (error) {
    console.error('Error saving crypto data:', error);
  }
};

// fetches data every 2 hours
cron.schedule('* * * * *', async () => {
  console.log('Fetching cryptocurrency data...');
  const data = await fetchCryptoData();
  if (data) {
    saveCryptoData(data);
  }
});
