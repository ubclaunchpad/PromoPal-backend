import pool from '../dbconfig/dbconnector';

/**
 * assume there is table 'promotion' in foodies db
 */

class SampleController {

    public async get(req: any, res: any) {
        try {
            const client = await pool.connect();

            const sql = "SELECT * FROM sample";
            const { rows } = await client.query(sql);
            const data = rows;

            client.release();

            res.send(data);
        } catch(error) {
            res.status(400).send(error);
        }
    }
}

export default SampleController;