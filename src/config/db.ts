import { Pool } from 'pg';
import config from '.';

export const db = new Pool({
  connectionString: `${config.connection_string}`,
});


export default db;