const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//Body-parser prepara a API para receber e enviar informaçôes no formato json.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./app/controllers/index')(app);

app.listen(3000);