// import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room, Device } from '../models/index.js';
// import { genId } from './generateID.js';
import ejs from 'ejs';
import fs from 'fs';
class SettingsController {
    show = (req, res, next) => {
        res.render('settings');
    }
    offEnergy = (req, res, next) => {
        Device.findOne({ status: true })
            .then(result => res.json(result))
            .catch(err => res.json(err))
    }
}
export default new SettingsController;