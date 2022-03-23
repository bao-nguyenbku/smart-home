import express from 'express';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());

app.get('/', (req, res, next) => {
    res.json({
        name: 'light'
    });
})
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})