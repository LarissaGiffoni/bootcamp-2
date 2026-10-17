/* ============================================================
   CineFinder — Bootcamp II · Etapa 02
   API: TMDB (The Movie Database) + Supabase (Favoritos)
   ============================================================ */

// ⚠️ SUBSTITUA "SUA_CHAVE_AQUI" pela sua API Key do TMDB
const API_KEY = "7019b2b0b035a4ac4e147823b5238467";

const URL_BASE = "https://api.themoviedb.org/3";
const URL_IMAGEM = "https://image.tmdb.org/t/p/w300";

// ============================================================
// CONEXÃO COM O SUPABASE
// ============================================================
const supabaseUrl = 'https://uyxlgxfbirfhmmrduhof.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eGxneGZiaXJmaG1tcmR1aG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5ODk0NDUsImV4cCI6MjEwNzU2NTQ0NX0.Mgm3GALZgjGOPHv8-DEEVrH6_WdpHUoSrfwavPdQnhg';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// ------- Elementos do modo normal -------
const campoBusca = document.getElementById("campo-busca");
const botaoBuscar = document.getElementById("botao-buscar");
const botaoAleatorio = document.getElementById("botao-aleatorio");
const filtroGenero = document.getElementById("filtro-genero");
const areaResultado = document.getElementById("resultado");
const areaPaginacao = document.getElementById("paginacao");
const botaoModoGosto = document.getElementById("botao-modo-gosto");

// ------- Elementos do modo gosto -------
const modoNormal = document.getElementById("modo-normal");
const modoGosto = document.getElementById("modo-gosto");
const modoResultadoQuiz = document.getElementById("modo-resultado-quiz");
const quizFilme = document.getElementById("quiz-filme");
const quizProgresso = document.getElementById("quiz-progresso");
const botaoGostei = document.getElementById("botao-gostei");
const botaoNaoGostei = document.getElementById("botao-nao-gostei");
const botaoCancelarQuiz = document.getElementById("botao-cancelar-quiz");
const botaoVoltar = document.getElementById("botao-voltar");
const resultadoQuiz = document.getElementById("resultado-quiz");

// ------- Estado da paginação -------
let estadoAtual = {
  tipo: null,       // "genero" ou "busca"
  valor: null,      // id do gênero ou termo de busca
  pagina: 1,
  totalPaginas: 1,
};

// ------- Estado do modo gosto -------
const estadoQuiz = {
  filmes: [],       // lista de filmes para o usuário avaliar
  indice: 0,        // em qual filme estamos
  gostei: [],       // filmes que a pessoa gostou
};

const TOTAL_QUIZ = 5; // quantos filmes a pessoa vai avaliar

/* ============================================================
   MODO NORMAL — carregamento de gêneros
   ============================================================ */
async function carregarGeneros() {
  try {
    const resposta = await fetch(
      `${URL_BASE}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`
    );
    if (!resposta.ok) throw new Error();
    const dados = await resposta.json();

    dados.genres.forEach((genero) => {
      const opcao = document.createElement("option");
      opcao.value = genero.id;
      opcao.textContent = genero.name;
      filtroGenero.appendChild(opcao);
    });
  } catch (erro) {
    console.warn("Não foi possível carregar os gêneros.");
  }
}

/* ============================================================
   MONTAGEM DE CARTÃO (Agora com botão de Favoritar)
   ============================================================ */
