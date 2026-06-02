# UnTelemetry Frontend

[English version](README.md)

UnTelemetry Frontend e a interface web da UnTelemetry, uma plataforma de observabilidade baseada em OpenTelemetry. Ela fornece dashboards e telas para requisicoes HTTP, queries de banco, logs, erros, projetos e busca.

Este projeto e o frontend complementar da UnTelemetry API. Para rodar em modo self-hosted, o backend precisa estar rodando e acessivel atraves de `NEXT_PUBLIC_API_URL`.

Repositorio do backend:

```text
https://github.com/Militao36/telemetry-api
```

## Versao Hospedada

Se voce nao quiser rodar uma instancia self-hosted, pode usar a plataforma hospedada da UnTelemetry:

```text
https://untelemetry.unledu.com.br/
```

## Recursos

- Landing page do produto UnTelemetry.
- Fluxo de login e autenticacao de usuario.
- Dashboard com metricas de observabilidade.
- Telas de requisicoes, queries, logs e erros.
- Listagem e detalhe de projetos.
- Fluxo de criacao de projetos.
- Busca global em dados de telemetria.
- Interface em tema escuro com componentes reutilizaveis.

## Tecnologias

- Next.js
- React
- TypeScript
- Tailwind CSS
- Radix UI
- Axios
- Recharts
- Vercel Analytics

## Requisitos

- Node.js 20 ou superior
- npm
- Uma instancia da UnTelemetry API rodando: `https://github.com/Militao36/telemetry-api`

## Configuracao

Copie o arquivo de exemplo e ajuste a URL da API:

```bash
cp .env.sample .env.local
```

Variavel principal:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333/api/v1
```

Use a URL da sua API de producao ao fazer deploy do frontend.

## Rodando Localmente

Instale as dependencias:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend ficara disponivel em:

```text
http://localhost:3000
```

## Rodando com Docker

Gere a imagem:

```bash
docker build -t untelemetry-front .
```

Rode o container:

```bash
docker run --rm -p 3000:3000 --env-file .env.local untelemetry-front
```

## Rotas Disponiveis

- `/` landing page.
- `/login` pagina de autenticacao.
- `/dashboard` dashboard principal.
- `/requests` monitoramento de requisicoes HTTP.
- `/queries` monitoramento de queries de banco.
- `/logs` busca e analise de logs.
- `/errors` monitoramento de erros.
- `/search` busca global de telemetria.
- `/projects` lista de projetos.
- `/projects/new` criacao de projeto.
- `/projects/[id]` detalhes do projeto.

## Build

Gere a versao de producao:

```bash
npm run build
```

Inicie o servidor de producao:

```bash
npm start
```

## Qualidade

Execute o lint:

```bash
npm run lint
```

## Projeto Relacionado

Este frontend espera que a UnTelemetry API esteja disponivel atraves de `NEXT_PUBLIC_API_URL`.

Repositorio da API:

```text
https://github.com/Militao36/telemetry-api
```

## Observacoes de Seguranca

- Nunca versione `.env`, `.env.local` ou credenciais de producao.
- Variaveis `NEXT_PUBLIC_*` sao expostas no navegador por definicao. Nao coloque segredos nelas.
- Rotacione qualquer token que possa ter sido usado durante testes locais antes de publicar o repositorio.
- Evite commitar screenshots, traces, logs ou payloads contendo dados de clientes, URLs internas, IPs, headers ou tokens.

## Licenca

MIT
