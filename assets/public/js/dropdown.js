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
    $(this).parents('.select-room-dropdown').find('span').text($(this).text());
    $(this).parents('.select-room-dropdown').find('input').attr('value', $(this).attr('id'));
});
/*End Dropdown Menu*/