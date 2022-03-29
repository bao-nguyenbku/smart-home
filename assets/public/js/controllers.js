// const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// App will execute all operation in smart home pages
class App {
    currentRoom = '';
    constructor() {
        this.handleDevice();
        this.handleMainControl();
        this.handleSidebarActive();
        this.handleAddRoom();
        this.handleAddNewDevice();
        this.renderRooms();
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
                if (li.children[0].dataset.tab == 'statistics') {
                    window.location.href = '/statistic.html';
                }
                else if (li.children[0].dataset.tab == 'dashboard') {
                    window.location.href = '/';
                }
                else if (li.children[0].dataset.tab == 'settings') {
                    window.location.href = '/settings.html';
                }
            })
        })
    }
    handleAddRoom = () => {
        document.querySelector('#submit-add-room-button').addEventListener('click', () => {
            const roomName = document.getElementById('formGroupExampleInput-room-name').value;
            document.getElementById('formGroupExampleInput-room-name').value = '';
            $.ajax({
                url: 'http://localhost:5000/room/add',
                method: 'POST',
                data:{ name: roomName },
                success: (res) => {
                    
                }
            })
        })
    }

    renderRooms = () => {
        $.ajax({
            url: 'http://localhost:5000/rooms',
            method: 'GET',
            success: (res) => {
                console.log(res);
                res.forEach((room, index) => {
                    const li = document.createElement('li');
                    li.textContent = room.name;
                    li.addEventListener('click', () => {
                        this.currentRoom = room.name;
                        console.log(this.currentRoom);
                    })
                    document.querySelector('.select-room-dropdown-menu').appendChild(li)
                })
            }
        })
    }

    handleAddNewDevice = () => {
        document.querySelector('#submit-add-device-button').addEventListener('click', () => {
            const deviceName = document.getElementById('formGroupExampleInput-device-name').value;
            const deviceCode = document.getElementById('formGroupExampleInput-device-code').value;
            $.ajax({
                url: 'http://localhost:5000/:roomName/add'
            })
            console.log(deviceName, deviceCode);
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

/*Dropdown Menu*/
$('.select-room-dropdown').click(function () {
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.select-room-dropdown-menu').slideToggle(300);
});
$('.select-room-dropdown').focusout(function () {
    $(this).removeClass('active');
    $(this).find('.select-room-dropdown-menu').slideUp(300);
});
$('.select-room-dropdown .select-room-dropdown-menu li').click(function () {
    console.log('Clicked');
    // $(this).parents('.select-room-dropdown').find('span').text('Living');
    // $(this).parents('.select-room-dropdown').find('input').attr('value', 'Living');
});
// $(this).attr('id')
/*End Dropdown Menu*/