const API_URL = "http://localhost:3000";

// 🧾 Função auxiliar para exibir mensagens
function showMessage(msg, isError = false) {
  const box = document.createElement("div");
  box.textContent = msg;
  box.style.padding = "10px";
  box.style.marginTop = "10px";
  box.style.borderRadius = "8px";
  box.style.textAlign = "center";
  box.style.color = isError ? "#fff" : "#155724";
  box.style.backgroundColor = isError ? "#e74c3c" : "#d4edda";
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 3000);
}

// 👷 Cadastrar funcionário
document.getElementById("btnCadastrar").addEventListener("click", async () => {
  const nome = document.getElementById("nome").value.trim();
  const cargo = document.getElementById("cargo").value.trim();

  if (!nome || !cargo) {
    showMessage("Preencha todos os campos!", true);
    return;
  }

  try {
    const resp = await fetch(`${API_URL}/funcionarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, cargo })
    });

    if (!resp.ok) throw new Error("Erro ao cadastrar funcionário");

    const data = await resp.json();
    showMessage(`Funcionário cadastrado com sucesso! ID: ${data.id}`);
    document.getElementById("nome").value = "";
    document.getElementById("cargo").value = "";
  } catch (error) {
    showMessage(error.message, true);
  }
});

// 📋 Listar funcionários
document.getElementById("btnListar").addEventListener("click", async () => {
  const lista = document.getElementById("listaFuncionarios");
  lista.innerHTML = "<li>Carregando...</li>";

  try {
    const resp = await fetch(`${API_URL}/funcionarios`);
    const data = await resp.json();

    lista.innerHTML = "";
    if (data.length === 0) {
      lista.innerHTML = "<li>Nenhum funcionário encontrado.</li>";
      return;
    }

    data.forEach(f => {
      const li = document.createElement("li");
      li.textContent = `ID: ${f.id} | ${f.nome} - ${f.cargo}`;
      lista.appendChild(li);
    });
  } catch {
    lista.innerHTML = "<li>Erro ao buscar funcionários.</li>";
  }
});

// ⏰ Registrar ponto
document.getElementById("btnRegistrarPonto").addEventListener("click", async () => {
  const funcionario_id = document.getElementById("funcionarioIdPonto").value;
  const tipo = document.getElementById("tipoPonto").value;

  if (!funcionario_id) {
    showMessage("Informe o ID do funcionário!", true);
    return;
  }

  try {
    const resp = await fetch(`${API_URL}/ponto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ funcionario_id, tipo })
    });

    if (!resp.ok) throw new Error("Erro ao registrar ponto");

    const data = await resp.json();
    showMessage(`Ponto ${data.tipo} registrado com sucesso!`);
  } catch (error) {
    showMessage(error.message, true);
  }
});

// 🔍 Consultar registros de ponto
document.getElementById("btnConsultarPonto").addEventListener("click", async () => {
  const id = document.getElementById("idConsulta").value;
  const lista = document.getElementById("listaPontos");
  lista.innerHTML = "";

  if (!id) {
    showMessage("Informe o ID do funcionário!", true);
    return;
  }

  try {
    const resp = await fetch(`${API_URL}/ponto/${id}`);
    const data = await resp.json();

    if (!Array.isArray(data) || data.length === 0) {
      lista.innerHTML = "<li>Nenhum registro encontrado.</li>";
      return;
    }

    data.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `#${p.id} | ${p.tipo.toUpperCase()} | ${new Date(p.data_hora).toLocaleString()}`;
      lista.appendChild(li);
    });
  } catch {
    lista.innerHTML = "<li>Erro ao buscar registros.</li>";
  }
});

// 📊 Gerar relatório
document.getElementById("btnRelatorio").addEventListener("click", async () => {
  const id = document.getElementById("idRelatorio").value;
  const div = document.getElementById("resultadoRelatorio");
  div.innerHTML = "";

  if (!id) {
    showMessage("Informe o ID do funcionário!", true);
    return;
  }

  try {
    const resp = await fetch(`${API_URL}/relatorio/${id}`);
    if (!resp.ok) throw new Error("Erro ao gerar relatório");

    const data = await resp.json();

    div.innerHTML = `
      <p><strong>ID do Funcionário:</strong> ${data.funcionario_id}</p>
      <p><strong>Total de Horas:</strong> ${data.totalHoras}</p>
      <p><strong>Horas Extras:</strong> ${data.horasExtras}</p>
      <p><strong>Atrasos:</strong> ${data.atrasos}</p>
    `;
  } catch (error) {
    showMessage(error.message, true);
  }
});