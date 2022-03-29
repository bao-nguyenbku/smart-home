// import client, { topicRes, topicReq } from '../mqtt/index.js';
// import { Room } from '../models/index.js';
// import { genId } from './generateID.js';
import ejs from 'ejs';
import fs from 'fs';
class SettingsController {
    show = (req, res, next) => {
        res.render('settings');
    }
    
}
export default new SettingsController;