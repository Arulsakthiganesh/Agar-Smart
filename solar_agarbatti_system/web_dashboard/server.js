const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log('=======================================================');
  console.log(' Solar Agarbatti Real-Time Web Dashboard Active');
  console.log(` Access Dashboard at: http://localhost:${PORT}`);
  console.log('=======================================================');
});
