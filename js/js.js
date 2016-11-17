$(document).ready(function() {
    $('.change').click(function(e) {
        e.preventDefault();
        $(this).toggleClass('changed');
        if (typeof $(this).data('original') === "undefined") {
            $(this).data('original', $(this).text());
        }
        var newText = $(this).data('changed') ? 'original' : 'hidden';
        $(this).text($(this).data(newText));
        $(this).data('changed', !$(this).data('changed'));
    });

    $('.itself').click(function(e) {
        e.preventDefault();
        $(this).parent().remove();
    })
});