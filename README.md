# WeMo Tech Stack

## Postgres

### Docker
```bash
docker run --name postgres-dev -d -p 5432:5432 -e POSTGRES_PASSWORD=toor postgres:13.15-alpine3.20
```

### psql
* `\l`: List database
* `\c db_name`: switch database
* `\dt`: List tables for current schema
* `create database wemo_tech_stack;`
* Create table
```postgres
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    age INTEGER CHECK (age BETWEEN 0 AND 999),
    height DECIMAL,
    ctime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
* Insert
```postgres
INSERT INTO "user" (name, age, height) VALUES ('Josh', 30, 180.1);
INSERT INTO "user" (name, age, height) VALUES ('Yuri', 22, 163.4);
```

* Update
```postgres
UPDATE "user"
SET name = 'Josh Chiu', age = 31
WHERE id = 1;
```

* Select
```postgres
select * from "user";
```

## Redis
```bash
docker run --name redis -d -p 6379:6379 redis:7.2.5-alpine
```