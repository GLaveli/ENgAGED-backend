const mongoose = require('mongoose');

mongoose.connect('mongodb://192.168.99.100:27017/engagedApp', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

mongoose.connection.on('disconnected', function () {
  console.log('Conexão finalizada');
});

mongoose.connection.on('error', function (err) {
  console.log(' Ocorreu um erro: ' + err);
});


mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

module.exports = mongoose;