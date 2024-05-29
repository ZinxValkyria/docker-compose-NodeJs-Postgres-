const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL connection settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get('/', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.send(`
      <html>
        <head>
          <title>Node.js PostgreSQL App</title>
        </head>
        <body>
          <h1>Welcome to the Node.js PostgreSQL App</h1>
          <p>Database time: ${result.rows[0].now}</p>
          <a href="/tables">View Tables</a>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error connecting to the database');
  }
});

// Route to create a new table
app.post('/create-table', async (req, res) => {
  const { tableName, columns } = req.body;
  if (!tableName || !columns) {
    return res.status(400).send('Table name and columns are required');
  }

  const columnsDef = columns.map(col => `${col.name} ${col.type}`).join(', ');
  const query = `CREATE TABLE ${tableName} (id SERIAL PRIMARY KEY, ${columnsDef})`;

  try {
    const client = await pool.connect();
    await client.query(query);
    client.release();
    res.status(201).send(`Table ${tableName} created successfully`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating table');
  }
});

// Route to insert data into a table
app.post('/insert-data', async (req, res) => {
  const { tableName, data } = req.body;
  if (!tableName || !data) {
    return res.status(400).send('Table name and data are required');
  }

  const columns = Object.keys(data).join(', ');
  const values = Object.values(data);
  const valuePlaceholders = values.map((_, index) => `$${index + 1}`).join(', ');

  const query = `INSERT INTO ${tableName} (${columns}) VALUES (${valuePlaceholders})`;

  try {
    const client = await pool.connect();
    await client.query(query, values);
    client.release();
    res.status(201).send('Data inserted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting data');
  }
});

// Route to fetch table data
app.get('/tables', async (req, res) => {
  try {
    const client = await pool.connect();
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    const tables = tablesResult.rows.map(row => row.table_name);
    let html = `
      <html>
        <head>
          <title>Node.js PostgreSQL App</title>
        </head>
        <body>
          <h1>Tables</h1>
          <ul>
    `;

    for (const table of tables) {
      const dataResult = await client.query(`SELECT * FROM ${table}`);
      html += `
        <li>
          <h2>${table}</h2>
          <table border="1">
            <tr>
              ${dataResult.fields.map(field => `<th>${field.name}</th>`).join('')}
            </tr>
      `;
      dataResult.rows.forEach(row => {
        html += `
          <tr>
            ${dataResult.fields.map(field => `<td>${row[field.name]}</td>`).join('')}
          </tr>
        `;
      });
      html += '</table></li>';
    }

    client.release();
    html += '</ul></body></html>';
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching table data');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
