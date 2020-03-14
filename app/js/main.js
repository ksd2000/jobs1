"use strict"

function menu() {

    var clickCountM = 0;
    $(".device_menu-butn").click(function() {
        if (clickCountM == 0) {
            $(".device_menu").removeClass("no-activ");
            clickCountM = 1;
        } else {
            $(".device_menu").addClass("no-activ");
            clickCountM = 0;
        }
    });
}

function menuHead() {
    var clickCountMHead = 0;
    $(".header_menu-butn").click(function() {
        if (clickCountMHead == 0) {
            $(".header_menu").removeClass("no-activ");
            clickCountMHead = 1;
        } else {
            $(".header_menu").addClass("no-activ");
            clickCountMHead = 0;
        }
    });
}

$(function() {
    menu();
    menuHead();
    });

$("#sl-btn>a").click( function () {         //слайдер
    $("#sl-btn>a").removeClass("current");
    $(this).addClass("current");
    $(".device_slider_action").hide();
    var  t_content=$(this).attr("href");
    $(t_content).show();
    $("#sl-btn>a").removeClass("activ")
    $(this).addClass("activ");
    return false
})
$("#sl-btn>a:first").trigger("click");
