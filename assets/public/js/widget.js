const getMonthText = (month) => {
    switch (month) {
        case 1:
            return 'Jan';
        case 2:
            return 'Feb';
        case 3:
            return 'Mar';
        case 4:
            return 'Apr';
        case 5:
            return 'May';
        case 6:
            return 'Jun';
        case 7:
            return 'Jul';
        case 8:
            return 'Aug';
        case 9:
            return 'Sep';
        case 10:
            return 'Oct';
        case 11:
            return 'Nov';
        case 12:
            return 'Dec';
        default:
            throw new Error('Invalid month');
    }
}

const getDayText = (day) => {
    switch (day) {
        case 0:
            return 'Sun';
        case 1:
            return 'Mon';
        case 2:
            return 'Tue';
        case 3:
            return 'Web';
        case 4:
            return 'Thu';
        case 5:
            return 'Fri';
        case 6:
            return 'Sat';
        default:
            throw new Error('Invalid day of week');
    }
}
const getFeed = (hour) => {
    if (hour >= 0 && hour < 12) {
        return 'Good Morning, Sir😎';
    }
    else if (hour >= 12 && hour < 18) {
        return 'Good Afternoon, Sir😎';
    }
    else if (hour >= 18 && hour <= 23) {
        return 'Good Evening, Sir😎';
    }
}
getWidgetAndFeedFirstTime = () => {
    const currentTime = new Date();
    let hour = currentTime.getHours();
    let minute = currentTime.getMinutes();
    let day = getDayText(currentTime.getDay());
    let date = currentTime.getDate();
    let month = getMonthText(currentTime.getMonth() + 1);
    let year = currentTime.getFullYear().toString().substring(2);
    hour = hour < 10 ? `0${hour}` : hour;
    minute = minute < 10 ? `0${minute}` : minute;
    $('.clock-widget .widget-clock p:first-child').text(hour);
    $('.clock-widget .widget-clock p:last-child').text(minute);
    $('.widget-day p').text(`${day}, ${date} ${month} ${year}`);
    feedText = getFeed(hour);
    $('.main-container .main-feed .feed p:first-child').text(feedText);
}
getWidgetAndFeedFirstTime();
setInterval(() => {
    const currentTime = new Date();
    let hour = currentTime.getHours();
    let minute = currentTime.getMinutes();
    let day = getDayText(currentTime.getDay());
    let date = currentTime.getDate();
    let month = getMonthText(currentTime.getMonth() + 1);
    let year = currentTime.getFullYear().toString().substring(2);
    hour = hour < 10 ? `0${hour}` : hour;
    minute = minute < 10 ? `0${minute}` : minute;
    $('.clock-widget .widget-clock p:first-child').text(hour);
    $('.clock-widget .widget-clock p:last-child').text(minute);
    $('.widget-day p').text(`${day}, ${date} ${month} ${year}`);
}, 1000)

setInterval(() => {
    const currentTime = new Date();
    let hour = currentTime.getHours();
    feedText = getFeed(hour);
    $('.main-container .main-feed .feed p:first-child').text(feedText);
}, 3600)

