# UnTelemetry Frontend

[Portuguese version](README.pt-BR.md)

UnTelemetry Frontend is the web interface for UnTelemetry, an observability platform based on OpenTelemetry. It provides dashboards and views for HTTP requests, database queries, logs, errors, projects, and search.

This project is the frontend companion for the UnTelemetry API.

## Hosted Version

If you do not want to run a self-hosted instance, you can use the hosted UnTelemetry platform:

```text
https://untelemetry.unledu.com.br/
```

## Features

- Landing page for the UnTelemetry product.
- Login and user authentication flow.
- Dashboard with observability metrics.
- Requests, queries, logs, and errors views.
- Project listing and project detail pages.
- Project creation flow.
- Global telemetry search.
- Dark theme UI built with reusable components.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Radix UI
- Axios
- Recharts
- Vercel Analytics

## Requirements

- Node.js 20 or higher
- npm
- A running UnTelemetry API instance

## Configuration

Copy the example environment file and adjust the API URL:

```bash
cp .env.sample .env.local
```

Main environment variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333/api/v1
```

Use your production API URL when deploying the frontend.

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

## Running With Docker

Build the image:

```bash
docker build -t untelemetry-front .
```

Run the container:

```bash
docker run --rm -p 3000:3000 --env-file .env.local untelemetry-front
```

## Available Routes

- `/` landing page.
- `/login` authentication page.
- `/dashboard` main dashboard.
- `/requests` HTTP request monitoring.
- `/queries` database query monitoring.
- `/logs` log search and analysis.
- `/errors` error monitoring.
- `/search` global telemetry search.
- `/projects` project list.
- `/projects/new` project creation.
- `/projects/[id]` project details.

## Build

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Quality

Run lint checks:

```bash
npm run lint
```

## Related Project

This frontend expects the UnTelemetry API to be available through `NEXT_PUBLIC_API_URL`.

API repository:

```text
https://github.com/your-org/telemetry-api
```

Replace this URL with the final repository URL after publishing the API.

## Security Notes

- Never commit `.env`, `.env.local`, or production API credentials.
- `NEXT_PUBLIC_*` variables are exposed to the browser by design. Do not put secrets in them.
- Rotate any tokens that may have been used during local testing before publishing the repository.
- Avoid committing screenshots, traces, logs, or payload samples containing customer data, internal URLs, IPs, headers, or tokens.

## License

MIT
