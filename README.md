# Pure Node.js API Project 🚀

A modern, lightweight API built with pure Node.js - no Express or Fastify! This project demonstrates how to build a performant API from scratch using Node.js core modules while integrating with powerful tools like PostgreSQL and Redis.

## Tech Stack 💻

- **Backend**: Pure Node.js HTTP server (no Express/Fastify)
- **Database**: PostgreSQL
- **Caching**: Redis
- **Security**: bcrypt (password hashing), JWT (authentication)
- **Containerization**: Docker & Docker Compose
- **Language**: TypeScript

## Features ✨

- **Authentication System**
  - User signup
  - User login
  - JWT-based authentication
  - Password hashing with bcrypt
- **Performance Optimization**
  - Redis caching layer
  - Efficient database queries
- **Developer Experience**
  - Docker-based development environment
  - Easy setup and configuration

## Getting Started 🏁

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development without Docker)

### Running with Docker

1. Clone the repository:

```bash
git clone https://github.com/yourusername/project-name.git
cd project-name
```

2. Start the containers:

```bash
docker-compose up -d
```

3. The API will be available at `http://localhost:3000`

### Running Locally

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/project-name.git
cd project-name
npm install
```

2. Set up your environment variables:

```bash
# Edit .env with your configuration
```

3. Start the development server:

```bash
npm run dev
```

## API Endpoints 🔌

### Users

| Method | Endpoint        | Description           | Auth Required |
| ------ | --------------- | --------------------- | ------------- |
| POST   | `/users/signup` | Register a new user   | No            |
| POST   | `/users/login`  | Authenticate a user   | No            |
| GET    | `/users/me`     | Get current user info | Yes           |

## Project Structure 📂

```
.
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── db/              # Database connection and models
│   ├── middleware/      # Custom middleware
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── index.ts         # Entry point
├── docker-compose.yml   # Docker Compose configuration
├── Dockerfile           # Docker configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```

## Architecture 🏗️

This project implements a clean architecture pattern:

- **HTTP Server Layer**: Pure Node.js HTTP module for handling requests
- **Controller Layer**: Handles HTTP requests and responses
- **Service Layer**: Contains business logic
- **Data Access Layer**: Interfaces with PostgreSQL database

## Development 🛠️

### Key Design Decisions

1. **Pure Node.js**: Avoiding Express/Fastify reduces dependencies and provides a better understanding of HTTP internals
2. **TypeScript**: Adds type safety and improves code quality
3. **Containerization**: Docker ensures consistent development and production environments
4. **Caching Strategy**: Redis is used for caching frequently accessed data

---
