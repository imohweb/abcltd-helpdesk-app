const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const sql = require('mssql');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database connection
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Use encryption for data transfer
    trustServerCertificate: true, // Change to false in production
  },
};

sql.connect(dbConfig).then(pool => {
  console.log('Connected to Microsoft SQL Server');
  return pool;
}).catch(err => {
  console.error('Database connection failed:', err);
});

// Basic routes
app.get('/', (req, res) => {
  res.send('Welcome to the backend API!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
