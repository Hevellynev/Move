// ================= NAV / AGENDAMENTO =================
function abrirAgendamento(nome, preco) {
  localStorage.setItem("quadraNome", nome);
  localStorage.setItem("quadraPreco", preco);
  window.location.href = "agendamento.html";
}

// ================= CARREGAR DADOS DA QUADRA =================
function carregarQuadra() {
  const nome = localStorage.getItem("quadraNome");
  const preco = localStorage.getItem("quadraPreco");

  if (nome && preco) {
    const nomeEl = document.getElementById("nomeQuadra");
    const precoEl = document.getElementById("precoQuadra");

    if (nomeEl) nomeEl.innerText = nome;
    if (precoEl) precoEl.innerText = "R$ " + preco;
  }
}

// ================= CALENDÁRIO =================
let dataAtual = new Date();
let diaSelecionado = null;

function renderizarCalendario() {
  const diasContainer = document.getElementById("dias");
  const mesAno = document.getElementById("mesAno");

  if (!diasContainer || !mesAno) return;

  diasContainer.innerHTML = "";

  const mes = dataAtual.getMonth();
  const ano = dataAtual.getFullYear();

  const nomesMes = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];

  mesAno.innerText = `${nomesMes[mes]} ${ano}`;

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();

  for (let i = 0; i < primeiroDia; i++) {
    diasContainer.innerHTML += "<div></div>";
  }

  for (let i = 1; i <= totalDias; i++) {
    const dia = document.createElement("div");
    dia.innerText = i;

    dia.onclick = () => {
      document.querySelectorAll(".dias div").forEach(d => d.classList.remove("dia-selecionado"));
      dia.classList.add("dia-selecionado");
      diaSelecionado = i;
    };

    diasContainer.appendChild(dia);
  }
}

function mudarMes(valor) {
  dataAtual.setMonth(dataAtual.getMonth() + valor);
  renderizarCalendario();
}

// ================= HORÁRIOS =================
let horaSelecionada = "";

function selecionarHora(btn) {
  document.querySelectorAll(".horarios button").forEach(b => {
    b.classList.remove("ativo");
  });

  btn.classList.add("ativo");
  horaSelecionada = btn.innerText;
}

// ================= CONFIRMAR RESERVA =================
function confirmar() {
  if (!diaSelecionado || !horaSelecionada) {
    alert("Escolha dia e horário!");
    return;
  }

  alert(`Reserva feita para o dia ${diaSelecionado} às ${horaSelecionada}`);
}

// ================= FORMULÁRIO JOGADOR =================
function abrirFormulario() {
  const form = document.getElementById("formulario");
  if (form) form.style.display = "flex";
}

function fecharFormulario() {
  const form = document.getElementById("formulario");
  if (form) form.style.display = "none";
}

// ================= SALVAR JOGADOR =================
function salvarJogador() {
  const nome = document.getElementById("nome").value;
  const posicao = document.getElementById("posicao").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;
  const nivel = document.getElementById("nivel").value;

  if (!nome || !posicao) {
    alert("Preencha os campos!");
    return;
  }

  const jogador = {
    nome,
    posicao,
    email,
    telefone,
    nivel
  };

  let lista = JSON.parse(localStorage.getItem("jogadores")) || [];
  lista.push(jogador);

  localStorage.setItem("jogadores", JSON.stringify(lista));

  fecharFormulario();
  carregarJogadores();
}

// ================= LISTAR JOGADORES =================
function carregarJogadores() {
  const container = document.querySelector(".grid");
  if (!container) return;

  let lista = JSON.parse(localStorage.getItem("jogadores")) || [];

  container.innerHTML = "";

  lista.forEach(j => {
    const iniciais = j.nome.split(" ").map(n => n[0]).join("").toUpperCase();

    const nivelClasse =
      j.nivel === "Avançado" ? "roxo" :
      j.nivel === "Intermediário" ? "amarelo" : "";

    const card = `
      <div class="player-card">
        <div class="avatar">${iniciais}</div>

        <h3 class="nome">${j.nome}</h3>
        <p class="posicao">${j.posicao}</p>

        <span class="badge ${nivelClasse}">
          ${j.nivel}
        </span>

        <div class="info">
          <p>✉ ${j.email}</p>
          <p>📞 ${j.telefone}</p>
          <p>🏆 0 jogos realizados</p>
        </div>
      </div>
    `;

    container.innerHTML += card;
  });
}

// ================= BUSCA =================
function ativarBusca() {
  const input = document.getElementById("busca");
  if (!input) return;

  input.addEventListener("keyup", function () {
    const valor = input.value.toLowerCase();

    const jogadores = document.querySelectorAll(".player-card");

    jogadores.forEach(card => {
      const nome = card.querySelector(".nome").innerText.toLowerCase();
      const posicao = card.querySelector(".posicao").innerText.toLowerCase();

      if (nome.includes(valor) || posicao.includes(valor)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
}

// ================= INICIALIZAÇÃO =================
window.onload = function () {
  carregarQuadra();
  renderizarCalendario();
  carregarJogadores();
  ativarBusca();
};

function showTab(tab) {
  const proximas = document.getElementById("proximas");
  const historico = document.getElementById("historico");

  if (!proximas || !historico) return;

  proximas.style.display = tab === "proximas" ? "block" : "none";
  historico.style.display = tab === "historico" ? "block" : "none";

  document.querySelectorAll(".abas button").forEach(btn => {
    btn.classList.remove("ativa");
  });

  event.target.classList.add("ativa");
}