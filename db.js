const mysql = require('mysql2');

const conexao = mysql.createConnection({
  host: 'localhost',
  user: 'root',       
  password: 'hbt23032412',       
  database: 'controle_ponto'
});

conexao.connect((erro) => {
  if (erro) {
    console.error('Erro ao conectar ao MySQL:', erro);
  } else {
    console.log('Conectado ao MySQL com sucesso!');
  }
});

module.exports = conexao;