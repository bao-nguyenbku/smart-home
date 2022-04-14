// import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room, Device } from '../models/index.js';
// import { genId } from './generateID.js';
import ejs from 'ejs';
import fs from 'fs';

class SettingsController {
    show = (req, res, next) => {
        res.render('settings');
    }
    
    OffEnergy = (req, res, next) => {
        Device.find({ status: true})
            .then(result => console.log(result))
            // .then(result => 
            //     for (x in result){
            //         console.log(x)
            //     })
            .catch(err => console.log(err))
    }
}
export default new SettingsController;