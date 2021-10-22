import { Pool } from 'pg';
// import faker from 'faker';

// faker.locale = 'fr';
const poolConfig = {
  database: process.env.DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  max: Number(process.env.DB_POOL_SIZE),
  idleTimeoutMillis: Number(process.env.DB_POOL_CLIENT_IDLE_TIMEOUT),
  connectionTimeoutMillis: Number(
    process.env.DB_POOL_CLIENT_CONNECTION_TIMEOUT
  ),
};

const pool = new Pool(poolConfig);

const db = {
  query: async function (text: string, params: any) {
    const res = await pool.query(text, params);
    return res;
  },
};

export default db;
