import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        // required: true
    },
    img: {
        type: String,
        // required: true
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;