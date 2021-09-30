import { Pool } from 'pg';

export default new Pool({
  max: 20,
  connectionString: 'postgres://matcha:matcha@localhost:5432/matcha',
  idleTimeoutMillis: 30000,
});
