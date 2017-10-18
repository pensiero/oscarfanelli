var Scrollbar = {

    scrollbar: $('#scrollbar'),
    scrollbarStartPosition: null,
    breakpoint1: null,
    breakpoint2: null,

    secondBreakpointSpace: 200,

    checkPosition: function() {

        var scroll = $(window).scrollTop();

        // change the scrollbar classes
        $(this.scrollbar).toggleClass('fixed', scroll >= this.scrollbarStartPosition);
        $(this.scrollbar).toggleClass('text-change', scroll >= this.breakpoint1);
        $(this.scrollbar).toggleClass('disappear', scroll >= this.breakpoint2);

        // update the counter (how many pixel left)
        $(this.scrollbar).find('.pixel-counter').html(this.breakpoint2 - scroll);
    },

    initStartPosition: function() {

        this.scrollbarStartPosition = $(this.scrollbar).position().top;
    },

    initBreakpoints: function() {

        // first breakpoint is the scrollbar start position + 500
        this.breakpoint1 = this.scrollbarStartPosition + ($('#block-intro').height() / 2);

        this.breakpoint2 = this.scrollbarStartPosition + $('#block-intro').height() - this.secondBreakpointSpace;

        if (this.breakpoint2 - this.breakpoint1 < 0) {
            this.breakpoint2 = this.breakpoint1 + 500;
        }

    },

    init: function() {

        // init start position of the scrollbar
        this.initStartPosition();

        // init breakpoints
        this.initBreakpoints();

        // check a function on scroll
        $(window).scroll(function() {
            this.checkPosition();
        }.bind(this));

    }

};

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
    });

    // scrollbar
    Scrollbar.init();
});