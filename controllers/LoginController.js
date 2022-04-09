// import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room, Device } from '../models/index.js';
import { genId } from './generateID.js';
class LoginController {
    show = (req, res, next) => {
        res.render('partials/login', {
            layout: 'layouts/login.ejs'
        })
    }
    loginUser = (req, res, next) => {
        const { email, password } = req.body;
        console.log(email, password);
    }
} 
export default new LoginController;