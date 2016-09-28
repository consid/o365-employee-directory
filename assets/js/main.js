/* ADD CLASS WEHN SCROLLING DOWN */
$(window).scroll(function() {    
    var scroll = $(window).scrollTop();
    if (scroll >= 105) {
        $(".top").addClass("active");
    } else {
        $(".top").removeClass("active");
    }
});

/* SMOOTH SCROLL */
$(document).on('click', 'a', function(event){
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 500);
});