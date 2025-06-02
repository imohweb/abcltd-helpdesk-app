-- Use the abchelpdeskdatabase
USE "DBName";
-- Ensure the database is created  
CREATE DATABASE "DBName";
-- Use the newly created database
-- Drop existing tables if they exist
DROP TABLE IF EXISTS ticket_status_history;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL
);

-- Create tickets table
CREATE TABLE tickets (
    id INT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    status NVARCHAR(50) NOT NULL,
    priority NVARCHAR(50) NOT NULL,
    customer_id INT NOT NULL,
    agent_id INT,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (agent_id) REFERENCES users(id)
);

-- Create comments table
CREATE TABLE comments (
    id INT PRIMARY KEY IDENTITY(1,1),
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create ticket_status_history table
CREATE TABLE ticket_status_history (
    id INT PRIMARY KEY IDENTITY(1,1),
    ticket_id INT NOT NULL,
    status NVARCHAR(50) NOT NULL,
    changed_by_user_id INT NOT NULL,
    changed_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id),
    FOREIGN KEY (changed_by_user_id) REFERENCES users(id)
);
