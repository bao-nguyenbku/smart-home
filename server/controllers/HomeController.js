import { topic, client } from '../mqtt/index.js';
import { Room } from '../models/index.js';
class HomeController {
    show = (req, res, next) => {
        const room = new Room({
            id: 1,
            name: 'Living room'
        });
        room.save()
            .then(result => res.send(result))
            .catch((err) => console.log(err))
        // client.on('connect', () => {
        //     client.publish(topic, '0.1', { qos: 0, retain: false }, (error) => {
        //         if (error) {
        //             console.error(error)
        //         }
        //     })
        // })
        // client.on('message', (topic, payload) => {
        //     res.json(payload.toString());
        // })
    }
}
export default new HomeController;