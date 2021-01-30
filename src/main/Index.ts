import { App } from './App';
import * as dotenv from 'dotenv';
dotenv.config();

const app: App = new App();
app.init().then();
