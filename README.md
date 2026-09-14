# clone-tabnews

Clone do [TabNews](https://www.tabnews.com.br) desenvolvido durante o curso [curso.dev](https://curso.dev), com foco em boas práticas de engenharia de software: testes automatizados, CI/CD, migrações de banco de dados e arquitetura de API RESTful.

---

## 🚀 Tecnologias

| Camada         | Tecnologia                                                                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework      | [Next.js 16](https://nextjs.org/) + [React 19](https://react.dev/)                                                                                   |
| Banco de dados | [PostgreSQL 16](https://www.postgresql.org/)                                                                                                         |
| Migrations     | [node-pg-migrate](https://github.com/salsita/node-pg-migrate)                                                                                        |
| Autenticação   | Cookie de sessão + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)                                                                                  |
| E-mail         | [Nodemailer](https://nodemailer.com/) + [MailCatcher](https://mailcatcher.me/)                                                                       |
| Data fetching  | [SWR](https://swr.vercel.app/)                                                                                                                       |
| Testes         | [Jest](https://jestjs.io/) + [@faker-js/faker](https://fakerjs.dev/)                                                                                 |
| Infra local    | [Docker](https://www.docker.com/) (Compose)                                                                                                          |
| Linting        | [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)                                                                                     |
| Commits        | [Husky](https://typicode.github.io/husky/) + [Commitlint](https://commitlint.js.org/) + [Commitizen](https://commitizen-tools.github.io/commitizen/) |

---

## ✨ Features

- **Cadastro de usuários** com validação de unicidade de username e e-mail
- **Ativação de conta por e-mail** — ao se cadastrar, o usuário recebe um link de ativação com expiração de 15 minutos
- **Login e logout** via sessão segura em cookie (expiração de 30 dias, renovável)
- **Controle de acesso baseado em features** — cada usuário possui um array de permissões que evolui conforme o estado da conta (ex: após ativar o e-mail, recebe permissão para criar sessão e atualizar perfil)
- **CRUD de usuário** com filtragem de saída por nível de autorização (dados públicos vs. dados do próprio usuário)
- **Endpoint de status** da aplicação com métricas de conexão ao banco de dados
- **Migrações de banco via API** — possível listar e executar migrações via `GET/POST /api/v1/migrations`
- **Hierarquia de erros estruturada** — erros HTTP tipados (`ValidationError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, etc.) com resposta JSON padronizada

---

## 📁 Estrutura do projeto

```bash
.
├── infra/
│   ├── compose.yaml        # PostgreSQL + MailCatcher via Docker
│   ├── controller.js       # Middlewares (injeção de usuário, autorização, cookies)
│   ├── database.js         # Pool de conexões com o PostgreSQL
│   ├── email.js            # Envio de e-mails via Nodemailer
│   ├── errors.js           # Classes de erro tipadas
│   ├── migrations/         # Arquivos de migração SQL
│   ├── scripts/            # Scripts utilitários (ex: wait-for-postgres)
│   └── webserver.js        # Configuração do servidor
├── models/
│   ├── user.js             # CRUD de usuários + hash de senha
│   ├── authentication.js   # Lógica de autenticação (email + senha)
│   ├── authorization.js    # Feature flags + filtragem de output
│   ├── session.js          # Criação, renovação e expiração de sessões
│   ├── activation.js       # Tokens de ativação de conta
│   ├── password.js         # Hashing e comparação de senhas
│   └── migrator.js         # Execução programática de migrações
├── pages/
│   ├── index.js            # Página inicial
│   └── api/v1/
│       ├── status/         # GET  /api/v1/status
│       ├── users/          # POST /api/v1/users | GET+PATCH /api/v1/users/:username
│       ├── user/           # GET  /api/v1/user (usuário autenticado)
│       ├── sessions/       # POST+DELETE /api/v1/sessions
│       ├── activations/    # PATCH /api/v1/activations/:token_id
│       └── migrations/     # GET+POST /api/v1/migrations
└── tests/
    ├── integration/        # Testes de integração por endpoint
    ├── unit/               # Testes unitários de models
    └── orchestrator.js     # Helpers de setup/teardown de testes
```

---

## 🔌 API — Endpoints

| Método   | Rota                            | Descrição                                     |
| -------- | ------------------------------- | --------------------------------------------- |
| `GET`    | `/api/v1/status`                | Status e métricas do banco de dados           |
| `POST`   | `/api/v1/users`                 | Criar novo usuário (envia e-mail de ativação) |
| `GET`    | `/api/v1/users/:username`       | Buscar usuário por username (público)         |
| `PATCH`  | `/api/v1/users/:username`       | Atualizar dados do usuário (autenticado)      |
| `GET`    | `/api/v1/user`                  | Dados do usuário autenticado (email incluso)  |
| `POST`   | `/api/v1/sessions`              | Login (cria sessão e define cookie)           |
| `DELETE` | `/api/v1/sessions`              | Logout (expira sessão e limpa cookie)         |
| `PATCH`  | `/api/v1/activations/:token_id` | Ativar conta via token de e-mail              |
| `GET`    | `/api/v1/migrations`            | Listar migrações pendentes                    |
| `POST`   | `/api/v1/migrations`            | Executar migrações pendentes                  |

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) `v24` (use [nvm](https://github.com/nvm-sh/nvm): `nvm use`)
- [Docker](https://www.docker.com/) e Docker Compose

---

## 🛠️ Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/warubert/proj.git
cd proj
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

O arquivo `.env.development` já vem preenchido para uso local. Nenhuma alteração é necessária para rodar em desenvolvimento.

### 4. Suba os serviços e inicie o servidor

```bash
npm run dev
```

Esse comando:

1. Sobe o **PostgreSQL** e o **MailCatcher** via Docker
2. Aguarda o banco de dados estar disponível
3. Executa todas as **migrações** pendentes
4. Inicia o **Next.js** em modo desenvolvimento

A aplicação estará disponível em `http://localhost:3000`.

O **MailCatcher** (visualizador de e-mails de desenvolvimento) estará em `http://localhost:1080`.

---

## 🧪 Como testar

```bash
npm test
```

Esse comando sobe os serviços, roda o Next.js em paralelo e executa todos os testes de integração e unitários com Jest.

Para rodar em modo watch durante o desenvolvimento:

```bash
npm run test:watch
```

> Os testes incluem integração real com banco de dados e envio de e-mail, garantindo cobertura end-to-end dos fluxos principais.

---

## 📝 Commits

O projeto usa **Commitizen** para padronizar mensagens de commit no formato [Conventional Commits](https://www.conventionalcommits.org/):

```bash
npm run commit
```

O **Commitlint** + **Husky** validam automaticamente cada commit antes de aceitar.

---

## 🗃️ Migrações

Criar uma nova migração:

```bash
npm run migrations:create -- nome-da-migracao
```

Executar migrações pendentes:

```bash
npm run migrations:up
```

Simular execução (dry-run):

```bash
npm run migrations:up:dry
```

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
