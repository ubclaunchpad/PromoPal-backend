import {Pool, Client} from 'pg';

/**
 * assume there is database 'foodies'
 */

export default new Pool ({
    max: 20,
    connectionString: 'postgres://admin:admin@db:5432/foodies',
    //postgres://user:password@hostname:port/dbname
    idleTimeoutMillis: 30000
});
