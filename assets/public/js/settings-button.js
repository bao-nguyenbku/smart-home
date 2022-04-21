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

    $("#nav_change_password").click(function(){
        $("#nav_edit_profile").removeClass("item_active");
        $("#nav_myhome").removeClass("item_active");
        $("#nav_change_password").addClass("item_active");
    });
});