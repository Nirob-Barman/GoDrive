# GoDrive

A car rental reservation system: search and book cars, pay through Stripe, leave
reviews, and manage everything from an admin dashboard. Built as a full-stack
project — a Clean Architecture .NET 8 Web API and a React + TypeScript client.

## Tech stack

**Backend** (`CleanArchitecture.*`)
- C# 12, .NET 8, ASP.NET Core Web API
- Clean Architecture (Domain / Application / Infrastructure / Api) + CQRS via MediatR
- Entity Framework Core 8, Code First, SQL Server
- ASP.NET Core Identity + JWT Bearer access tokens, httpOnly-cookie refresh tokens
- FluentValidation (as a MediatR pipeline behavior)
- Stripe (payments), Cloudinary (images), Gmail SMTP via MailKit (email), all
  behind small `IPaymentService` / `IImageUploadService` / `IEmailService`
  abstractions
- Transactional Outbox + a background worker for reliable email delivery
- xUnit + FluentAssertions + NSubstitute, integration tests against a real
  SQL Server database with Respawn resets between tests

**Frontend** (`GoDrive.Client`)
- React 19, TypeScript, Vite
- Redux Toolkit + RTK Query (single `createApi`, one feature slice per domain)
- redux-persist (access token only — the refresh token never leaves its httpOnly
  cookie)
- react-router-dom v7

## Project structure

```
GoDrive.sln
├── CleanArchitecture.Domain              # Entities, enums, domain rules — no framework dependencies
├── CleanArchitecture.Application         # CQRS commands/queries, DTOs, validators (feature-based folders)
├── CleanArchitecture.Infrastructure       # EF Core, Identity, Stripe/Cloudinary/MailKit, the Outbox worker
├── CleanArchitecture.Api                  # Controllers, JWT/cookie/CORS config, global exception handling
├── CleanArchitecture.Domain.UnitTests
├── CleanArchitecture.Api.IntegrationTests
└── GoDrive.Client                         # React + TypeScript frontend (Vite)
```

## Features

- **Auth**: register, login, JWT access + httpOnly-cookie refresh tokens (rotated
  on use), change password, forgot/reset password (emailed), log out, log out
  everywhere, account lockout after repeated failed logins
- **Cars**: public search/filter/pagination, availability by date range, admin
  create/update/delete + Cloudinary image management
- **Reservations**: booking with ID/license verification, overlap-checked
  availability, modify/cancel while pending, admin approve/reject/pickup/return
- **Payments**: Stripe Checkout, webhook-confirmed (never trusts the client
  redirect), full amount collected at approval before pickup
- **Reviews**: one per user per car, only after a completed (returned) rental,
  car average rating computed live
- **Admin**: user management (block/activate, role changes), car CRUD, dashboard
  (statistics, revenue by period, car utilization)

## Getting started

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- SQL Server (local instance — developed against `WINDOWS\SQLEXPRESS`)
- Accounts/API keys for Stripe (test mode), Cloudinary, and a Gmail account with
  an app password, if you want those integrations live rather than no-op

### Backend

```bash
cp .env.example .env
# fill in .env: JWT key, SQL Server connection string, Cloudinary, Stripe, email, seed admin

dotnet ef database update --project CleanArchitecture.Infrastructure --startup-project CleanArchitecture.Api

dotnet run --project CleanArchitecture.Api
```

Swagger UI opens at the URL printed on startup (`/swagger`) with a JWT Bearer
"Authorize" button. A dev admin account is seeded from `.env`'s `SEEDADMIN__*`
keys on first run.

### Frontend

```bash
cd GoDrive.Client
npm install
npm run dev
```

Runs at `http://localhost:5173` — the backend's CORS policy (`CORS__ALLOWEDORIGIN`
in `.env`) must match this origin exactly for the browser to talk to the API.

### Tests

```bash
dotnet test                                          # everything
dotnet test CleanArchitecture.Domain.UnitTests        # domain unit tests only
dotnet test CleanArchitecture.Api.IntegrationTests    # integration tests (needs the real SQL Server DB)
```

```bash
cd GoDrive.Client
npm run build   # type-checks (tsc) and builds
```

## Configuration

All secrets live in a git-ignored `.env` at the repo root (never in
`appsettings.json`, which is also git-ignored here) — see `.env.example` for
every key required, with the `__` double-underscore convention binding straight
into `IOptions<T>` sections (`Jwt`, `ConnectionStrings`, `Cloudinary`, `Stripe`,
`EmailSettings`, `SeedAdmin`, `Cors`).
