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
	reported BOOLEAN DEFAULT FALSE,
	distance_preference INT DEFAULT 100,
	age_preference_min INT DEFAULT 18,
	age_preference_max INT DEFAULT 45,
	rate INT DEFAULT 0
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
	id SERIAL PRIMARY KEY,
	user_id INT,
	liked_id INT,
	seen BOOLEAN DEFAULT FALSE
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

-- DROP TABLE IF EXISTS visits;
CREATE TABLE visits (
	id SERIAL PRIMARY KEY,
	visitee_id INT,
	visitor_id INT,
	seen BOOLEAN DEFAULT FALSE,
	visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
	id SERIAL PRIMARY KEY,
	sender_id INT,
	receiver_id INT,
	message VARCHAR(255),
	seen BOOLEAN DEFAULT FALSE,
	sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DROP TABLE IF EXISTS chats;
CREATE TABLE chats (
	id SERIAL PRIMARY KEY,
	sender_id INT,
	receiver_id INT,
	text VARCHAR(255),
	seen BOOLEAN DEFAULT FALSE,
	sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DROP TABLE IF EXISTS matches;
CREATE TABLE matches (
	id SERIAL PRIMARY KEY,
	user_id INT,
	seen BOOLEAN DEFAULT FALSE
);