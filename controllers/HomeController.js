// import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room, Device, Port } from '../models/index.js';
import { genId } from './generateID.js';
import ada from '../api/adafruit.js';
import axios from 'axios';
class HomeController {
    addPort = (req, res, next) => {
        for (let i = 0; i < 3; i++) {
            const newPort = new Port({
                port: i,
                status: false
            })
            newPort.save();
        }
    }
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
        const emptyPorts = await Port.find({ status: false });
        if (emptyPorts.length === 0) {
            res.status(200).json({
                status: 404,
                message: 'All ports have been used'
            })
        }
        else {
            res.status(200).json({
                status: 200,
                data: emptyPorts
            });
        }
        // const newDevices = await ada.getNewDevice();
        // try {
        //     const allNewDevice = newDevices.data.map(async (item) => {
        //         try {
        //             const value = JSON.parse(item.value);
        //             if (value.cmd == 'add') {
        //                 const device = await Device.findOne({id: value.id})
        //                     .then(result => {
        //                         if (result) return null;
        //                         else return value;
        //                     }).catch(err => console.log(err));
        //                 return device;
        //             }
        //             else return null;
        //         } catch (error) {
        //             return null;
        //         }
        //     })

        //     Promise.all(allNewDevice).then((result) => {
        //         if (result.every((curr) => curr === null)) {
        //             res.status(200).json({status: 404, message: 'New device not found'});
        //         }
        //         else {
        //             res.status(200).json({
        //                 status: 200,
        //                 data: result.filter((item) => item !== null)
        //             })
        //         }
        //     })
        // } 
        // catch (error) {
        //     console.log(error);
        // }
    }
    addNewDevice = (req, res, next) => {
        const { deviceName, deviceId, deviceType, roomId } = req.body;  
        const newDevice = new Device({
            id: deviceId,
            name: deviceName,
            status: false,
            type: deviceType,
            roomId: roomId,
            lastUse: new Date()
        })
        newDevice.save()
            .then(result => {
                Port.findOneAndUpdate({ port: deviceId }, { status: true })
                    .then(_ => {
                        res.status(200).json({
                            status: 200,
                            data: result
                        })
                    }).catch(err => console.log(err))
            }).catch(err => console.log(err));
    }
    toggleDevice = (req, res, next) => {
        const { deviceId, status } = req.body;
        // Turn off
        if (status == 'false') {
            Device.findOne({ id: deviceId })
                .then(result => {
                    const currentTime = new Date();
                    const usedTime = currentTime - result.lastUse;
                    const lastDuration = result.duration;
                    Device.findOneAndUpdate({ id: deviceId }, { 
                        status: status, 
                        duration: usedTime + lastDuration,
                    }).then(result2 => {
                        const device = {
                            id: deviceId,
                            cmd: status == 'true' ? 'open' : 'close',
                            name: result2.type,
                            paras: 'none'
                        }
        
                        client.publish(topicReq, `${JSON.stringify(device)}`, { qos: 0, retain: true }, (error) => {
                            if (error) {
                                res.json({
                                    error: error
                                })
                            }
                            else {
                                res.json({
                                    status: 200,
                                    error: '',
                                    data: result2
                                })
                            }
                        })
                    }).catch(err => console.log(err))
                }).catch(err => console.log(err))
        }
        else {
            Device.findOneAndUpdate({ id: deviceId }, { status: status, lastUse: new Date() })
                .then(result => {
                    const device = {
                        id: deviceId,
                        cmd: status == 'true' ? 'open' : 'close',
                        name: result.type,
                        paras: 'none'
                    }
    
                    client.publish(topicReq, `${JSON.stringify(device)}`, { qos: 0, retain: true }, (error) => {
                        if (error) {
                            res.json({
                                error: error
                            })
                        }
                        else {
                            res.json({
                                status: 200,
                                error: '',
                                data: result
                            })
                        }
                    })
                }).catch(err => console.log(err))
        }
    }
    deleteDevice = (req, res, next) => {
        const { id } = req.body;
        Device.findOneAndDelete({ id: id })
            .then(result => res.status(200).json({
                status: 200
            }))
            .catch(err => console.log(err));
    }
    
}
export default new HomeController;