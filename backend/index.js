const express = require('express');
const cors = require('cors');
const downloadRoute = require('./routes/download');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', downloadRoute);

app.listen(5001, () => {
  console.log('Server running on http://localhost:5001');
});
