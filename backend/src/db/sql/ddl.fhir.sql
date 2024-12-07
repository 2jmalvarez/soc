DROP TABLE IF EXISTS observation_components CASCADE;

DROP TABLE IF EXISTS observations CASCADE;

DROP TABLE IF EXISTS patients CASCADE;

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE patients (
  id uuid PRIMARY KEY,
  name varchar(100) NOT NULL,
  birth_date date NOT NULL,
  gender varchar(10) NOT NULL,
  address varchar(255)
);

CREATE TABLE users (
  id uuid PRIMARY KEY,
  name varchar(100) NOT NULL,
  email varchar(150) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  jwt_token text
);

CREATE TABLE observations (
  id uuid PRIMARY KEY,
  patient_id uuid NOT NULL REFERENCES patients (id),
  user_id uuid NOT NULL REFERENCES users (id),
  observation_code varchar(50) NOT NULL,
  value varchar(255),
  date timestamp DEFAULT CURRENT_TIMESTAMP,
  status varchar(20) NOT NULL,
  category varchar(50) NOT NULL
);

CREATE TABLE observation_components (
  id uuid PRIMARY KEY,
  observation_id uuid NOT NULL REFERENCES observations (id),
  code varchar(50) NOT NULL,
  display varchar(255) NOT NULL,
  value decimal NOT NULL,
  unit varchar(50) NOT NULL
);