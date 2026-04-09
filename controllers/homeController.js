const getHome = (req, res) => {
  res.send('Hello World');
};

const getCurrentTime = (req, res) => {
  res.json({ currentTime: new Date().toISOString() });
};

module.exports = {
  getHome,
  getCurrentTime,
};
