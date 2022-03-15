const toggleBtns = document.querySelectorAll('.toggle-control input');

toggleBtns.forEach(btn => {
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