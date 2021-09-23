var $sections = new Array();


function setDiagonalsSize(container){
    var parent = container.parent();
    var width = Math.sqrt(Math.pow(parent.height(), 2) + Math.pow(parent.width(), 2));
    var pattern = /\d+/g;
    var percentage = container.attr("class").toString().split(' ')[0].match(pattern);
    var extra = (parseInt(percentage) / 100) * parent.width();

    container.width(width + extra);
    container.css("left", extra);
}

function setBlueboxHeight(){
    
    jQuery(".bluebox").each(function(){
        var tmpHeight = 0;
        jQuery(this).children(".walkthrough").each( function(){
            var e_height = jQuery(this).outerHeight();
        
            if( tmpHeight < e_height ){
                tmpHeight = e_height;
            }

            jQuery(this).addClass("d-none");
        });  

        jQuery(this).css("height", tmpHeight);      
        jQuery(this).css("display", "none");

    });
}

function nuvei_reset_steps(element, displayFirst){

    displayFirst = displayFirst || false;


    jQuery(element).find('div.walkthrough').each(function(){


        if(!jQuery(this).hasClass('d-none')){
            jQuery(this).addClass('d-none');
        }

        jQuery(this).removeClass('walkthroughOut walkthroughIn');
    });

    if(displayFirst){

        jQuery(element + ' div.walkthrough:first-child').css("left", 0).toggleClass("d-none");
    }
}

function nuvei_reset_walkthrough(){
    
    jQuery('.bluebox').each(function(){
        if(jQuery(this).is(':visible')){
            jQuery(this).slideToggle(1000);

            nuvei_reset_steps(this);
        }
    });
}

function nuvei_toggle_sub_menu_level_1(element){

    jQuery(element).children('> a').toggleClass('active');
        
    if(jQuery(element).find('div.sub-menu-level-1').length >= 1){
        jQuery(element).children('div.sub-menu-level-1').toggleClass('active');
    } 
}

function nuvei_reset_sub_menus(element){

    element = element || false;

    if(element == null){
        jQuery('div.sub-menu-level-1.sub-menu-slideIn').each(function(){
            jQuery(this).removeClass('sub-menu-slideIn');
            jQuery(this).removeClass('sub-menu-slideOut');
        });
    } else {
        jQuery(element).addClass('sub-menu-slideOut').removeClass('sub-menu-slideIn');
        jQuery(element).siblings('a').removeClass('active');
        setTimeout(function(){
            jQuery(element).removeClass('sub-menu-slideOut');
        }, 1000);
    } 

}

function nuvei_handle_search_form($){
    var $form = $('#search-form-wp-search');
    var $buttons = $form.find('.btn');
    var $proxyButton = $form.find('[name=swpengine]');

    $buttons.click(function() {
        $proxyButton.val($(this).find('input').val());
        $form.submit();
    });
}

jQuery(function($){
    nuvei_handle_search_form($);
});

