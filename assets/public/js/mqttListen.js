
class Adafruit {
    options = {
        username: 'kimhungtdblla24',
        clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8)
    }
    HOST = 'io.adafruit.com/kimhungtdblla24'
    PORT = 443
    client = undefined
    // client = mqtt.connect(`wss://${this.HOST}:${this.PORT}`, this.options)
    topicReq = 'kimhungtdblla24/feeds/ttda-cnpm-so2ha'
    topicRes = 'kimhungtdblla24/feeds/ttda-cnpm-ha2so'

    constructor() {
        $.ajax({
            url: '/adafruit-key',
            method: 'get',
            success: (res) => {
                if (res.status === 200) {
                    this.options.password = res.key;
                    this.client = mqtt.connect(`wss://${this.HOST}:${this.PORT}`, this.options);
                    this.client.on('connect', () => {
                        console.log('Connected to adafruit');
                        this.client.subscribe([this.topicRes], () => {
                            console.log(`Subscribed to ${this.topicRes}`);
                        })
                    })
                    this.client.on('error', (err) => {
                        console.log(err);
                        this.client.reconnect();
                    })
                    this.client.on('message', (topicRes, payload) => {
                        const feedData = payload.toString();
                        console.log('Received Message from:', topicRes, feedData);
                        try {
                            const value = JSON.parse(feedData);
                            
                            if (value.cmd === 'close' && this.event.hasOwnProperty('currentTarget') && this.event.currentTarget.id === 'energy') {
                                this.turnOffEnergy(value);
                            }
                            else if (value.cmd === 'open' || value.cmd === 'close') {
                                this.toggleDevice(value);
                            }
                            else if (value.cmd === 'update' && value.id === -1) {
                                this.restartServer();
                            }
                            else if (value.cmd === 'add') {
                                this.listenAddDevice(value);
                            }
                            else if (value.cmd === 'del') {
                                this.listenDeleteDevice(value);
                            }
                            else if (value.cmd === 'info' && value.name === 'TempHumi') {
                                this.updateTempHumi(value);
                            }
                        } catch (error) {
                            console.log(error);
                            return;
                        }
                    })
                }
                else {
                    throw new Error('Something went wrong while connecting to adafruit.');
                }
            }
        })
    
        this.handleAddNewDevice();
        this.handleToggleDevice();
        this.setTempAndHumi();
        this.deleteDevice();
        this.handleOffEnergy();
    }
    appDevice = {
        id: -1,
        name: '',
        type: '',
        roomId: -1,
        status: false
    }
    adaDevice = {
        id: -1,
        cmd: '',
        name: '',
        paras: ''
    }
    event = ''
    countDevice = 0
    turnOffEnergy = (value) => {
        if (value.paras === 'success') {
            $.ajax({
                url: '/device/toggle',
                method: 'post',
                data: {
                    deviceId: value.id,
                    deviceType: value.name,
                    status: false
                },
                success: (res) => {
                    console.log(res);
                    this.countDevice++;
                    this.popMessage(`Đã tắt ${this.countDevice} thiết bị`);
                }
            })
        }
        return;
    }
    handleOffEnergy = () => {
        $('#energy').on('click', (e) => {
            console.log('Clicked');
            this.event = e;
            $.ajax({
                url: '/device/active',
                method: 'GET',
                success: (res) => {
                    // Not modified
                    if (res.status === 200) {
                        res.data.forEach(item => {
                            const adaDevice = {
                                id: item.id,
                                cmd: 'close',
                                name: item.type,
                                paras: 'none'
                            }
                            console.log(adaDevice);
                            this.client.publish(this.topicReq, `${JSON.stringify(adaDevice)}`, { qos: 0, retain: true }, (err) => {
                                if (err) throw new Error(err);
                                console.log('Sent turn off device request successfully!');
                            })
                        })
                    }
                }
            })
        })
    }
    listenDeleteDevice = (value) => {
        if (value.id === this.adaDevice.id && value.cmd === 'del' && value.paras === 'success') {
            $.ajax({
                url: '/device/delete',
                method: 'POST',
                data: { id: this.adaDevice.id },
                dataType: 'json',
                success: (res) => {
                    if (res.status == 200) {
                        location.reload();
                    }
                }
            })
        }
    }
    deleteDevice = () => {
        $('.bottom-info-edit .dropdown-menu-edit li').each((index, li) => {
            li.onclick = (e) => {
                const deviceId = parseInt(li.dataset.id);
                const deviceType = li.dataset.dtype;
                const typ = li.dataset.type;
                if (typ === 'edit') {
                    const deviceNameInput = li.parentElement.parentElement.parentElement.firstElementChild.firstElementChild;
                    deviceNameInput.disabled = false;
                    deviceNameInput.focus();
                    $('.bottom-info').find(deviceNameInput).one('focusout', (e) => {
                        if (confirm('Save your edited?')) {
                            const newDeviceName = e.target.value;
                            $.ajax({
                                url: '/device/edit',
                                method: 'POST',
                                data: {
                                    deviceId: deviceNameInput.dataset.id,
                                    deviceName: newDeviceName
                                },
                                success: (res) => {
                                    if (res.status === 200) {
                                        deviceNameInput.disabled = true;
                                        this.popMessage(res.message);
                                    }
                                }
                            })
                        }
                        else {
                            deviceNameInput.disabled = true;
                        }
                    });
                }
                else if (typ === 'delete') {
                    if (confirm('Do you want to delete this device?')) {
                        this.adaDevice.id = deviceId;
                        this.adaDevice.cmd = 'del';
                        this.adaDevice.name = deviceType;
                        this.adaDevice.paras = 'none';
                        this.client.publish(this.topicReq, `${JSON.stringify(this.adaDevice)}`, { qos: 0, retain: true }, (err) => {
                            if (err) {
                                console.log('From delete new device: ', err);
                            }
                            else {
                                console.log('Success to sent delete device');
                            }
                        })
                    }
                }
                $('.bottom-info-edit .dropdown-menu-edit li').off(e);
            }
        });
    }
    toggleDevice = (value) => {
        if (value.id === this.adaDevice.id
            && value.cmd === this.adaDevice.cmd
            && value.name === this.adaDevice.name
            && value.paras === 'success') {
            console.log(value);
            $.ajax({
                url: '/device/toggle',
                method: 'post',
                data: {
                    deviceId: this.adaDevice.id,
                    deviceType: this.adaDevice.name,
                    status: value.cmd === 'open' ? true : false
                },
                success: (res) => {
                    console.log(res);
                    const message = this.event.children[1].children[0].children[0].value + ' đã được ' + (value.cmd === 'open' ? 'mở' : 'tắt');
                    this.popMessage(message);
                    this.event.classList.toggle('device-item-active');
                    this.loading(0);
                }
            })
        }
        return;
    }
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
    loading = (type = true) => {
        if (type) {
            $('.wrapper > .wrapper-loading').css('display', 'flex');
        }
        else {
            $('.wrapper > .wrapper-loading').css('display', 'none');
        }
    }
    getCurrentSelectRoom = () => document.querySelector('#select-room-dropdown-menu').value;
    restartServer = () => {
        console.log('Received message from ListenRestartServer:', this.topicRes);
        $.ajax({
            url: '/device/all',
            method: 'get',
            success: (res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const restartInfo = {
                        id: [],
                        cmd: 'update',
                        name: [],
                        paras: []
                    }
                    for (let i = 0; i < data.length; i++) {
                        restartInfo.id.push(parseInt(data[i].id));
                        restartInfo.name.push(data[i].type);
                        restartInfo.paras.push(data[i].status === true ? 1 : 0);
                    }
                    this.client.publish(this.topicReq, `${JSON.stringify(restartInfo)}`, { qos: 0, retain: true }, (err) => {
                        if (err) console.log(err);
                        else {
                            console.log('Sent device status to restart successfully');
                            return;
                        }
                    })
                }
            }
        })
    }
    listenAddDevice = (value) => {
        if (value.id === this.adaDevice.id
            && value.cmd === 'add'
            && value.name === this.adaDevice.name
            && value.paras === 'success') {
            $.ajax({
                url: '/device/add',
                method: 'post',
                data: {
                    deviceName: this.appDevice.name,
                    deviceId: value.id,
                    deviceType: value.name,
                    roomId: this.appDevice.roomId
                },
                success: (res) => {
                    console.log(res);
                    this.loading(0);
                    // $('.wrapper + .wrapper-loading').css('display', 'none');
                    location.reload();
                }
            })
        }
    }
    setTempAndHumi = () => {
        $('.temp-and-humi-container .temp-container p:nth-child(2)').html(`${localStorage.getItem('temp') ? localStorage.getItem('temp') : '--'}<span>o</span> C`);
        $('.temp-and-humi-container .humidity-container p:nth-child(2)').html(`${localStorage.getItem('humi') ? localStorage.getItem('humi') : '--'}%`);
    }
    updateTempHumi = (value) => {
        if (value) {
            localStorage.setItem('temp', parseInt(value.paras[0]));
            localStorage.setItem('humi', parseInt(value.paras[1]));
            console.log(value);
            this.setTempAndHumi();
        }
    }
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

                        // This function is used to disable loading icon on page
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
                                const data = addNewDeviceForm.serializeArray();
                                const roomId = parseInt(this.getCurrentSelectRoom());
                                const deviceId = parseInt(data[0].value);
                                const deviceName = data[2].value;
                                const deviceType = data[1].value;
                                this.adaDevice.id = deviceId;
                                this.adaDevice.cmd = 'add';
                                this.adaDevice.name = deviceType;
                                this.adaDevice.paras = 'none';

                                this.appDevice.id = deviceId;
                                this.appDevice.name = deviceName;
                                this.appDevice.type = deviceType;
                                this.appDevice.roomId = roomId;
                                this.loading();
                                // $('.wrapper > .wrapper-loading').css('display', 'flex');
                                this.client.publish(this.topicReq, `${JSON.stringify(this.adaDevice)}`, { qos: 0, retain: true }, (err) => {
                                    if (err) {
                                        console.log('From add new device: ', err);
                                    }
                                    else {
                                        console.log('Success to sent add new device');
                                    }
                                })
                            })
                        }
                    }
                }
            })
        })
    }
    handleToggleDevice = () => {
        document.querySelectorAll('.device-list .device-item').forEach((item) => {
            if (item.dataset.item !== 'add') {
                item.children[0].children[1].children[0].addEventListener('change', (e) => {
                    this.loading();
                    const deviceId = item.dataset.id;
                    const deviceType = item.dataset.type;
                    const status = e.target.checked;
                    this.adaDevice.id = parseInt(deviceId);
                    this.adaDevice.cmd = status === true ? 'open' : 'close';
                    this.adaDevice.name = deviceType;
                    this.adaDevice.paras = 'none';
                    this.event = item;
                    this.client.publish(this.topicReq, `${JSON.stringify(this.adaDevice)}`, { qos: 0, retain: true }, (err) => {
                        if (err) console.log(err);
                        else console.log('Success from toggle device publish');
                    })
                })
            }
        })
    }
}

const adaMqtt = new Adafruit();