import { topic, client } from '../mqtt/index.js';
class HomeController {
    show = (req, res, next) => {
        client.on('connect', () => {
            client.publish(topic, '0.1', { qos: 0, retain: false }, (error) => {
                if (error) {
                    console.error(error)
                }
            })
        })
        client.on('message', (topic, payload) => {
            res.json(payload.toString());
        })
    }
}
export default new HomeController;