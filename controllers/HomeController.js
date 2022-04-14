// import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room, Device } from '../models/index.js';
import { getAllRoomWithField } from '../models/RoomQuery.js';
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
    getAllRoom = (req, res, next) => {
        Room.find()
            .then(result => {
                res.status(200).json(result)
            }).catch(err => res.json(err))
    }
}
export default new HomeController;