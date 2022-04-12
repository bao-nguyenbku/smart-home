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
    type: {
        type: String,
        required: true
    },
    roomId: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        default: 36,
        required: true
    },
    duration: {
        type: Number,
        default: 0,
        required: true
    },
    lastUse: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const Device = mongoose.model('Device', deviceSchema);
export default Device;