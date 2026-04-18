/**
 * config/db.js
 *
 * MySQL2 connection pool with promise wrapper.
 * The pool is created once and shared across the entire application,
 * preventing "too many connections" issues under load.
 */

'use strict';

const mysql = require('mysql2/promise');

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = '3306',
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

if (!DB_USER || !DB_PASSWORD || !DB_NAME) {
  throw new Error(
    '[db] Missing required environment variables: DB_USER, DB_PASSWORD, DB_NAME. ' +
    'Copy .env.example to .env and fill in your local values.'
  );
}

const pool = mysql.createPool({
  host:               DB_HOST,
  port:               Number(DB_PORT),
  user:               DB_USER,
  password:           DB_PASSWORD,
  database:           DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,       // max simultaneous connections
  queueLimit:         0,        // unlimited queue (0 = no limit)
  timezone:           '+00:00', // store/retrieve all dates in UTC
  charset:            'utf8mb4',
});

// Surface connectivity issues at startup rather than at first request
pool.getConnection()
  .then((conn) => {
    console.log(`[db] ✓ MySQL connected → ${DB_HOST}:${DB_PORT}/${DB_NAME}`);
    conn.release();
  })
  .catch((err) => {
    console.error('[db] ✗ MySQL connection failed:', err.message);
    process.exit(1); // fast-fail: no point starting if DB is unreachable
  });

module.exports = pool;
