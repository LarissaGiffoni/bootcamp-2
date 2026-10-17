# 🎬 CineFinder — Recomendação de Filmes

## Autor
Larissa Moreira de Alencar Giffoni Lacerda 
Matrícula - 22551663

## Descrição
Aplicação web que permite descobrir filmes por gênero, buscar pelo título ou sortear um filme aleatório, exibindo pôster, ano de lançamento e nota. Útil para quem quer uma recomendação rápida de filme.

## API utilizada
- **TMDB (The Movie Database)** — https://developer.themoviedb.org/docs
- Endpoints consumidos:
  - `/search/movie` — busca por título
  - `/discover/movie` — descoberta por gênero
  - `/genre/movie/list` — lista de gêneros disponíveis
  - `/movie/popular` — filmes populares (usado no botão aleatório)

## Funcionalidades
- Busca por título (pelo botão ou pela tecla Enter)
- Filtro por gênero (dropdown populado dinamicamente)
- Botão "Surpreenda-me" que sorteia um filme popular
- Exibição de pôster, título, ano e nota
- Mensagens de erro amigáveis para busca sem resultado e falha de conexão

---

## 🚀 Novidades da Etapa 02

### 💾 Persistência de Dados
- **Banco escolhido:** Supabase (PostgreSQL).
- **Estrutura da Tabela:** `favoritos` (`id`, `created_at`, `titulo`, `ano`, `poster`, `nota`).
- **O que é salvo:** O usuário pode salvar seus filmes favoritos. Os dados são gravados num banco real (Supabase) e **sobrevivem ao fechamento do navegador**.
- **Operações CRUD:** A aplicação permite **Criar** (inserir favorito), **Ler** (listar favoritos ao abrir a página) e **Excluir** (remover favorito). O Update não foi implementado.
- **Limitação conhecida:** As políticas de segurança (RLS) do banco estão abertas para o papel `anon` nesta etapa, permitindo leitura e escrita sem autenticação de usuário, conforme escopo do projeto.

### 🐳 Como executar a aplicação via Docker
Para rodar a aplicação em qualquer máquina com Docker instalado, execute o comando:

docker run -d -p 8080:80 larissagiffoni/bootcamp2-app:latest

Depois, acesse `http://localhost:8080` no navegador.

---

## 🎮 Evidências das Sidequests

### SQ1 · .dockerignore
Foi criado um arquivo `.dockerignore` excluindo pastas e arquivos desnecessários (como `.git`, `README.md`, etc.).
**Por que isso melhora o build?** Ao ignorar esses arquivos, o Docker não precisa enviar todo o histórico do Git e arquivos pesados para o contexto de build. Isso deixa o processo muito mais rápido e a imagem final menor.

### SQ2 · Versionamento de Imagem
A imagem foi publicada no Docker Hub com três tags: `1.0` (primeira versão), `1.1` (ajustes) e `latest` (mais recente).

### SQ3 · Descrição no Docker Hub
A página do repositório no Docker Hub foi preenchida com a descrição do projeto, o comando `docker run` e o link do GitHub.

### SQ4 · Explorando a orquestração
Para comprovar a execução de múltiplos containers, dois containers da aplicação foram rodados simultaneamente nas portas 8080 e 8081. O print do comando `docker ps` está salvo neste repositório como `print-docker-ps.png`.

**Se eu tivesse 100 containers, como gerenciaria?**
Gerenciar 100 containers manualmente com `docker run` seria inviável. Para isso, utiliza-se um **orquestrador de containers** como o **Kubernetes**. Ele organiza os containers em um **Cluster** (conjunto de máquinas). Em vez de rodar containers soltos, o Kubernetes usa o conceito de **Pod** (a menor unidade, que pode conter um ou mais containers) e **Réplica** (garante que o número desejado de Pods esteja sempre rodando, substituindo automaticamente os que falham). O Kubernetes também faz o balanceamento de carga e escala a aplicação conforme a demanda.

---

## 🔗 Links do Projeto
- **Aplicação no ar (GitHub Pages):** https://larissagiffoni.github.io/bootcamp-2/ 
- **Repositório no GitHub:** https://github.com/LarissaGiffoni/bootcamp-2
- **Repositório no Docker Hub:** https://hub.docker.com/r/larissagiffoni/bootcamp2-app
