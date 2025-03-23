# libman-backend
The Library Management System Backend Service

## Installation

Install the dependencies, you need to have a Node.js version 18 or higher.

```bash
npm install
```

Run the backend server.

```bash
npm run start
```

By default, the server listens on `0.0.0.0:3000`, this can be changed with the following
environment variables:

```bash
HOST=0.0.0.0
PORT=3000
```

## Database

The application uses PostgreSQL, docker compose for spinning
a database server is included under the directory `postgresql`.
Create the `.env` file under `postgresql` using the example `./postgres/.env.example`.

Run docker-compose up

```bash
cd postgresql
docker-compose up -d
```

** DDL for initializing the database can be found as `./postgresql/volume/init.sql`. **

## Running the Application

Before running the application, create the `.env` file under root
using the example `.env.example`.
If you have used the provided docker compose for the database
with the default values within `./postgres/.env.example`,
you may also use the default values with `.env.example` since they match.

Run the application

```bash
npm run start
```