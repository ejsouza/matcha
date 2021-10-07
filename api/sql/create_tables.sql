CREATE TABLE  users (
  id SERIAL PRIMARY KEY,
	username VARCHAR(128) NOT NULL UNIQUE,
  first_name VARCHAR(128) NOT NULL,
	last_name VARCHAR(128) NOT NULL,
	email VARCHAR(128) NOT NULL UNIQUE,
	password VARCHAR(64) NOT NULL,
	gender VARCHAR(16),
	sexual_orientation VARCHAR (16),
	biography VARCHAR(255),
	tags VARCHAR(250)
);

CREATE TABLE  pictures (
  id SERIAL PRIMARY KEY,
	user_id SERIAL NOT NULL,
	file_name VARCHAR(255),
	file_data BYTEA NOT NULL,
	FOREIGN KEY(user_id) REFERENCES users(id)
);