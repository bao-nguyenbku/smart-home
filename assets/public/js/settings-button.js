$(document).ready(function(){
    $(".nav-tabs a").click(function(){
        $(this).tab('show');
        $(this).addClass("active1")
        $("#edit_profile").removeClass("active1")
    });
});

// Hover 
$(document).ready(function(){
    $("#nav_edit_profile").click(function(){
        $("#nav_edit_profile").addClass("item_active");
        $("#nav_myhome").removeClass("item_active");
        $("#nav_change_password").removeClass("item_active");
    });

    $("#nav_myhome").click(function(){
        $("#nav_edit_profile").removeClass("item_active");
        $("#nav_myhome").addClass("item_active");
        $("#nav_change_password").removeClass("item_active");
    });
    // <%= session.user ? session.user.name '\'s House': ''%>
    $("#nav_change_password").click(function(){
        $("#nav_edit_profile").removeClass("item_active");
        $("#nav_myhome").removeClass("item_active");
        $("#nav_change_password").addClass("item_active");
    });
});


$('#form_edit_my_home').on('submit', (e) => {
    e.preventDefault();
    const data = $('#form_edit_my_home').serializeArray();
    const address = data[1].value;
    const email = data[2].value;
    $.ajax({
        url: 'settings/changeMyHome',
        method: 'POST',
        data: {address: address, email: email},
        success: (res) => {
            // document.getElementById('address').value = address;
            if (res.status === 200){
                Toastify({
                    ...this.toastOption,
                    text: res.message
                }).showToast();
            };
            // popMessage('Cập nhật thành công');
        }
    })
})
