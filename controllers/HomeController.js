import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room, Device } from '../models/index.js';
import { getAllRoomWithField } from '../models/RoomQuery.js';
import { getTempAndHumi } from '../models/TempAndHumiQuery.js';
import { genId } from './generateID.js';
class HomeController {
    show = (req, res, next) => {
        // const temp = {
        //     cmd:'info',
        //     name:'temp',
        //     paras:'none'
        // }
        // client.on('connect', () => {
        //     console.log('Connected');
        //     client.publish(topicReq, `${JSON.stringify(temp)}`, { qos: 0, retain: true }, (error) => {
        //         if (error) {
        //             console.error(error)
        //         }
        //     })
        // })
        // res.json('Success');
        // client.on('message', (topicRes, payload) => {
        //    res.json(JSON.parse(payload));
        // })
        const { roomName } = req.query;
        Room.find({}, 'name id')
            .then(rooms => {
                let currentRoomId;
                if (roomName) {
                    for (let i = 0; i < rooms.length; i++) {
                        if (rooms[i].name.toLowerCase().split(' ').join('-') === roomName) {
                            currentRoomId = rooms[i].id;
                            break;
                        }
                    }
                }
                else {
                    currentRoomId = rooms[0].id;
                }
                
                Device.find({roomId: currentRoomId})
                    .then(devices => {
                        getTempAndHumi((err, data) => {
                            if (!err) {
                                res.render('index', { 
                                    rooms: rooms, 
                                    currentRoomId: currentRoomId, 
                                    devices: devices, 
                                    temp: parseInt(data.temp),
                                    humi: parseInt(data.humidity)
                                });
                            }
                        })
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }
    addNewRoom = (req, res, next) => {
        const roomName = req.body.name;
        const newRoom = new Room({
            id: genId(),
            name: roomName
        })
        newRoom.save()
            .then(result => {
                res.status(200).json({
                    status: 200,
                    data: result
                })
            })
            .catch(err => console.log(err))
    }
    addNewDevice = (req, res, next) => {
        const { deviceName, deviceCode, room } = req.body;
        
        // Find a room in database which match 'room'
        getAllRoomWithField('name', (err, result) => {
            if (!err) {
                const newDevice = new Device({
                    id: genId(),
                    name: deviceName,
                    status: false,
                    type: deviceCode,
                    roomId: result.find(el => el.name === room).id
                });
                newDevice.save()
                    .then(result => {
                        res.status(200).json({
                            status: 200,
                            data: result
                        })
                    })
                    .catch(err => console.log(err));
            }
        });
        

    }
    // getAllRoom = (req, res, next) => {
    //     Room.find({}, 'name')
    //         .then(result => {
    //             res.json(result);
    //         })
    //         .catch(err => console.log(err));
    // }
    getTempAndHumidity = (req, res, next) => {
        getTempAndHumi((err, data) => {
            if (!err) {
                res.status(200).json(data);
            }
            else {
                console.log(err);
            }
        })
    }
}
export default new HomeController;