const express = require('express');
const { Pool } = require('pg'); //importing pool instead of client
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// PostgreSQL Pool setup
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    
});


// const client = new Client({
//     host: process.env.PG_HOST,
//     port: process.env.PG_PORT,
//     user: process.env.PG_USER,
//     password: process.env.PG_PASSWORD,
//     database: process.env.PG_DATABASE,
//   });

// Test DB connection
pool.connect()
  .then(client => {
    console.log("Connected to the database");
    client.release();
  })
  .catch(err => console.error('Error connecting to the database', err));

// CRUD Endpoints
// GET all items
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items_table');
    res.json(result.rows);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// POST new item
app.post('/api/items', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query('INSERT INTO items_table (name, description) VALUES ($1, $2) RETURNING *', [name, description]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// PUT (Update) item
app.put('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const result = await pool.query('UPDATE items_table SET name = $1, description = $2 WHERE id = $3 RETURNING *', [name, description, id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Item not found');
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// DELETE item
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM items_table WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Item not found');
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
