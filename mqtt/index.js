import mqtt from 'mqtt';
import env from 'dotenv';
env.config();
const HOST = process.env.IO_HOST;
const PORT = process.env.IO_PORT;
const IO_USERNAME = process.env.IO_USERNAME;
const IO_KEY = process.env.IO_KEY;
const connectUrl = `mqtt://${HOST}:${PORT}`;

// connect options
const OPTIONS = {
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    clean: true,
    connectTimeout: 4000,
    username: IO_USERNAME,
    password: IO_KEY,
    reconnectPeriod: 1000,
    protocolVersion: 4
}
export const topicReq = 'kimhungtdblla24/feeds/ttda-cnpm-so2ha';
export const topicRes = 'kimhungtdblla24/feeds/ttda-cnpm-ha2so';
let client = mqtt.connect(connectUrl, OPTIONS);

client.on('error', (error) => {
    console.log(error);
    client.end();
})
client.on('connect', () => {
    console.log('Connected');
    client.subscribe([topicRes], () => {
        console.log(`Subscribed to ${topicRes}`);
    })
})
export default client;