import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room, Device, Port } from '../models/index.js';
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
        const device = {
            id: deviceId,
            cmd: status == 'true' ? 'open' : 'close',
            name: deviceType,
            paras: 'none'
        }
        // Turn off
        // if (status == 'false') {
        //     client.publish(topicReq, `${JSON.stringify(device)}`, { qos: 0, retain: true }, async (error) => {
        //         if (error) {
        //             res.json({ error: error })
        //         }
        //         else {
        //             const feedData = await ada.getFeedData();
        //             feedData.data.forEach(feed => {
        //                 try {
        //                     value = JSON.parse(feed.value);
        //                     if (value.id == deviceId && value.cmd == device.cmd && value.name == deviceType) {
        //                         if (value.paras === 'success') {
        //                             Device.findOne({ id: deviceId })
        //                                 .then(result => {
        //                                     const currentTime = new Date();
        //                                     const usedTime = currentTime - result.lastUse;
        //                                     const lastDuration = result.duration;
        //                                     Device.findOneAndUpdate({ id: deviceId }, { 
        //                                         status: status, 
        //                                         duration: usedTime + lastDuration,
        //                                     }).then(result2 => {
        //                                         res.json({
        //                                             status: 200,
        //                                             error: '',
        //                                             data: result2
        //                                         })
        //                                     }).catch(err => console.log(err))
        //                                 }).catch(err => console.log(err))
        //                         }
        //                     }
        //                 } catch (error) { 
        //                     return;
        //                 }
        //             });
        //         }
        //     })
        // }
        if (status == 'true') {
            client.publish(topicReq, `${JSON.stringify(device)}`, { qos: 0, retain: true }, async (error) => {
                if (error) {
                    res.json({ error: error })
                }
                else {
                    let end_time = new Date();
                    this.listenFeedRespone(device, end_time, (err, result) => {
                        // No response from adafruit
                        if (err === 'failed') {
                            res.status(200).json({
                                status: 404,
                                message: 'Server is busy now'
                            })
                        }
                        else if (!err) {
                            res.status(200).json({
                                status: 200,
                                data: result
                            })
                        }
                        else if (err) {
                            res.status(200).json({
                                status: 500,
                                message: 'Database issue'
                            })
                        }
                    });
                }
            })
            
        }
    }
    listenFeedRespone = async (device, _end_time, callback) => {
        let end_time = _end_time;
        const currentTime = new Date();
        while (new Date() - currentTime < 3000) {
            console.log('Time');
            const feedData = await ada.getFeedData(10, end_time);
            feedData.data.forEach(feed => {
                try {
                    value = JSON.parse(feed.value);
                    if (value.id == device.id && value.cmd == device.cmd && value.name == device.name) {
                        if (value.paras === 'success') {
                            Device.findOneAndUpdate({ id: device.id }, { status: device.cmd == 'open', lastUse: new Date() })
                                .then(result2 => {
                                    callback(null, result2);
                                    return;
                                }).catch(err => callback(err, null));
                        }
                    }
                } catch (error) { 
                    return;
                }
            });
            end_time = feedData.data[feedData.data.length - 1].created_at;
        }
        callback('failed', null);
    }
    deleteDevice = (req, res, next) => {
        const { id } = req.body;
        Device.findOneAndDelete({ id: id })
            .then(result => res.status(200).json({
                status: 200
            }))
            .catch(err => console.log(err));
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
}
export default new HomeController;