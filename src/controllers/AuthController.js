const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');
const User = require('../models/User');

const router = express.Router();

//função cria uma validação unica do token com base no secret.
function generateTolken(params = {}) {

  //quem chama este metodo envia os params{} necessários para gerar o token
  return jwt.sign(params, authConfig.secret, {
    //validade de 24h para todo novo tolken de acesso gerado (cada novo login gera um novo token)
    expiresIn: 86400,
  });

}

//Rota de registro, onde é chegado no documento se o email cadastrado é existente
router.post('/register', async (req, res) => {

  //Esta constanten recebe as informaçoes vindas do DOM informadas pelo usuario.
  const { email } = req.body;

  try {
    //aqui é feita uma busca no documento do mongo
    if (await User.findOne({ email })) {

      //se existir um email nos documentos registrados é gerado um status 400 com aviso informando o ocorrido
      return res.status(400).send({ error: 'E-mail já cadastrado' });

    }
    //Caso o email não exista nos documentos é permitido que a função create seja executada com as informaçoes.
    const user = await User.create(req.body);

    //esta linha nao permite que campo pasword seja retornado ao criar a conta
    user.password = undefined;

    //ao finalizar o registro do documento os dados sao retornado para o usuario.
    return res.send({
      //retorna os dados cadastrados pelo usuario
      user,
      //envia os parametros para o metodo generateTolken e são retornados em tela.
      token: generateTolken({ id: user.id })
    });

  } catch (err) {

    //caso ocorra um erro durante o processo de entrada do try é gerado o status 400 com aviso
    return res.status(400).send({ error: 'Falha de registro' });
  }
});

router.post('/autenticate', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user)
    return res.status(400).send({ error: 'Usuario não encontrado' })

  if (!await bcrypt.compare(password, user.password))
    return res.status(400).send({ error: 'Senha incorreta' });

  user.password = undefined;

  res.send({
    user,
    token: generateTolken({ id: user.id })
  })
});

module.exports = (app) => {
  app.use('/auth', router)
};