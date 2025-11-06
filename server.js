const express = require('express');
const db = require('./db');
const app = express();

app.use(express.json());


app.post('/funcionarios', (req, res) => {
  const { nome, cargo } = req.body;

  db.query('INSERT INTO funcionarios (nome, cargo) VALUES (?, ?)',
    [nome, cargo],
    (erro, resultado) => {
      if (erro) return res.status(500).json({ erro: 'Erro ao cadastrar funcionário' });
      res.status(201).json({ id: resultado.insertId, nome, cargo });
    });
});


app.get('/funcionarios', (req, res) => {
  db.query('SELECT * FROM funcionarios', (erro, resultados) => {
    if (erro) return res.status(500).json({ erro: 'Erro ao buscar funcionários' });
    res.json(resultados);
  });
});


app.post('/ponto', (req, res) => {
  const { funcionario_id, tipo } = req.body;

  db.query('SELECT * FROM funcionarios WHERE id = ?', [funcionario_id], (erro, resultados) => {
    if (erro || resultados.length === 0) {
      return res.status(404).json({ erro: 'Funcionário não encontrado' });
    }

    db.query(
      'INSERT INTO registros (funcionario_id, tipo) VALUES (?, ?)',
      [funcionario_id, tipo],
      (erro2, resultado) => {
        if (erro2) return res.status(500).json({ erro: 'Erro ao registrar ponto' });
        res.status(201).json({ id: resultado.insertId, funcionario_id, tipo });
      }
    );
  });
});


app.get('/ponto/:id', (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM registros WHERE funcionario_id = ?', [id], (erro, resultados) => {
    if (erro) return res.status(500).json({ erro: 'Erro ao buscar registros' });
    res.json(resultados);
  });
});


app.get('/relatorio/:id', (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM registros WHERE funcionario_id = ? ORDER BY data_hora ASC', [id], (erro, registros) => {
    if (erro) return res.status(500).json({ erro: 'Erro ao gerar relatório' });
    if (registros.length < 2) return res.json({ mensagem: 'Poucos registros para calcular horas' });

    let totalHoras = 0;
    let horasExtras = 0;
    let atrasos = 0;

    for (let i = 0; i < registros.length; i += 2) {
      const entrada = new Date(registros[i]?.data_hora);
      const saida = new Date(registros[i + 1]?.data_hora);

      if (entrada && saida) {
        const horasTrabalhadas = (saida - entrada) / (1000 * 60 * 60);
        totalHoras += horasTrabalhadas;

        if (horasTrabalhadas > 8) horasExtras += horasTrabalhadas - 8;
        else if (horasTrabalhadas < 8) atrasos += 8 - horasTrabalhadas;
      }
    }

    res.json({
      funcionario_id: id,
      totalHoras: totalHoras.toFixed(2),
      horasExtras: horasExtras.toFixed(2),
      atrasos: atrasos.toFixed(2)
    });
  });
});


app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
