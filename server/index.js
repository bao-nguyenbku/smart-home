import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';
import mongoose from './database/index.js';
// import client from './mqtt/index.js';




const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());


routes(app);





app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})