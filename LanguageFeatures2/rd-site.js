var ds;
var dscookiename;
var certifiedCarousel, featuredCarousel;
var maxDropdownHeight = 430;


(function () {

    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();


var widthEvent = new CustomEvent("WindowWidthChanged", {});

function getWindowWidth() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return e[a + 'Width'];
}

function IsLandscape(){
    var w = $(window);
    return w.height() < w.width();
}

function is_touch_device() {
    return 'ontouchstart' in window        // works on most browsers 
        || navigator.maxTouchPoints;       // works on IE10/11 and Surface
};

function InitializeCustomDropdown()
{
    if ($('.custom-select').length > 0) {
        if (navigator.platform.indexOf('iPad') != -1 || navigator.platform.indexOf('iPhone') != -1 || navigator.userAgent.indexOf('Android') != -1) {
            $('.custom-select select').selectpicker('destroy');

            $('.custom-select-multy select').prepend($('<option>', {
                selected: true,
                disable: true,
                'class': 'iOSfix'
            })).blur(function () {
                $(this).find('.iOSfix').prop('selected', $(this).find(':selected:not(.iOSfix)').length == 0);
            });
        }
        else {
            $('.custom-select select').selectpicker({ style: '', size: 78, dropupAuto: true });

            $('.custom-select div.dropdown-menu').each(function (i, o) {

                var contentHeight = $(o).find('ul li').length * 31;
                if (contentHeight > maxDropdownHeight) {
                    $(o).perfectScrollbar();
                }
            });

            setdropdownnewwidth();
        }
    }

    if (navigator.userAgent.indexOf('Android') != -1 && window.innerWidth < 768)  {
        $('input, textarea')
            .on('focusin', function () {
                var orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
                var isHorizontal = orientation.type.indexOf('landscape') != -1;
                if (isHorizontal) {
                    $('.header_middle_small.sticky-navbar, #divsliding, .sticky-navbar-fixed-menu').addClass('hor-andr');
                    $(".navMenu .sticky-navbar-fixed-menu .nav").css({ maxHeight: $(window).height() + "px" });
                }
            })
            .on('focusout', function () {           
                $('.hor-andr').removeClass('hor-andr');
                setStickyMobileMenuMaxHeight();
            });

        $(window).on('orientationchange', function () {
            var orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
            var isHorizontal = orientation.type.indexOf('landscape') != -1;

            var isFocus = $('input, textarea').is(':focus');
        
            if (isFocus) {
                if (isHorizontal) {
                    $('input:focus, textarea:focus').blur().focus();
                    $('.header_middle_small.sticky-navbar').addClass('hor-andr');
                    $('#divsliding').addClass('.hor-andr');
                    $('.sticky-navbar-fixed-menu').addClass('hor-andr');                 
                    $(".navMenu .sticky-navbar-fixed-menu .nav").css({ maxHeight: $(window).height()  + "px" });           
                }               
            }         

            if (!isFocus || !isHorizontal) {
                $('.hor-andr').removeClass('hor-andr');          
                setStickyMobileMenuMaxHeight();
            }
        });       
    }
}

function setdropdownnewwidth() {
    if ($('.custom-select').length > 0) {
        $('.custom-select div.dropdown-menu').each(function () {
            var elementInnerWidth = $('.custom-select select').innerWidth();
            var elementWidth = $('.custom-select select').width();
            $(this).width(elementWidth + elementWidth - elementInnerWidth);
        });
    }
}

function loadDeferVideo() {
    var currentWidth = $(window).width();
    $('iframe.video-defer-load[data-src]').each(function (i, e) {
        var o = $(e);
        if (o[0].hasAttribute('data-maxwidth')) {
            if (currentWidth <= parseInt(o.data('maxwidth'), 10)) {
                prepareDeferVideo(o);
            }
        }
        else {
            prepareDeferVideo(o);
        }
    });
}

function prepareDeferVideo(o) {
    setTimeout(function () { o.attr('src', $('iframe.video-defer-load').data('src')).removeAttr('data-src'); }, 20);
}

function loadDeferMenuBackgrounds() {
    setTimeout(function () {
        $('.big-main-menu').each(function () {
            $(this).find('ul.main-container').css("background", "url('" + $(this).data('bgimg') + "')");
        });
    }, 20);
}

loadDeferVideo();
loadDeferMenuBackgrounds();

$(function () {
    setshippingtext();
    $('.search-spinner').attr('src', 'data:image/gif;base64,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');
    $('.header_middle_logo').attr('src', 'data:image/png;base64,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');

    $(window).on('WindowWidthChanged', function () {
        loadDeferVideo();
    });

    InitializeCustomDropdown();
    applySubscriber();
    FixElementWidthWhenOpenedFancybox();

    ds = JSON.parse($("#hdds").val());
    dscookiename = $("#hdDiamondSearchName").val()

    var xsMaxSize = 767;
    var currentMenuHeight = 0;
    var menuTimer;
    var closeMenuTimer;
    var menuDelay = 300;

    $(".nav .main-menu").mouseover(function () {
        var o = $(this);
        if (!o.hasClass('main-menu-no-popup')) {
            var submenuName = o.data('sub-menu');
            $('.no-mobile-menu').hide();
            $(submenuName).show();
            clearTimeout(closeMenuTimer);
            clearTimeout(menuTimer);
            menuTimer = setTimeout(function () {
                if (getWindowWidth() > xsMaxSize) {
                    if (submenuName) {                       
                        currentMenuHeight = $(submenuName + ' .main-container').outerHeight(true);
                        if (currentMenuHeight > 10) {
                            $('.no-mobile-menu-main-placeholder').height(currentMenuHeight);
                        }
                    }
                }
            }, menuDelay);
        }
        else
        {
            $('.no-mobile-menu-main-placeholder').height(0);
        }
    }).mouseout(function (e) {
        clearTimeout(menuTimer);       
    });

    $(".no-mobile-menu").mouseover(function () {
        clearTimeout(closeMenuTimer);
        if (getWindowWidth() > xsMaxSize) {           
            var o = $(this);
            o.show();         
            if (currentMenuHeight > 10)
            {
                 $('.no-mobile-menu-main-placeholder').height(currentMenuHeight);
            }

            var parent = o.data("parent");           
            if (parent) {
                $(parent).addClass('activeMenu');
            }
        }
    }).mouseout(function () {
        clearTimeout(closeMenuTimer);
        if (getWindowWidth() > xsMaxSize) {
            $('.no-mobile-menu-main-placeholder').height(0);
            $(this).hide();
            var parent = $(this).data("parent");
            if (parent) {
                $(parent).removeClass('activeMenu');
            }
        }
    });

    $(".header_middle").mouseover(function () {       
        $('.no-mobile-menu-main-placeholder').height(0);
        $('.no-mobile-menu').hide();        
    });

    $(".header").siblings('div').mouseover(function () {
        $('.no-mobile-menu-main-placeholder').height(0);
        $('.no-mobile-menu').hide();
    });

    //$('.main-menu').on('click', 'a', function (e) {      
    //    e.preventDefault();
    //});

    $('.menu-close-button').click(function () {
        var activeMenu = $(this).closest('.no-mobile-menu');
        if (getWindowWidth() > xsMaxSize) {
            var parent = activeMenu.data("parent");
            if (parent) {
                $(parent).removeClass('activeMenu');
            }
            activeMenu.hide();
            $('.no-mobile-menu-main-placeholder').height(0);
        }
    });

    txtArea = $('.txtAreaInContactForms');
    txtArea.focusin(
            function () {
                if (navigator.platform == 'iPhone') {
                    setTimeout(function () {
                        $('html, body').animate({ scrollTop: txtArea.offset().top - 30 }, 0);
                    }, 250);
                }
            });

    $(".current-currency").click(function () {
        $(".currencies-wrapper").toggle();
    });

    $(document).mouseup(function (e) {
        var container = $(".currencies-wrapper");

        if (!container.is(e.target)
            && container.has(e.target).length === 0) {
            container.hide();
        }
    });

    $('.currencies-wrapper .currency-item').click(function () {
        var currCode = $(this).data('code');
        var currRate = $(this).data('rate');
        if ($(".current-currency.current-currency-code").text() != currCode.toUpperCase()) {
            $('.current-currency.current-currency-flag').attr('class', 'current-currency current-currency-flag flags_sprite flags_sprite-' + currCode);
            $(".current-currency.current-currency-code").text(currCode.toUpperCase());
            var currentTime = new Date();
            $.cookies.set("currency", currCode, {
                expiresAt: new Date(currentTime.getFullYear() + 1, currentTime.getMonth(), currentTime.getDate()), domain: cookiesdomain
            });
            window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname;
        }
        $(".currencies-wrapper").hide();
    });

    $(".nav li.collapsable").on("click", function () {
        if (getWindowWidth() <= xsMaxSize) {
            setStickyMobileMenuMaxHeight();
            if ($(this).hasClass('expanded-menu')) {
                var childSub = $(this).data('target');
                if (childSub) {
                    $(childSub).each(function () {
                        var childSubSub = $(this).data('target');
                        if (childSubSub) {
                            $(childSubSub).collapse('hide');
                        }
                    }).find('.menu-sprite-Header_mobile_arrow_d').toggleClass("menu-sprite-Header_mobile_arrow_l").toggleClass("menu-sprite-Header_mobile_arrow_d");
                }

                $(this).find('.sub-sub-menu').toggleClass('in');
            }

            $(this).toggleClass("expanded-menu");
            $(this).find('.mobile_menu_arrow').toggleClass("menu-sprite-Header_mobile_arrow_l").toggleClass("menu-sprite-Header_mobile_arrow_d");
        }
        else {

        }
    });

    $(".header .menuBar").on("click", function () {
        $('.header .menuBar button.navbar-toggle').toggleClass('navbar-toggle-cancel');
        $('.header .menuBar button.navbar-toggle').toggleClass('navbar-toggle-menu');
        setStickyMobileMenuMaxHeight();
        setStickForTopMenu();
    });

    function setStickForTopMenu()
    {
        var origOffsetY = 100;
        if ($(window).scrollTop() < origOffsetY) {
            if ($('.header .menuBar button.navbar-toggle').hasClass('navbar-toggle-cancel')) {
                $('.header_middle_small').addClass('sticky-navbar');
                $('.header').addClass('sticked-mobile-menu');
                $('.header .navbarMenu').addClass('sticky-navbar-fixed-menu');
                $('.header .header_top').hide();
            } else {
                $('.header_middle_small').removeClass('sticky-navbar');
                $('.header').removeClass('sticked-mobile-menu');
                $('.header .navbarMenu').removeClass('sticky-navbar-fixed-menu');
                $('.header .header_top').show();
            }
        }
    }

    $(document).ready(function () {

    
        //if (navigator.platform.indexOf('iPad') != -1) {
        //    $(".bc-minimize-state-container").live("click", function () { $("html, body").animate({ scrollTop: $(document).height() - $(window).height() }) });
        //    $("#bc-chat-container").live("click", function () { $("html, body").animate({ scrollTop: $(document).height() - $(window).height() }) });
        //    $("#livechat").live("click", function () { $("html, body").animate({ scrollTop: $(document).height() - $(window).height() }) });
        //}

        if (navigator.platform.indexOf('iPhone') != -1) {
            $(".bc-minimize-state-container").live("click", function () { $('html, body').animate({ scrollTop: 100 }, 200) });
        }

        var menu = $('.header_middle_small');
        var origOffsetY = 100;
        var origOffsetYHeader = 36 /*$('.header_top').height()*/;
        setStickyMobileMenuMaxHeight();
        certifiedCarousel = new CarouselClass("certified-carousel");
        featuredarousel = new CarouselClass("featured-carousel");
        recomendedcarousel = new CarouselClass("recomended-carousel");

        var prev = $(window).scrollTop();
        var prevDirection = null;

        function scroll() {
            var current = $(window).scrollTop();
            var currentDirection = (prev - current) > 0 ? 'up' : 'down';
            if (prevDirection === null || currentDirection === prevDirection) {
                //if ((navigator.platform.indexOf('iPhone') != -1)) {
                //    $("#bc-chat-container").css({ "top": "0" });
                //    var $frame = $("#bc-frame");
                //    if ($frame.length > 0) {
                //        if (typeof ($frame.css('display')) != 'undefined' && $frame.css('display') != "none") {
                //            if ($(window).scrollTop() > 400) {
                //                $('html, body').animate({ scrollTop: 270 }, 200);
                //            }
                //        }
                //    }
                //}

                scroll_header();
                if (getWindowWidth() <= xsMaxSize) {
                    if ($(window).scrollTop() >= origOffsetY) {
                        if ($('.header .navbar-toggle.navbar-toggle-menu').length > 0) {
                            $('.header_middle_small').addClass('sticky-navbar');
                            $('.header').addClass('sticked-mobile-menu');
                            $('.header .navbarMenu').addClass('sticky-navbar-fixed-menu');
                        }
                    } else {
                        setStickForTopMenu();
                    }
                }
            }
             
            prev = current;
            prevDirection = currentDirection;
            setTimeout(function () { prevDirection = null }, 300);
        }

        scroll();

        function scroll_header() {         
            if ($(window).scrollTop() >= origOffsetYHeader) {
                $('.header').addClass('sticky-header');
                $('#topPanel').addClass('sticky-header');
                $('.sticky_middle').addClass('sticky');
                $('.responsive-banner-image').addClass('responsive-banner-image-sticky');
                if ($("#topPanel").css('display') == 'block') $(".sticky-header").css({ "top": "41px" }); else $(".sticky-header").css({ "top": "0px" })
            } else {
                $(".sticky-header").css({ "top": "auto" });
                $('#topPanel').removeClass('sticky-header');
                $('.header').removeClass('sticky-header');
                $('.sticky_middle').removeClass('sticky');
                $('.responsive-banner-image').removeClass('responsive-banner-image-sticky');
                $('.header.header-ui').css({ "top": "auto" });
            }
        }

        scroll_header();

        var last_document_w = $(document).width();

        $(window).resize(function () {
            var wWidth =  $(window).width();
            if (last_document_w != wWidth) {

                if (document.createEvent) {
                    window.dispatchEvent(widthEvent);
                }
                else{
                    document.fireEvent('WindowWidthChanged');
                }
           
                last_document_w = wWidth;
                scroll();
                setStickyMobileMenuMaxHeight();
                certifiedCarousel.Resize();
                featuredarousel.Resize();
                recomendedcarousel.Resize();
                setdropdownnewwidth();
            }
        });

        document.onscroll = scroll;

        function activeLinkClick(o) {
            var url = o.data('link-src');         
            if (o.hasClass('recommended-active-link-class')) {
                url = o.closest('.recommended-item-wrapper').find('.link-wrapper a, .link-wrapper-carousel a').attr('href');
            }

            if (url != '' && url != undefined) window.location = url;
        }

        if (is_touch_device()) {
            $('.active-link-class').swipe({
                longTap: function () {                   
                    activeLinkClick($(this));                  
                },
                longTapThreshold: 1               
            });
        }
        else {
            $('.active-link-class').click(function () {              
                activeLinkClick($(this));
            });
        }      

        if (is_touch_device()) {
            $('.active-swipe-class').swipe({
                swipeLeft: function () {
                    if ($(this).not('.carousel')) {
                        $(this).closest('.carousel').carousel("next");
                    }
                    else {
                        $(this).carousel("next");
                    }
                },
                swipeRight: function () {
                    if ($(this).not('.carousel')) {
                        $(this).closest('.carousel').carousel("prev");
                    }
                    else {
                        $(this).carousel("prev");
                    }
                },
                allowPageScroll: "vertical"               
            });
        }

        $("#certified-carousel .c-carousel-left").click(function () {
            certifiedCarousel.LeftClick();
        });

        $("#certified-carousel .c-carousel-right").click(function () {
            certifiedCarousel.RightClick();
        });

        $("#featured-carousel .c-carousel-left").click(function () {
            featuredarousel.LeftClick();
        });

        $("#featured-carousel .c-carousel-right").click(function () {
            featuredarousel.RightClick();
        });

        $("#recomended-carousel .c-carousel-left").click(function () {
            recomendedcarousel.LeftClick();
        });

        $("#recomended-carousel .c-carousel-right").click(function () {
            recomendedcarousel.RightClick();
        });

        InitActionButtons();

        $('#featured-carousel').on('click', '.c-carousel-item', function (event) {
            event.preventDefault();
            AsFeaturedVideo()
        })

        function AsFeaturedVideo() {
            $.fancybox.open({
                href: 'https://www.youtube.com/embed/Pz4kYqfY_k8?list=PLn13d6uCV_NJ57E4QJltxmufOSeLbp_gj&amp;controls=1&amp;showinfo=1&autoplay=1&rel=0',
                type: 'iframe',
                fitToView: false,
                maxWidth: 560,
                maxHeight: 315,
                width: '100%',
                autoSize: true,
                closeClick: false,
                openEffect: 'none',
                closeEffect: 'none',
                autoScale: true,
                cyclic: true
            });
        }

        $('.featured-table .active-link-class').on('click', 'i', function (event) {
            event.preventDefault();
            AsFeaturedVideo()
        });

    });

    $('.sub-menu').on('click', 'a[href]', function (e) {        
            e.preventDefault();
            var url = $(this).attr('href');
            if (typeof (url) == "undefined") return;
            window.location = url;
    });


    if (typeof(showloginPopUp) != 'undefined') {
        if (showloginPopUp) {
            $("#divDialogBody").dialog("open");
        }

        $("#txtLogin, #txtPassword").keypress(function (event) {
            if (event.keyCode == 13) {
                $("#lbtnSignIn").click();
            }
        });
    }
});

function InitActionButtons() {

    var ab_object = $(".control-action-buttons");
    var lb_text= ab_object.attr("lb-text");
    var lb_type = ab_object.attr("lb-type");
    var lb_link = ab_object.attr("lb-link");
    var lb_padding_height = ab_object.attr("lb-padding-height"); 
    var lb_padding_width = ab_object.attr("lb-padding-width"); 
    var rb_text = ab_object.attr("rb-text"); 
    var rb_type = ab_object.attr("rb-type");
    var rb_link = ab_object.attr("rb-link");
    var rb_padding_height = ab_object.attr("rb-padding-height"); 
    var rb_padding_width = ab_object.attr("rb-padding-width"); 
    var ab_description = ab_object.attr("ab-description"); 
    var ab_margin_top = ab_object.attr("ab-margin-top"); 
    var ab_margin_bottom = ab_object.attr("ab-margin-bottom");
    var ab_align = ab_object.attr("ab-align");
    
    var div_action_buttons = "";
    div_action_buttons = div_action_buttons + '<div style="text-align: ' + ab_align + '">' + ab_description + '</div>';
    div_action_buttons = div_action_buttons + '<div style="margin-top: ' + ab_margin_top + 'px; margin-bottom: ' + ab_margin_bottom + 'px;">';
    div_action_buttons = div_action_buttons + '<div class="control-action-button-view control-action-right-button ';
    if (rb_type == 'clear') div_action_buttons = div_action_buttons + 'control-action-clear-button ';
    if (rb_type == 'solid') div_action_buttons = div_action_buttons + 'control-action-solid-button ';
    div_action_buttons = div_action_buttons + 'noPadding"><a href="' + rb_link + '"><span style="padding-top: ' +
            rb_padding_height + 'px; padding-bottom: ' + rb_padding_height + 'px; padding-left: ' + rb_padding_width + 'px; padding-right: ' +
            rb_padding_width + 'px;">' + rb_text + '</span></a></div>';
    div_action_buttons = div_action_buttons + '<div class="control-action-button-view control-action-left-button ';
    if (lb_type == 'clear') div_action_buttons = div_action_buttons + 'control-action-clear-button ';
    if (lb_type == 'solid') div_action_buttons = div_action_buttons + 'control-action-solid-button ';
    div_action_buttons = div_action_buttons + 'noPadding"><a href="' + lb_link + '"><span style="padding-top: ' +
            lb_padding_height + 'px; padding-bottom: ' + lb_padding_height + 'px; padding-left: ' + lb_padding_width + 'px; padding-right: ' +
            lb_padding_width + 'px;">' + lb_text + '</span></a></div></div>';

    ab_object.after(div_action_buttons);
    ab_object.remove();
}


function setStickyMobileMenuMaxHeight() {
    var hOffset = (navigator.platform.indexOf('iPhone') == -1) ? 84 : getWindowWidth() <= 414 ? 16 : 86;
    $(".navMenu .sticky-navbar-fixed-menu .nav").css({ maxHeight: $(window).height() - hOffset + "px" });
}

function clickLink(link) {
    var click_count = 0;
    var target = $('#' + link + '.tapHandler');
    if (target.length > 0) {
        var targetScript = target.data('onclick');
        if (targetScript) {
            eval(targetScript);
        }
    }
    else {
        if (getBrowser() == 'Safari') {
            var link_href = $("#" + link).attr('href');
            document.location.href = link_href;
        }
        else {
            document.getElementById(link).click();
        }
    }
}

function applySubscriber() {
    var btn = $("#btnSubscribeEmail");
    var txt = $("#txtNewsletterEmail");
    btn.click(function () {
        var email = $.trim(txt.val());
        if (email != "" && validateEmail(email))
        {
            $.ajax({
                type: "POST",
                url: "/services/subscribersservice.asmx/subscribe",
                data: "{'email':'" + email + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });

            window.location =("/thankyou.aspx?s=1&email=" +email);
        }
    });
    txt.keypress(function (event) {
        if (event.keyCode == "13") {
            event.preventDefault();
            btn.click();
        }
    });
}

function validateEmail(mail) {
    var emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailPattern.test(mail);
}

function gTrack(title) {
    try {
        gtag('event', 'clicked', { 'target': title });   
    }
    catch (e) { }
}

function getInfoBlock() {
    var infoBlock = "";
    if (shoppingCartSubTotal > 0 || wishlistTotal > 0)
        infoBlock = "C: $" + shoppingCartSubTotal + " - " + "W: $" + wishlistTotal;
    return infoBlock;
}

function openChat() {
    var data = {
        bdid: "4418712996628313680",
        cwdid: "3811016547171737894",
        dl: 1,
        dt: 0,
        embed: true,
        fix: true,
        height: 480,
        id: "4418712996628313680",
        img: "//images.boldchat.com/ext/images/buttons/float/button1/left/ButtonIconNoBorderLeftGray.png",
        px: 0,
        py: 50,
        si: 1000,
        sl: 63,
        st: null,
        type: "chat",
        width: 640,
        x: 0,
        y: 0,
    };

    if (typeof (window._bcvmw) != "undefined"
        && typeof (window._bcvmw.chatWindow) != "undefined") {
        window._bcvmw.chatWindow(data);
    } else {
        setTimeout(openChat, 1000);
    }
}

function looseDiamondSearch(shape, category) {

    ds.s = [];
    var sh = parseInt(shape);
    if (sh != 0) {
        ds.s.push(sh);
    }

    ds.t = category;
    runDiamondsSearch();
}

function runDiamondsSearch() {
    setJsonToCookieWithExpires(dscookiename, {
        ctn: ds.ctn,
        ctx: ds.ctx,
        cn: ds.cn,
        cx: ds.cx,
        cln: ds.cln,
        clx: ds.clx,
        gn: ds.gn,
        gx: ds.gx,
        s: ds.s,
        sz: ds.sz,
        p: 1,
        prn: ds.prn,
        prx: ds.prx,
        sv: ds.sv,
        cert: ds.cert
    });
    window.location.href = publicdomain + "/loose-diamonds/search.aspx";
}

function setJsonToCookieWithExpires(cookieName, jsonData) {
    if ($.cookies.get(cookieName) != null) {
        $.cookies.del(cookieName, { domain: cookiesdomain });
    }
    var currentTime = new Date();
    $.cookies.set(cookieName, JSON.stringify(jsonData), { expiresAt: new Date(currentTime.getFullYear() + 1, currentTime.getMonth(), currentTime.getDate()), domain: cookiesdomain });
}


/*------------------CarouselClass-------------------------*/

function CarouselClass(carouselID, border, horizontalCentering, overWidth) {
    this.carouselID = carouselID;
    this.borderWidth = border || 10;
    this.width = $("#" + this.carouselID + " .c-center-block").width();
    this.activeIndex = 1;
    this.items = SetItemsWidth(this.carouselID, this.borderWidth);
    this.showItems = CalculateShowItems(this.width, this.items, 1);
    this.centerElements = horizontalCentering || false;
    this.overWidth = overWidth || 5;

    SetImage(this.carouselID, this.activeIndex, this.showItems, this.width, this.items, this.borderWidth, this.centerElements, this.overWidth);
}

CarouselClass.prototype.SetShowItems = function () {
    $("#" + this.carouselID + " .c-place").empty();
    this.width = $("#" + this.carouselID + " .c-center-block").width();
    this.showItems = CalculateShowItems(this.width, this.items, 1);
    SetImage(this.carouselID, this.activeIndex, this.showItems, this.width, this.items, this.borderWidth, this.centerElements, this.overWidth);
}

CarouselClass.prototype.RightClick = function () {
    this.activeIndex += 1;

    if (this.activeIndex >= this.items.length + 1)
        this.activeIndex = 1;

    this.SetShowItems();
}

CarouselClass.prototype.LeftClick = function () {
    this.activeIndex -= 1;

    if (this.activeIndex <= 0)
        this.activeIndex = this.items.length;

    this.SetShowItems();
}

CarouselClass.prototype.Resize = function () {
    $("#" + this.carouselID + " .c-place").empty();
    this.width = $("#" + this.carouselID + " .c-center-block").width();
    this.items = SetItemsWidth(this.carouselID, this.borderWidth);
    this.showItems = CalculateShowItems(this.width, this.items, 1);
    SetImage(this.carouselID, this.activeIndex, this.showItems, this.width, this.items, this.borderWidth, this.centerElements, this.overWidth);
}


function CalculateShowItems(width, itemList, indexShowItems) {
    if (itemList.length == 0)
        return indexShowItems;

    var currentWidth = 0, item = 0, stop = false;
    for (var i = 0; i < itemList.length; i++) {
        for (var j = i; j < i + indexShowItems; j++) {
            item = j;
            if (item == itemList.length)
                item = item - itemList.length

            currentWidth += itemList[item];
        }

        if (currentWidth > width) {
            stop = true;
            break;
        }

        currentWidth = 0;
        item = 0;
    }

    if (stop)
        return (indexShowItems == 1) ? 1 : indexShowItems - 1;
    else if (itemList.length == indexShowItems)
        return indexShowItems;
    else
        return CalculateShowItems(width, itemList, indexShowItems + 1);
}

function SetItemsWidth(carouselID, border) {
    var itemsWidth = new Array();

    $("#" + carouselID + " .c-center-block .c-template").show();

    $("#" + carouselID + " .c-center-block .c-template .c-carousel-item").each(function () {
        itemsWidth.push($(this).width() + border);
    });

    $("#" + carouselID + " .c-center-block .c-template").hide();

    return itemsWidth;
}


function SetImage(carouselID, activeIndex, showItems, width, itemList, border, centerElements, overWidth) {
    var currentWidth = 0;
    for (var i = activeIndex; i < activeIndex + showItems; i++) {
        var item = i - 1;
        if (item >= itemList.length)
            item = item - itemList.length
        currentWidth += itemList[item];
    }

    var addWidth = Math.round((width - currentWidth) / showItems - overWidth);

    if (centerElements) {
        /* Detect if the is space for more items*/
        if ((width / (currentWidth + 2 * border * showItems)) > 1) {
            addWidth = 2 * border;
        }
    }

    if ($('#' + carouselID).hasClass('center-aligned-carousel')) { 
        if (showItems >= itemList.length && showItems < 5)
        {
            var pseudoItems = new Array();       

            for (var i = 0; i < 5; i++)
            {
                pseudoItems.push(itemList[0]);
            }        

            $('#' + carouselID).find('.c-left-block .sprite, .c-left-right .sprite').hide();

            var realShowItems = showItems;
            showItems = CalculateShowItems(width, pseudoItems, 1);
            var posibleWidth = 0;
            for (var i = activeIndex; i < activeIndex + showItems; i++) {
                var item = activeIndex - 1;
                if (item >= pseudoItems.length)
                    item = item - pseudoItems.length
                posibleWidth += pseudoItems[item];
            }                

            addWidth = Math.round((width - posibleWidth) / showItems - overWidth);          
            showItems = realShowItems;          
        }
        else
        {
            $('#' + carouselID).find('.c-left-block .sprite, .c-left-right .sprite').show();
        }
    }

    function is_touch_device() {
        return 'ontouchstart' in window        // works on most browsers 
            || navigator.maxTouchPoints;       // works on IE10/11 and Surface
    };

    for (var i = activeIndex; i < activeIndex + showItems; i++) {
        var item = i;
        if (item > itemList.length)
            item = item - itemList.length;

        var currentItem = $("#" + carouselID + " .c-center-block .c-template .c-carousel-item[carousel-index=" + item + "]");

        var currentImage = currentItem.find('img[data-src]');
        if (currentImage.length > 0) {
            var imageSrc = currentImage.data('src');

            if (imageSrc && imageSrc.length > 0) {
                currentImage.attr('src', imageSrc);
                currentImage.removeAttr('data-src');

                var nextItemId = item + 1;
                if (item == (activeIndex + showItems - 1) && (nextItemId <= itemList.length)) {
                    var nextItem = $("#" + carouselID + " .c-center-block .c-template .c-carousel-item[carousel-index=" + nextItemId + "]");
                    var nextImageSrc = nextItem.find('img[data-src]').data('src');
                    if (nextImageSrc && nextImageSrc.length > 0) {
                        nextItem.find('img[data-src]').attr('src', nextImageSrc);
                    }
                }

                var prevItemId = item - 1;
                if (prevItemId < 1) {
                    prevItemId = itemList.length;
                }

                if (prevItemId >= 1 && prevItemId && prevItemId <= itemList.length) {
                    var prevItem = $("#" + carouselID + " .c-center-block .c-template .c-carousel-item[carousel-index=" + prevItemId + "]");
                    if (prevItem.length >= 0) {
                        var prevImageSrc = prevItem.find('img[data-src]').data('src');
                        if (prevImageSrc && prevImageSrc.length > 0) {
                            prevItem.find('img[data-src]').attr('src', prevImageSrc);
                        }
                    }
                }
            }
        }

        currentItem.clone().appendTo("#" + carouselID + " .c-center-block .c-place");

        var element = $("#" + carouselID + " .c-center-block .c-place .c-carousel-item[carousel-index=" + item + "]");

        if (addWidth > 0) {
            element.css("width", element.width() + addWidth + border);
        }
        else {
            element.css("width", element.width() + border);
        }

        if (is_touch_device()) {
            element.swipe("destroy");
            element.swipe({
                longTap: function () {
                    var url = $(this).attr('data-c-link-src');
                    if (typeof (url) == "undefined") url = $(this).find(".active-link-class").attr('data-link-src');
                    if (typeof (url) == "undefined" || url == "") return;
                    window.location = url;
                },
                longTapThreshold: 1,
                swipeLeft: function () {
                    $(this).parents(".c-carousel").find(".c-carousel-right").click();
                },
                swipeRight: function () {
                    $(this).parents(".c-carousel").find(".c-carousel-left").click();
                },
                allowPageScroll: "vertical",
                excludedElements: "label, button, input, select, textarea, .noSwipe"
            });
        } else {
            element.click(function () {               
                if ($(this).attr('data-c-link-src') != undefined) {                    
                    if ($(this).attr('data-c-link-src') != '') window.location = $(this).attr('data-c-link-src');
                }
            });
        }
    }
}

function ScrollPage(position) {
    $('html, body').animate({ scrollTop: position }, 200);
}

function injectStyles(rule) {
    var div = $("<div />", {
        html: '<style>' + rule + '</style>'
    }).appendTo("body");
}

function getScrollBarWidth() {
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);

    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);

    return (w1 - w2);
};

