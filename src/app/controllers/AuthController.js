const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth');
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

//rota de autenticação
router.post('/autenticate', async (req, res) => {

  //Pega as informaçoes da requisição (email e senha)
  const { email, password } = req.body;
  //pega os dados recebidos e verifica no banco de dados se existe algum documento existente
  const user = await User.findOne({ email }).select('+password');

  //Se o Usuario não existir retorna o estatus 400
  if (!user)
    return res.status(400).send({ error: 'Usuario não encontrado' })

  //Se existir um usuario ele verifica a senha enviada, decriptografando a que esta no banco para comparação
  //Caso incorreta, envia o estatus 400
  if (!await bcrypt.compare(password, user.password))
    return res.status(400).send({ error: 'Senha incorreta' });
  //Impede que a senha seja retornada na requisição (Não mostra a senha ao usuario)
  user.password = undefined;
  //Se tudo estiver correto, é retornado os dados de usuario junto ao token
  res.send({
    user,
    token: generateTolken({ id: user.id })
  })
});

//rota para o envio de email de senha perdida
router.post('/forgot_password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).send({ error: 'Email não encontrado' });

    //Gera um token de 20 caracteres utilizando o crypto
    const cryptoken = crypto.randomBytes(20).toString('hex');
    //Pega a data do momento
    const now = new Date();
    //Adiciona 1 hora a mais
    now.setHours(now.getHours() + 1);
    //Adiciona ao documento os dados gerados de token e tempo de duração
    await User.findByIdAndUpdate(user.id, {
      '$set': {
        passwordResetToken: cryptoken,
        passwordResetExpires: now
      }
    });

    mailer.sendMail({
      from: 'g.laveli.p@gmail.com',
      to: 'g.laveli.p@gmail.com',
      subject: 'Sending Email using Node.js',
      html: '</p> Codigo de validação para recuprar sua senha: </p> ' + cryptoken
    },
      (err) => {

        if (err)
          return res.status(400).send({ error: 'Não é posivel fazer o envio do email ' });

        return res.send();

      });

  } catch (err) {
    console.log(err);
    res.status(400).send({ error: 'Uma falha ocorreu durante o proceso tente de novoem instantes!: ' });
  }

});

//rota para resetar a senha
router.post('/reset_password', async (req, res) => {

  const { email, token, password } = req.body;

  try {

    const user = await User.findOne({ email })
      .select('+passwordResetToken passwordResetExpires');

  } catch (err) {

    res.status(400).send({ error: 'Não foi possivel resetar a senha, tente novamente' })

  }

});

//Aqui é esportado o modulo para que outras partes do sistema possam utilizar a autenticação
module.exports = app => app.use('/auth', router);