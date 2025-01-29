#!/usr/bin/env node
const express = require('express');
const bp = require('body-parser');
const pg = require('pg');
const app = express();
const pool = new pg.Pool({
  user:'****',
  host:'localhost',
  database: 'api',
  password: '****',
  port: 5432,
});


app.use(bp.json());
app.use(
  bp.urlencoded({
    extended: true,
  })
);

app.get('/user', (req, res) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (err, results) => {
    if (err) {
      throw err;
    }
    res.status(200).json(results.rows);
  });
});

app.get('/user/:id', (req, res) => {
  const id = parseInt(req.params.id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (err, results) => {
    if (err) {
      throw err;
    }
    res.send(results.rows);
  })
});

app.post('/users', (req, res) => {
  const { name, email } = req.body;

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (err, results) => {
    if (err) {
      throw err;
    }
    res.status(201).send(`User added with ID: ${results.insertId}`);
  });
});

app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (err) => {
      if (err) {
        throw err;
      }
      res.status(200).send(`User modified with ID: ${id}`);
    }
  );
});

app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);

  pool.query('DELETE FROM users WHERE id = $1', [id], (err) => {
    if (err) {
      throw err;
    }
    res.send(`User deleted with ID: ${id}`);
  });
});


const port = process.env.port | 8080;
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