function montarCartao(filme) {
  const poster = filme.poster_path
    ? `${URL_IMAGEM}${filme.poster_path}`
    : null;

  const imagemHTML = poster
    ? `<img src="${poster}" alt="Pôster de ${filme.title}" loading="lazy">`
    : `<div style="aspect-ratio:2/3;display:flex;align-items:center;justify-content:center;font-size:3rem;background:#0f0f1a">🎬</div>`;

  const ano = filme.release_date ? filme.release_date.split("-")[0] : "—";
  const nota = filme.vote_average ? filme.vote_average.toFixed(1) : "N/A";

  // Convertendo o objeto do filme para uma string JSON segura para colocar no onclick
  const filmeString = JSON.stringify(filme).replace(/'/g, "&#39;");

  return `
    <article class="cartao-filme">
      ${imagemHTML}
      <div class="info">
        <h3 title="${filme.title}">${filme.title}</h3>
        <p class="meta">${ano}</p>
        <span class="nota">★ ${nota}</span>
        <button class="btn-favoritar" onclick='salvarFavorito(${filmeString})' style="margin-top: 10px; width: 100%; padding: 8px; background: #e50914; color: white; border: none; border-radius: 4px; cursor: pointer;">
          ⭐ Favoritar
        </button>
      </div>
    </article>`;
}

function renderizar(filmes) {
  if (!filmes || filmes.length === 0) {
    areaResultado.innerHTML =
      '<div class="erro">Nenhum filme encontrado.<br>Tente outro termo ou gênero.</div>';
    areaPaginacao.innerHTML = "";
    return;
  }
  const cartoes = filmes.map(montarCartao).join("");
  areaResultado.innerHTML = `<div class="grade-filmes">${cartoes}</div>`;
}

/* ============================================================
   PAGINAÇÃO
   ============================================================ */
function renderizarPaginacao() {
  areaPaginacao.innerHTML = "";

  if (estadoAtual.totalPaginas <= 1) return;

  const total = estadoAtual.totalPaginas;
  const atual = estadoAtual.pagina;

  // Botão "Anterior"
  const btnAnterior = document.createElement("button");
  btnAnterior.textContent = "←";
  btnAnterior.disabled = atual === 1;
  btnAnterior.addEventListener("click", () => irParaPagina(atual - 1));
  areaPaginacao.appendChild(btnAnterior);

  // Cria uma janela de páginas ao redor da atual (no máx. 5 botões)
  let inicio = Math.max(1, atual - 2);
  let fim = Math.min(total, inicio + 4);
  if (fim - inicio < 4) inicio = Math.max(1, fim - 4);

  if (inicio > 1) {
    adicionarBotaoPagina(1);
    if (inicio > 2) areaPaginacao.appendChild(document.createTextNode("…"));
  }

  for (let i = inicio; i <= fim; i++) {
    adicionarBotaoPagina(i);
  }

  if (fim < total) {
    if (fim < total - 1) areaPaginacao.appendChild(document.createTextNode("…"));
    adicionarBotaoPagina(total);
  }

  // Botão "Próxima"
  const btnProxima = document.createElement("button");
  btnProxima.textContent = "→";
  btnProxima.disabled = atual === total;
  btnProxima.addEventListener("click", () => irParaPagina(atual + 1));
  areaPaginacao.appendChild(btnProxima);
}

function adicionarBotaoPagina(numero) {
  const btn = document.createElement("button");
  btn.textContent = numero;
  if (numero === estadoAtual.pagina) btn.classList.add("ativo");
  btn.addEventListener("click", () => irParaPagina(numero));
  areaPaginacao.appendChild(btn);
}

function irParaPagina(pagina) {
  if (pagina < 1 || pagina > estadoAtual.totalPaginas) return;
  estadoAtual.pagina = pagina;

  if (estadoAtual.tipo === "genero") {
    descobrirPorGenero(estadoAtual.valor, pagina);
  } else if (estadoAtual.tipo === "busca") {
    buscarPorTitulo(estadoAtual.valor, pagina);
  }

  // Sobe a página para o topo da grade
  areaResultado.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ============================================================
   BUSCA POR TÍTULO
   ============================================================ */
async function buscarPorTitulo(termo, pagina = 1) {
  areaResultado.innerHTML = '<p class="carregando">Buscando filmes...</p>';
  areaPaginacao.innerHTML = "";

  try {
    const resposta = await fetch(
      `${URL_BASE}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(termo)}&page=${pagina}`
    );
    if (!resposta.ok) throw new Error("nao-encontrado");

    const dados = await resposta.json();

    estadoAtual = {
      tipo: "busca",
      valor: termo,
      pagina: dados.page,
      totalPaginas: Math.min(dados.total_pages, 500), // TMDB limita a 500 páginas
    };

    renderizar(dados.results);
    renderizarPaginacao();
  } catch (erro) {
    areaResultado.innerHTML =
      '<div class="erro">Não foi possível consultar a API agora.</div>';
  }
}

/* ============================================================
   DESCOBRIR POR GÊNERO
   ============================================================ */
async function descobrirPorGenero(generoId, pagina = 1) {
  areaResultado.innerHTML = '<p class="carregando">Carregando filmes...</p>';
  areaPaginacao.innerHTML = "";

  try {
    const resposta = await fetch(
      `${URL_BASE}/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=${generoId}&sort_by=popularity.desc&page=${pagina}`
    );
    if (!resposta.ok) throw new Error("nao-encontrado");

    const dados = await resposta.json();

    estadoAtual = {
      tipo: "genero",
      valor: generoId,
      pagina: dados.page,
      totalPaginas: Math.min(dados.total_pages, 500),
    };

    renderizar(dados.results);
    renderizarPaginacao();
  } catch (erro) {
    areaResultado.innerHTML =
      '<div class="erro">Não foi possível carregar esse gênero.</div>';
  }
}

/* ============================================================
   FILME ALEATÓRIO
   ============================================================ */
async function filmeAleatorio() {
  areaResultado.innerHTML = '<p class="carregando">Sorteando um filme...</p>';
  areaPaginacao.innerHTML = "";

  try {
    const pagina = Math.floor(Math.random() * 10) + 1;
    const resposta = await fetch(
      `${URL_BASE}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${pagina}`
    );
    if (!resposta.ok) throw new Error();

    const dados = await resposta.json();
    const sorteado = dados.results[Math.floor(Math.random() * dados.results.length)];

    areaResultado.innerHTML = `<div class="grade-filmes">${montarCartao(sorteado)}</div>`;
  } catch (erro) {
    areaResultado.innerHTML =
      '<div class="erro">Não foi possível sortear um filme agora.</div>';
  }
}

/* ============================================================
   MODO "DESCOBRIR PELO MEU GOSTO"
   ============================================================ */
async function iniciarQuiz() {
  // Esconde modo normal, mostra modo quiz
  modoNormal.classList.add("escondido");
  modoResultadoQuiz.classList.add("escondido");
  modoGosto.classList.remove("escondido");

  quizFilme.innerHTML = '<p class="carregando">Preparando filmes...</p>';
  quizProgresso.textContent = "";

  try {
    // Pega 5 filmes populares aleatórios
    const pagina = Math.floor(Math.random() * 10) + 1;
    const resposta = await fetch(
      `${URL_BASE}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${pagina}`
    );
    if (!resposta.ok) throw new Error();

    const dados = await resposta.json();
    // Embaralha e pega os 5 primeiros
    estadoQuiz.filmes = dados.results
      .sort(() => Math.random() - 0.5)
      .slice(0, TOTAL_QUIZ);
    estadoQuiz.indice = 0;
    estadoQuiz.gostei = [];

    mostrarFilmeDoQuiz();
  } catch (erro) {
    quizFilme.innerHTML =
      '<div class="erro">Não foi possível carregar os filmes agora.</div>';
  }
}

function mostrarFilmeDoQuiz() {
  if (estadoQuiz.indice >= estadoQuiz.filmes.length) {
    finalizarQuiz();
    return;
  }

  const filme = estadoQuiz.filmes[estadoQuiz.indice];
  quizProgresso.textContent = `Filme ${estadoQuiz.indice + 1} de ${estadoQuiz.filmes.length}`;
  quizFilme.innerHTML = `<div class="grade-filmes" style="grid-template-columns:1fr">${montarCartao(filme)}</div>`;
}

function responderQuiz(gostou) {
  if (gostou) {
    estadoQuiz.gostei.push(estadoQuiz.filmes[estadoQuiz.indice]);
  }
  estadoQuiz.indice++;
  mostrarFilmeDoQuiz();
}

async function finalizarQuiz() {
  // Se não gostou de nenhum, avisa
  if (estadoQuiz.gostei.length === 0) {
    modoGosto.classList.add("escondido");
    modoNormal.classList.remove("escondido");
    areaResultado.innerHTML =
      '<div class="erro">Você não gostou de nenhum filme. Tente de novo com outros!</div>';
    areaPaginacao.innerHTML = "";
    return;
  }

  // Esconde modo quiz, mostra modo resultado
  modoGosto.classList.add("escondido");
  modoResultadoQuiz.classList.remove("escondido");
  resultadoQuiz.innerHTML = '<p class="carregando">Buscando recomendações...</p>';

  try {
    // Para cada filme que gostou, pega as recomendações
    const promessas = estadoQuiz.gostei.map((filme) =>
      fetch(
        `${URL_BASE}/movie/${filme.id}/recommendations?api_key=${API_KEY}&language=pt-BR&page=1`
      ).then((r) => r.json())
    );

    const resultados = await Promise.all(promessas);

    // Junta todas as recomendações numa lista única (removendo duplicados)
    const vistos = new Set();
    const recomendados = [];

    resultados.forEach((r) => {
      (r.results || []).forEach((f) => {
        if (!vistos.has(f.id) && !estadoQuiz.gostei.some((g) => g.id === f.id)) {
          vistos.add(f.id);
          recomendados.push(f);
        }
      });
    });

    // Embaralha e limita a 20
    const listaFinal = recomendados
      .sort(() => Math.random() - 0.5)
      .slice(0, 20);

    if (listaFinal.length === 0) {
      resultadoQuiz.innerHTML =
        '<div class="erro">Não encontramos recomendações parecidas. Tente de novo!</div>';
      return;
    }

    resultadoQuiz.innerHTML = `<div class="grade-filmes">${listaFinal.map(montarCartao).join("")}</div>`;
  } catch (erro) {
    resultadoQuiz.innerHTML =
      '<div class="erro">Não foi possível carregar as recomendações agora.</div>';
  }
}

function voltarAoInicio() {
  modoResultadoQuiz.classList.add("escondido");
  modoGosto.classList.add("escondido");
  modoNormal.classList.remove("escondido");
  areaResultado.innerHTML = "";
  areaPaginacao.innerHTML = "";
}

/* ============================================================
   FUNÇÕES DO SUPABASE (SALVAR / LISTAR / DELETAR)
   ============================================================ */

// Função chamada quando o usuário clica no botão "⭐ Favoritar"
async function salvarFavorito(filme) {
  const botao = event.target; // Pega o botão que foi clicado
  botao.textContent = "Salvando...";
  botao.disabled = true;

  const { error } = await supabaseClient
    .from('favoritos')
    .insert([
      { 
        titulo: filme.title, 
        ano: filme.release_date ? filme.release_date.split('-')[0] : '—', 
        poster: filme.poster_path ? `${URL_IMAGEM}${filme.poster_path}` : '', 
        nota: filme.vote_average ? filme.vote_average.toFixed(1) : 'N/A'
      }
    ]);

  if (error) {
    console.error('Erro ao salvar:', error);
    alert('Erro ao salvar o filme. Veja o console (F12).');
    botao.textContent = "⭐ Favoritar";
    botao.disabled = false;
  } else {
    botao.textContent = "✅ Salvo!";
    botao.style.background = "#28a745"; // Fica verde
    listarFavoritos(); // Atualiza a lista na tela
  }
}

// Função para buscar os favoritos no banco e desenhar na tela
async function listarFavoritos() {
  const container = document.getElementById("lista-favoritos");
  if (!container) return;

  const { data, error } = await supabaseClient
    .from('favoritos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao listar:', error);
    container.innerHTML = '<p class="erro">Erro ao carregar favoritos.</p>';
    return;
  }

  if (data.length === 0) {
    container.innerHTML = '<p style="color: #888;">Você ainda não tem filmes favoritos.</p>';
    return;
  }

  container.innerHTML = data.map(filme => `
    <article class="cartao-filme" style="width: 200px;">
      <img src="${filme.poster}" alt="${filme.titulo}" style="width: 100%; border-radius: 8px;">
      <div class="info">
        <h3 title="${filme.titulo}">${filme.titulo}</h3>
        <p class="meta">${filme.ano}</p>
        <span class="nota">★ ${filme.nota}</span>
        <button onclick="removerFavorito(${filme.id})" style="margin-top: 10px; width: 100%; padding: 8px; background: #444; color: white; border: none; border-radius: 4px; cursor: pointer;">
          ❌ Excluir
        </button>
      </div>
    </article>
  `).join("");
}

// Função para deletar um filme do banco
async function removerFavorito(id) {
  const { error } = await supabaseClient
    .from('favoritos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar:', error);
    alert('Não foi possível excluir.');
  } else {
    listarFavoritos(); // Atualiza a lista
  }
}

/* ============================================================
   EVENTOS
   ============================================================ */
function dispararBusca() {
  const termo = campoBusca.value.trim();
  if (termo) buscarPorTitulo(termo, 1);
}

botaoBuscar.addEventListener("click", dispararBusca);
campoBusca.addEventListener("keydown", (e) => {
  if (e.key === "Enter") dispararBusca();
});

filtroGenero.addEventListener("change", () => {
  if (filtroGenero.value) descobrirPorGenero(filtroGenero.value, 1);
});

botaoAleatorio.addEventListener("click", filmeAleatorio);
botaoModoGosto.addEventListener("click", iniciarQuiz);

botaoGostei.addEventListener("click", () => responderQuiz(true));
botaoNaoGostei.addEventListener("click", () => responderQuiz(false));
botaoCancelarQuiz.addEventListener("click", voltarAoInicio);
botaoVoltar.addEventListener("click", voltarAoInicio);

// Inicialização
carregarGeneros();
listarFavoritos(); // Carrega os favoritos assim que a página abre