-- create users table
CREATE TABLE IF NOT EXISTS USERS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- create books table
CREATE TABLE IF NOT EXISTS BOOKS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    avg_score NUMERIC(4, 2) NOT NULL, -- [-99.99, 99.99]
    times_scored BIGINT NOT NULL,
    borrowed_by INT
);

-- create history table
CREATE TABLE IF NOT EXISTS HISTORY (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    score INT,
    active BOOLEAN NOT NULL,
    borrow_time BIGINT NOT NULL,
    return_time BIGINT
);
