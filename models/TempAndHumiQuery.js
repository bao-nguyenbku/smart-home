export const getTempAndHumi = (callback) => {
    const temp = Math.random() * 40;
    const humi = Math.random() * 100;
    callback(null, { temp: temp, humidity: humi });
}

