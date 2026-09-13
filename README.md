# CineFinder — Recomendação de Filmes

## Autor
Larissa Moreira de Alencar Giffoni Lacerda 

Matrícula -  22551663

## Descrição
Aplicação web que permite descobrir filmes por gênero, buscar pelo título ou
sortear um filme aleatório, exibindo pôster, ano de lançamento e nota.
Útil para quem quer uma recomendação rápida de filme.

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

## Como executar localmente
1. Clone: `git clone https://github.com/LarissaGiffoni/bootcamp-2.git`
2. Obtenha uma API Key gratuita em https://www.themoviedb.org/settings/api
3. Cole a chave no arquivo `script.js` (linha 10)
4. Abra `index.html` no navegador

## Links
- **Aplicação no ar (GitHub Pages):** https://larissagiffoni.github.io/bootcamp-2/ 
- **Repositório:** https://github.com/LarissaGiffoni/bootcamp-2.git