const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const ticketRoutes = require('./src/routes/ticketRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/tickets', ticketRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
