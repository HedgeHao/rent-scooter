# Rent Scooter

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
SELECT r.*, u.name, u.status  AS "userStatus", s.name, s.status  AS "scooterStatus"
FROM "rent" r
JOIN "user" u ON r.user_id = u.id
JOIN "scooter" s ON r.scooter_id = s.id
ORDER BY r.id;
```

## Redis

```bash
docker run --name redis -d -p 6379:6379 redis:7.2.5-alpine
```

- enable expire listener

```bash
CONFIG SET notify-keyspace-events Ex
```

## Kafka

- Error `There is no leader for this topic-partition as we are in the middle of a leadership election`
  The broker create topic is lost

- After first connect to Kafka broker. Broker will return a `listener` metadata for further connection. Host needs to be able to connect to that listener address.

```yaml
environment:
  - ALLOW_PLAINTEXT_LISTENER=yes
  - KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181
  - KAFKA_LISTENERS=INTERNAL://:9092,EXTERNAL://:9093
  - KAFKA_ADVERTISED_LISTENERS=INTERNAL://kafka:9092,EXTERNAL://kafka:9093
  - KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
  - KAFKA_INTER_BROKER_LISTENER_NAME=INTERNAL
```

- Add `127.0.0.1 kafka` to `/etc/hosts` for connection both within docker containers and host machine

## App

### Run

```bash
docker run -it --rm --name rent-scooter -p 3000:3000 -e "MODE=docker" --network rent-scooter_rent-scooter-net rent-scooter
```
