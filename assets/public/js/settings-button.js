$(document).ready(function(){
    $("#energy").click(function(){
        const active = document.querySelector('#energy.active');
        if (active){
            $("#energy").removeClass("active");
        }
        else{
            $("#energy").addClass("active");
        }
    });
});

$(document).ready(function(){
    $("#left-home").click(function(){
        const active = document.querySelector('#left-home.active');
        if (active){
            $("#left-home").removeClass("active");
        }
        else{
            $("#left-home").addClass("active");
        }
    });
});

// $(document).ready(function(){
//     $("#came-home").click(function(){
//         const active = document.querySelector('#came-home.active');
//         if (active){
//             $("#came-home").removeClass("active");
//         }
//         else{
//             $("#came-home").addClass("active");
//         }
//     });
// });

$(document).ready(function(){
    $(".nav-tabs a").click(function(){
        // alert("Hello! I am an alert box!!");
        $(this).tab('show');
    });
});

$(document).ready(function(){
    $("#nav_edit_profile").click(function(){
        // const active = document.querySelector('#edit_profile.item_active');
        // if (!active){
            $("#nav_edit_profile").addClass("item_active");
            $("#nav_myhome").removeClass("item_active");
            $("#nav_change_password").removeClass("item_active");
        // }
    });

    $("#nav_myhome").click(function(){
        $("#nav_edit_profile").removeClass("item_active");
        $("#nav_myhome").addClass("item_active");
        $("#nav_change_password").removeClass("item_active");
    });

    $("#nav_change_password").click(function(){
        $("#nav_edit_profile").removeClass("item_active");
        $("#nav_myhome").removeClass("item_active");
        $("#nav_change_password").addClass("item_active");
    });
});