-- Create ENUM types
CREATE TYPE gender_type AS ENUM ('male', 'female');
CREATE TYPE role_type AS ENUM ('user', 'admin');

-- Create Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role role_type DEFAULT 'user',
    gender gender_type,
    age INT,
    phone VARCHAR(20),
    photo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);