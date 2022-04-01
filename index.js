import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';
import path from 'path';
import ejsLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';
import mongoose from './database/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();
const PORT = process.env.PORT || 5000;
// Set template engine
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.set('layout', './layouts/main.ejs');
// Static file
app.use("/assets", express.static(path.join(__dirname, '/assets')));

// Use json format
app.use(express.json());

// Allow client send request
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());


routes(app);





app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})