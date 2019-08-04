const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://deploy:Sem_senha1@cluster0-x03i0.mongodb.net/engagedApp?retryWrites=true&w=majority', {
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