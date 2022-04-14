// const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Global method
// devices: Array(8)
// 0: {_id: '6244053e840a9faf0b473eea', id: 2022330142238, name: 'Đèn trần', status: true, type: 'led', …}
// 1: {_id: '62440554840a9faf0b473eef', id: 202233014230, name: 'Đèn góc bếp', status: false, type: 'led', …}
// 2: {_id: '62441fc83d8220fcc91220d2', id: 2022330161552, name: 'Đèn sau', status: true, type: 'led', …}
// 3: {_id: '62442ac8d53150160bacc01e', id: 202233017248, name: 'Đèn chùm', status: true, type: 'led', …}
// 4: {_id: '62451e21a53d7dd1d85c28a0', id: 202233110215, name: 'Đèn chân tủ', status: false, type: 'led', …}
// 5: {_id: '624673df394ce8cfa456b34f', id: 202241103911, name: 'Đèn toilet', status: false, type: 'led', …}
// 6: {_id: '624674453e74511028ec8d27', id: 202241104053, name: 'Đèn nhà xe', status: true, type: 'led', …}
// 7: {_id: '624b083a1cc083410a96ba6d', id: 20224422114, name: 'Đèn nhà tắm', status: false, type: 'led', …}
// length: 8
// [[Prototype]]: Array(0)
// rooms: Array(5)
// 0: {_id: '624281390ee4e33c6fffb543', id: 202232910475, name: 'Kitchen', createdAt: '2022-03-29T03:47:05.527Z', updatedAt: '2022-03-29T03:47:05.527Z', …}
// 1: {_id: '6242817bafae31267e86b6ab', id: 2022329104811, name: 'Living room', createdAt: '2022-03-29T03:48:11.493Z', updatedAt: '2022-03-29T03:48:11.493Z', …}
// 2: {_id: '6242d14069034d38f754f7c6', id: 2022329162832, name: 'Toilet', createdAt: '2022-03-29T09:28:32.148Z', updatedAt: '2022-03-29T09:28:32.148Z', …}
// 3: {_id: '62430f1044a66a5ce52aafc4', id: 2022329205216, name: 'Garage', createdAt: '2022-03-29T13:52:17.001Z', updatedAt: '2022-03-29T13:52:17.001Z', …}
// 4: {_id: '62451e5ca53d7dd1d85c28a8', id: 202233110224, name: 'Bathroom', createdAt: '2022-03-31T03:22:04.131Z', updatedAt: '2022-03-31T03:22:04.131Z', …}
const  milisecondToHour = (time) => {
    const second = parseInt(time / 1000);
    const minute = parseInt(time / 60000);
    const hour = parseInt(time / 3600000);
    return {
        str: `${hour}:${minute}:${second}`,
        hour: parseFloat(time / 3600000)
    };
}
const renderTable = (page, numOfPage, devices) => {
    let row = '';
    
    devices.forEach(device => {
        timeUsed = milisecondToHour(device.duration);
        row += `
            <tr>
                <td scope="row">${device.name}</td>
                <td>${device.roomName}</td>
                <td>${timeUsed.str}</td>
                <td>${(Math.round(timeUsed.hour * device.capacity * 0.001 * 100) / 100).toFixed(2)}</td>
                <td><span class="badge bg-success">active</span></td>
            </tr>
            `
    });
    $('#table-of-device tbody').html(row);
    $('.table-of-device .table-pagination > p').text(`page ${page} of ${numOfPage}`);
    $('.table-of-device .table-pagination > p').data('page', page);
}
const getDevicesPerPage = (page, devices) => {
    const itemPerPage = 4;
    let idx = 0;
    while (page > 1) {
        idx += 4;
        page--;
    }
    const devicePerPage = devices.slice(idx, idx + 4);
    return devicePerPage;
}
const addRoomToDevice = (rooms, devices) => {
    let hashRoom = {};
    rooms.forEach((room, index) => {
        hashRoom[room.id] = room.name;
    });
    const newDevices = devices.map((device) => {
        return {
            ...device,
            roomName: hashRoom[device.roomId]
        }
    })
    return newDevices;
}
const validatePassword = (password) => {
    const lower = /[a-z]/g;
    const upper = /[A-Z]/g;
    const number = /[0-9]/g;
    if (password.search(lower) === -1 || password.search(upper) === -1 || password.search(number) === -1) {
        return 'Password must contain lower-case, upper-case and number characters';
    }
    else {
        return 'OK';
    }
}
// App will execute all operation in smart home pages
class App {
    constructor() {
        this.handleMainControl();
        this.handleSidebarActive();
        this.handleAddRoom();
        this.handleAddNewDevice();
        this.handleSelectRoom();
        this.handleToggleDevice();
        this.updateTempAndHumi();
        this.handleOffEnergy();
        if (window.location.pathname.split('/').includes('login')) {
            this.handleLogin();
        }
        if (window.location.pathname.split('/').includes('statistics')) {
            this.handleTableDeviceInStatistic();
        }
    }
    handleOffEnergy = () => {
        $('#setting-energy').on('click', () => {
            $.ajax({
                url: '/settings/offEnergy',
                method: 'GET',
                success: (res) => {
                    console.log(res);
                }
            })
            console.log('Clicked');
        })
    }
    handleLogin = () => {
        document.querySelector('#login-form').onsubmit = (e) => {
            e.preventDefault();
            const email = e.target[0].value;
            const password = e.target[1].value;
            const message = validatePassword(password);
            if (message === 'OK') {
                document.querySelector('#login-form').submit();
            }
            else {
                document.querySelector('#login-form .login-field:nth-child(2)').classList.add('login-field-error');
                document.querySelector('#login-form .error-message').textContent = message;
                document.querySelector('#login-form .error-message').style.display = 'block';

            }
            console.log(email, password);
        }
    }
    handleMainControl = () => {
        const handleSlider = () => {
            const slider = document.querySelector('div.slider');
            if (slider) {
                slider.addEventListener('mousedown', mouseDown, false);
                window.addEventListener('mouseup', mouseUp, false);
            }
        }

        const mouseUp = () => {
            window.removeEventListener('mousemove', divMove, true);
        }

        const mouseDown = (e) => {
            window.addEventListener('mousemove', divMove, true);
        }

        const divMove = (e) => {
            let currentRatio = ((e.clientX - document.querySelector('div.range-background').offsetLeft) / document.querySelector('div.range-background').offsetWidth) * 100;
            currentRatio = parseInt(currentRatio);
            if (currentRatio > 100) {
                currentRatio = 100;
            }
            else if (currentRatio < 0) {
                currentRatio = 0;
            }
            document.querySelector('div.slider').dataset.after = currentRatio + '%';
            document.querySelector('div.slider').style.width = currentRatio + '%';
        }
        handleSlider();
    }
    handleSidebarActive = () => {
        const sidebarItem = $$('.sidebar-items li');
        sidebarItem.forEach((li, index) => {
            li.addEventListener('click', () => {
                for (let j = 0; j < sidebarItem.length; j++) {
                    if (sidebarItem[j].classList.contains('li-active')) {
                        sidebarItem[j].classList.remove('li-active');
                    }
                }
                // li.classList.add('li-active');
                window.localStorage.setItem('activeTab', index);
            })
        })
    }
    handleAddRoom = () => {
        const addRoomBtn = document.querySelector('#submit-add-room-button');
        if (addRoomBtn) {
            addRoomBtn.addEventListener('click', () => {
                const roomName = document.getElementById('formGroupExampleInput-room-name').value;
                document.getElementById('formGroupExampleInput-room-name').value = '';
                $.ajax({
                    url: '/room/add',
                    method: 'POST',
                    data: { name: roomName },
                    success: (res) => {
                        const option = new Option(`${res.data.name}`, `${res.data.name}`);
                        console.log(option);
                        document.getElementById('select-room-dropdown-menu').appendChild(option);
                    }
                })
            })
        }
    }