function FixElementWidthWhenOpenedFancybox() {
    var fixWidth = getScrollBarWidth() / 2;
    injectStyles('.fancybox-lock .header.sticky-header.sticked-mobile-menu {right: ' + fixWidth + 'px; margin-right: 0px;}' +
    ' @media (min-width: 768px){.fancybox-lock .header.sticky-header {padding-right: ' + fixWidth * 2 + 'px; margin-right: 0px; left: 0;}}' +
    ' .fancybox-lock .header_middle_small_sticky.display-sticky, .fancybox-lock #divsliding {padding-right: ' + fixWidth * 2 + 'px;}');
}
/*------------------End CarouselClass-------------------------*/

var isRetinaDisplay = isRetina();

function isRetina() {
    return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)').matches)) || (window.devicePixelRatio && window.devicePixelRatio >= 2)) && /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
}

function InitializeFancyboxSwipe() {
    $('.fancybox-wrap').not(':has(video)').swipe({
        excludedElements: "",
        preventDefaultEvents: true,
        excludedElements: "label, button, input, select, textarea, .noSwipe",
        swipe: function (event, direction) {

            if (direction === 'left' || direction === 'up') {
                $.fancybox.next(direction);
            } else {
                $.fancybox.prev(direction);
            }
        }
    });

    $('.fancybox-wrap:has(video)').on('touchmove', function (e) {       
         e.preventDefault();        
    });
}

function changeUrl(url)
{
    var a = document.createElement('a');
    a.href = url;
    var newPathName = a.pathname;
    var curPathname = location.pathname;

    window.location.href = url;
    if (newPathName == curPathname)
    {
        location.reload();
    }
}

function loginButton(buttonname) {
    $("div.updnValidatorCallout").hide();
    $(buttonname).click();
}

function setshippingtext() {
    $.ajax({
        type: "POST",
        url: "/services/wfservices.asmx/checkonusa",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var result = data.d;
            switch (result) {
                case true:
                    $('.iconlabel-world').remove();
                    $('.iconlabel-usa').show();              
                    break;             
                default:
                    $('.iconlabel-usa').remove();
            }
        }
    });
}

function webpurl(iurl) {
    return webpSupport && iurl && iurl.indexOf('photos') != -1 ? iurl.replace('.jpg', '.webp').replace('.png', '.webp') : iurl;
}