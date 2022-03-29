import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from './database/index.js';
// import client from './mqtt/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();
const PORT = process.env.PORT || 5000;
app.set('view engine', 'ejs');
app.use("/assets", express.static(path.join(__dirname, '/assets')));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());


routes(app);





app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})