// import client, { topicRes, topicReq } from '../mqtt/index.js';
import session from 'express-session';
import { Room, Device, User } from '../models/index.js';
// import { genId } from './generateID.js';

class SettingsController {
    show = (req, res, next) => {
        User.find()
            .then(user => {
                res.render('settings', {
                    user: user[0]
                });
            })
            .catch(err => console.log(err))
        // res.render('settings');
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
    updateProfile = (req, res, next) => {
        const {name, phone, email } = req.body;
        User.findOneAndUpdate( {email: email}, {name: name, phone: phone} )
            .then(result => {
                res.status(200).json({
                    status: 200,
                    data: result,
                    message: 'Update user successfully'
                })
            }).catch(err => console.log(err))

        // return res.redirect('/')
    }
    changeMyHome = (req, res, next) => {
        // const {nameHouse, address, email} = req.body;
        // const nameHouse = req.bosy.nameHouse;
        const address = req.body.address;
        const email2 = req.body.email2;
        console.log(address, email);
        User.findOneAndUpdate( {email: email2}, {address: address} )
            .then(result => {
                res.status(200).json({
                    status: 200,
                    data: result,
                    message: 'Update your home successfully'
                })
            }).catch(err => console.log(err))
        return res.redirect('/')
    }
}

export default new SettingsController;
