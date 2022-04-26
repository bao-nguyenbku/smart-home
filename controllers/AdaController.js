// import client, { topicRes, topicReq } from '../mqtt/index.js';
// import { Room, Device } from '../models/index.js';
// import { genId } from './generateID.js';
class AdaController {
    getIOKey = (req, res, next) => {
        const key = process.env.IO_KEY;
        res.status(200).json({
            status: 200,
            key: key
        })
    }
}

export default new AdaController;