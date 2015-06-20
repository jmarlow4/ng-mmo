module.exports = {
  port: process.env.PORT || 8000,
  db: process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/rldb'
};