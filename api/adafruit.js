const url = 'https://io.adafruit.com/api/v2/kimhungtdblla24/feeds/ttda-cnpm-ha2so/data';
import axios from "axios";
class AdaFruitAPI {
    getNewDevice = async (end_time = new Date()) => {
        const limit = 10;
        return await axios.get(`${url}?limit=${limit}&end_time=${end_time}`);
        // const result = {
        //     data: [
        //         {              
        //             "id": "0EZV49AXP149NG2T555BM41BEK",
        //             "value": `{\"id\":${genId()},\"cmd\":\"add\",\"name\":\"led\",\"paras\":\"none\"}`,
        //             "feed_id": 1846206,
        //             "feed_key": "ttda-cnpm-so2ha",
        //             "created_at": "2022-03-31T16:42:52Z",
        //             "created_epoch": 1648744972,
        //             "expiration": "2022-04-30T16:42:52Z"
        //         },
        //         {
        //             "id": "0EZV498YK84Q0X8EEX5BVNM0FN",
        //             "value": "{\"id\":1,\"cmd\":\"close\",\"name\":\"led\",\"paras\":\"none\"}",
        //             "feed_id": 1846206,
        //             "feed_key": "ttda-cnpm-so2ha",
        //             "created_at": "2022-03-31T16:42:45Z",
        //             "created_epoch": 1648744965,
        //             "expiration": "2022-04-30T16:42:45Z"
        //         },
        //     ]
        // }
    }
}
export default new AdaFruitAPI;
