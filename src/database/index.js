const mongoose = require('mongoose');

mongoose.connect('mongodb://192.168.99.100:27017/engagedApp', {
  useCreateIndex: true,
  useNewUrlParser: true
});
mongoose.Promise = global.Promise;

module.exports = mongoose;