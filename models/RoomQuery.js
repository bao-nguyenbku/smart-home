import { Room } from './index.js';

export const getAllRoomWithField = (field, callback) => {
    Room.find()
        .then(result => {
            callback(null, result);
        })
        .catch(err => callback(err, null));
}

