import express, {Application, Router} from 'express';
import * as bodyParser from "body-parser";
import sampleRouter from './routers/SampleRouter';
import pool from './dbconfig/dbconnector';

class Server {
    private app;

    constructor() {
        this.app = express();
        this.config();
        this.routerConfig();
        this.dbConnect();
    }

    private config() {
        this.app.use(bodyParser.urlencoded({extended:true}));
        this.app.use(bodyParser.json());
    }

    private dbConnect() {
        pool.connect(function (err, client, done) {
            if (err) throw new Error('fail to connect with db');
            console.log('Connected');
        });
    }

    private routerConfig() {
        this.app.use('/', sampleRouter);
    }

    public start = (port: number) => {
        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err: Object) => reject(err));
        });
    }
}
export default Server;