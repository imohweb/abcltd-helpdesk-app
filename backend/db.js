const sql = require('mssql');
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Database configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, // e.g., 'localhost'
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Use encryption
        trustServerCertificate: true // Change to false for production
    }
};

// Create a connection pool
let pool;

async function getDbConnection() {
    if (!pool) {
        try {
            pool = await sql.connect(dbConfig);
            console.log('Connected to the database');
        } catch (err) {
            console.error('Database connection failed:', err);
            throw err;
        }
    }
    return pool;
}

const app = express();
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET;

// User registration endpoint
app.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const pool = await getDbConnection();
        await pool.request()
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email)
            .input('password_hash', sql.NVarChar, hashedPassword)
            .input('role', sql.NVarChar, role)
            .query('INSERT INTO users (name, email, password_hash, role) VALUES (@name, @email, @password_hash, @role)');
        res.status(201).send('User registered successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    }
});

// User login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const pool = await getDbConnection();
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM users WHERE email = @email');

        const user = result.recordset[0];
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).send('Invalid email or password');
        }

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).send('Access denied');

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = user;
        next();
    });
}

// Protect ticket routes
app.use('/tickets', authenticateToken);

// Ticket management endpoints

// Create a new ticket
app.post('/tickets', async (req, res) => {
    const { title, description, priority } = req.body;
    const customerId = req.user.id;
    try {
        const pool = await getDbConnection();
        await pool.request()
            .input('title', sql.NVarChar, title)
            .input('description', sql.NVarChar, description)
            .input('priority', sql.NVarChar, priority)
            .input('customer_id', sql.Int, customerId)
            .query('INSERT INTO tickets (title, description, status, priority, customer_id) VALUES (@title, @description, @status, @priority, @customer_id)');
        res.status(201).send('Ticket created successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating ticket');
    }
});

// Update a ticket
app.put('/tickets/:id', async (req, res) => {
    const { id } = req.params;
    const { status, priority, agent_id } = req.body;
    try {
        const pool = await getDbConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('status', sql.NVarChar, status)
            .input('priority', sql.NVarChar, priority)
            .input('agent_id', sql.Int, agent_id)
            .query('UPDATE tickets SET status = @status, priority = @priority, agent_id = @agent_id WHERE id = @id');
        res.send('Ticket updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating ticket');
    }
});

// Get a list of all tickets with filters
app.get('/tickets', async (req, res) => {
    const { status, priority } = req.query;
    try {
        const pool = await getDbConnection();
        let query = 'SELECT * FROM tickets';
        const conditions = [];
        if (status) conditions.push(`status = '${status}'`);
        if (priority) conditions.push(`priority = '${priority}'`);
        if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching tickets');
    }
});

// Get ticket details with comments
app.get('/tickets/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getDbConnection();
        const ticketResult = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM tickets WHERE id = @id');
        const commentsResult = await pool.request()
            .input('ticket_id', sql.Int, id)
            .query('SELECT * FROM comments WHERE ticket_id = @ticket_id');
        if (ticketResult.recordset.length === 0) {
            return res.status(404).send('Ticket not found');
        }
        res.json({
            ticket: ticketResult.recordset[0],
            comments: commentsResult.recordset
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching ticket details');
    }
});

// Add a comment to a ticket
app.post('/tickets/:id/comments', async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user.id;
    try {
        const pool = await getDbConnection();
        await pool.request()
            .input('ticket_id', sql.Int, id)
            .input('user_id', sql.Int, userId)
            .input('message', sql.NVarChar, message)
            .query('INSERT INTO comments (ticket_id, user_id, message) VALUES (@ticket_id, @user_id, @message)');
        res.status(201).send('Comment added successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding comment');
    }
});

// Role-based access control middleware
function authorizeRoles(roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).send('Access denied');
        }
        next();
    };
}

// Apply role-based access control to ticket routes
app.post('/tickets', authorizeRoles(['customer']));
app.put('/tickets/:id', authorizeRoles(['agent']));

// Report generation endpoints

// Average response and resolution time
app.get('/reports/average-times', async (req, res) => {
    try {
        const pool = await getDbConnection();
        const result = await pool.request().query(`
            SELECT 
                AVG(DATEDIFF(MINUTE, created_at, updated_at)) AS average_resolution_time
            FROM tickets
            WHERE status = 'closed';
        `);
        res.json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating report');
    }
});

// Number of tickets by status and priority
app.get('/reports/tickets-summary', async (req, res) => {
    try {
        const pool = await getDbConnection();
        const result = await pool.request().query(`
            SELECT 
                status, 
                priority, 
                COUNT(*) AS count
            FROM tickets
            GROUP BY status, priority;
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating report');
    }
});

// Top performing agents
app.get('/reports/top-agents', async (req, res) => {
    try {
        const pool = await getDbConnection();
        const result = await pool.request().query(`
            SELECT 
                u.name AS agent_name, 
                COUNT(t.id) AS tickets_resolved
            FROM tickets t
            JOIN users u ON t.agent_id = u.id
            WHERE t.status = 'closed'
            GROUP BY u.name
            ORDER BY tickets_resolved DESC;
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating report');
    }
});

module.exports = {
    getDbConnection,
    sql,
    app
};
