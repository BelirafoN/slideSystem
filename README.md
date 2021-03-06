slideSystem
===========
jQuery-плагин для создания web-презентаций

## Зависимости

* Если в параметрах презентации запрошена поддержка эскизов слайдов
    * потребуется <a target="_blank" href="https://github.com/niklasvh/html2canvas">html2canvas.js</a>.
* Если в параметрах презентации запрошена поддержка управления колесом мыши
    * потребуются <a target="_blank" href="https://github.com/brandonaaron/jquery-mousewheel">jquery.mousewheel.js</a>;
    * потребуются <a target="_blank" href="https://github.com/cowboy/jquery-throttle-debounce">jquery.ba-throttle-debounce.js</a>;
* Указанные в зависимостях файлы, можно найти по ссылкам или в каталоге `lib`.

## Использование

```js
$( "#slideshow" ).presentation( options );
```

#### Параметры

##### По умолчанию:

```js
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
```

* `slideClass` - имя класса, которое будет использовано для поиска слайдов в блоке презентации.
    * По умолчанию имя класса не используется.
    * В качестве слайдов презентации выбираются все прямые потомки блока.

* `autoplay` - автовоспроизведение презентации после загрузки страницы.
    * По умолчанию `false`, автовоспроизведение не используется.

* `autoplayDelay` - задержка в миллисекундах между сменами слайдов во время воспроизведения.
    * По умолчанию `2000`.

* `progressBar` - отобразить в блоке прогрессбар презентации.
    * Поумолчанию `true`, прогрессбар отображается.

* `slideIndex` - отобразить в блоке номер текущего слайда.
    * Поумолчанию `true`, номер слайда отображается.

* `thumbnails` - селектор блока с миниатюрами солайдов.
    * Если селектор не указан, миниатюры слайдов построены не будут.
    * По умолчанию не используется.

* `controls` - перечисление элементов управления презентацией.
    * Возможные значения:
        * `all` - добавить все элементы;
        * массив с названиями элементов, которые следует добавить;
        * `null` или `false` - не добавлять никаких элементов

* `enableHotKeys` - активировать управление с помощью горячих клавиш.
    * По умолчанию значение `false`, не активно.

* `enableScroll` - активировать управление с помощью колеса мыши.
    * По умолчанию значение `false`.

* `toggleEffect` - задать эффект смены слайдов.

Пример:
```js
    $( "#slideshow" ).presentation(
         {
            slideClass: ".slide",
            autoplay: true,
            autoplayDelay: 5000,
            progressBar: true,
            slideIndex: true,
            thumbnails: false,
            controls: "all",
            enableHotKeys: true,
            enableScroll: true,
            toggleEffect: "fade"
         }
    );
```

#### Методы

* `next` - перейти к следующему слайду
Пример:
```js
$( "#slideshow" ).presentation( "next" );
```

* `prev` - перейти к предыдущему слайду
Пример:
```js
$( "#slideshow" ).presentation( "prev" );
```

* `go` - перейти к слайду с указанным номером
Пример:
```js
$( "#slideshow" ).presentation( "go", 2 );
```

* `play` - начать автоматическое проигрывание презентации
Пример:
```js
$( "#slideshow" ).presentation( "play" );
```

* `stop` - остановить автоматическое проигрывание презентации
Пример:
```js
$( "#slideshow" ).presentation( "stop" );
```

* `fullscreen` - развернуть/светнуть презентацию в полноэкранный режим
Пример:
```js
$( "#slideshow" ).presentation( "stop" );
```

* `destroy` - откатить блок презентации в неинициализированное состояние
Пример:
```js
$( "#slideshow" ).presentation( "destroy" );
```

#### CSS Классы

Для простой привязки стилей при инициализации каждая функциональная часть презентации получает свой класс.
Что куда навешивается:

* `.ss-slide-show` - на блок со слайдами;
    * Активный слайд получает дополнительный класс `.active`
* `.ss-slide` - на слайд;
* `.ss-control` - элемент навигации или управления;
* `.ss-prev` - кнопка "Назад", если есть;
* `.ss-next` - кнопка "Вперед", если есть;
* `.ss-play` - кнопка "Воспроизвести", если есть;
    * Когда презентация находится в режиме воспроизведения, кнопке добавляется дополнительный класс `.ss-playing`
* `.ss-fullscreen` - кнопка "На весь экран", если есть;
    * Когда презентация развернута на весь экран, кнопке добавляется дополнительный класс `.ss-expanded`
    * Когда презентация развернута на весь экран, <body> и блок со слайдами получают дополнительный класс `.ss-fs-active`
    * Используя класс `.ss-fs-active`, легко реализовать разворачивание на весь экран в браузерах, не имеющих поддержки FullScreen API
* `.ss-slide-index` - номер слайда, если есть;
* `.ss-progress` - прогрессбар презентации, если есть;
* `.ss-thumb` - эскиз слайжа, если есть;
    * Активный эскиз получает дополнительный класс `.active`

#### Дополнительные возможности

Декларативно можно кастомизировать любой слайд.

* Если слайду добавить класс `.ss-disabled`, он будет исключен из потока презентации.
* Если слайду добавить класс `.ss-start`, презентация будет начала с этого слайда.
    * Если слайдов с классом `.ss-start` несколько, в качестве стартового будет выбран первый.
* В атрибуте `data-desc` можно указать краткое описание к слайду.
    * В случае указания такого описания, оно будет использовано для подписания эскиза слайда на панеле навигации.
* В атрибуте `data-effect` можно указать название анимационного эффекта, который будет использован при отображении данного слайда.
    * Эффект будет применен только к данному слайду, независимо от настроек презентации

Пример разметки слайда
```html
<div class="ss-disabled ss-start" data-effect="scrolllr" data-desc="слайд №1" >Контент слайда</div>
```

##### демо: http://voronyansky.com/demo/slidesystem
