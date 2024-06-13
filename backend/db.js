const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: 5432, // default Postgres port
  database: process.env.DB_NAME
});

async function createDBIfNotExists() {
  const tempPool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: 5432, // default Postgres port
    database: 'postgres'
  });
  let client = await tempPool.connect();
  try {
    const result = await client.query(
      `SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower($1)`,
      [process.env.DB_NAME]
    );

    if (result.rows.length === 0) {
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log('Database created');
      
      client.release();

      const newPool = new Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        port: 5432, // default Postgres port
        database: process.env.DB_NAME
      });

      client = await newPool.connect();
      // Create tables

      await client.query(`CREATE TYPE public.question_type AS ENUM (
        'multiple_choice',
        'write_in',
        'fill_in'
      )`);

      await client.query(`CREATE TYPE public.role AS ENUM (
        'admin',
        'user'  
      )`);

      await client.query(`CREATE TABLE public.users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        google_id VARCHAR(255) NOT NULL,
        user_role role default 'user'
      )`);

      await client.query(`CREATE TABLE public.quiz (
        quiz_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        quiz_name VARCHAR(255),
        description TEXT,
        lang CHAR(2),
        difficulty INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      )`);

      await client.query(`CREATE TABLE public.user_quiz_result (
        result_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        quiz_id INTEGER REFERENCES quiz(quiz_id) ON DELETE CASCADE,
        correct_answers INTEGER,
        incorrect_answers INTEGER,
        started_at TIMESTAMP,
        completed_at TIMESTAMP DEFAULT NOW()
      )`);

      await client.query(`CREATE TABLE public.quiz_rating (
        quiz_id INTEGER REFERENCES quiz(quiz_id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER,
        PRIMARY KEY (quiz_id, user_id)
      )`);

      await client.query(`CREATE TABLE public.question (
        question_id SERIAL PRIMARY KEY,
        quiz_id INTEGER REFERENCES quiz(quiz_id) ON DELETE CASCADE,
        q_type question_type NOT NULL,
        question_text TEXT,
        image_url TEXT
      )`);

      await client.query(`CREATE TABLE public.multiple_choice_question (
        question_id INTEGER PRIMARY KEY REFERENCES question(question_id) ON DELETE CASCADE,
        correct_ans TEXT,
        incorrect_ans_1 TEXT,
        incorrect_ans_2 TEXT,
        incorrect_ans_3 TEXT,
        UNIQUE(question_id)
      )`);

      await client.query(`CREATE TABLE public.write_in_question (
        question_id INTEGER PRIMARY KEY REFERENCES question(question_id) ON DELETE CASCADE,
        correct_ans TEXT,
        UNIQUE(question_id)
      )`);

      await client.query(`CREATE TABLE public.fill_in_question (
        question_id INTEGER PRIMARY KEY REFERENCES question(question_id) ON DELETE CASCADE,
        correct_ans TEXT,
        answer_hint TEXT,
        UNIQUE(question_id)
      )`);

    } else {
      console.log('Database already exists');
    }
  } catch(error) {
    console.error('Error creating database: ', error);
  } finally {
    client.release();
  }
}

const fetchDataFromDB = async (query, params) => {
  try {
      if (params) {
        const { rows } = await pool.query(query, params);
        return rows;
      } else {
        const { rows } = await pool.query(query);
        return rows;
      }
  } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error('Error fetching data from database');
  }
}

module.exports = { pool, fetchDataFromDB, createDBIfNotExists };