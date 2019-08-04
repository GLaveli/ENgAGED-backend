const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

//Body-parser prepara a API para receber e enviar informaçôes no formato json.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

require('./app/controllers/index')(app);

app.listen(process.env.PORT || 3000);