    handleSelectRoom = () => {
        const selectRoomBtn = document.querySelector('#select-room-dropdown-menu');
        if (selectRoomBtn) {
            selectRoomBtn.addEventListener('change', (e) => {
                const currentRoom = e.target.value.toLowerCase().split(' ').join('-');
                window.location.href = `/?room=${currentRoom}`;
            });
        }
    }
    getCurrentSelectRoom = () => document.querySelector('#select-room-dropdown-menu').value;

    handleAddNewDevice = () => {
        const addDeviceBtn = document.querySelector('#submit-add-device-button');
        if (addDeviceBtn) {
            addDeviceBtn.addEventListener('click', () => {
                const deviceName = document.getElementById('formGroupExampleInput-device-name').value;
                const deviceCode = document.getElementById('formGroupExampleInput-device-code').value;
                const currentRoom = this.getCurrentSelectRoom();

                $.ajax({
                    url: '/device/add',
                    method: 'POST',
                    data: {
                        deviceName: deviceName,
                        deviceCode: deviceCode,
                        room: currentRoom
                    },
                    dataType: 'json',
                    success: (result) => {
                        if (result.status === 200) {
                            // TODO: Fix this to add new device without reload page
                            location.reload();
                        }
                    }
                })
            })
        }
    }
    updateTempAndHumi = () => {
        setTimeout(() => {
            // get time at 2 minutes ago
            const previous = new Date(Date.now() - 2 * 60 * 1000);
            $.ajax({
                // url: `https://io.adafruit.com/api/v2/kimhungtdblla24/feeds/ttda-cnpm-ha2so/data`,
                url: `https://io.adafruit.com/api/v2/kimhungtdblla24/feeds/ttda-cnpm-ha2so/data?start_time=${previous.toISOString()}`,
                method: 'GET',
                success: (data) => {
                    if (data.length !== 0) {
                        const lastData = JSON.parse(data[0].value);
                        if (lastData.name === 'TempHumi') {
                            const paras = lastData.paras.slice(1, lastData.paras.length - 1).split(',');
                            $('.temp-container p:nth-child(2)').html(`${parseInt(paras[0])}<span>o</span> C`);
                            $('.humidity-container p:nth-child(2)').html(`${parseInt(paras[1])}%`);
                            this.updateTempAndHumi();
                        }
                    }
                }
            })
        }, 5000)
    }

