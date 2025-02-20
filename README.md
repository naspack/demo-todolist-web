# Todo List Web App

A modern todo list web application built with Next.js, React Query, and TypeScript.

## Features

-   User authentication (login/register)
-   Create, read, update, and delete todos
-   Mark todos as complete/incomplete
-   Responsive design with Tailwind CSS
-   Static site export capability

## Prerequisites

-   Node.js 18 or later
-   pnpm

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd demo-todolist-web
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

To create a static production build:

```bash
pnpm build
```

The static files will be generated in the `out` directory.

## API Configuration

The app expects a backend API running at `http://localhost:8080`. You can modify the API URL in `app/lib/api.ts`.

## Technologies Used

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   React Query
-   Zustand
-   React Hook Form
-   Zod
-   Axios

## Project Structure

-   `app/` - Next.js app directory
    -   `components/` - React components
    -   `lib/` - Utilities, API client, and types
    -   `page.tsx` - Main application page
    -   `layout.tsx` - Root layout component

## License

MIT
