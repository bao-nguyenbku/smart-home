
class Adafruit {
    options = {
        username: 'kimhungtdblla24',
        password: 'aio_tbrk84qNuBNK0gmKIzJosdwwKSKI',
        clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8)
    }
    HOST = 'io.adafruit.com/kimhungtdblla24'
    PORT = 443
    client = mqtt.connect(`ws://${this.HOST}:${this.PORT}`, this.options)
    topicReq = 'kimhungtdblla24/feeds/ttda-cnpm-so2ha'
    topicRes = 'kimhungtdblla24/feeds/ttda-cnpm-ha2so'

    adaDevice = {
        id: -1,
        cmd: '',
        name: '',
        paras: ''
    }
    eventTarget = ''
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
                    status: this.adaDevice.cmd === value.cmd
                },
                success: (res) => {
                    console.log(res);
                    this.eventTarget;
                    const message = this.eventTarget.children[1].children[0].children[0].value + ' đã được ' + (value.cmd === 'open' ? 'mở' : 'tắt');
                    this.popMessage(message);
                    this.eventTarget.classList.toggle('device-item-active');
                    this.loading(0);
                }
            })
        }
        return;
    }

    constructor() {
        this.client.on('connect', () => {
            console.log('Connected to adafruit');
            this.client.subscribe([this.topicRes], () => {
                console.log(`Subscribed to ${this.topicRes}`);
            })
        });
        this.client.on('message', (topicRes, payload) => {
            const feedData = payload.toString();
            console.log('Received Message from:', topicRes, feedData);
            try {
                const value = JSON.parse(feedData);
                this.toggleDevice(value);
            } catch (error) {
                console.log(error);
                return;
            }
        })
        // this.listenRestartServer();
        // this.handleAddNewDevice();
        this.handleToggleDevice();
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
    listenRestartServer = () => {
        // this.client.on('message', (topicRes, payload) => {
        //     const feedData = payload.toString();
        //     console.log('Received Message from ListenRestartServer:', topicRes, feedData);
        //     try {
        //         const value = JSON.parse(feedData);
        //         if (value.id === -1 && value.cmd === 'update') {
        //             $.ajax({
        //                 url: '/device/all',
        //                 method: 'get',
        //                 success: (res) => {
        //                     if (res.status === 200) {
        //                         const data = res.data;
        //                         const restartInfo = {
        //                             id: [],
        //                             cmd: 'update',
        //                             name: [],
        //                             paras: []
        //                         }
        //                         for (let i = 0; i < data.length; i++) {
        //                             restartInfo.id.push(parseInt(data[i].id));
        //                             restartInfo.name.push(data[i].type);
        //                             restartInfo.paras.push(data[i].status === true ? 1 : 0);
        //                         }
        //                         this.client.publish(this.topicReq, `${JSON.stringify(restartInfo)}`, { qos: 0, retain: true }, (err) => {
        //                             if (err) console.log(err);
        //                             else {
        //                                 console.log('Sent device status to restart successfully');
        //                                 return;
        //                             }
        //                         })
        //                     }
        //                 }
        //             })
        //         }
        //         return;
        //     }
        //     catch (error) {
        //         console.log(error);
        //         return;
        //     }
            
        // })
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
                                const adaDevice = {
                                    id: deviceId,
                                    cmd: 'add',
                                    name: deviceType,
                                    paras: 'none'
                                }
                                $('.wrapper > .wrapper-loading').css('display', 'flex');
                                // this.client.publish(this.topicReq, `${JSON.stringify(adaDevice)}`, { qos: 0, retain: true }, (err) => {
                                //     if (err) {
                                //         console.log('From mqttListen, listenToSubmit: ', err);
                                //     }
                                //     else {
                                //         this.client.on('message', (topicRes, payload) => {
                                //             const feedData = payload.toString();
                                //             try {
                                //                 const value = JSON.parse(feedData);
                                //                 if (value.id === deviceId && value.cmd === 'add' && value.name === deviceType && value.paras === 'success') {
                                //                     $.ajax({
                                //                         url: '/device/add',
                                //                         method: 'post',
                                //                         data: {
                                //                             deviceName: deviceName,
                                //                             deviceId: deviceId,
                                //                             deviceType: deviceType,
                                //                             roomId: roomId
                                //                         },
                                //                         success: (res) => {
                                //                             console.log(res);
                                //                             $('.wrapper + .wrapper-loading').css('display', 'none');
                                //                             location.reload();
                                //                         }
                                //                     })
                                //                 }
                                //             } catch (error) {
                                //                 console.log(error);
                                //                 return;
                                //             }
                                //         })
                                //     }
                                // })
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
                    this.eventTarget = item;
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