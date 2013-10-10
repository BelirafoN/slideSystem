slideSystem
===========
jQuery-плагин для создания web-презентаций

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
    * По умолчанию имя класса не используется
    * В качестве слайдов презентации выбираются все прямые потомки блока.

* `autoplay` - автовоспроизведение презентации после загрузки страницы.
    *По умолчанию `false`, автовоспроизведение не используется.

* `autoplayDelay` - задержка в миллисекундах между сменами слайдов во время воспроизведения.
    * По умолчанию 2000.

* `progressBar` - отобразить в блоке прогрессбар презентации.
    * Поумолчанию true, прогрессбар отображается.

* `slideIndex` - отобразить в блоке номер текущего слайда.
    * Поумолчанию true, номер слайда отображается.

* `thumbnails` - селектор блока с миниатюрами солайдов.
    * Если селектор не указан, миниатюры слайдов построены не будут.
    * По умолчанию не используется.

* `controls` - перечисление элементов управления презентацией.
    * Возможные значения:
        * `all` - добавить все элементы;
        * массив с названиями элементов, которые следует добавить;
        * `null` или `false` - не добавлять никаких элементов

* `enableHotKeys` - активировать управление с помощью горячих клавиш.
    * По умолчанию значение false, не активно.

* `enableScroll` - активировать управление с помощью колеса мыши.
    * По умолчанию значение false.

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

##### демо: http://voronyansky.com/demo/slidesystem
