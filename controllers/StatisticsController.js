// import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room, Device, Stat } from '../models/index.js';
// import { genId } from './generateID.js';
class StatisticsController {
    show = async (req, res, next) => {
        Room.find()
            .then(roomList => {
                const totalWh = roomList.map(async (room) => {
                    const devicesTotalWh = await Device.find({ roomId: room.id })
                                            .then(deviceList => {
                                                let totalWh = 0;
                                                if (deviceList.length !== 0) {
                                                    totalWh = deviceList.reduce((a, b) => 
                                                    { return a + (parseInt(b.duration / 3600000) 
                                                               * parseInt(b.capacity))}, 0)
                                                }
                                                return totalWh;
                                            });
                    return {
                        roomId: room.id,
                        roomName: room.name,
                        total: devicesTotalWh
                    };
                })  
                Promise.all(totalWh).then((result) => {
                    res.render('statistics', { roomKWh: result });
                })
            }).catch(err => console.log(err))
        
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
    getTotalkWhPerDay = (req, res, next) => {
        Stat.find({})
            .then(result => {
                res.status(200).json({
                    status: 200,
                    data: result
                })
            })
    }
}
export default new StatisticsController;