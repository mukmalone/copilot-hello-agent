const express = require('express');
const {
  getHome,
  getCurrentTime,
} = require('../controllers/homeController');

const router = express.Router();

router.get('/', getHome);
router.get('/api/time', getCurrentTime);

module.exports = router;
