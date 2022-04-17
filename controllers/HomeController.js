// import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room, Device } from '../models/index.js';
import { getAllRoomWithField } from '../models/RoomQuery.js';
import { genId } from './generateID.js';
import fs from 'fs';
import ejs from 'ejs';
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
    // showWithRoom = (req, res, next) => {
    //     const roomName = req.body.room;
    //     Room.find({}, 'name id')
    //         .then(rooms => {
    //             let currentRoomId;
    //             for (let i = 0; i < rooms.length; i++) {
    //                 if (rooms[i].name.toLowerCase().split(' ').join('-') === roomName) {
    //                     currentRoomId = rooms[i].id;
    //                     break;
    //                 }
    //             }
    //             console.log(roomName);
    //             Device.find({ roomId: currentRoomId })
    //                 .then(devices => {   
    //                     // res.render('index', {
    //                     //     rooms: rooms,
    //                     //     currentRoomId: currentRoomId,
    //                     //     devices: devices,
    //                     //     temp: '--',
    //                     //     humi: '--'
    //                     // })
    //                     console.log(devices);
    //                     fs.readFile('views/partials/devices.ejs', "utf-8", function (err, template) {
    //                         const test_template = ejs.compile(template, { client: true });
    //                         const html = test_template({
    //                             devices: devices,
    //                         });
    //                         res.status(200).send(html);
    //                     });
    //                 })
    //                 .catch(err => console.log(err));
    //         })
    //         .catch(err => console.log(err));
    // }
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