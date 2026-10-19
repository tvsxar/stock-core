# Stock Core — Inventory Management System

A full-stack inventory management application built with React, TypeScript, Node.js, Express, PostgreSQL, and Prisma.

Stock Core helps manage products, track inventory movements, and monitor available stock through a simple and centralized interface.

The project focuses on backend architecture, relational database design, inventory business logic, and production-oriented engineering practices, including automated testing, containerization, CI, and deployment.

## Live Demo

**Live Application:** [Stock Core](https://stock-core-client.onrender.com)

> The backend is hosted on a free Render instance and may take a short time to wake up after a period of inactivity.

## Features

- Create, view, and update products
- Manage products using unique SKUs
- Record incoming inventory (IN)
- Record outgoing inventory (OUT)
- Track current stock quantities
- View inventory movement history
- Prevent invalid stock operations
- Preserve inventory history
- Responsive user interface

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- React Router
- TanStack Query

**Backend**
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM

**Testing**
- Vitest
- Supertest
- React Testing Library
- Playwright

**DevOps & Deployment**
- Docker
- Docker Compose
- GitHub Actions
- CI
- Render
- Neon PostgreSQL

## Architecture

Stock Core uses a separated frontend/backend architecture with a relational PostgreSQL database.

```text
┌──────────────────────────┐
│          Browser         │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│    React + TypeScript    │
│    Render Static Site    │
└────────────┬─────────────┘
             │
             │ HTTPS / REST API
             ▼
┌──────────────────────────┐
│   Node.js + Express API  │
│   Docker Web Service     │
├──────────────────────────┤
│     Business Logic       │
│       Prisma ORM         │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│    Neon PostgreSQL       │
└──────────────────────────┘
```

The frontend communicates with the backend through a REST API.

The backend handles product management, inventory movements, stock calculations, and validation of inventory operations.

Prisma is used for database access, while PostgreSQL provides persistent storage and relational data integrity.

## Database Design

Stock Core uses a relational database designed around products and inventory movements.

The database contains two main tables:

**Products**
- Unique product identifier
- SKU
- Product name

**Stock Movements**
- Unique movement identifier
- Product reference
- Movement type (IN or OUT)
- Quantity
- Timestamp

### Relationships

```text
┌──────────────────────┐
│       products       │
├──────────────────────┤
│ id (PK)              │
│ sku (UNIQUE)         │
│ name                 │
└──────────┬───────────┘
           │
           │ 1:N
           ▼
┌──────────────────────┐
│   stock_movements    │
├──────────────────────┤
│ id (PK)              │
│ product_id (FK)      │
│ type (IN / OUT)      │
│ quantity             │
│ occurred_at          │
└──────────────────────┘
```

Each product can have multiple inventory movements.

### Stock Calculation

Stock quantities are calculated from inventory movements rather than maintained as a separate product field.

```text
Current Stock = Total IN - Total OUT
```

For example:

```text
Product: Wireless Mouse

IN    +50
OUT   -12
IN    +20
OUT    -8
----------
Stock  50
```

This approach keeps inventory calculations based on the recorded movement history.

Database constraints and application-level validation help maintain data integrity and prevent invalid inventory operations.

## Testing

Stock Core uses multiple levels of automated testing to verify backend logic, frontend behavior, and complete application workflows.

### Backend

Backend tests use **Vitest** and **Supertest**.

Tests cover API behavior and inventory-related business logic, including product operations and stock movements.

A separate PostgreSQL test database is used to keep automated test data isolated from production data.

### Frontend

Frontend tests use **Vitest** and **React Testing Library**.

They verify component behavior, user interactions, and integration between the interface and application logic.

### End-to-End

**Playwright** tests run against the complete application with both frontend and backend services running.

The E2E suite covers critical inventory workflows:

- Creating a product
- Recording an incoming stock movement
- Recording an outgoing stock movement

The tests use a dedicated E2E environment and a separate Neon PostgreSQL test database.

## Docker

Both frontend and backend are containerized independently.

The complete application can be built and started locally with Docker Compose:

```bash
docker compose up --build
```

Docker Compose coordinates the application services and provides a reproducible local environment.

The backend Docker image is also used for production deployment on Render.

The production frontend is deployed separately as a Render Static Site.

## CI

Stock Core uses **GitHub Actions** for continuous integration.

Pushes and pull requests targeting the main branch trigger automated validation.

```text
                  Push / Pull Request
                           │
                           ▼
                  ┌─────────────────┐
                  │ GitHub Actions  │
                  └────────┬────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
     ┌─────────────────┐       ┌─────────────────┐
     │   Backend CI    │       │   Frontend CI   │
     ├─────────────────┤       ├─────────────────┤
     │ Prisma Generate │       │ Component Tests │
     │ Backend Tests   │       │ Production Build│
     │ TypeScript Build│       │ Docker Build    │
     │ Docker Build    │       └─────────────────┘
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │  Playwright E2E │
     ├─────────────────┤
     │ Backend Server  │
     │ Frontend Server │
     │ PostgreSQL Test │
     │ Browser Tests   │
     └─────────────────┘
```

The pipeline includes:

- Backend dependency installation and Prisma Client generation
- Backend automated tests
- Backend TypeScript build validation
- Frontend component tests
- Frontend production build validation
- Playwright end-to-end tests
- Docker image build validation

The E2E job runs after the backend CI job completes successfully.

Backend and frontend CI jobs run independently.

## Deployment

Stock Core is deployed on Render with Neon PostgreSQL as the database provider.

**Frontend**

The React application is built with Vite and deployed as a **Render Static Site**.

**Backend**

The Express API runs as a **Docker Web Service** on Render.

**Database**

PostgreSQL is hosted on **Neon**.

Production and automated testing use separate database connections to isolate application data from test operations.

## Getting Started

### Prerequisites

For the Docker setup:

- Docker
- Docker Compose
- PostgreSQL database

For manual development:

- Node.js 22+
- npm
- PostgreSQL database

### Run with Docker

Clone the repository:

```bash
git clone https://github.com/tvsxar/stock-core
cd stock-core
```

Configure the required environment variables using the repository's `.env.example` file.

Then start the application:

```bash
docker compose up --build
```

### Manual Development

Install backend dependencies:

```bash
cd backend
npm ci
npx prisma generate
npm run dev
```

Install frontend dependencies in another terminal:

```bash
cd frontend
npm ci
npm run dev
```

Configure the frontend API URL to point to the local backend.

For production, the frontend uses:

```env
VITE_API_URL=https://stock-core-api.onrender.com/api
```

## Project Structure

```text
stock-core/
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── backend/
│   ├── prisma/
│   ├── tests/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── Dockerfile
│   ├── app.ts
│   ├── server.ts
│   └── prisma7.config.ts
│
├── frontend/
│   ├── e2e/
│   ├── src/
│   ├── Dockerfile
│   ├── playwright.config.ts
│   └── vite.config.ts
│
├── .env.example
└── compose.yaml
```

## API

The backend exposes REST endpoints for product management and inventory operations.

Main API resources:

```text
/api/products     Product management
/api/movements    Inventory movements
/api/health       Service health check
```

The API supports product operations, stock movement recording, and retrieval of inventory information.

Inventory quantities are derived from movement history to keep stock calculations consistent with recorded operations.

## Author

**Taras Poiatsyka**

[GitHub](https://github.com/tvsxar) | [Portfolio](https://taras-portfolio-theta.vercel.app)
