import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    roomId: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Device = mongoose.model('Device', deviceSchema);
export default Device;