jQuery(function($){

    //Sets OwlCarousel dots options
    var item_count = parseInt($(".owl-carousel").find('.slide').length);
    var sections = document.getElementsByTagName('section');
    var active_sub_menu_2 = null;

    $sections = jQuery.makeArray(sections);
    
    if( item_count <= 1 ){
        var isLooped = false;
        var isNav = false;
        var container = '';
    } else {
        var isLooped = true;
        var isNav = true;
        var container = '#customDots';
    }

   $(".owl-carousel").owlCarousel({
        dotsContainer: container,
        loop: isLooped,
        autoplay: true,
        items: 1,
        autoplayHoverPause: true,
        dots:true,
        nav: isNav,
        animateOut: 'slideOutUp',
        animateIn: 'slideInUp',
        mouseDrag: false,
        touchDrag: false,
        autoplayTimeout: 5000
   }); 


   $("[class^=perc-]").each(function(){
        setDiagonalsSize($(this));
   });

   setBlueboxHeight();

  
    $('[data-toggle="menu-main-menu-container"]').on('click', function(e){

        e.preventDefault();
        
        var $menu = $('.menu-main-menu-container');

        if ( $menu.hasClass("menuSlideOut") ) {
            $menu.addClass("menuSlideIn").removeClass("menuSlideOut");
        } else if ( $menu.hasClass("menuSlideIn") ) {
            $menu.addClass("menuSlideOut").removeClass("menuSlideIn");
        } else {
            $menu.addClass("menuSlideIn");
        }

        nuvei_reset_sub_menus();
    });

    $('[data-toggle="menu-sub-menu-container"]').on('click', function(e){

        e.preventDefault;
        
        var $menu = $(this).parent().parent().parent();
        
        nuvei_reset_sub_menus($menu);
    });

    $(window).on('resize', _.debounce(setBlueboxHeight, 200));

    $(".stepToggle").click(function(e){
        e.preventDefault();
        var target = $(this).attr("href");

        if($(target).is(':visible')){
            nuvei_reset_steps(target, true);
        }        
        else{
            nuvei_reset_walkthrough();    
            if( !$(target + ' div:first-child').hasClass("d-none") ){
                $(target).slideToggle(1000, function(){
                    $(target + ' div:first-child').toggleClass("d-none");    
                });    
            }
            else
            {
                $(target + ' div.walkthrough:first-child').toggleClass("d-none");
                $(target).slideToggle(1000);    
            }    
        }
    });

    $("[data-toggle-next-step]").click(function() {
        
        var target = $(this).data('toggle-next-step');
        var parent = $(this).parent();
        var left = 0;

        left = $(document).width() - (($(parent).offset().left + $(parent).outerWidth()));
        $(parent).css("left", left);

        $(this).parent().toggleClass("walkthroughOut");
        $(target).toggleClass("d-none");
        $(target).toggleClass("walkthroughIn");
        
    });

    $('#primary-menu > li').mouseenter(function(){
        nuvei_toggle_sub_menu_level_1($(this));
    })
    .mouseleave(function(){
        nuvei_toggle_sub_menu_level_1($(this));
    });

    $('#primary-menu > li > a').click(function(){

        if($(this).siblings('div.sub-menu-level-1').length >= 1){

            if($(this).siblings('div.sub-menu-level-1').hasClass('sub-menu-slideOut')){
                $(this).siblings('div.sub-menu-level-1').removeClass('sub-menu-slideOut');
            }

            $(this).siblings('div.sub-menu-level-1').toggleClass('sub-menu-slideIn');
            if(!$(this).siblings('div.sub-menu-level-1').hasClass('active')){
                $(this).siblings('div.sub-menu-level-1').toggleClass('active');
            }
        } 
    });

    //Toggle Sub-Menu
    $('#primary-menu > li > div.sub-menu-level-1 > ul.sub-menu > li > a').click(function(e){
        $(this).toggleClass('active');

        if(active_sub_menu_2 !== null){
            $(active_sub_menu_2).toggleClass('active');
            $(active_sub_menu_2).parent('li').children('div.sub-menu-level-2').children('ul.sub-menu').slideToggle();
        }

        if($(active_sub_menu_2).attr('id') !== $(this).attr('id')){
            active_sub_menu_2 = $(this);        
            if($(this).parent('li').find('div.sub-menu-level-2').length >= 1){
                $(this).parent('li').children('div.sub-menu-level-2').children('ul.sub-menu').slideToggle();
            } 
        } else {
            $(active_sub_menu_2).toggleClass('active');
            active_sub_menu_2 = null;
        }
    });

    $('[data-target="next-block"]').click(function(){
        var target = $(this).parent().parent().next();

        target[0].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });

    $('[data-target="header-next-block"]').click(function(){
        var target = $sections[0];

        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });

    $('[data-target="next-section"]').click(function(){
        var target = $(this).parent().parent().parent().next();
        
        target[0].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });

    

    /*
        Documentation for scroll-snap
        -----------------------------------------------------------------------------
        ------  https://services.github.com/on-demand/_javascript/jquery-scrollsnap-plugin/
    */
    $(document).scrollsnap({
        snaps: '.scroll-zone',
        proximity: window.innerHeight / 5,
        offset: -$('#menus').outerHeight()
    });


    $('[data-animation-delay]').each(function(){
        var value = $(this).data('animationDelay');
        $(this).delay(value * 1000).removeClass('delayedAnimatable').addClass('delayedAnimated');
    });

    $('.headerAnimatable').each(function(){
        $(this).removeClass('headerAnimatable').addClass('headerAnimated');
    });

    if (document.getElementsByClassName('header-logo').length > 0) {
        window.onscroll = function () {
            var logo = document.getElementsByClassName('header-logo');
            var offset = logo[0].offsetHeight + 50;
            if (window.pageYOffset >= offset) {
                $('#menus').addClass('sticky');
            } else {
                $('#menus').removeClass('sticky');
            }
        };
    }

});

