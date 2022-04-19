// import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room, Device } from '../models/index.js';
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
        let end_time = new Date();
        
        try {
            // const result = await axios.get(`https://io.adafruit.com/api/v2/kimhungtdblla24/feeds/ttda-cnpm-ha2so/data?limit=${limit}&end_time=${end_time}`);
            const result = {
                data: [
                    {              
                        "id": "0EZV49AXP149NG2T555BM41BEK",
                        "value": `{\"id\":${genId()},\"cmd\":\"add\",\"name\":\"led\",\"paras\":\"none\"}`,
                        "feed_id": 1846206,
                        "feed_key": "ttda-cnpm-so2ha",
                        "created_at": "2022-03-31T16:42:52Z",
                        "created_epoch": 1648744972,
                        "expiration": "2022-04-30T16:42:52Z"
                    },
                    {
                        "id": "0EZV498YK84Q0X8EEX5BVNM0FN",
                        "value": "{\"id\":1,\"cmd\":\"close\",\"name\":\"led\",\"paras\":\"none\"}",
                        "feed_id": 1846206,
                        "feed_key": "ttda-cnpm-so2ha",
                        "created_at": "2022-03-31T16:42:45Z",
                        "created_epoch": 1648744965,
                        "expiration": "2022-04-30T16:42:45Z"
                    },
                ]
            }
            // const data = result.data;
            const allNewDevice = result.data.map(async (item) => {
                try {
                    const value = JSON.parse(item.value);
                    if (value.cmd == 'add') {
                        const device = await Device.findOne({id: value.id})
                            .then(result => {
                                if (result) return null;
                                else return value;
                            }).catch(err => console.log(err));
                        return device;
                    }
                    else return null;
                } catch (error) {
                    return;
                }
            })

            Promise.all(allNewDevice).then((result) => {
                if (result.every((curr) => curr === null)) {
                    res.status(200).json({status: 404, message: 'New device not found'});
                }
                else {
                    res.status(200).json({
                        status: 200,
                        data: result.filter((item) => item !== null)
                    })
                }
            })
            // const value = JSON.parse('{"id":1234,"cmd":"add","name":"led","paras":"none"}');
            
            // res.status(200).json(result.data)
        } 
        catch (error) {
            console.log(error);
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
                res.status(200).json({
                    status: 200,
                    data: result
                })
            })
            .catch(err => console.log(err));
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