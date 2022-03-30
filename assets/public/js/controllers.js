// const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// App will execute all operation in smart home pages
class App {
    constructor() {
        this.handleDevice();
        this.handleMainControl();
        this.handleSidebarActive();
        this.handleAddRoom();
        this.handleAddNewDevice();
        this.handleSelectRoom();
        
    }
    handleDevice = () => {
        $$('.toggle-control input').forEach(btn => {
            btn.addEventListener('change', (e) => {
                const deviceItem = e.path[3];
                deviceItem.classList.toggle('device-item-active');
                if (deviceItem.dataset.item == 'light') {
                    deviceItem.children[1].children[1].textContent = deviceItem.children[1].children[1].textContent == 'Off' ? 'On' : 'Off';
                }
                else if (deviceItem.dataset.item == 'fan') {
                    deviceItem.children[1].children[1].textContent = deviceItem.children[1].children[1].textContent == 'Off' ? '1' : 'Off';
                }
            })
        })
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
        document.querySelector('#submit-add-room-button').addEventListener('click', () => {
            const roomName = document.getElementById('formGroupExampleInput-room-name').value;
            document.getElementById('formGroupExampleInput-room-name').value = '';
            $.ajax({
                url: '/room/add',
                method: 'POST',
                data:{ name: roomName },
                success: (res) => {
                    const option = new Option(`${res.data.name}`, `${res.data.name}`);
                    console.log(option);
                    document.getElementById('select-room-dropdown-menu').appendChild(option);
                }
            })
        })
    }

    handleSelectRoom = () => {
        document.querySelector('#select-room-dropdown-menu').addEventListener('change', (e) => {
            const currentRoom = e.target.value;
            window.location.href = `/?roomName=${currentRoom.toLowerCase().split(' ').join('-')}`;
        });
    }
    getCurrentSelectRoom = () => document.querySelector('#select-room-dropdown-menu').value;
        
    handleAddNewDevice = () => {
        document.querySelector('#submit-add-device-button').addEventListener('click', () => {
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
            // console.log(deviceName, deviceCode);
        })
    }
}
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

// GET DATA REAL TIME ========================

const myHome = new App();
