// import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room, Device } from '../models/index.js';
import { getAllRoomWithField } from '../models/RoomQuery.js';
import { genId } from './generateID.js';
import axios from 'axios';
class HomeController {
    show = (req, res, next) => {
        const { room } = req.query;
        Room.find({}, 'name id')
            .then(rooms => {
                let currentRoomId;
                if (room) {
                    for (let i = 0; i < rooms.length; i++) {
                        if (rooms[i].name.toLowerCase().split(' ').join('-') === room) {
                            currentRoomId = rooms[i].id;
                            break;
                        }
                    }
                }
                else {
                    currentRoomId = rooms[0].id;
                }

                Device.find({ roomId: currentRoomId })
                    .then(devices => {
                        res.render('index', {
                            rooms: rooms,
                            currentRoomId: currentRoomId,
                            devices: devices,
                            temp: '--',
                            humi: '--'
                        });
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
    getNewDevice = async (req, res, next) => {
        const limit = 10;
        // while (true) {
            try {
                const result = await axios.get(`https://io.adafruit.com/api/v2/kimhungtdblla24/feeds/ttda-cnpm-ha2so/data?limit=${limit}`);
                // const data = result.data;
                const data = JSON.parse('{"id":-1,"cmd":"info","name":"TempHumi","paras":"{31.00,75.00}"}');
                res.json([
                    data
                ])
                // res.status(200).json(result.data)
            } 
            catch (error) {
                console.log(error);
            }
        // }

    }
    addNewDevice = (req, res, next) => {
        const { deviceName, deviceId, room } = req.body;
        // Find a room in database which match 'room'
        getAllRoomWithField('name', (err, result) => {
            if (!err) {
                const newDevice = new Device({
                    id: deviceId,
                    name: deviceName,
                    status: false,
                    type: deviceCode === 'light' ? 'led' : '',
                    roomId: result.find(el => el.name === room).id,
                    lastUse: new Date()
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

    toggleDevice = (req, res, next) => {
        const { deviceId, status } = req.body;
        // Turn off
        if (status == 'false') {
            Device.find({ id: deviceId })
                .then(result => {
                    const currentTime = new Date();
                    const usedTime = currentTime - result[0].lastUse;
                    const lastDuration = result[0].duration;
                    Device.findOneAndUpdate({ id: deviceId }, { 
                        status: status, 
                        duration: usedTime + lastDuration,
                    }).then(result2 => {
                        const device = {
                            id: deviceId,
                            cmd: status ? 'open' : 'close',
                            name: result.type,
                            paras: 'none'
                        }
        
                        // console.log(JSON.stringify(device));
                        // client.publish(topicReq, `${JSON.stringify(device)}`, { qos: 0, retain: true }, (error) => {
                        //     if (error) {
                        //         console.error(error);
                        //     }
                        // })
        
                        res.json(result);
                    }).catch(err => console.log(err))
                }).catch(err => console.log(err))
        }
        else {
            Device.findOneAndUpdate({ id: deviceId }, { status: status, lastUse: new Date() })
                .then(result => {
                    const device = {
                        id: deviceId,
                        cmd: status ? 'open' : 'close',
                        name: result.type,
                        paras: 'none'
                    }
    
                    // console.log(JSON.stringify(device));
                    // client.publish(topicReq, `${JSON.stringify(device)}`, { qos: 0, retain: true }, (error) => {
                    //     if (error) {
                    //         console.error(error);
                    //     }
                    // })
    
                    res.json(result);
                })
                .catch(err => console.log(err))
        }
    }

    
}
export default new HomeController;