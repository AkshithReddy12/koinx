const axios = require('axios');

const COIN_GECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';

const fetchCryptoData = async () => {
  try {
    const response = await axios.get(COIN_GECKO_API_URL, {
      params: {
        ids: 'bitcoin,matic-network,ethereum',
        vs_currencies: 'usd',
        include_market_cap: 'true',
        include_24hr_change: 'true',
        x_cg_demo_api_key: process.env.API_KEY
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data from CoinGecko:', error);
  }
};

module.exports = fetchCryptoData;
