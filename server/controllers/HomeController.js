import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room } from '../models/index.js';
import { genId } from './generateID.js';
class HomeController {
    show = (req, res, next) => {
        const temp = {
            cmd:'info',
            name:'temp',
            paras:'none'
        }
        // client.on('connect', () => {
        //     console.log('Connected');
        //     client.publish(topicReq, `${JSON.stringify(temp)}`, { qos: 0, retain: true }, (error) => {
        //         if (error) {
        //             console.error(error)
        //         }
        //     })
        // })
        // res.json('Success');
        client.on('message', (topicRes, payload) => {
           res.json(JSON.parse(payload));
        })
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
        // Room.find({}, 'name')
        //     .then(result => {
        //         res.json(result);
        //     })
        //     .catch(err => console.log(err));
    }
}
export default new HomeController;