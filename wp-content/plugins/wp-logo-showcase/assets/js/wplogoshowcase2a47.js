(function ($) {
    "use strict";

    $(window).on('resize load', function () {
        HeightResizeWls();
    });

    jQuery(document).ready(function($) {
        rt_content_ready_scripts();
    });

    function rt_content_ready_scripts() {
        HeightResizeWls();
        $('.wls-tooltip').hover(
            function () {
                var $this = $(this);
                var $parent = $(this).parents('.rt-wpls');
                var id = $parent.attr('id').replace("rt-container-", "");
                var $title = $this.attr('data-title');
                $tooltip = '<div class="rt-tooltip" id="rt-tooltip-' + id + '">' +
                    '<div class="rt-tooltip-content">' + $title + '</div>' +
                    '<div class="rt-tooltip-bottom"></div>' +
                    '</div>';
                $('body').append($tooltip);
                var $tooltip = $('body > .rt-tooltip');
                var tHeight = $tooltip.outerHeight();
                var tBottomHeight = $tooltip.find('.rt-tooltip-bottom').outerHeight();
                var tWidth = $tooltip.outerWidth();
                var tHolderWidth = $this.outerWidth();
                var top = $this.offset().top - (tHeight + tBottomHeight);
                var left = $this.offset().left;
                $tooltip.css('top', top + 'px');
                $tooltip.css('left', left + 'px');
                $tooltip.css('opacity', 1);
                $tooltip.show();
                if (tWidth <= tHolderWidth) {
                    var itemLeft = (tHolderWidth - tWidth) / 2;
                    left = left + itemLeft;
                    $tooltip.css('left', left + 'px');
                } else {
                    var itemLeft = (tWidth - tHolderWidth) / 2;
                    left = left - itemLeft;
                    if (left < 0) {
                        left = 0;
                    }
                    $tooltip.css('left', left + 'px');
                }
            }, function () {
                $('body > .rt-tooltip').remove();
            }
        );

        $('.rt-wpls').each(function () {
            var container = $(this),
                $carousel = $('.rt-row.wpls-carousel', container),
                $isotope = $('.wpls-isotope', container);
            if ($carousel.length) {
                var data = $carousel.data('slick'),
                    slidesToShowTab = data.slidesToShowTab,
                    slidesToShowMobile = data.slidesToShowMobile;
                $carousel.imagesLoaded(function () {
                    HeightResizeWls();

                    $carousel.on("init", function () {
                        setTimeout(function () {
                            container.removeClass('rt-loading').addClass('rt-loaded');
                            $carousel.slick("slickGoTo", 1, true);
                        }, 0);
                    });

                    $carousel.slick({
                        responsive: [
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesToShow: slidesToShowTab,
                                    slidesToScroll: slidesToShowTab
                                }
                            },
                            {
                                breakpoint: 767,
                                settings: {
                                    slidesToShow: slidesToShowMobile,
                                    slidesToScroll: slidesToShowMobile
                                }
                            }
                        ]
                    });
                });
            }
            if ($isotope.length) {
                var isotope = $isotope.imagesLoaded(function () {
                    HeightResizeWls();
                    isotope.isotope({
                        itemSelector: '.isotope-item',
                    }).isotope('layout');
                });
                var $isotopeButtonGroup = $isotope.parents('.rt-wpls').find('.wls-isotope-button');
                $isotopeButtonGroup.on('click', 'button', function (e) {
                    e.preventDefault();
                    var filterValue = $(this).attr('data-filter');
                    isotope.isotope({filter: filterValue});
                    $(this).parent().find('.selected').removeClass('selected');
                    $(this).addClass('selected');
                });
            }
        });
    }

    function HeightResizeWls() {
        var wWidth = $(window).width();
        $(".rt-wpls").each(function () {
            var _this = $(this),
                dCol = _this.data('desktop-col'),
                tCol = _this.data('tab-col'),
                mCol = _this.data('mobile-col'),
                rtMaxH = 0;
            if ((wWidth >= 992 && dCol > 1) || (wWidth >= 768 && tCol > 1) || (wWidth < 768 && mCol > 1)) {
                _this.imagesLoaded(function () {
                    _this.children('div.rt-row').find(".rt-equal-height").height("auto");
                    _this.children('div.rt-row').find('.rt-equal-height').each(function () {
                        var $thisH = $(this).actual('outerHeight');
                        if ($thisH > rtMaxH) {
                            rtMaxH = $thisH;
                        }
                    });
                    _this.children('div.rt-row').find(".rt-equal-height").css('height', rtMaxH + "px");
                });
            } else {
                _this.children('div.rt-row').find(".rt-equal-height").height("auto");
            }
        });
    }

    // Elementor Frontend Load
    $(window).on('elementor/frontend/init', function () {
        if (elementorFrontend.isEditMode()) {
            elementorFrontend.hooks.addAction('frontend/element_ready/widget', function () {
                rt_content_ready_scripts();
            });
        }
    });

})(jQuery);