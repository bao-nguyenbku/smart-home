// import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room, Device } from '../models/index.js';
// import { genId } from './generateID.js';

class SettingsController {
    show = (req, res, next) => {
        res.render('settings');
    }
    offEnergy = (req, res, next) => {
        Device.find({ status: true })
            .then(result => {
                // No device turned on
                if (result.length == 0) {
                    res.status(200).json({
                        status: 304
                    })
                }

                for (let i = 0; i < result.length; i++){      
                    const currentTime = new Date();
                    const usedTime = currentTime - result[i].lastUse;
                    const lastDuration = result[i].duration;
                    const deviceId = result[i].id;
                    Device.findOneAndUpdate({ id: deviceId }, { 
                        duration: usedTime + lastDuration,
                        status: false
                    }).then(result2 => {
                        const device = {
                            id: deviceId,
                            // cmd: status ? 'open' : 'close',
                            name: result.type,
                            paras: 'none'
                        }
                    }).catch(err => res.json(err))
                }
                res.status(200).json({
                    status: 200
                })
            }).catch(err => res.json(err))
    }
}
export default new SettingsController;