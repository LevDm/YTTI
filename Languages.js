

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
      LanguageSettings: {    
        selector: 'Выберете язык',
        engRu: ['Английский', 'Русский']
      },
      StructureScreen: {
        categorys: [
          "внешнего вида",
          "системы"
        ],
        params: [
          "тема", 
          "скругления", 
          "навигационное меню", 
          "загрузочная анимация",
          "списки",
          "кнопка поплавок",
  
          "язык",
          "местоположение",
          "функции", 
          "обращение",
          "погода", 
          "другое"
        ]
      },
      Redactors: {
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
          type: "",
          types: ["","",""],
          menuParams: "",
          height: "",
          slider: {min: "", max: ""},
          signature: "",
          signatureState: {true: "", false: ""},
          verticalPosition: "",
          horizontalPosition: "",
          horizontalPositions: ["","",""]
        },
        loadAnimation: {
          info: "",
          show: "",
          showState: {true: "", false: ""},
        },
        lists: {
          textSize: "",
          slider: {min: "", max: ""},
          proximity: "",
          fullWidth: "",
          fullWidthState: {true: "", false: ""},
          shadows: "",
          shadowsState: {true: "", false: ""},  
        },
        bobberButton: {
          position: "",
          positions: ["","",""],
          size: "",
          slider: {min: "", max: ""},
        }
      }
    },
    TasksScreen: {
      HeaderTitle: 'Задачи',
    },
    AnalyticsScreen: {
      HeaderTitle: 'Аналитика',
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
      HeaderTitle: 'settings',
      LanguageSettings: {
        selector: 'Select language',
        engRu: ['English', 'Russian']
      },
      StructureScreen: {
        categorys: [
          "appearance", 
          "systems"
        ],
        params: [ 
          "theme", 
          "fillets", 
          "navigation menu", 
          "loading animation",
          "lists",
          "bobber button",
  
          "language",
          "location", 
          "functions",
          "accost",
          "weather", 
          "others"
        ]
      },
      Redactors: {
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
          type: "",
          types: ["","",""],
          menuParams: "",
          height: "",
          slider: {min: "", max: ""},
          signature: "",
          signatureState: {true: "", false: ""},
          verticalPosition: "",
          horizontalPosition: "",
          horizontalPositions: ["","",""]
        },
        loadAnimation: {
          info: "",
          show: "",
          showState: {true: "", false: ""},
        },
        lists: {
          textSize: "",
          slider: {min: "", max: ""},
          proximity: "",
          fullWidth: "",
          fullWidthState: {true: "", false: ""},
          shadows: "",
          shadowsState: {true: "", false: ""},  
        },
        bobberButton: {
          position: "",
          positions: ["","",""],
          size: "",
          slider: {min: "", max: ""},
        }
      }
    },
    TasksScreen: {
      HeaderTitle: 'Tasks',
    },
    AnalyticsScreen: {
      HeaderTitle: 'Analytics',
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
  