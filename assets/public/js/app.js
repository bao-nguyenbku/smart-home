// const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Global method
const addRoomToDevice = (rooms, devices) = {
    
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
        if (window.location.pathname.split('/').includes('statistics')) {
            this.handleTableDeviceInStatistic();
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

    handleTableDeviceInStatistic = () => {
        $.ajax({
            url: '/statistics/devices',
            method: 'GET',
            success: (res) => {
                console.log(res);
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


