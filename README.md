slideSystem
===========
jQuery-плагин для создания web-презентаций

## Использование

$( "#slideshow" ).presentation( options );


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
    * По умолчанию имя класса не используется
    * В качестве слайдов презентации выбираются все прямые потомки блока.

* `autoplay` - автовоспроизведение презентации после загрузки страницы.
    *По умолчанию `false`, автовоспроизведение не используется.

Пример:
```js
    $( "#slideshow" ).presentation(
         {
            slideClass: ".slide"
         }
    );
```

* `autoplayDelay` - задержка в миллисекундах между сменами слайдов во время воспроизведения.
    * По умолчанию 2000.

Пример:
```js
    $( "#slideshow" ).presentation(
         {
            autoplayDelay: 5000
         }
    );
```

* `progressBar` - отобразить в блоке прогрессбар презентации.
    * Поумолчанию true, прогрессбар отображается.

Пример:
```js
    $( "#slideshow" ).presentation(
         {
            progressBar: true
         }
    );
```

* `slideIndex` - отобразить в блоке номер текущего слайда.
    * Поумолчанию true, номер слайда отображается.

Пример:
```js
    $( "#slideshow" ).presentation(
         {
            slideIndex: true
         }
    );
```

* `thumbnails` - селектор блока с миниатюрами солайдов.
    * Если селектор не указан, миниатюры слайдов построены не будут.
    * По умолчанию не используется.

Пример:
```js
    $( "#slideshow" ).presentation(
         {
            thumbnails: "#thumbs"
         }
    );
```

* `controls` - перечисление элементов управления презентацией.
    * Возможные значения:
        * `all` - добавить все элементы;
        * массив с названиями элементов, которые следует добавить;
        * `null` или `false` - не добавлять никаких элементов

Пример:
```js
    $( "#slideshow" ).presentation(
         {
            controls: ["prev", "play", "next"]
         }
    );
```

* `enableHotKeys` - активировать управление с помощью горячих клавиш.
    * По умолчанию значение false, не активно.

Пример:
```js
    $( "#slideshow" ).presentation(
         {
            enableHotKeys: true
         }
    );
```

* `enableScroll` - активировать управление с помощью колеса мыши.
    * По умолчанию значение false.

Пример:
```js
    $( "#slideshow" ).presentation(
         {
            enableScroll: true
         }
    );
```

* `toggleEffect` - задать эффект смены слайдов.

Пример:
```js
    $( "#slideshow" ).presentation(
         {
            toggleEffect: 'fade'
         }
    );
```

#### Методы

скоро

##### демо: http://voronyansky.com/demo/slidesystem
