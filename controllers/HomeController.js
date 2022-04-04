// import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room, Device } from '../models/index.js';
import { getAllRoomWithField } from '../models/RoomQuery.js';
import { getTempAndHumi } from '../models/TempAndHumiQuery.js';
import { genId } from './generateID.js';
import fs from 'fs';
import ejs from 'ejs';
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
                        getTempAndHumi((err, data) => {
                            if (!err) {
                                res.render('index', {
                                    rooms: rooms,
                                    currentRoomId: currentRoomId,
                                    devices: devices,
                                    temp: '--',
                                    humi: '--'
                                });
                            }
                        })
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }
    showWithRoom = (req, res, next) => {
        const roomName = req.body.room;
        Room.find({}, 'name id')
            .then(rooms => {
                let currentRoomId;
                for (let i = 0; i < rooms.length; i++) {
                    if (rooms[i].name.toLowerCase().split(' ').join('-') === roomName) {
                        currentRoomId = rooms[i].id;
                        break;
                    }
                }
                console.log(roomName);
                Device.find({ roomId: currentRoomId })
                    .then(devices => {   
                        // res.render('index', {
                        //     rooms: rooms,
                        //     currentRoomId: currentRoomId,
                        //     devices: devices,
                        //     temp: '--',
                        //     humi: '--'
                        // })
                        console.log(devices);
                        fs.readFile('views/partials/devices.ejs', "utf-8", function (err, template) {
                            const test_template = ejs.compile(template, { client: true });
                            const html = test_template({
                                devices: devices,
                            });
                            res.status(200).send(html);
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
        client.on('message', (topicRes, payload) => {
            res.json(JSON.parse(payload));
            return;
        })
    }

    toggleDevice = (req, res, next) => {
        const { deviceId, status } = req.body;
        Device.findOneAndUpdate({ id: deviceId }, { status: status })
            .then(result => {
                res.json(result);
            })
            .catch(err => console.log(err));
    }
}
export default new HomeController;