jQuery(function($) {
      
        // Function which adds the 'animated' class to any '.animatable' in view
        var doAnimations = function() {
            
            // Calc current offset and get all animatables
            var offset = $(window).scrollTop() + $(window).height(),
                $animatables = $('.animatable');
            
            // Unbind scroll handler if we have no animatables
            if ($animatables.length == 0) {
                $(window).off('scroll', doAnimations);
            }
            
            // Check all animatables and animate them if necessary
            $animatables.each(function(i) {
                var $animatable = $(this);
                
                if (($animatable.offset().top + $animatable.height() - 20) < offset) {
                    $animatable.removeClass('animatable').addClass('animated');
                }

            });

        };
          
        // Hook doAnimations on scroll, and trigger a scroll
        $(window).on('scroll', doAnimations);
        $(window).trigger('scroll');

    });



(function($) {
    $(function() {
        var sizeGroups = {};
        var sizedItems = $('[data-size-group]');

        sizedItems.each(function() {
            var sizeGroup = $(this).data('size-group');
            var elementWidth = $(this).outerWidth();
            $(this).data('size-natural', elementWidth + "px");

            if (sizeGroup in sizeGroups) {
                var group = sizeGroups[sizeGroup];

                if (group.width < elementWidth) {
                    group.width = elementWidth;
                }

                group.elements.push(this);
            } else {
                sizeGroups[sizeGroup] = {
                    width: elementWidth,
                    elements: [ this ]
                };
            }
        });

        sizedItems.each(function() {
            var sizeGroup = $(this).data('size-group');
            $(this).css('width', sizeGroups[sizeGroup].width + "px");
        });
    });
})(jQuery);



(function($) {
    $(function() {
        var fileInputs = $('.wpcf7 input[type=file], .gfield input[type=file]');
        $(fileInputs).each(function() {
            var fileInput = this;

            var btn = document.createElement('a');
            btn.textContent = 'Choose File';
            btn.classList.add('btn');
            $(btn).on('click', function(event) {
                event.preventDefault();
                $(fileInput).click();
            });
            
            var filename = document.createElement('span');
            if (fileInput.files.length !== 0) {
                filename.textContent = fileInput.files[0].name;
            }

            $(fileInput).css({opacity:0, position: 'absolute', pointerEvents: 'none'});
            $(fileInput).parent().append(btn, filename);
            $(fileInput).on('change', function(event) {
                if (fileInput.files.length === 0) {
                    filename.textContent = '';
                } else {
                    filename.textContent = fileInput.files[0].name;
                }
            });
        });
    });
})(jQuery);

(function($) {
        var foregroundLayers = $.map($('.foreground-layer'), function(e,i) { return e; });
        var backgroundLayers = $.map($('.background-layer'), function(e,i) { return e; });

        var doParallaxAnimation = function() {
            var scroll = Math.max(window.pageYOffset, 0);
            var windowHeight = $(window).height();

            for (var i in foregroundLayers) {
                var e = foregroundLayers[i];
                var style = window.getComputedStyle(e);
                var position = style.getPropertyValue('position');
                
                if (position !== 'absolute') {
                    setYOffset(e, 0);
                    continue;
                }
                else
                {
                    var foreScroll = scroll + (windowHeight / 2);
                    var height = $(e).height();
                    var parent = $(e).parent();
                    var parentOffset = $(parent).offset().top;
                    var parentHeight = $(parent).height();
                    var speed = height / parentHeight;
                    var minScroll = 0;
                    var maxScroll = parentHeight - height;

                    var offset = (foreScroll - parentOffset) * speed;
                    if (offset < minScroll) {
                        offset = minScroll;
                    } else if (offset > maxScroll) {
                        offset = maxScroll;
                    }

                    setYOffset(e, offset);
                }
            }
        }

        var setYOffset = function(node,offset) {
            node.style.transform = 'translate3d(0,' + offset + 'px,0)';
        }

        if ((foregroundLayers.length + backgroundLayers.length) > 0) {
            setInterval(function() {
                window.requestAnimationFrame(doParallaxAnimation);
            }, 10);
        }
})(jQuery);

// Homepage Opportunities block - Animation
;(function($, win) {
    $.fn.inViewport = function(cb) {
       return this.each(function(i,el){
         function visPx(){
           var H = $(this).height(),
               r = el.getBoundingClientRect(), t=r.top, b=r.bottom;
           return cb.call(el, Math.max(0, t>0? H-t : (b<H?b:H)));  
         } visPx();
         $(win).on("resize scroll", visPx);
       });
    };
  }(jQuery, window));
  
  jQuery(".home_more_opportunies").inViewport(function(px){
      if(px) jQuery(this).addClass("triggeredCSS3") ;
  });

  var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 500;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length = 0);
    } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    var that = this;
    var delta = 150 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
    }

    setTimeout(function() {
    that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 2px solid #fff}";
    document.body.appendChild(css);
};