export const genId = () => {
    const day = new Date();
    const dayString = `${day.getFullYear()}${day.getMonth() + 1}${day.getDate()}${day.getHours()}${day.getMinutes()}${day.getSeconds()}`;
    return parseInt(dayString);
}


