create database rent_scooter;

CREATE TABLE scooter (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  power NUMERIC(10,2),
  status SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  height NUMERIC(10,2),
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE "order" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  scooter_id INTEGER,
  reservation_time TIMESTAMP NOT NULL,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  status SMALLINT NOT NULL DEFAULT 2,
  FOREIGN KEY (user_id) REFERENCES "user" (id),
  FOREIGN KEY (scooter_id) REFERENCES scooter (id)
);

-- Data
truncate table "user" CASCADE;
truncate table "scooter" CASCADE;
truncate table "order";
INSERT INTO "user" (name, age, height, username, password) VALUES
  ('Josh', 30, 180.1, 'joshchiu', '1234'),
  ('Yuri', 22, 163.4, 'yuri', '1234');

INSERT INTO scooter (name, power, status) VALUES
('Scooter A', 100.0, 0),
('Scooter B', 87.65, 0),
('Scooter C', 45.67, 0),
('Scooter D', 23.45, 0),
('Scooter E', 7.8, 0);

