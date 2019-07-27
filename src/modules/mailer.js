const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-handlebars');


const { host, port, user, pass } = require('../config/mail.json');


const transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass }
});

transport.use('compile', hbs({
  viewEngine: 'handlebars',
}));

module.exports = transport;