

const LanguageStoreRu = {
    language: 'ru',
    Calendar: {
      Month: 'Выбор месяца',
      Year: 'Выбор года',
      ListMonthFullName: [
        'Январь' ,
        'Февраль' ,
        'Март' , 
        'Апрель' , 
        'Май' , 
        'Июнь' , 
        'Июль' , 
        'Август' , 
        'Сентябрь' , 
        'Октябрь' , 
        'Ноябрь', 
        'Декабрь' ,
      ],
      ListMonthShortName: [
        'Янв.' ,
        'Фев.' ,
        'Март' , 
        'Апр.' , 
        'Май' , 
        'Июнь' , 
        'Июль' , 
        'Авг.' , 
        'Сен.' , 
        'Окт.' , 
        'Нояб.', 
        'Дек.' 
      ],
      ListWeekDaysShortName: [
        'Пн' ,
        'Вт' ,
        'Ср' ,
        'Чт' ,
        'Пт' ,
        'Сб' ,
        'Вс' 
      ],
    },
    Pointer: {
      ClickAdd: 'Нажми, чтобы добавить задачу',
    },
    NoTaskMessage: {
      NoTasks: 'У тебя нет задачь? - Повезло тебе!',
    },
    TrojanButton: {
      ALL: 'Всё',
    },
    DeleteAlert: {
      Warning: 'Предупреждение',
      DeleteAll: 'Удалить ВСЕ задачи?',
      Cancel: 'Отмена',
      Ok: 'Да',
    },
    ModalInput: {
      title: 'Редактор задачь',
      text: 'Текст задачи',
      placeholderInputArea: "Твоя задача ...",
      to: 'До',
      placeholderTimeArea: "Время окончания",
      placeholderDateArea: "Дата окончания",
      deadlineTarget: 'Задача начнет гореть за',
      placeholderDeadlineTargetArea: "Время до пожара",
    },
    ListItems: {
      to: 'До',
      from: 'От'
    },
    SettingsScreen: {
      HeaderTitle: 'настройки',
      app: 'приложения',
      LanguageSettings: {    
        selector: 'Выберете язык',
        engRu: ['Английский', 'Русский']
      },
      PainterScreen: {
        title: 'редактор цветов',
        mod: 'режим',
        themes: {light: 'светлая тема', dark: 'темная тема'},
        isNew: 'Сохранить изменения для новой палитры и выйти?',
        isNewActions: {y: 'Да', n: 'Нет', yn: 'Выйти без сохранения'},
        saved: 'Палитра сохранена',
        fullMod: {
          title: 'полный',
          statusBarStyle: 'Цвет символов строки состояния',
          barStyles: {
            auto: 'автоматический',
            inverted: 'инвертированный',
            light: 'светлый',
            dark: 'темный'
          },
          traceActions: {
            lightGradient: 'Светлый градиент',
            darkGradient: 'Темный градиент',
            distributeValue: 'Распространить значение'
          }
        },
        easeMod: {
          title: 'быстрый',
          stages: {
            hue: 'Оттенки',
            saturation: 'Насыщенность',
            lightness: 'Яркость',
            almost: 'Почти всё готово!'
          },
          accept: 'Принять',
          changeGradient: 'Изменить направление градиента',
          changerText: 'Изменить цвет текста',
          back: 'Отменить шаг',
          clear: 'Сбросить всё'
        }
      },
      stackTransition: {
        loadPainter: "Переход к редактору...",
      },
      StructureScreen: {
        typesSettings: {
          appearance: {
            type: 'интерфейса',
            category: 'интерфейс'
          },

          functions: {
            type: 'функционала',
            category: 'функционал'
          },
          
          additional: {
            type: 'для каждого',
            category: 'распространение'
          },
        },

        categorys: [
          "внешнего вида",
          "системы",
          "спец"
        ],

        subCategorys: {
          globalProperties: 'общее',
          elements: 'элементы',
          additionalFunctions: 'дополнительное',  
        },

        params: {

          presets: 'пресет',
          
          effects: "эффекты", 

          thema: "цвета", 
          borderRadius: "скругления", 
          navigationMenu: "меню навигации", 
          loadAnimation: "загрузка",
          lists: "ленты",
          bobberButton:"плавающие кнопки",
          modals: 'модальные окна',
          language: "язык",
          //"location", 
          appFunctions:"экраны",
          user: "пользователь",
          
          weather: "погода",
          ohters: "информация"
        }
      },
      Redactors: {
        themes: {
          colorMode: "Тема",
          colorsMods: {auto: 'Системная', light: 'Светлая', dark: 'Темная'},
          palette: "Палитра",
          openPainter: "редактор"
        },
        fillets: {
          synhronous: "Синхронизация значений",
          synhronousState: {true: "включена", false: "выключена"},
          type: {
            basic: "Базовые элементы", 
            additional: "Дополнительные элементы"
          },
          slider: {min: "прямее", max: "круглее"}
        },
        navigationMenu: {
          type: "Тип меню",
          types: ["Классическое","Скрытое","Выдвижная панель"],
          menuParams: "Параметры меню",
          rippleEffect: 'Эффект пульсации при нажатии',
          rippleEffectState: {true: "включен", false: "выключен"},
          height: "Высота",
          slider: {min: "ниже", max: "выше"},
          signature: "Подписи иконок",
          signatureState: {true: "включены", false: "выключены"},
          verticalPosition: "Вертикальное положение",
          horizontalPosition: "Горизонтальное положение",
          horizontalPositions: ["Слева","По центру","Справа"],
          horizontalPositionDrawer: "Панель выдвигается",
          horizontalPositionsDrawer: ["Слева","Справа"]
        },
        loadAnimation: {
          info: "...",
          show: "Показ анимации при запуске",
          showState: {true: "включен", false: "выключен"},
        },
        lists: {
          textSize: "Размер текста в элементах списка",
          slider: {min: "меньше", max: "больше"},
          proximity: "Отступы между элементами списка",
          fullWidth: "Элементы списка занимают всю ширину экрана",
          fullWidthState: {true: "включено", false: "выключено"},
          shadows: "Тени элементов списка",
          shadowsState: {true: "включены", false: "выключены"},  
        },
        bobberButton: {
          position: "Положение на экране",
          positions: ["Слева","По центру","Справа"],
          size: "Размер кнопки",
          slider: {min: "меньше", max: "больше"},
        },
        modals: {
          horizontalProximity: 'Окно занимает всю ширину экрана',
          horizontalProximityState: {true: "включено", false: "выключено"},
          outline: 'Контур',
          outlineState: {true: "включен", false: "выключен"},
          dimOut: 'Затемнение вне окна при открытие',
          dimOutState: {true: "включено", false: "выключено"},
          highlightMethods: 'Способ выделения окна',
          //outline: 'Window outline',
          dimOutDark: 'Затемнение',
          //dimOutLight: 'Засветление',
          gradient: 'Градиент границы',
        },
        languages: {
          thisLanguage: 'Использовать русский'
        },
        weather: {
          used: 'Определять и использовать погоду',
          usedState: {true: "включено", false: "выключено"},
          type: 'Тип отображеня погоды',
          types: {
            lists: 'В списках', 
            widget: 'Виджет', 
            panel: 'В панеле'
          },
          locations: 'Используемые местоположения',
          add: 'Добавление нового местоположения',
          replace: 'Замена выбранного местоположения',
          //location: 'местоположение',
          network: 'Определено сетью',
          device: 'Определено устройством',
          errorsDevice: {
            '0': 'Нет запроса',  
          }
        },
        user: {
          name: "Имя",
          accost: "Как к тебе обращаться?",
          welcome: 'Приветствие на экране загрузки',
          welcomeState: {true: "включено", false: "выключено"},
        }
      }
    },
    SplachScreen: {
      night: 'Доброй ночи',
      morning: 'Доброе утро', 
      day: 'Добрый день', 
      evening: 'Добрый вечер'
    },
    TasksScreen: {
      HeaderTitle: 'задачи',
    },
    AnalyticsScreen: {
      HeaderTitle: 'аналитика',
    },
    Weather: {
      actualWeather: 'Актуальная погода',
      country: 'Страна',
      area: 'Область',
      city: 'Город',
      today: 'Сегодня',
      morrow: 'Завтра',
      now: 'Сейчас',
      feelsLike: 'Ощущается как',
      windFrom: ['С','СВ','В','ЮВ','Ю','ЮЗ','З','СЗ'],
      ms: 'м/с',
      calm: 'штиль',
      loadingData: 'Загрузка данных',
      netConnectError: 'Ошибка подключения сети'
    }
}
  
  
const LanguageStoreEng = {
    language: 'en',
    Calendar: {
      Month: 'Selection month',
      Year: 'Selection year',
      ListMonthFullName: [
        'January' ,
        'February' ,
        'March' , 
        'April' , 
        'May' , 
        'June' , 
        'July' , 
        'August' , 
        'September' , 
        'October' , 
        'November',
        'December' ,
      ],
      ListMonthShortName: [
        'Jan.' ,
        'Feb.' ,
        'Mar.' , 
        'Apr.' , 
        'May' , 
        'Jun.' , 
        'Jul.' , 
        'Aug.' , 
        'Sep.' , 
        'Oct.' , 
        'Nov.', 
        'Dec.' 
      ],
      ListWeekDaysShortName: [
        'Mon' ,
        'Tue' ,
        'Wed' ,
        'Thu' ,
        'Fri' ,
        'Sat' ,
        'Sun' 
      ],
    },
    Pointer: {
      ClickAdd: 'Click to add a task',
    },
    NoTaskMessage: {
      NoTasks: 'You have no tasks? - Lucky you!',
    },
    TrojanButton: {
      ALL: 'All',
    },
    DeleteAlert: {
      Warning: 'Warning',
      DeleteAll: 'Delete ALL tasks?',
      Cancel: 'Cancel',
      Ok: 'Ok',
    },
    ModalInput: {
      title: 'Task redactor',
      text: 'Text task',
      placeholderInputArea: "Text of your task",
      to: 'To',
      placeholderTimeArea: "Time end",
      placeholderDateArea: "Date end",
      deadlineTarget: 'Task burn',
      placeholderDeadlineTargetArea: "Time to fire",
    },
    ListItems: {
      to: 'To',
      from: 'From'
    },
    SettingsScreen: {
      HeaderTitle: 'settings for',
      app: 'app',
      LanguageSettings: {
        selector: 'Select language',
        engRu: ['English', 'Russian']
      },
      PainterScreen: {
        title: 'color editor',
        mod: 'mode',
        themes: {light: 'light theme', dark: 'dark theme'},
        isNew: 'Save changes to new palette and exit?',
        isNewActions: {y: 'Yes', n: 'No', yn: 'Exit without saving'},
        saved: 'Palette saved',
        fullMod: {
          title: 'full',
          statusBarStyle: 'Color of status bar symbols',
          barStyles: {
            auto: 'automatic',
            inverted: 'inverted',
            light: 'light',
            dark: 'dark'
          },
          traceActions: {
            lightGradient: 'Light gradient',
            darkGradient: 'Dark Gradient',
            distributeValue: 'Distribute value'
          }
        },
        easeMod: {
          title: 'fast',
          stages: {
            hue: 'Hues',
            saturation: 'Saturation',
            lightness: 'Brightness',
            almost: 'Almost done!'
          },
          accept: 'Accept',
          changeGradient: 'Change gradient direction',
          changerText: 'Change text color',
          back: 'Undo step',
          clear: 'Reset all'
        }
      },
      stackTransition: {
        loadPainter: "Going to the editor...",
      },
      StructureScreen: {
        typesSettings: {
          appearance: {
            type: 'interface',
            category: 'interface'
          },

          functions: {
            type: 'functions',
            category: 'functions'
          },

          additional: {
            type: 'rest of it',
            category: 'rest of it'
          },
        },

        subCategorys: {
          globalProperties:'global properties',
          elements: 'elements',
          additionalFunctions: 'additional functions',  
        },

        params: {
          presets: 'presets',
          
          thema: "theme", 
          borderRadius: "fillets",
          effects: "effects", 

          navigationMenu: "navigation menu", 
          loadAnimation: "loading animation",
          lists: "lists",
          bobberButton:"bobber button",
          modals: 'popup windows',

          language: "language",
          user: "user",
          //"location", 
          appFunctions: "functions",

          weather: "weather", 

          ohters: "others"
        }
      },
      Redactors: {
        themes: {
          colorMode: "Color mode",
          colorsMods: {auto: 'Systemic', light: 'Light', dark: 'Dark'},
          palette: "Palette",
          openPainter: "redactor"
        },
        fillets: {
          synhronous: "Value synchronization",
          synhronousState: {true: "on", false: "off"},
          type: {
            basic: "Basic elements", 
            additional: "Additional elements"
          },
          slider: {min: "straighter", max: "rounder"}
        },
        navigationMenu: {
          type: "Type menu",
          types: ["Classical","Hidden", "Retractable panel"],
          menuParams: "Menu params",
          rippleEffect: 'Ripple effect when pressed',
          rippleEffectState: {true: "on", false: "off"},
          height: "Height",
          slider: {min: "up", max: "more"},
          signature: "Icons signature",
          signatureState: {true: "on", false: "off"},
          verticalPosition: "Vertical position",
          horizontalPosition: "Horizontal position",
          horizontalPositions: ["Left","Center","Right"],
          horizontalPositionDrawer: "Panel slides out",
          horizontalPositionsDrawer: ["Left","Right"]
        },
        loadAnimation: {
          info: "...",
          show: "Animation on startup",
          showState: {true: "on", false: "off"},
        },
        lists: {
          textSize: "Text size in list items",
          slider: {min: "less", max: "more"},
          proximity: "Spacing between list items",
          fullWidth: "List items take up the full width of the screen",
          fullWidthState: {true: "on", false: "off"},
          shadows: "List item shadows",
          shadowsState: {true: "on", false: "off"},  
        },
        bobberButton: {
          position: "Position on screen",
          positions: ["Left","Center","Right"],
          size: "Button size",
          slider: {min: "less", max: "more"},
        },
        modals: {
          horizontalProximity: 'Window takes up the full width of the screen',
          horizontalProximityState: {true: "enabled", false: "disabled"},
          outline: 'Оutline',
          outlineState: {true: "on", false: "off"},
          dimOut: 'Dimout outside window when opened',
          dimOutState: {true: "enabled", false: "disabled"},
          highlightMethods: 'Window highlight method',
          //outline: 'Window outline',
          dimOutDark: 'Dark Dimout',
          //dimOutLight: 'Light Dimout',
          gradient: 'Gradient bord',
        },
        languages: {
          thisLanguage: 'Use English'
        },
        weather: {
          used: 'Detect and use weather',
          usedState: {true: "on", false: "of"},
          type: 'Weather display type',
          types: {
            lists: 'In lists', 
            widget: 'Widget', 
            panel: 'In panel'
          },
          locations: 'Used Locations',
          add: 'Adding a new location',
          replace: 'Replace the selected location',
          //location: 'location',
          network: 'Defined by network',
          device: 'Determined by device',
          errorsDevice: {
            '0': 'No request',  
          }
        },
        user: {
          name: "Name",
          accost: "How to contact you?",
          welcome: 'Loading screen welcome',
          welcomeState: {true: "on", false: "of"},
        }
      }
    },
    SplachScreen: {
      night: 'Good night',
      morning: 'Good morning',
      day: 'Good day', 
      evening: 'Good evening',
    },
    TasksScreen: {
      HeaderTitle: 'tasks',
    },
    AnalyticsScreen: {
      HeaderTitle: 'analytics',
    },
    Weather: {
      actualWeather: 'Actual weather',
      country: 'Country',
      area: 'Area',
      city: 'City',
      today: 'Today',
      morrow: 'Morrow',
      now: 'Now',
      feelsLike: 'Feels like',
      windFrom: ['N','NE','E','SE','S','SW','W','NW'],
      ms: 'm/s',
      calm: 'calm',
      loadingData: 'Loading data',
      netConnectError: 'Network connection error'
    }
}


const languagesAppList = [LanguageStoreEng,LanguageStoreRu];  
export default languagesAppList;
export const languagesApp = ['en','ru']; 
  