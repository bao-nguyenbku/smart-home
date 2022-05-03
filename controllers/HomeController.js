// import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room, Device, Port } from '../models/index.js';
import { genId } from './generateID.js';
import axios from 'axios';
class HomeController {
    addNewRoom = (req, res, next) => {
        const { name } = req.body;
        console.log(name);
        const newRoom = new Room({
            id: genId(),
            name: name
        })
        newRoom.save()
            .then(result => {
                res.status(200).json({
                    status: 200,
                    data: result
                })
            })
            .catch(err => res.json(err))
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
    addNewDevice = (req, res, next) => {
        const { name, id, type, roomId } = req.body;
        // Find a room in database which match 'room'
        Room.findOne({id: roomId})
            .then(result => {
                const newDevice = new Device({
                    id: id,
                    name: name,
                    status: false,
                    type: type,
                    roomId: roomId,
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
            })
            .catch(err => res.json(err))
    }
    getAllDevice = (req, res, next) => {
        Device.find()
            .then(result => {
                res.status(200).json({
                    data: result
                })
            })
            .catch(err => res.json(err))
    }
    toggleDevice = (req, res, next) => {
        const { id, status } = req.body;
        // Turn off
        if (status === false) {
            Device.findOne({ id: id })
                .then(result => {
                    if (result.status) {
                        res.status(200).json({
                            status: 304,
                            message: 'This device is currently off'
                        })
                    }
                    else {
                        const currentTime = new Date();
                        const usedTime = currentTime - result.lastUse;
                        const lastDuration = result.duration;
                        Device.findOneAndUpdate({ id: id }, { 
                            status: status, 
                            duration: usedTime + lastDuration,
                        }).then(result2 => {
                            res.status(200).json({
                                status: 200,    
                                data: result2
                            });
                        }).catch(err => res.json(err))
                    }
                }).catch(err => res.json(err))
        }
        else {
            Device.findOne({ id: id })
                .then(result => {
                    if (result.status) {
                        res.status(200).json({
                            status: 304,
                            message: 'This device is currently on'
                        })
                    }
                    else {
                        Device.findOneAndUpdate({ id: id }, { status: status, lastUse: new Date() })
                            .then(result => {
                                res.status(200).json({
                                    status: 200,
                                    data: result
                                });
                            })
                            .catch(err => res.json(err))
                    }
                }).catch(err => req.json(err))
        }
    }
    getAllRoom = (req, res, next) => {
        Room.find()
            .then(result => {
                res.status(200).json({
                    data: result
                })
            }).catch(err => res.json(err))
    }
    getDeviceByRoomId = (req, res, next) => {
        const { id } = req.body;
        Device.find({roomId: id})
            .then(result => {
                res.status(200).json({
                    data: result
                })
            })
            .catch(err => res.json(err))
        console.log(id);
    }
    getDataFeed = (req, res, next) => {
        axios.get('https://io.adafruit.com/api/v2/kimhungtdblla24/feeds/ttda-cnpm-ha2so/data')
            .then(result => res.status(200).json({
                data: result.data
            }))
            .catch(err => res.json(err))
    }
    getPorts = (req, res, next) => {
        Port.find()
            .then(result => res.status(200).json({
                data: result
            })).catch(err => console.log(err))
    }
}
export default new HomeController;
