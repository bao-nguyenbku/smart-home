// import client, { topicRes, topicReq } from '../mqtt/index.js';
// import { Room } from '../models/index.js';
// import { genId } from './generateID.js';
class StatisticsController {
    show = (req, res, next) => {
        res.render('statistics');
    }
    
}
export default new StatisticsController;