# 🕒 Sistema de Controle de Ponto

Um projeto simples de **backend em Node.js** com **Express** e **MySQL**, que permite cadastrar funcionários, registrar batidas de ponto (entrada, saída, intervalo) e gerar relatórios de horas trabalhadas, extras e atrasos.

---

## 🚀 Tecnologias utilizadas

* [Node.js](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [MySQL](https://www.mysql.com/)


---

## ⚙️ Funcionalidades

* Cadastro de funcionários
* Registro de batidas de ponto (entrada, saída e intervalo)
* Cálculo simples de horas trabalhadas
* Identificação de horas extras e atrasos
* Relatório individual por funcionário

---

## 🗄️ Banco de dados

```sql
CREATE DATABASE controle_ponto;
USE controle_ponto;

CREATE TABLE funcionarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  cargo VARCHAR(100)
);

CREATE TABLE registros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  funcionario_id INT,
  tipo ENUM('entrada','saida','intervalo') NOT NULL,
  data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);
```

---

## 🔧 Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/timenewhorizonsLTDA/Sistema-de-controle-de-ponto.git
   ```

2. Instale as dependências:

   ```bash
   npm install express mysql2
   ```

3. Configure a conexão com o banco de dados no arquivo `db.js`:

   ```js
   const conexao = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: '',
     database: 'controle_ponto'
   });
   ```

4. Inicie o servidor:

   ```bash
   node server.js
   ```

O servidor iniciará em:

```
http://localhost:3000
```

---

## 📬 Rotas da API

### 👤 Funcionários

#### ➕ Cadastrar funcionário

`POST /funcionarios`

**Body JSON:**

```json
{
  "nome": "João Vitor",
  "cargo": "Desenvolvedor"
}
```

#### 📋 Listar funcionários

`GET /funcionarios`

---

### 🕐 Registros de ponto

#### ➕ Registrar ponto

`POST /ponto`

**Body JSON:**

```json
{
  "funcionario_id": 1,
  "tipo": "entrada"
}
```

Tipos aceitos: `"entrada"`, `"saida"`, `"intervalo"`

#### 📄 Listar registros de um funcionário

`GET /ponto/:idFuncionario`

Exemplo:

```
GET /ponto/1
```

---

### 📊 Relatório

#### 📈 Gerar relatório de horas

`GET /relatorio/:idFuncionario`

Exemplo:

```
GET /relatorio/1
```

**Retorno:**

```json
{
  "funcionario_id": "1",
  "totalHoras": "9.50",
  "horasExtras": "1.50",
  "atrasos": "0.00"
}
```

---

## 🧠 Lógica de cálculo

* Jornada padrão: **8 horas por dia**
* Se o funcionário trabalhar **mais de 8h**, o excedente é contado como **hora extra**
* Se trabalhar **menos de 8h**, a diferença é considerada **atraso**


---

Desenvolvido como exemplo prático de integração entre **Node.js**, **Express** e **MySQL**
