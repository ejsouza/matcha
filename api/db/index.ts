import { Pool, QueryArrayConfig, PoolClient } from 'pg';
import path from 'path';
import { migrate } from 'postgres-migrations';

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

// const pool = new Pool(poolConfig);

// const db = {
//   runMigrations: async function (): Promise<void> {
//     const client = await pool.connect();
//     try {
//       await migrate({ client }, path.resolve(__dirname, 'migrations/sql'));
//     } catch (err) {
//       console.log(`migration failed ${err}`);
//     } finally {
//       client.release();
//     }
//   },
//   query: async function (text: string, params: any): Promise<any> {
//     try {
//       const { rows } = await pool.query(text, params);

//       Object.entries(rows).forEach((val, index) => console.log(`<< $ >> ${val[index]}`))
//       console.log(`>>> ${rows[0]}`);
//       return rows;
//     } catch (err) {
//       console.log(`Something went worong querying the db... ${err}`);
//       throw Error('Error querying db');
//     }
//   },
// };

// export default db;

// export default new Pool({
//   max: 20,
//   connectionString: 'postgres://matcha:matcha@localhost:5432/matcha',
//   idleTimeoutMillis: 30000,
//   user: 'matcha',
//   host: 'postgres',
//   password: 'matcha',
//   port: 5432,
// });
