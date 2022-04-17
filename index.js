import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import cors from 'cors';
import path from 'path';
import ejsLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';
import mongoose from './database/index.js';
// import client from './mqtt/index.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

// -----------------------------------------
const app = express();
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'smart home',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 2 * 60 * 60 * 1000 }
}))
app.use(cookieParser());

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

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
})

routes(app);


app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})