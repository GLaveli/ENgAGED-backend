const fs = require('fs');
const path = require('path');

module.exports = app => {
  //FS = File siste
  fs
    //faz a leitura de um diretorio (__dirname representa o diretorio atual do do index.js)
    .readdirSync(__dirname)
    //Filtra os arqivos que não iniciam com '.' e que não sejam o index.js
    .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js")))
    //Percorre os arquivos deste diretório dando um require em todos os que nao entraram no filtro
    .forEach(file => require(path.resolve(__dirname, file))(app))
}