    toggleOffEnergy = () => {
        onclick 
        $.ajax({
            url: '/settings/OffEnergy',
            method: 'GET',
            dataType: 'json',
            success: (res) => {
                console.log(res);
            }
        })
    }

    handleTableDeviceInStatistic = () => {
        // let newDevices;
        $.ajax({
            url: '/statistics/devices',
            method: 'GET',
            success: (res) => {
                const newDevices = addRoomToDevice(res.rooms, res.devices);
                this.handleChangePageInStatistic(newDevices);
            }
        })
    }
    handleChangePageInStatistic = (devices) => {
        let pages = devices.length < 4 ? 1 : parseInt(devices.length / 4) + (devices.length % 4);
        const devicePerPage = getDevicesPerPage(1, devices);
        renderTable(1, pages, devicePerPage);

        $('.table-of-device .table-pagination .back').on('click', () => {
            const page = parseInt($('.table-of-device .table-pagination > p').data('page'));
            if (page !== 1) {
                const devicePerPage = getDevicesPerPage(page - 1, devices);
                renderTable(page - 1, pages, devicePerPage);
            }
        })
        $('.table-of-device .table-pagination .forward').on('click', () => {
            const page = parseInt($('.table-of-device .table-pagination > p').data('page'));
            if (page !== pages) {
                const devicePerPage = getDevicesPerPage(page + 1, pages, devices);
                renderTable(page + 1, pages, devicePerPage);
            }
        })

    }
    handleToggleDevice = () => {
        $$('.toggle-control input').forEach(btn => {
            btn.addEventListener('change', (e) => {
                const deviceItem = e.path[3];
                const message = deviceItem.children[1].children[0].textContent + 'đã được ' + (e.target.checked ? 'mở' : 'tắt');
                Toastify({
                    text: message,
                    duration: 3000,
                    // destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    className: 'custom-toast',
                    // onClick: function(){} // Callback after click
                }).showToast();
                deviceItem.classList.toggle('device-item-active');
                if (deviceItem.dataset.item == 'light') {
                    deviceItem.children[1].children[1].textContent = deviceItem.children[1].children[1].textContent == 'Off' ? 'On' : 'Off';
                }
                else if (deviceItem.dataset.item == 'fan') {
                    deviceItem.children[1].children[1].textContent = deviceItem.children[1].children[1].textContent == 'Off' ? '1' : 'Off';
                }
            })
        })
        $$('.device-list .device-item').forEach((item) => {
            if (item.dataset.item !== 'add') {
                item.children[0].children[1].children[0].addEventListener('change', (e) => {
                    $.ajax({
                        url: '/device/toggle',
                        method: 'POST',
                        data: {
                            deviceId: item.dataset.id,
                            status: e.target.checked
                        },
                        dataType: 'json',
                        success: (res) => {
                            console.log(res);
                        }
                    })
                })
            }
        })
    }
}
// INITIAL APP
const myHome = new App();

// ================= GET TAB ACTIVE ================
window.onload = () => {
    const oldIndex = window.localStorage.getItem('activeTab');
    if (!oldIndex) {
        $$('.sidebar-items li')[0].classList.add('li-active');
    }
    $$('.sidebar-items li').forEach((li, index) => {
        if (index == oldIndex) {
            li.classList.add('li-active');
        }
    })
}


