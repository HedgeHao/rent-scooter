# WeMo Tech Stack

## Postgres

### Docker

```bash
docker run --name postgres-dev -d -p 5432:5432 -e POSTGRES_PASSWORD=toor postgres:13.15-alpine3.20
```

### psql

- `\l`: List database

- `\c db_name`: switch database

- `\dt`: List tables for current schema

- Create database

```postgres
create database rent_scooter;
```

- Create table

```postgres
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    age INTEGER CHECK (age BETWEEN 0 AND 999),
    height DECIMAL,
    ctime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- Insert

```postgres
INSERT INTO "user" (name, age, height, username, password) VALUES ('Josh', 30, 180.1, 'joshchiu', '1234');
INSERT INTO "user" (name, age, height, username, password) VALUES ('Yuri', 22, 163.4, 'yuri', '1234');
```

- Update

```postgres
UPDATE "user"
SET name = 'Josh Chiu', age = 31
WHERE id = 1;
```

- Select

```postgres
select * from "user"; -- Table name need to be in quotes.
```

## Redis

```bash
docker run --name redis -d -p 6379:6379 redis:7.2.5-alpine
```
