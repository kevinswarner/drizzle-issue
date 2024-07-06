# Drizzle Issue

This repo demonstrates an issue using Drizzle. I cannot understand what is going
on but here are the steps to reproduce the issue.

NOTE: This example requires Docker and Docker Compose support.

## Create a .env file

```
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=test
```

## Install dependencies

```
npm i
```

## Start services

This should start up a Postgres Docker image.

```
npm run start-services
```

## Push Schema

Initialize the DB with the current schema.

```
npm run push
```

## Run Tests

All tests should pass.

```
npm run test
```

## Build

The build should fail with several type errors.

```
npm run build
```

## Change the Table Name for Licenses

Open the file...

```
src/repositories/license/repository.ts
```

And change the name of the table to "widgets".

```
const TABLE_NAME = 'widgets';
```

## Push Schema Changes

```
npm run push
```

## Run Tests

All tests should pass.

```
npm run test
```

## Build

The build should now succeed.

```
npm run build
```
