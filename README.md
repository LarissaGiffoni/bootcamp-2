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

```bash
docker run -d -p 8080:80 larissagiffoni/bootcamp2-app:latest