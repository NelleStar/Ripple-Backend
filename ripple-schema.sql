-- Table: users - stores user info
CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL CHECK (position('@' IN email) > 1),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    profile_pic TEXT
);

-- Table: waves - stores waves made by users
CREATE TABLE waves (
    wave_id SERIAL PRIMARY KEY,
    username VARCHAR(25) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    wave_string TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: comments - stores comments on waves
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    username VARCHAR(25) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    wave_id INT NOT NULL REFERENCES waves(wave_id) ON DELETE CASCADE,
    comment_string TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: songs - Deezer songs being fetched
CREATE TABLE songs (
    song_id INT PRIMARY KEY, 
    title VARCHAR(100) NOT NULL,
    artist VARCHAR(100) NOT NULL,
    duration INT NOT NULL,
    link VARCHAR(255) NOT NULL
);

-- Table: user_song_likes - many to many relationship between users and songs to indicate which songs users have liked
CREATE TABLE user_song_likes (
    username VARCHAR(25) NOT NULL REFERENCES users(username) ON DELETE CASCADE, 
    song_id INT NOT NULL REFERENCES songs(song_id) ON DELETE CASCADE, 
    PRIMARY KEY (username, song_id) 
);

