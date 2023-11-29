export default LanguageStoreRu = {
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
    SettingsScreen: {
      HeaderTitle: 'настройки',
      //app: 'приложения',
      preview: {
        title: 'предпросмотр',
        //apply: 'Принять изменения',
        toolbar: {
          hide: 'свернуть',
          show: 'показать',
          apply: 'принять'
        },
      },
      LanguageSettings: {    
        selector: 'Выберете язык',
        engRu: ['Английский', 'Русский']
      },
      NFCScreen: {
        title: 'NFC',
      },
      PainterScreen: {
        title: 'редактор цветов',
        mod: 'режим',
        themes: {light: 'светлая тема', dark: 'темная тема'},
        isNew: 'Создана новая палитра',
        isNewActions: {y: 'Сохранить и выйти', n: 'Не выходить', yn: 'Выйти без сохранения'},
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
          title: 'акцентный',
          stages: {
            step: 'шаг из',
            hue: 'Оттенок',
            saturation: 'Насыщенность',
            lightness: 'Яркость',
            almost: 'Готово!'
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
          app: {
            type: "приложения",
          },
          appearance: {
            type: 'интерфейса',
            category: 'интерфейс'
          },

          functions: {
            type: 'функций',
            category: 'функционал'
          },
          
          additional: {
            type: 'для каждого',
            category: 'информация'
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

          selectors: 'переключатели',
          navigationMenu: "меню навигации", 
          loadAnimation: "Заставка",
          lists: "страницы",
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
        presets: {
          appAs: 'Дизайн интерфейса приложения',
          saveFAB: 'Не менять настройку "плавающие кнопоки"',
          saveNavigation: 'Не менять настройку "меню навигации"',
          stateSave: {true: "активно", false: "выключено"},
        },
        themes: {
          colorMode: "Тема",
          colorsMods: {auto: 'Системная', light: 'Светлая', dark: 'Темная'},
          statusBarStyle: 'Цвет символов строки состояния',
          barStyles: {
            auto: 'Aвтоматический',
            //inverted: 'Инвертированный',
            light: 'Светлый',
            dark: 'Tемный'
          },
          palette: "Палитра",
          painter: "Редактор палитры",
          openPainter: "редактор"
        },
        fillets: {
          synhronous: "Синхронизация значений",
          synhronousState: {true: "включена", false: "выключена"},
          type: {
            primary: "Первичные углы", 
            secondary: "Вторичные углы"
          },
          slider: {min: "прямее", max: "круглее"}
        },
        effects: {
          ripple: 'Пульсации',
          ripples: ['Все', 'Основные', 'Выключены'],
          shadows: 'Стиль теней',
          shadowsTypes: ['','','','','Выключены'],
           //['Стандартные','Полные','Неоморфические','Грубые','Выключены'],
          //shadowsTypes: ['Выключены','Неоморфические','Грубые','Полные','Стандартные','Основные стандартные',],
          blur: 'Эффекты стекла',
          blurState: {true: "включены", false: "выключены"},
          warningBlur: '! В активном состоянии данный параметр может вызвать проблемы с производительностью'
        },
        selectors: {
          disabledShadows: 'Игнорирование полного отключения теней',
          disabledShadowsState: {true: "включено", false: "выключено"},
          switchs: 'Тумблеры',
          checkBoxs: 'Флажки множественного выбора',
          radioButtons: 'Флажки одинарного выбора'
        },
        navigationMenu: {
          type: "Тип меню",
          types: ["Классическое нижнее", "Боковая выдвижная панель","Скрытое",],
          menuParams: "Параметры меню",
          height: "Высота меню",
          slider: {min: "ниже", max: "выше"},
          signature: "Подпись значков",
          signatureState: {true: "включена", false: "выключена"},
          verticalPosition: "Вертикальное положение",
          horizontalPosition: "Горизонтальное положение",
          horizontalPositions: ["Слева","По центру","Справа"],
          horizontalPositionDrawer: "Панель выдвигается",
          horizontalPositionsDrawer: ["Слева","Справа"],
          accentsType: 'Способ акцентирования',
          accentsTypes: {
            coloring: 'Изменение цвета',
            filling: 'Изменение значка',
          }
        },
        loadAnimation: {
          info: "...",
          show: "Показ анимации при запуске",
          showState: {true: "включен", false: "выключен"},
          welcome: 'Приветствие на экране загрузки',
          welcomeState: {true: "включено", false: "выключено"},
        },
        lists: {
          textSize: "Размер текста в элементах списка",
          slider: {min: "меньше", max: "больше"},
          proximity: "Вертикальные отступы ",
          fullWidth: "Элементы без горизонтального отступа",
          fullWidthState: {true: "включен", false: "выключен"},
          invertColorsHeader: 'Нейтральные цвета заголовка' ,
          invertColorsHeaderState: {true: "включены", false: "выключены"},
        },
        bobberButton: {
          position: "Положение на экране",
          positions: ["Сверху (в заголовке)", "Снизу"],
          bottomPosition: "Горизонтальное положение",
          bottomPositionSlider: {min: 'левее', max: 'правее'},
          signatures: 'Подписи к значкам',
          signaturesState: {true: "включены", false: "выключены"},
          disabledShadows: 'Игнорирование полного отключения теней',
          disabledShadowsState: {true: "включено", false: "выключено"},
          size: "Размер",
          slider: {min: "меньше", max: "больше"},
          invertColors: 'Нейтральные цвета' ,
          invertColorsState: {true: "включены", false: "выключены"},
          outline: 'Контур',
          outlineState: {true: "включен", false: "выключен"},
        },
        modals: {
          horizontalProximity: "Окно без горизонтального отступа",
          horizontalProximityState: {true: "включен", false: "выключен"},
          outline: 'Контур окна',
          outlineState: {true: "включен", false: "выключен"},
          dimOut: 'Затемнение вне окна при открытие',
          dimOutState: {true: "включено", false: "выключено"},
          highlightMethods: 'Способы выделения окна',
          //outline: 'Window outline',
          dimOutDark: 'Затемнение фона',
          //dimOutLight: 'Засветление',
          gradient: 'Градиент верхней границы окна',
        },
        languages: {
          thisLanguage: 'Использовать русский'
        },
        weather: {
          type: 'Способ отображения погоды',
          types: {
            panel: 'Виджет в боковой панеле',
            lists: 'Элемент на главном экране', 
            //widget: 'Значок в заголовке главного экрана', 
            off: 'Выключена'
          },
          locations: 'Местоположение',
          add: 'Добавить новое',
          replace: 'Замена',
          //location: 'местоположение',
          network: 'Определено сетью',
          device: 'Определено устройством',
          errorsDevice: {
            '0': 'Нет запроса',  
          },
          gettingState: {
            dvc: {
              '0':   'Нажми для получения информации',
              '0.1': 'Ожидание разрешения',
              '0.2': 'Отказ в разрешении определения местоположения',
              '0.3': 'Определение геолокации',
              '0.4': 'Геолокация определена',
              '0.5': 'Определение населенного пункта',
              '0.9': 'Данный населенный пункт уже добавлен',
              '1':   'Вся информация получена',
            },  
            net: {
              '0':   'Нет информации',
              '0.1': 'Определение населенного пункта',
              '0.7': 'Населенный пункт не определен, возможна ошибка доступа',
              '0.9': 'Данный населенный пункт уже добавлен',
              '1':   'Вся информация получена',
            }   
          }
        },
        user: {
          name: "Имя",
          accost: "Как к тебе обращаться?",
        },
        info: {
          userQR: "Твой дизайн",
          scanQR: "Сканер дизайна"
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
      HeaderTitle: 'Задачи',
      filtration: {today: 'на сегодня', all: 'все'},
      taskAction: {
        delete: 'Удалить',
        edit: 'Редактировать',
        done: 'Выполнено',
        add: 'Добавить'
      },
      categorys: {
        today: 'Сегодня',
        tomorrow: 'Завтра',
        week: 'Недельные',
        later: 'Позднее',
        overdue: 'Пропущеные'
      },
      pointer: {
        ClickAdd: 'Нажми, чтобы добавить задачу',
      },
      noTaskMessage: {
        NoTasks: 'У тебя нет задачь? - Повезло тебе!',
      },
      deleteAlert: {
        Warning: 'Предупреждение',
        DeleteAll: 'Удалить ВСЕ задачи?',
        Cancel: 'Отмена',
        Ok: 'Да',
      },
      intro: [
        'На этом экране ты можешь управлять своими задачами.',
        'На текущий момент у тебя нет задачь, чтобы добавить их используй кнопку с таким обозначением'
      ],
      modalInput: {
        newTask: 'Новая задача',
        subTask: 'Этап',
        actions: {
          send: 'Добавить задачу',
          erase: 'Очистить поля',
          time: 'Дата и время',
          repeat: 'Повтор',
          notification: 'Уведомления'
        },
        dateTime: {
          today: 'Сегодня',
          endday: 'до конца дня',
        },
        //

        title: 'Редактор задачь',
        text: 'Текст задачи',
        placeholderInputArea: "Твоя задача ...",
        to: 'До',
        placeholderTimeArea: "Время",
        placeholderDateArea: "Дата",
        deadlineTarget: 'Задача начнет гореть за',
        placeholderDeadlineTargetArea: "Время до пожара",
        deadline: {
          title: 'Отслежевание дедлайна (ч.)',
          placeholder: 'Сразу',
        },
        accept: 'Установить'
      },
      listItems: {
        to: 'До',
        from: 'Добавлена',
        end: 'Выполнена'
      },
      

    },
    AnalyticsScreen: {
      HeaderTitle: 'аналитика',
    },
    NotesScreen: {
      HeaderTitle: 'заметки',
    },
    TimetableScreen: {
      HeaderTitle: 'расписание',
    },
    Weather: {
      actualWeather: 'погода',
      feelsLike: 'ощущается как',
      windFrom: ['С','СВ','В','ЮВ','Ю','ЮЗ','З','СЗ'],
      calm: 'штиль',
      loadingData: 'Загрузка данных',
      netConnectError: 'Ошибка подключения сети',
      lastUpdate: 'Последнее обновление',
      min: 'мин.',
      hour: 'ч.',
      ago: 'назад',
      dataSource: 'Источник'
      /*
      country: 'Страна',
      area: 'Область',
      city: 'Город',
      today: 'Сегодня',
      morrow: 'Завтра',
      now: 'Сейчас',
      ms: 'м/с',
      */
    }
}