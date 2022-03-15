const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// App will execute all operation in smart home pages
class App {
    constructor() {
        this.handleDevice();
        this.handleMainControl();
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
            $('div.slider').addEventListener('mousedown', mouseDown, false);
            window.addEventListener('mouseup', mouseUp, false);
        }

        const mouseUp = () => {
            window.removeEventListener('mousemove', divMove, true);
        }

        const mouseDown = (e) => {
            window.addEventListener('mousemove', divMove, true);
        }

        const divMove = (e) => {
            let currentRatio = ((e.clientX - $('div.range-background').offsetLeft) / $('div.range-background').offsetWidth) * 100;
            currentRatio = parseInt(currentRatio);
            if (currentRatio > 100) {
                currentRatio = 100;
            }
            else if (currentRatio < 0) {
                currentRatio = 0;
            }
            $('div.slider').dataset.after = currentRatio + '%';
            $('div.slider').style.width = currentRatio + '%';
        }
        handleSlider();
    }
    handleSidebarActive = () => {

    }
}

const myHome = new App();