import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const username = process.env.mongoDB_username;
const password = process.env.mongoDB_password;
const mongoURI = `mongodb+srv://${username}:${password}@smarthome.mjg1s.mongodb.net/smarthome?retryWrites=true&w=majority`;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to database'))
    .catch((err) => console.log(err))

export default mongoose;
