import mqtt from 'mqtt';
const HOST = `io.adafruit.com`;
const PORT = '1883';
const IO_USERNAME = "kimhungtdblla24";
const IO_KEY = "aio_UDSA14XHRvdTduRIlQnWGDlGVVah";
const connectUrl = `mqtt://${HOST}:${PORT}`;
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
// connect options
const OPTIONS = {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: IO_USERNAME,
    password: IO_KEY,
    reconnectPeriod: 1000,
}
export const topic = 'kimhungtdblla24/feeds/TTDA_CNPM_RQ';
export const client = mqtt.connect(connectUrl, OPTIONS);
client.on('connect', () => {
    client.subscribe([topic], () => {
        console.log(`Subscribe to ${topic}`);
    })
})