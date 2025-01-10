const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Crypto = require('./models/crypto');
const math = require('mathjs');  
const fetchCryptoData = require('./services/getdata');  
require('./cron'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));


// stats api
app.get('/stats', async (req, res) => {
  const { coin } = req.query;

  if (!coin || !['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
    return res.status(400).json({ error: 'Invalid coin. Valid options are bitcoin, matic-network, ethereum.' });
  }

  try {
    const latestData = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(1);
    if (latestData.length === 0) {
      return res.status(404).json({ error: 'No data available for the requested coin.' });
    }

    res.json(latestData[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// deviation api
app.get('/deviation', async (req, res) => {
  const { coin } = req.query;

  if (!coin || !['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
    return res.status(400).json({ error: 'Invalid coin. Valid options are bitcoin, matic-network, ethereum.' });
  }

  try {
    const records = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(100);

    if (records.length === 0) {
      return res.status(404).json({ error: 'No records found for the requested coin.' });
    }
    const prices = records.map(record => record.price_usd);
    const deviation = math.std(prices); 
    res.json({ deviation: deviation.toFixed(2) });

  } catch (error) {
    console.error('Error calculating deviation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
