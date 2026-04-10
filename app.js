const express = require('express');
const homeRoutes = require('./routes/homeRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

app.use(express.json());
app.use('/', homeRoutes);
app.use('/api', noteRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
