// import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room, Device } from '../models/index.js';
// import { genId } from './generateID.js';
class StatisticsController {
    show = (req, res, next) => {
        res.render('statistics');
    }
    getAllDevice = (req, res, next) => {
        Device.find()
            .then(devices => {
                // [{}, {}, {}, {}]
                Room.find()
                    .then(rooms => {
                        res.json({ devices: devices, rooms: rooms });
                    })
                
            })
    }
}
export default new StatisticsController;