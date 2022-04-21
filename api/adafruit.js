const url = 'https://io.adafruit.com/api/v2/kimhungtdblla24/feeds/ttda-cnpm-ha2so/data';
import axios from "axios";
import { genId }  from '../controllers/generateID.js';
class AdaFruitAPI {
    getFeedData = async (limit = 10, end_time = new Date()) => {
        // return await axios.get(`${url}?limit=${limit}&end_time=${end_time}`);
        return {
            data: [
                {
                    "id": "0EZV498YK84Q0X8EEX5BVNM0FN",
                    "value": "{\"id\":-1,\"cmd\":\"close\",\"name\":\"none\",\"paras\":\"none\"}",
                    "feed_id": 1846206,
                    "feed_key": "ttda-cnpm-so2ha",
                    "created_at": "2022-03-31T16:42:45Z",
                    "created_epoch": 1648744965,
                    "expiration": "2022-04-30T16:42:45Z"
                },
            ]
        }
    }

    
}
export default new AdaFruitAPI;
