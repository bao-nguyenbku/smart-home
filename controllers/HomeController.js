// import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room, Device, Port, getAllDevice } from '../models/index.js';
import { genId } from './generateID.js';
import ada from '../api/adafruit.js';
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
                        // devices.map((device) => {
                        //     if (device.type ==='led') {
                        //         icon = 'lightbulb'
                        //     }
                        //     else if (device.typ === 'fan') {
                        //         icon = ''
                        //     }
                        // })
                        res.render('index', {
                            rooms: rooms,
                            currentRoomId: currentRoomId,
                            devices: devices,
                            temp: '--',
                            humi: '--',
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
    toggleDevice = async (req, res, next) => {
        const { deviceId, deviceType, status } = req.body;
        // Turn off
        if (status == 'false') {
            Device.findOne({ id: deviceId })
                .then(result => {
                    const currentTime = new Date();
                    const usedTime = currentTime - result.lastUse;
                    const lastDuration = result.duration;
                    Device.findOneAndUpdate({ id: deviceId }, {
                        status: false,
                        duration: usedTime + lastDuration,
                    }).then(result2 => {
                        res.status(200).json({
                            status: 200,
                            data: result2
                        })
                    }).catch(err => console.log(err))
                }).catch(err => console.log(err))
        }
        if (status == 'true') {
            Device.findOneAndUpdate({ id: deviceId }, {
                status: true,
                lastUse: new Date()
            }).then(result => {
                res.status(200).json({
                    status: 200,
                    data: result
                })
            }).catch(err => console.log(err));
        }
    }
    deleteDevice = (req, res, next) => {
        const _id = req.body.id;
        Device.findOneAndDelete({ id: _id })
            .then(_ => {
                Port.findOneAndUpdate({ port: _id }, { status: false })
                    .then(_ => {
                        res.status(200).json({
                            status: 200
                        })
                    })
            }).catch(err => console.log(err));
    }
    updateDevice = (req, res, next) => {
        const { deviceId, deviceName } = req.body;
        console.log(deviceId, deviceName);
        Device.findOneAndUpdate({ id: deviceId }, { name: deviceName })
            .then(result => {
                res.status(200).json({
                    status: 200,
                    data: result,
                    message: 'Update device successfully'
                })
            }).catch(err => console.log(err))
    }
    getAllDevice = (req, res, next) => {
        Device.find()
            .then(result => res.status(200).json({
                status: 200,
                data: result
            })).catch(err => console.log(err))
    }
}
export default new HomeController;