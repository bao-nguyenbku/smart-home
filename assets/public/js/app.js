// const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Global method
const milisecondToHour = (time) => {
    const second = parseInt(time / 1000) % 60;
    const minute = parseInt(time / 60000) % 60;
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
    $('.table-of-device-container .table-pagination > p').text(`page ${page} of ${numOfPage}`);
    $('.table-of-device-container .table-pagination > p').data('page', page);
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
    popMessage = (message) => {
        Toastify({
            duration: 3000,
            // destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            className: 'custom-toast',
            text: message
        }).showToast();
    }
    
    constructor() {
        this.handleSidebarActive();
        this.handleAddRoom();
        this.handleSelectRoom();
        this.handleOffEnergy();
        this.handleEditDevice();
        if (window.location.pathname.split('/').includes('login')) {
            this.handleLogin();
        }
        if (window.location.pathname.split('/').includes('statistics')) {
            this.handleTableDeviceInStatistic();
        }
    }

    handleOffEnergy = () => {
        $('#energy').on('click', () => {
            $.ajax({
                url: '/settings/offEnergy',
                method: 'GET',
                success: (res) => {
                    // Not modified
                    if (res.status === 304) {
                        const message = 'Tất cả thiết bị đang tắt';
                        this.popMessage(message);
                    }
                    else if (res.status === 200) {
                        const message = 'Đã tắt toàn bộ thiết bị';
                        this.popMessage(message);
                    }
                }
            })
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
        const selectRoomBtn = $('#select-room-dropdown-menu');
        if (selectRoomBtn) {
            selectRoomBtn.on('change', (e) => {
                const currentRoom = selectRoomBtn.children('option').filter(':selected').text().trim().toLowerCase().split(' ').join('-');
                window.location.href = `/?room=${currentRoom}`;
            });
        }
    }
    getCurrentSelectRoom = () => document.querySelector('#select-room-dropdown-menu').value;

    handleAddNewDevice = () => {
        $('.find-new-device').on('click', () => {
            $('.find-new-device').css('display', 'none');
            $('#exampleModal .loading').css('display', 'flex');
            $.ajax({
                url: '/find-new-device',
                method: 'GET',
                dataType: 'json',
                success: (res) => {
                    if (res.status === 404) {
                        let notFound = `<div class="new-device-found">
                                            <p>${res.message}</p>
                                        </div>`
                        $('#exampleModal .loading').css('display', 'none');
                        $('#exampleModal .new-device-found').css('display', 'flex');
                        $('#exampleModal .new-device-found-container').append(notFound);
                        return;
                    }
                    else if (res.status === 200) {
                        let ports = `<select class="form-select" aria-label="Default select example" name="port">
                                    <option selected disabled>Select a port to connect</option>`;
                        res.data.forEach(data => {
                            ports += `<option value="${data.port}">Port ${data.port}</option>`
                        })
                        ports += `</select>`
                        let deviceType = `<select class="form-select" aria-label="Default select example" name="deviceType">
                                            <option selected>Select a device type</option>
                                            <option value="led">light</option>
                                            <option value="fan">fan</option>
                                          </select>`;
                        let nameAndSubmit = `<div class="input-group mb-3">
                        <span class="input-group-text" id="inputGroup-sizing-default">Name of new device</span>
                        <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" name="deviceName">
                        </div><button type="submit" class="my-btn">Add this device</button>`;

                        const disableLoading = () => {
                            setTimeout(() => {
                                $('#exampleModal .loading').css('display', 'none');
                                $('#exampleModal #add-new-device-form').css('display', 'flex');
                                $('#exampleModal .new-device-found-container #add-new-device-form').append(ports);
                                $('#exampleModal .new-device-found-container #add-new-device-form').append(deviceType);
                                $('#exampleModal .new-device-found-container #add-new-device-form').append(nameAndSubmit);
                                listenToSubmit();
                            }, 1000)
                        }
                        disableLoading();
                        const listenToSubmit = () => {
                            const addNewDeviceForm = $('#add-new-device-form');
                            addNewDeviceForm.on('submit', (e) => {
                                e.preventDefault();
                                console.log(e);
                                const data = addNewDeviceForm.serializeArray();
                                const roomId = parseInt(this.getCurrentSelectRoom());
                                const deviceId = parseInt(data[0].value);
                                const deviceName = data[2].value;
                                const deviceType = data[1].value;
                                $.ajax({
                                    url: '/device/add',
                                    method: 'POST',
                                    data: {
                                        deviceName: deviceName,
                                        deviceId: deviceId,
                                        deviceType: deviceType,
                                        roomId: roomId
                                    },
                                    dataType: 'json',
                                    success: (result) => {
                                        if (result.status === 200) {
                                            location.reload();
                                        }
                                        else if (result.status === 404) {
                                            this.popMessage(result.message + '. Please try again');
                                        }
                                        else if (result.status === 500) {
                                            this.popMessage(result.message);
                                        }
                                    }
                                })
                            })
                        }
                    }
                }
            })
        })
    }
    // updateTempAndHumi = () => {
    //     setTimeout(() => {
    //         // get time at 2 minutes ago
    //         const previous = new Date(Date.now() - 2 * 60 * 1000);
    //         $.ajax({
    //             // url: `https://io.adafruit.com/api/v2/kimhungtdblla24/feeds/ttda-cnpm-ha2so/data`,
    //             url: `https://io.adafruit.com/api/v2/kimhungtdblla24/feeds/ttda-cnpm-ha2so/data?limit=5&start_time=${previous.toISOString()}`,
    //             method: 'GET',
    //             success: (result) => {
    //                 if (result.length !== 0) {
    //                     result.forEach(data => {
    //                         try {
    //                             const lastData = JSON.parse(data.value);
    //                             if (lastData.name === 'TempHumi') {
    //                                 const paras = lastData.paras.slice(1, lastData.paras.length - 1).split(',');
    //                                 $('.temp-and-humi-container .temp-container p:nth-child(2)').html(`${parseInt(paras[0])}<span>o</span> C`);
    //                                 $('.humidity-container p:nth-child(2)').html(`${parseInt(paras[1])}%`);
    //                                 this.updateTempAndHumi();
    //                             }
    //                         } catch (error) {
    //                             return;
    //                         }
    //                     })
    //                 }
    //             }
    //         })
    //     }, 3000)
    // }
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
        let pages = devices.length < 4 ? 1 : parseInt(devices.length / 4) + 1;
        const devicePerPage = getDevicesPerPage(1, devices);
        renderTable(1, pages, devicePerPage);

        $('.table-of-device-container .table-pagination .back').on('click', () => {
            const page = parseInt($('.table-of-device-container .table-pagination > p').data('page'));
            if (page !== 1) {
                const devicePerPage = getDevicesPerPage(page - 1, devices);
                renderTable(page - 1, pages, devicePerPage);
            }
        })
        $('.table-of-device-container .table-pagination .forward').on('click', () => {
            const page = parseInt($('.table-of-device-container .table-pagination > p').data('page'));
            if (page !== pages) {
                const devicePerPage = getDevicesPerPage(page + 1, devices);
                renderTable(page + 1, pages, devicePerPage);
            }
        })

    }

    handleEditDevice = () => {
        $$('.bottom-info-edit .dropdown-menu-edit li').forEach(li => {
            li.addEventListener('click', () => {
                const deviceId = parseInt(li.dataset.id);
                const typ = li.dataset.type;
                if (typ === 'delete') {
                    if (confirm('Do you want to delete this device?')) {
                        $.ajax({
                            url: '/device/delete',
                            method: 'POST',
                            data: { id: deviceId },
                            dataType: 'json',
                            success: (res) => {
                                if (res.status == 200) {
                                    location.reload();
                                }
                            }
                        })
                    }
                }
                else if (typ === 'edit') {
                    console.log('Edit');
                    const deviceNameInput = $('.bottom-info .bottom-info-device-name > input');
                    deviceNameInput.prop('disabled', false);
                    deviceNameInput.focus();
                    deviceNameInput.on('focusout', (e) => {
                        if (confirm('Save your edited?')) {
                            const newDeviceName = e.target.value;
                            console.log(newDeviceName, deviceNameInput.data('id'));
                            $.ajax({
                                url: '/device/edit',
                                method: 'POST',
                                data: { 
                                    deviceId: deviceNameInput.data('id'),
                                    deviceName: newDeviceName
                                },
                                success: (res) => {
                                    console.log(res);
                                    if (res.status === 200) {
                                        deviceNameInput.prop('disabled', true);
                                        this.popMessage(res.message);
                                    }
                                }
                            })
                        }
                        else {
                            deviceNameInput.prop('disabled', true);
                        }
                    })
                }
            })
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


