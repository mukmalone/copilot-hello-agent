const express = require('express');
const homeRoutes = require('./routes/homeRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

app.use(express.json());
app.use('/', homeRoutes);
app.use('/api', noteRoutes);

module.exports = app;
