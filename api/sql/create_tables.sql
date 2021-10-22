-- DROP TABLE IF EXISTS users;
CREATE TABLE  users (
  id SERIAL PRIMARY KEY,
	username VARCHAR(128) NOT NULL UNIQUE,
  firstname VARCHAR(128) NOT NULL,
	lastname VARCHAR(128) NOT NULL,
	email VARCHAR(128) NOT NULL UNIQUE,
	password VARCHAR(64) NOT NULL,
	gender VARCHAR(16),
	birthdate DATE,
	sexual_orientation VARCHAR (16),
	biography VARCHAR(255),
	localisation POINT,
	activated BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	default_picture VARCHAR(255),
	is_connected INT DEFAULT 0,
	popularity SMALLINT DEFAULT 0,
	reported BOOLEAN DEFAULT FALSE
);

-- DROP TABLE IF EXISTS pictures;
CREATE TABLE  pictures (
  id SERIAL PRIMARY KEY,
	user_id SERIAL NOT NULL,
	file_path VARCHAR(255),
	FOREIGN KEY(user_id) REFERENCES users(id)
);

-- DROP TABLE IF EXISTS tags;
CREATE TABLE tags (
	id INT,
	user_id SERIAL NOT NULL,
	name VARCHAR(64)
);

-- DROP TABLE IF EXISTS likes;
CREATE TABLE likes (
	user_id INT,
	liked_id INT
);

-- DROP TABLE IF EXISTS dislikes;
CREATE TABLE dislikes (
	user_id INT,
	disliked_id INT
);

-- DROP TABLE IF EXISTS reported_users;
CREATE TABLE reported_users (
	reporter_id INT,
	reported_id INT
);

-- DROP TABLE IF EXISTS blocked_users;
CREATE TABLE blocked_users (
	blocker_id INT,
	blocked_id INT
);
