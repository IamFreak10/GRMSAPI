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


-- ১. রুমের সাধারণ তথ্য
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    room_no VARCHAR(10) NOT NULL,
    branch branch_type NOT NULL, -- Dhaka, Barishal
    type room_type DEFAULT 'shared', -- Shared, Private
    total_beds INT NOT NULL
);

-- ২. প্রতিটি রুমের আন্ডারে বেডগুলো (যেমন: R1 এর জন্য B1, B2)
CREATE TABLE beds (
    id SERIAL PRIMARY KEY,
    room_id INT REFERENCES rooms(id) ON DELETE CASCADE,
    bed_label VARCHAR(5) NOT NULL,
    UNIQUE(room_id, bed_label)
);

-- ৩. তারিখ অনুযায়ী কোন বেড কার নামে বুকড
CREATE TABLE room_daily_status (
    id SERIAL PRIMARY KEY,
    bed_id INT REFERENCES beds(id),
    room_id INT REFERENCES rooms(id),
    booking_date DATE NOT NULL,
    assigned_gender gender_type, -- জেন্ডার লক লজিকের জন্য
    user_id INT REFERENCES users(id),
    is_paid BOOLEAN DEFAULT FALSE,
    UNIQUE(bed_id, booking_date)
);