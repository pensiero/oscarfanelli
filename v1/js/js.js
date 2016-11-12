var Section = {

    // compress the section
    compress: function(section) {
        $(section).children('.section-close').fadeOut(500, function() {
            $(this).remove();
        });
        $(section).stop().animate({
            width: '50%',
            height: '50%'
        }, 500, function() {

            // put the section behind the others
            $(section).css('z-index', 1);

            // expand the action of the previously opened section
            Section.expandAction($(section).children('.section-action'));
        });
        $(section).children('.section-action').fadeIn(500);
    },

    // expand the section
    expand: function(section) {
        $(section).css('z-index', 100);
        $(section).stop().animate({
            width: '100%',
            height: '100%'
        }, 500, function() {

            // back to the home
            $(section).append($('<img />', {
                src: '/images/grid.svg',
                class: 'section-close',
                width: '50px'
            }).hide().fadeIn(500).click(function() {

                // compress the section
                Section.compress(section);
            }));
        });
        $(section).children('.section-action').fadeOut(500);
    },

    compressAction: function(action) {
        var section = $(action).parent();
        var textWrapper = $(action).find('.section-action-text > div');

        // lock the mouseover transictions on that class
        $(section).addClass('loading');

        // fade out the icon
        $(textWrapper).children('img').stop().animate({'opacity': 0}, 300, function() {

            // horizontal or vertical flow
            if ($(textWrapper).data('flow') == 'horizontal') {
                $(textWrapper).data('originalWidth', $(textWrapper).width());
                $(textWrapper).stop().animate({'width': 0}, 500);
                $(textWrapper).find('span').stop().animate({'left': -($(textWrapper).find('span').width() / 2)}, 500, function() {
                    Section.expand(section);
                });
            }
            else {
                $(textWrapper).data('originalHeight', $(textWrapper).height());
                $(textWrapper).stop().animate({'height': 0}, 500);
                $(textWrapper).find('span').stop().animate({'top': -($(textWrapper).find('span').width())}, 500, function() {
                    Section.expand(section);
                });
            }
        });
    },

    restoreIcons: function(section, textWrapper) {
        $(textWrapper).children('img').stop().animate({'opacity': 1}, 300, function() {
            $(section).removeClass('loading');
        });
    },

    expandAction: function(action) {
        var section = $(action).parent();
        var textWrapper = $(action).find('.section-action-text > div');

        // horizontal or vertical flow
        if ($(textWrapper).data('flow') == 'horizontal') {
            $(textWrapper).find('span').stop().animate({'left': 0}, 500);
            $(textWrapper).stop().animate({'width': $(textWrapper).data('originalWidth')}, 500, function() {
                Section.restoreIcons(section, textWrapper);
            });
        }
        else {
            $(textWrapper).find('span').stop().animate({'top': 0}, 500);
            $(textWrapper).stop().animate({'height': $(textWrapper).data('originalHeight')}, 500, function() {
                Section.restoreIcons(section, textWrapper);
            });
        }
    },

    init: function() {
        $('.section-action').click(function() {
            Section.compressAction(this);
        });
    }

};

$(document).ready(function() {

    Section.init();

});

(function() {

    var width, height, canvas, ctx, points, target, animateHeader = true;

    // Main
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};

        canvas = document.getElementById('stars');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create points
        points = [];
        for(var x = 0; x < width; x = x + width/20) {
            for(var y = 0; y < height; y = y + height/20) {
                var px = x + Math.random()*width/20;
                var py = y + Math.random()*height/20;
                var p = {x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for(var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if(!(p1 == p2)) {
                    var placed = false;
                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for(var i in points) {
            var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
            points[i].circle = c;
        }
    }

    // Event handling
    function addListeners() {
        if(!('ontouchstart' in window)) {
            document.getElementById('stars-wrapper').addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    // animation
    function initAnimation() {
        animate();
        for(var i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in points) {
                // detect points in range
                if(Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
            y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
            onComplete: function() {
                shiftPoint(p);
            }});
    }

    // Canvas manipulation
    function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(255,255,255,'+ p.active+')';
            ctx.stroke();
        }
    }

    function Circle(pos,rad,color) {
        var _this = this;

        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(255,255,255,'+ _this.active+')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

})();

(function() {

    var width, height, canvas, ctx, circles, target, animateHeader = true;

    // Main
    initHeader();
    addListeners();

    function initHeader() {
        width = window.innerWidth / 2;
        height = window.innerHeight / 2;
        target = {x: 0, y: height};

        canvas = document.getElementById('bubbles');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create particles
        circles = [];
        for(var x = 0; x < width*0.5; x++) {
            var c = new Circle();
            circles.push(c);
        }
        animate();
    }

    // Event handling
    function addListeners() {
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in circles) {
                circles[i].draw();
            }
        }
        requestAnimationFrame(animate);
    }

    // Canvas manipulation
    function Circle() {
        var _this = this;

        // constructor
        (function() {
            _this.pos = {};
            init();
        })();

        function init() {
            _this.pos.x = Math.random()*width;
            _this.pos.y = height+Math.random()*100;
            _this.alpha = 0.1+Math.random()*0.3;
            _this.scale = 0.1+Math.random()*0.3;
            _this.velocity = Math.random();
        }

        this.draw = function() {
            if(_this.alpha <= 0) {
                init();
            }
            _this.pos.y -= _this.velocity;
            _this.alpha -= 0.0005;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.scale*10, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(255,255,255,'+ _this.alpha+')';
            ctx.fill();
        };
    }

})();