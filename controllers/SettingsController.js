// import client, { topicRes, topicReq } from '../mqtt/index.js';
// import { Room } from '../models/index.js';
// import { genId } from './generateID.js';
class SettingsController {
    show = (req, res, next) => {
        res.render('settings');
    }
    
}
export default new SettingsController;