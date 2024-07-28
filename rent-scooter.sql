CREATE DATABASE rent_scooter;

DROP TABLE "user" CASCADE;
DROP TABLE "scooter" CASCADE;
DROP TABLE "rent";
CREATE TABLE scooter (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  power NUMERIC(10,2),
  status SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  status SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE "rent" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  scooter_id INTEGER,
  reservation_expired_at INTEGER NOT NULL,
  start_time INTEGER,
  end_time INTEGER,
  status SMALLINT NOT NULL DEFAULT 2,
  FOREIGN KEY (user_id) REFERENCES "user" (id),
  FOREIGN KEY (scooter_id) REFERENCES scooter (id)
);

-- Data
TRUNCATE TABLE "user" CASCADE;
TRUNCATE TABLE "scooter" CASCADE;
TRUNCATE TABLE "rent";
INSERT INTO "user" (name, username, password) VALUES
  ('Josh', 'joshchiu', '1234'),
  ('Yuri', 'yuri', '1234');

INSERT INTO scooter (name, power, status) VALUES
('Scooter A', 100.0, 0),
('Scooter B', 87.65, 0),
('Scooter C', 45.67, 0),
('Scooter D', 23.45, 1),
('Scooter E', 7.8, 2),
('Scooter F', 7.8, 3);

