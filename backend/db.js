const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: 5432, // default Postgres port
  database: process.env.DB_NAME
});

const fetchDataFromDB = async (query, params) => {
  try {
      const { rows } = await pool.query(query, params);
      return rows;
  } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error('Error fetching data from database');
  }
}

module.exports = { pool, fetchDataFromDB };