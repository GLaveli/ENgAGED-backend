const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (req, res, next) => {

  //Variavel authHeader recebe a parte do DOM a qual tem a autorização.
  const authHeader = req.headers.authorization;

  // se essa parte do header vier vazio, significa que não existe um token
  if (!authHeader) {
    return res.status(401).send({ error: "token não existente" });
  }

  //se existir a variavel authHeader é dividida em Bearer e hash.
  const parts = authHeader.split(' ');

  //Caso o token não contenha duas partes e gerado o erro de token
  if (!parts.lenght === 2) {
    return res.status(401).send('Erro de token');
  }

  //caso o token contenha daus partes, é gerado um array literal onde essa partes serão armazenadas
  const [scheme, tolken] = parts;

  //para conferir se as partes realmente se tratam de um token
  //é checado com uma expressão regular (regexp) para verificar a existencia do objeto Bearer
  if (!/^Bearer$^/i.test(scheme)) {
    return res.status(401).send({ error: ' token mal formatted' });
  }
  //Finalmente o token recebido é comparado com o rash md5 do nosso secret
  jwt.verify(tolken, authConfig.secret, (err, decoded) => {
    //se nesse processo retornar um erro, significa que o token não foi gerado com base no rash md5 desta API!
    if (err) {
      return res.status(401).send({ error: 'token invalido' });
    }
    //Se tudo der certo, o usuario recebe 
    req.userId = decoded.id;
    return next();
  });

};