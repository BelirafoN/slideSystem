/**
 * Developer: Alexandr Voronyansky
 * E-mail: alexandr@voronynsky.com
 * Date: 04.10.13
 * Time: 10:07
 */

(function( $, global ){

    document.fullScreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement||
        document.documentElement.requestFullscreen || document.documentElement.mozRequestFullScreen || document.documentElement.webkitRequestFullscreen;
    document.cancelFullScreen = document.cancelFullScreen || document.mozCancelFullScreen || document.webkitCancelFullScreen;

    /**
     * Настройки презентации по умолчанию
     *
     * @type {{slideClass: string, autoplay: boolean, autoplayDelay: number, progressBar: boolean, slideIndex: boolean, thumbnails: boolean, controls: Array, enableScroll: boolean, toggleEffect: string}}
     */
    var defaultSettings = {

        slideClass: "",
        autoplay: false,
        autoplayDelay: 2000,
        progressBar: true,
        slideIndex: true,
        thumbnails: false,
        controls: ["next", "prev", "play", "fullscreen"],
        enableHotKeys: false,
        enableScroll: false,
        toggleEffect: "base"
    };

    /**
     * Данные для генерации навигационной панели
     * @type {{}}
     */
    var controlData = {
        /* пространство имен "_ss" нужно для безопасной поддержки метода destroy */

       next: {
           text: 'вперед',
           hotKeyHelp: " ( Пробел, →, ↑ )",
           className: 'ss-next',
           title: 'листаем вперед',
           init: function ( p ){
               var _self = this;

               $( this ).on( "click._ss", ".ss-next", function( e ){
                   shareMethods.next.apply( _self );
                   e.preventDefault();
               });
           }
       },

       prev: {
           text: 'назад',
           hotKeyHelp: " ( Backspace, ←, ↓ )",
           className: 'ss-prev',
           title: 'листаем назад',
           init: function ( p ){
               var _self = this;

               $( this ).on( "click._ss", ".ss-prev", function( e ){
                   shareMethods.prev.apply( _self );
                   e.preventDefault();
               })
           }
       },

       play: {
           text: 'воспроизвести',
           hotKeyHelp: " (Ctrl + P, Ctrl + Enter)",
           textActive: 'остановить',
           className: 'ss-play',
           title: 'воспроизвести',
           titleActive: 'отановить',
           init: function ( p ){
               var _self = this;

               $( this ).on( "click._ss", ".ss-play", function( e ){

                   if ( p.isPlaying ){
                       shareMethods.stop.apply( _self );
                   }else{
                       shareMethods.play.apply( _self );
                   }
                   e.preventDefault();
               })
           }
       },

       fullscreen: {
           text: 'на весь экран',
           hotKeyHelp: " (Ctrl + F)",
           textActive: 'обычный режим',
           className: 'ss-fullscreen',
           title: 'развернуть презентацию в полноэкранном режиме',
           titleActive: 'выйти из полноэкранного режима (ESC)',
           init: function ( p ){
               var _self = this;

               $( this ).on( "click._ss", ".ss-fullscreen", function( e ){
                   shareMethods.fullscreen.apply( _self );
                   e.preventDefault();
               });
           }
       }
    };

    /**
     * Анимирующие функции, импользуются для смены активного слайда.
     * Можно легко реализовать возможность добавления пользователем своих анимирующих функций в систему
     *
     * @type {{base: Function, fade: Function, scrolllr: Function, scrolltb: Function}}
     */
    var animateFunctions = {

        base: function ( actualSlide, requireSlide ){

            var defer = new $.Deferred();
            actualSlide.removeClass( "active" );
            requireSlide.addClass( "active" );
            defer.resolve();

            return defer.promise();
        },

        fade: function( actualSlide, requireSlide ){

            requireSlide.css( "opacity", 0).addClass( "active" );
            return $.when(

                actualSlide.animate( {"opacity": 0}, 200, function(){
                    actualSlide.removeClass( "active" ).css( "opacity", 1 );
                }),

                requireSlide.animate( {"opacity": 1}, 150 )

            ).promise();
        },

        scrolllr: function( actualSlide, requireSlide ){

            requireSlide.css( "left", "-" + requireSlide.width()  + "px" ).addClass( "active" );
            return $.when(

                actualSlide.animate( {"left": actualSlide.width() + "px"}, 500, function(){
                    actualSlide.removeClass( "active" ).css( "left", 0 );
                }),

                requireSlide.animate( {"left": 0}, 500 )

            ).promise();

        },

        scrolltb: function( actualSlide, requireSlide ){

            requireSlide.css( "top", "-" + requireSlide.height()  + "px" ).addClass( "active" );
            return $.when(

                actualSlide.animate( {"top": actualSlide.height() + 200 + "px"}, 500, function(){
                    actualSlide.removeClass( "active" ).css( "top", 0 );
                }),

                requireSlide.animate( {"top": 0}, 500 )

            ).promise();

        }
    };

    /**
     * Внутренние сервисные методы. Недоступны для пользователя
     *
     * @type {{init: Function, loadSlide: Function, toggleSlides: Function, getPersentage: Function}}
     */
    var helperMethod = {

        /**
         * Инициализатор системы
         * @param options
         */
        init: function( options ){

            var _self = this,
                container = $(this),
                p = {};

            /* если презентация уже инициализирована */
            if ( !!container.data( "ss_data" ) ) return;

            if ( options && options.controls === "all" ){
                options.controls = defaultSettings.controls;
            }

            p.settings = $.extend( $.extend( {},defaultSettings ), options || {} );
            p.allSlides = container.children( p.settings.slideClass );
            p.isPlaying = false;
            p.tick = null;

            if ( p.allSlides.length == 0 ) return;

            var enableSlides = p.allSlides.filter( function(){
                    return !$( this ).hasClass( "ss-disabled" );
                }),
                firstRequest = enableSlides.filter( ".ss-start" );

            p.enableSlideCount = enableSlides.length;
            p.actualSlide = null;

            container.addClass( "ss-slide-show" );
            if ( container.css( "position" ) === "static" ){
                container.css( {position: "relative"} );
            }

            p.allSlides.addClass( "ss-slide" ).css(
                {
                    position: "absolute"
                }
            );

            $.each( enableSlides, function( index, el){
                var slide = $( el );
                slide.addClass( "ss-inqueue" ).data( "ss_index", index + 1 );
            });

            p.actualSlide = firstRequest.length == 0 ? enableSlides.first() : firstRequest.first();
            p.actualIndex = p.actualSlide.data( "ss_index" );
            p.actualSlide.addClass( "active" );

            /* инициализация панели управления */
            if ( p.settings.controls && Object.prototype.toString.call( p.settings.controls ) === "[object Array]" ){

                var controlArr = p.settings.controls,
                    control, i;

                for ( i = 0; i < controlArr.length && controlData.hasOwnProperty( controlArr[i] ); i++ ){

                    control = $( "." + controlData[controlArr[i]].className, container );
                    if ( control.length == 0 ){
                        control = $('<a class="' + controlData[controlArr[i]].className +
                            '" href="#">' + controlData[controlArr[i]].text + '</a>');
                        control.appendTo( container );
                    }
                    control.addClass( "ss-control" );
                    control.attr( "title", p.settings.enableHotKeys ?
                            controlData[controlArr[i]].title + controlData[controlArr[i]].hotKeyHelp :
                            controlData[controlArr[i]].title );
                    controlData[ controlArr[i] ].init.apply( this, [p] );
                }
            }

            /* инициализация прогрессбара */
            if ( p.settings.progressBar ){

                p.progressBar = $(".ss-progress", container );
                if ( p.progressBar.length == 0 ){

                    p.progressBar = $('<div class="ss-control ss-progress"></div>');
                    p.progressBar.css(
                        {
                            width: helperMethod.getPersentage( p.enableSlideCount, p.actualIndex ) + "%"
                        }
                    ).appendTo(container );
                }
            }

            /* инициализация счетчика слайдов */
            if ( p.settings.slideIndex && p.actualIndex ){

                p.slideIndex = $(".ss-slide-index", container );
                if ( p.slideIndex.length == 0 ){

                    p.slideIndex = $('<div class="ss-control ss-slide-index">' + p.actualIndex + '</div>');
                    p.slideIndex.appendTo(container );
                }
            }

            /* инициализация управления с клавиатуры */
            if ( p.settings.enableHotKeys ){

                $( document).on( "keydown._ss", function( e ){
                    if ( e.ctrlKey ){

                        if ( e.keyCode == 80 || e.keyCode == 13 ){
                            shareMethods.play.apply( _self );
                            e.preventDefault();
                        }

                        if ( e.keyCode == 70 ){
                            shareMethods.fullscreen.apply( _self );
                            e.preventDefault();
                        }

                    }else{

                        if ( e.keyCode == 37 || e.keyCode == 40 || e.keyCode == 8 ){
                            shareMethods.prev.apply( _self );
                            e.preventDefault();
                        }

                        if ( e.keyCode == 32 || e.keyCode == 38 || e.keyCode == 39 ){
                            shareMethods.next.apply( _self );
                            e.preventDefault();
                        }
                    }
                });
            }

            /* инициализация поддержки скроллинга */
            if ( p.settings.enableScroll ){

                var throttledPrev = $.throttle( 300, true, shareMethods.prev),
                    throttledNext = $.throttle( 300, true, shareMethods.next );

                container.on( "mousewheel._ss", function( e, delta, deltaX, deltaY ){

                    if ( deltaY > 0 ){
                        throttledPrev.apply( _self );

                    }else{
                        throttledNext.apply( _self );
                    }
                    e.preventDefault();
                })
            }

            /* инициализация панели с миниатюрами */
            if ( p.settings.thumbnails ){

                var thumbPanel = $( p.settings.thumbnails );
                if ( thumbPanel.length ){

                    var actualIndex = 0;
                    $.each( p.allSlides, function( index, el ){

                        var slide = $( el ),
                            thumb = $('<div class="ss-thumb"></div>');

                        thumb.appendTo( thumbPanel );
                        if ( !slide.hasClass( "ss-disabled" ) ){
                            actualIndex += 1;
                            thumb.data( "ss_index", actualIndex).addClass( "ss-inqueue").text( actualIndex );

                            if ( actualIndex == p.actualIndex ){
                                thumb.addClass( "active" );
                            }

                        }else{
                            thumb.addClass( "ss-disabled" );
                        }

                        helperMethod.generateThumb.apply( this, [ slide, thumb ] );
                    });

                    if ( p.allSlides.length ){

                        thumbPanel.on( "click._ss", ".ss-inqueue", function( e ){

                            var thumb = $( this ),
                                index = thumb.data( "ss_index" );

                            shareMethods.stop.apply( _self );
                            helperMethod.loadSlide.apply( _self, [index] );
                            $( ".active", thumbPanel ).removeClass( "active" );
                            thumb.addClass( "active" );
                            e.preventDefault();
                        });
                    }

                    if ( container.has( thumbPanel ) ){
                        thumbPanel.addClass( "ss-control" );
                    }
                }
            }

            $( ".ss-control", container ).css(
                {
                    "z-index": 3000
                }
            );
            container.data( "ss_data", p );

            if ( p.settings.autoplay ){
                shareMethods.play.apply( this );
            }
        },

        /**
         * Загрузчик нового активного слайда. Может обрабатывать как указание направдения "next" или "prev",
         * так и запросы на загрузку конкретных слайдов по номерам
         *
         * @param param
         * @returns {null|*}
         */
        loadSlide: function( param ){
            var container = $( this ),
                p = container.data( "ss_data" ),
                requireSlide = null;

            if ( Object.prototype.toString.call( param ) === "[object Number]" ){
                param--;

                if ( param != p.actualIndex - 1 && param >= 0 && param < p.enableSlideCount ){
                    requireSlide = $( ".ss-inqueue:eq(" + param + ")", container );
                }

            }else{

                var searchNode = p.actualSlide[param]( ".ss-slide" );

                while ( requireSlide == null && searchNode.length ){

                    if ( searchNode.hasClass( "ss-disabled" ) ){
                        searchNode = searchNode[param]( ".ss-slide" );
                        continue;
                    }
                    requireSlide = searchNode;
                }
            }

            if ( requireSlide && requireSlide != p.actualSlide ){
                helperMethod.toggleSlides( p.actualSlide, requireSlide, p.settings, function( slideIndex ){

                    if ( p.settings.progressBar ){

                        p.progressBar.css(
                            {
                                width: helperMethod.getPersentage( p.enableSlideCount, slideIndex ) + "%"
                            }
                        );
                    }

                    if ( p.settings.slideIndex ){
                        p.slideIndex.text( slideIndex );
                    }
                });

                p.actualSlide = requireSlide;
                p.actualIndex = p.actualSlide.data( "ss_index" );

                if ( p.settings.thumbnails ){
                    var thumbPanel = $( p.settings.thumbnails );

                    $(".active", thumbPanel).removeClass("active");
                    $(".ss-inqueue:eq(" + ( p.actualIndex - 1 ) + ")", thumbPanel).addClass( "active" );
                }
            }

            /* вернуть загружаемый слайд */
            return requireSlide || p.actualSlide ;

        },

        /**
         * Вспомогательный метод, управляет сменой текушего и нового активного слайдов.
         *
         * @param actualSlide - текущий слайд
         * @param requireSlide - слайд, ожидающий загрузки
         * @param settings  - настройки презентации
         * @param callback - вызывается после окончания смены слайдов
         */
        toggleSlides: function( actualSlide, requireSlide, settings, callback ){

            var effect = requireSlide.attr( "data-effect"),
                animateFunction = animateFunctions.hasOwnProperty( effect ) ? animateFunctions[effect] :
                                  animateFunctions.hasOwnProperty( settings.toggleEffect ) ? animateFunctions[settings.toggleEffect] : animateFunctions.base,
                animateRequest = animateFunction( actualSlide, requireSlide );

            if ( callback ){
                animateRequest.done( callback( requireSlide.data("ss_index")) );
            }
        },

        /**
         * Вспомогательный метод. Возвращает процентную долю числа от целого.
         * Используется для управления прогрессбаром презентации
         *
         * @param total
         * @param part
         * @returns {number}
         */
        getPersentage: function( total, part ){
            if ( total == 0 ) return 0;
            return part / total * 100;
        },

        /**
         * Сгенерировать эскиз слайда
         *
         * @param slide
         * @param thumb
         */
        generateThumb: function( slide, thumb ){

            var desc = slide.attr( "data-desc" );
            if ( !!desc ){
                $( '<h3 class="ss-thumb-desc">' + desc + '</h3>').appendTo( thumb );
            }
            if ( slide.css( "display" ) === "none" ){
                slide.get(0).style.display = "block";
            }
            try{   /* попытка сгенерировать эскиз слайда */
                html2canvas( slide.get(0), {
                    onrendered: function ( canvas ){
                        if ( !canvas.toDataURL ) return;
                        var jqCanvas = $( canvas );

                        jqCanvas.appendTo( "body" );
                        thumb.css( 'background-image', 'url("' + canvas.toDataURL() + '")');
                        jqCanvas.remove();
                        slide.get(0).style.display = null;
                    }
                });
            }catch( e ){ /* намеренно тушим исключение */ }
        }
    };

    /**
     * Методы, достыпнве для пользователя системы
     *
     * @type {{next: Function, prev: Function, go: Function, play: Function, stop: Function, fullscreen: Function}}
     */
    var shareMethods = {

        /**
         * Загружает слайд из очереди, следующий за текущим
         * Позволяет двигаться по очереди слайдов вперед
         *
         */
        next: function(){
            shareMethods.stop.apply( this );
            helperMethod.loadSlide.apply( this, ["next"] );
        },

        /**
         * Загружает слайд из очереди, следующий перед текущим
         * Позволяет двигаться по очереди слайдов назад
         *
         */
        prev: function(){
            shareMethods.stop.apply( this );
            helperMethod.loadSlide.apply( this, ["prev"] );
        },

        /**
         * Позволяет перейти к указанному слайду
         * Позволяет произвольно перемещаться по очереди слайдов
         *
         * @param slideIndex
         */
        go: function( slideIndex ){
            helperMethod.loadSlide.apply( this, [slideIndex] );
        },

        /**
         * Запускает автопроигрывание презентации
         */
        play: function(){

            var container = $( this ),
                _self = this,
                p = container.data( "ss_data" );

            if ( !p.isPlaying ){

                var playBtn = container.find(".ss-play"),
                    lastSlide = p.actualSlide;

                playBtn.addClass( "ss-playing" ).text( controlData.play.textActive).attr( "title", controlData.play.titleActive );
                p.isPlaying = true;

                p.tick = setInterval( function(){

                    var slide = helperMethod.loadSlide.apply( _self, ["next"] );
                    if ( slide == lastSlide ){
                        shareMethods.stop.apply( _self );
                    }else{
                        lastSlide = slide;
                    }

                } , p.settings.autoplayDelay);

                container.data( "ss_data", p );
            }
        },

        /**
         * Останавливает автопроигрывание презентации
         */
        stop: function(){

            var container = $( this ),
                p = container.data( "ss_data" );

            if ( p.isPlaying ){
                p.isPlaying = false;
                clearInterval( p.tick );
                container.find( ".ss-play" ).removeClass( "ss-playing" ).text( controlData.play.text).attr( "title", controlData.play.title );
                container.data( "ss_data", p );
            }

        },

        /**
         * Включает полноэкранный режим презентации
         */
        fullscreen: function(){

            //TODO: не срабатывает при вызове через API

            var container = $( this ),
                _self = this;

            if ( !container.hasClass( "ss-fs-active" ) ){

                if ( document.fullScreen ){
                    document.fullScreen.call( this[0] );

                }else{
                    $( "body" ).addClass("ss-fs-active" );
                    container.css( {position: "fixed"} );
                }
                container.find( ".ss-fullscreen" )
                    .addClass( "ss-expanded")
                    .text( controlData.fullscreen.textActive)
                    .attr( "title", controlData.fullscreen.titleActive );
                container.addClass( "ss-fs-active" );

                /* перехватываем ESC для режима эмуляции  и обновления состояния кнопки в современном режиме*/
                $( document ).on( "keyup._ss_esc", function( e ){
                    if ( e.keyCode == 27 ){
                        shareMethods.fullscreen.apply( _self );
                    }
                });

            }else{

                if ( document.cancelFullScreen ){
                    document.cancelFullScreen();

                }else{
                    $( "body" ).removeClass( "ss-fs-active" );
                    container.css( {position: "relative"} );
                }

                container.find( ".ss-fullscreen" )
                    .removeClass( "ss-expanded" )
                    .text( controlData.fullscreen.text )
                    .attr( "title", controlData.fullscreen.title );
                container.removeClass( "ss-fs-active" );

                /* удалить обработчик перехвата ESC */
                $( document ).off( "keyup._ss_esc" );
            }
        },

        /**
         * Откат к неинициализированному состоянию
         */
        destroy: function(){
            var container = $( this ),
                p = container.data( "ss_data" );

            if ( p.settings.enableHotKeys ){
                $( document).off( "keydown._ss" );
            }

            if ( p.settings.enableScroll ){
                container.off( "mousewheel._ss" );
            }

            if ( p.settings.thumbnails ){
                var thumbContainer = $( p.settings.thumbnails );
                thumbContainer.off( "click._ss" );
                $( ".ss-thumb", thumbContainer).remove();
            }

            $( ".ss-slide", container ).removeClass( "ss-slide ss-inqueue active" );
            $( ".ss-control", container ).remove();

            container.off( "click._ss" );
            container.removeData( "ss_data" );
        }
    };


    $.fn.presentation = function( options ){

        if ( this.length > 1 ){

            $.each( this, function( index, el){
                $( el).presentation( options );
            });

        }else{

            if ( shareMethods.hasOwnProperty( options ) ){
                shareMethods[options].apply( this, Array.prototype.slice.call( arguments, 1 ) );

            }else if ( !options || Object.prototype.toString.call( options ) === "[object Object]" ){
                helperMethod.init.apply( this, arguments );
            }else{
                throw new Error( "Method [" + options + "] not found in presentation api." );
            }
        }
        return this;
    }

}( jQuery, window ));