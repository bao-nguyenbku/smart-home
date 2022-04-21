import client, { topicRes, topicReq } from '../mqtt/index.js';
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
        const reqAdaPort = {
            id: parseInt(deviceId),
            cmd: 'add',
            name: deviceType,
            paras: 'none'
        }
        client.publish(topicReq, `${JSON.stringify(reqAdaPort)}`, { qos: 0, retain: true }, async (error) => {
            if (error) {
                res.json({ error: error })
            }
            else {
                this.listenFeedRespone(reqAdaPort, new Date(), (err, result) => {
                    // No response from adafruit
                    if (err === 'failed') {
                        res.status(200).json({
                            status: 404,
                            message: 'Server is busy now'
                        })
                    }
                    else if (!err) {
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
    toggleDevice = async (req, res, next) => {
        const { deviceId, deviceType, status } = req.body;
        const device = {
            id: parseInt(deviceId),
            cmd: status == 'true' ? 'open' : 'close',
            name: deviceType,
            paras: 'none'
        }
        const deviceJSON = JSON.stringify(device);

        // Turn off
        if (status == 'false') {
            client.publish(topicReq, `${JSON.stringify(device)}`, { qos: 0, retain: true }, async (error) => {
                if (error) {
                    res.json({ error: error })
                }
                else {
                    this.listenFeedRespone(device, new Date(), (err, result) => {
                        // No response from adafruit
                        if (err === 'failed') {
                            res.status(200).json({
                                status: 404,
                                message: 'Server is busy now'
                            })
                        }
                        else if (!err) {
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
                        else if (err) {
                            res.status(200).json({
                                status: 500,
                                message: 'Database issue'
                            })
                        }
                    });
                    const feedData = await ada.getFeedData();
                    feedData.data.forEach(feed => {
                        try {
                            value = JSON.parse(feed.value);
                            if (value.id == deviceId && value.cmd == device.cmd && value.name == deviceType) {
                                if (value.paras === 'success') {

                                }
                            }
                        } catch (error) {
                            return;
                        }
                    });
                }
            })
        }
        if (status == 'true') {
            this.listenFeedRespone(device, new Date(), async (err, result) => {
                // No response from adafruit
                if (err === 'failed') {
                    res.status(200).json({
                        status: 404,
                        message: 'Server is busy now'
                    })
                }
                else if (!err) {
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
                else if (err) {
                    res.status(200).json({
                        status: 500,
                        message: 'Database issue'
                    })
                }
            });
            // client.publish(topicReq, `${JSON.stringify(device)}`, { qos: 0, retain: true }, async (error) => {
            //     if (error) {
            //         res.json({ error: error })
            //     }
            //     else {
            //         this.listenFeedRespone(device, new Date(), (err, result) => {
            //             // No response from adafruit
            //             if (err === 'failed') {
            //                 res.status(200).json({
            //                     status: 404,
            //                     message: 'Server is busy now'
            //                 })
            //             }
            //             else if (!err) {
            //                 res.status(200).json({
            //                     status: 200,
            //                     data: result
            //                 })
            //             }
            //             else if (err) {
            //                 res.status(200).json({
            //                     status: 500,
            //                     message: 'Database issue'
            //                 })
            //             }
            //         });
            //     }
            // })

        }
    }
    listenFeedRespone = async (device, _end_time, callback) => {
        let end_time = _end_time;
        const currentTime = new Date();
        let isStop = false;
        try {
            while (new Date() - currentTime < 3000 && !isStop) {
                // const feedData = await ada.getFeedData(10, end_time);
                const feedData = {
                    data: [
                        // {
                        //     "id": "0F0BJTX0TQ13J32VNCMG1FJ3V4",
                        //     "value": "Connected!",
                        //     "feed_id": 1846209,
                        //     "feed_key": "ttda-cnpm-ha2so",
                        //     "created_at": "2022-04-21T03:29:37Z",
                        //     "created_epoch": 1650511777,
                        //     "expiration": "2022-05-21T03:29:37Z"
                        // },
                        {
                            "id": "0F0BJSDAMJKREQHPD4525TZZ2M",
                            "value": "{\"id\":\"0\",\"cmd\":\"close\",\"name\":\"led\",\"paras\":\"success\"}",
                            "feed_id": 1846209,
                            "feed_key": "ttda-cnpm-ha2so",
                            "created_at": "2022-04-21T03:27:00Z",
                            "created_epoch": 1650511620,
                            "expiration": "2022-05-21T03:27:00Z"
                        },
                        {
                            "id": "0F0BJSDAMJKREQHPD4525TZZ2M",
                            "value": "{\"id\":\"0\",\"cmd\":\"open\",\"name\":\"led\",\"paras\":\"success\"}",
                            "feed_id": 1846209,
                            "feed_key": "ttda-cnpm-ha2so",
                            "created_at": "2022-04-21T03:27:00Z",
                            "created_epoch": 1650511620,
                            "expiration": "2022-05-21T03:27:00Z"
                        }
                    ]
                }
                for (let i = 0; i < feedData.data.length; i++) {
                    const feed = feedData.data[i];
                    try {
                        const value = JSON.parse(feed['value']);
                        // console.log('From value: ',value);
                        if (parseInt(value.id) === device.id 
                            && value.cmd === device.cmd 
                            && value.name === device.name) {
                            if (value.paras === 'success') {
                                callback(null, 'success');
                                isStop = true;
                                break;
                            }
                        }
                        
                    } catch (error) {
                        console.log(error);
                        continue;
                    }
                }
                end_time = feedData.data[feedData.data.length - 1].created_at;
            }
            if (!isStop) {
                callback('failed', null);
            }
        } catch (error) {
            console.log(error);
            callback('failed', null);
        }
    }
    deleteDevice = (req, res, next) => {
        const { id } = req.body;
        Device.findOneAndDelete({ id: id })
            .then(_ => {
                Port.findByIdAndUpdate({ port: id }, { status: false })
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

    restartServer = async (req, res, next) => {
        console.log('Waiting for Adafruit...');
        client.on('message', async (topicRes, payload) => {
            const feedData = payload.toString();
            console.log('Received Message:', topic, feedData);
            try {
                const value = JSON.parse(feedData);
                if (value.id === -1 && value.cmd === 'update') {
                    const data = await getAllDevice();
                    const restartInfo = {
                        id: [],
                        cmd: 'update',
                        name: [],
                        paras: []
                    }
                    for (let i = 0; i < data.length; i++) {
                        restartInfo.id.push(parseInt(data[i].id));
                        restartInfo.name.push(data[i].type);
                        restartInfo.paras.push(data[i].status);
                    }
                    client.publish(topicReq, `${JSON.stringify(restartInfo)}`, { qos: 0, retain: true }, (err) => {
                        if (err) console.log(err);
                        else {
                            res.status(200).json({
                                status: 200,
                                message: 'Restart server successfully'
                            })
                        }
                    })
                }
            } catch (error) {
                console.log(error);
            }
        })
    }
}
export default new HomeController;