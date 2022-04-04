// import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room, Device } from '../models/index.js';
import { genId } from './generateID.js';
class LoginController {
    show = (req, res, next) => {
        res.render('partials/login', {
            layout: 'layouts/login.ejs'
        })
    }
} 
export default new LoginController;