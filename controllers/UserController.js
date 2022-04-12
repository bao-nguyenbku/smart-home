// import client, { topicRes, topicReq } from '../mqtt/index.js';
import { Room, Device, User } from '../models/index.js';
import { genId } from './generateID.js';
import bcrypt from 'bcrypt';
import env from 'dotenv';
env.config();
class UserController {
    show = (req, res, next) => {
        // const salt = parseInt(process.env.saltRounds);
        // bcrypt.hash('adminS1', salt, (err, result) => {
        //     console.log('From load: ',result);
        // })
        res.render('partials/login', {
            layout: 'layouts/login.ejs',
            message: ''
        })
    }
    login = (req, res, next) => {
        const { email, password } = req.body;
        User.find({ email: email })
            .then(result => {
                bcrypt.compare(password, result[0].password, (err, isTrue) => {
                    if (isTrue) {
                        const user = {
                            name: result[0].name,
                            email: result[0].email
                        }
                        req.session.user = user;
                        res.redirect('/');
                    }
                    else if (!isTrue) {
                        res.render('partials/login', { layout: 'layouts/login.ejs', message: 'Password is incorrect!' });
                    }
                    if (err) console.log(err);
                })
            })
            .catch(err => console.log(err))

        // console.log(email, password);
    }
    logout = (req, res, next) => {
        res.send('Logout');
    }
} 
export default new UserController;