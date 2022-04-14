// import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room, Device } from '../models/index.js';
import { genId } from './generateID.js';

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
    deleteRoom = (req, res, next) => {
        const { id } = req.body;
        Room.findOneAndDelete({ id: id })
            .then(result => {
                res.status(200).json({
                    status: 200,
                    data: result
                })
            })
            .catch(err => res.json(err))

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
                res.json(result)
            })
            .catch(err => res.json(err))
    }
    toggleDevice = (req, res, next) => {
        const { id, status } = req.body;
        // Turn off
        if (!status) {
            Device.findOne({ id: id })
                .then(result => {
                    if (!result.status) {
                        res.status(304).json({
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
                        res.status(304).json({
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
                res.status(200).json(result)
            }).catch(err => res.json(err))
    }
}
export default new HomeController;