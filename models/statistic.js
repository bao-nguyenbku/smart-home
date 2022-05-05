import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const statSchema = new Schema({
    deviceId: {
        type: Number,
        required: true
    },
    data: {
        type: Array,
        required: true,
        default: [0,0,0,0,0,0,0]
    }
}, { timestamps: true });

const Stat = mongoose.model('Stat', statSchema);
export default Stat;