INSERT INTO users (username, password, email, first_name, last_name, profile_pic)
VALUES ('user1',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 
        'user1@example.com',
        'Test',
        'User1',
        'https://images.unsplash.com/photo-1556197908-96ed0fa30b65?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
       ('user2',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'user2@example.com',
        'Test',
        'User2!',
        'https://images.unsplash.com/photo-1556197908-96ed0fa30b65?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

INSERT INTO waves (username, wave_string, created_at)
VALUES ('user1', 'Great song!', '2024-02-12 08:00:00'),
       ('user2', 'Nice track!', '2024-02-12 08:15:00');

INSERT INTO comments (username, wave_id, comment_string, created_at)
VALUES ('user1', 2, 'I agree!', '2024-02-12 08:05:00'),
       ('user2', 1, 'Love it!', '2024-02-12 08:20:00');

INSERT INTO songs (song_id, title, artist, duration, link)
VALUES 
        (116348632, 'Hey Jude', 'The Beatles', 429, 'https://www.deezer.com/track/116348632'),
       (100325278, 'Hit the Road Jack', 'Ray Charles', 117, 'https://www.deezer.com/track/100325278'),
       (3413187, 'La bohème', 'Charles Aznavour', 243, 'https://www.deezer.com/track/3413187');

INSERT INTO user_song_likes (username, song_id)
VALUES ('user1', 116348632),
       ('user1', 3413187),
       ('user2', 100325278),
       ('user2', 3413187);
