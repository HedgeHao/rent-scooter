CREATE TABLE scooter (
  id SERIAL PRIMARY KEY,
  status SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE "user" (
  id INTEGER PRIMARY KEY,
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
  status SMALLINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES "user" (id),
  FOREIGN KEY (scooter_id) REFERENCES scooter (id)
);