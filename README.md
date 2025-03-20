# Remix Auth Example

A basic authentication setup using Remix, Prisma, and PostgreSQL with Docker.

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## Setup & Installation

1. Clone the repository

```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies

```bash
npm install
```

3. Environment Setup

Copy the example environment file and update it with your values:

```bash
cp .env.example .env
```

Your `.env` should contain the appropriate DATABASE_URL:

```
# For development (Docker)
DATABASE_URL="postgresql://[user]:[password]@localhost:5432/[dbname]"

# For production (Neon)
# DATABASE_URL="[your-neon-connection-string]"
```

Get your development connection details from the docker-compose.yml file, and your production connection string from the Neon dashboard.

# Database Setup

This project supports two database options:

- Local PostgreSQL via Docker (for development)
- Neon PostgreSQL (for production)

## Development Database (Docker)

For local development with Docker, make sure you have Docker running, then:

```bash
make db-start    # Starts PostgreSQL in Docker
make init-db     # Runs initial Prisma migrations
```

Additional Docker commands:

```bash
make db-stop     # Stops the database container
make db-restart  # Restarts the database container
make db-logs     # Shows database logs
make db-shell    # Opens PostgreSQL shell
make db-clean    # Removes container and all data
```

## Production Database (Neon)

This project uses Neon's serverless PostgreSQL for production. To deploy migrations to production:

1. Ensure your `.env` file contains the production Neon connection string.

2. Deploy migrations safely:
   ```bash
   make migrate-prod
   ```

## Managing Database Migrations

### Development Workflow

When making schema changes during development:

1. Update your `prisma/schema.prisma` file
2. Run migrations in your development environment:
   ```bash
   make migrate-dev
   ```

### Production Deployment

⚠️ Never run `migrate-dev` against production! Always use:

```bash
make migrate-prod
```

This command includes safety checks and confirmation prompts to protect your production data.

## Viewing Your Database

```bash
make studio     # Opens Prisma Studio to view/edit data
```

Prisma Studio will connect to whichever database is specified in your `.env` file. This works for both development and production databases, so be careful when viewing/editing production data.

## Switching Between Environments

To switch between development and production:

1. Edit your `.env` file
2. Comment/uncomment the appropriate DATABASE_URL
3. Verify which environment is active before running migrations

## Common Commands

```bash
# View database in browser
make studio

# Reset development database (CAUTION: deletes all data)
make migrate-reset

# Generate Prisma client after schema changes (safe for any environment)
npx prisma generate
```

## Start the Development Server

```bash
make dev
```

The application will be available at http://localhost:3000

## Available Make Commands

```bash
make help          # Show all available commands
make install       # Install dependencies
make dev           # Start everything for development
make db-start      # Start the database container
make db-stop       # Stop the database container
make db-restart    # Restart the database
make db-logs       # View database logs
make migrate-dev   # Run Prisma migrations for development
make migrate-prod  # Deploy migrations to production (safely)
make reset-all     # Reset everything (database, migrations, node_modules)
```

## Features

- User registration
- User login/logout
- Session management
- Protected routes
- PostgreSQL database
- Password hashing with bcrypt

## Tech Stack

- Remix
- Prisma
- PostgreSQL (Docker for dev, Neon for prod)
- Docker
- bcryptjs
- Tailwind CSS
