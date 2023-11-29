export default LanguageStoreEng = {
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
    SettingsScreen: {
      HeaderTitle: 'settings',
      //app: 'for app',
      preview: {
        title: 'preview',
        toolbar: {
          hide: 'hide',
          show: 'to show',
          apply: 'apply'
        },
      },
      LanguageSettings: {
        selector: 'Select language',
        engRu: ['English', 'Russian']
      },
      NFCScreen: {
        title: 'NFC',
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
            step: 'step',
            hue: 'Hues',
            saturation: 'Saturation',
            lightness: 'Brightness',
            almost: 'Done!'
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
          app: {
            type: "for app",
          },

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

          selectors: 'selectors',
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
        presets: {
          appAs: 'Interface design of this application',
          saveFAB: 'The current "floating buttons" setting will be carried over to the new design',
          saveNavigation: 'The current "navigation menu" setting will be carried over to the new design',
          stateSave: {true: "enabled", false: "disabled"},
        },
        themes: {
          colorMode: "Color mode",
          colorsMods: {auto: 'Systemic', light: 'Light', dark: 'Dark'},
          statusBarStyle: 'Color of status bar symbols',
          barStyles: {
            auto: 'Automatic',
            //inverted: 'Inverted',
            light: 'Light',
            dark: 'Dark'
          },
          palette: "Palette",
          painter: 'Рalette editor',
          openPainter: "redactor"
        },
        fillets: {
          synhronous: "Value synchronization",
          synhronousState: {true: "on", false: "off"},
          type: {
            primary: "Basic elements", 
            secondary: "Additional elements"
          },
          slider: {min: "straighter", max: "rounder"}
        },
        effects: {
          ripple: 'Ripple',
          ripples: ['All', 'General', 'Off'],
          shadows: 'Element Shadows',
          //shadowsTypes: ['Off','Neomorphic','Tough','Full','Standard','Standard basic',],
          shadowsTypes: ['Standard','Full','Neomorphic','Tough','Off',],
          blur: 'Surface element transparency',
          blurState: {true: "on", false: "off"},
          warningBlur: '! If enabled, this setting may cause performance issues'
        },
        selectors: {
          disabledShadows: 'Ignore completely disabling shadows',
          disabledShadowsState: {true: "on", false: "off"},
          switches: 'Toggles', 
          checkBox: 'Multiple select checkboxes', 
          radioButtons: 'Single select checkboxes'
        },
        navigationMenu: {
          type: "Type menu",
          types: ["Classical", "Retractable panel", "Hidden",],
          menuParams: "Menu params",
          height: "Height",
          slider: {min: "up", max: "more"},
          signature: "Icons signature",
          signatureState: {true: "on", false: "off"},
          verticalPosition: "Vertical position",
          horizontalPosition: "Horizontal position",
          horizontalPositions: ["Left","Center","Right"],
          horizontalPositionDrawer: "Panel slides out",
          horizontalPositionsDrawer: ["Left","Right"],
          accentsType: 'Accent Method',
          accentsTypes: {
            coloring: 'Coloring',
            filling: 'Filling icons',
          }
        },
        loadAnimation: {
          info: "...",
          show: "Animation on startup",
          showState: {true: "on", false: "off"},
          welcome: 'Loading screen welcome',
          welcomeState: {true: "on", false: "of"},
        },
        lists: {
          textSize: "Text size in list items",
          slider: {min: "less", max: "more"},
          proximity: "Spacing between list items",
          fullWidth: "List items take up the full width of the screen",
          fullWidthState: {true: "on", false: "off"},
          invertColorsHeader: 'Neutral Header Palette' ,
          invertColorsHeaderState: {true: "on", false: "off"},
        },
        bobberButton: {
          position: "Position on screen",
          positions: ["Above","Below"],
          bottomPosition: "Нorizontal position of the button at the bottom",
          bottomPositionSlider: {min: 'to the left', max: 'to the right'},
          signatures: 'Icon captions',
          signaturesState: {true: "on", false: "off"},
          disabledShadows: 'Ignore completely disabling shadows',
          disabledShadowsState: {true: "on", false: "off"},
          size: "Button size",
          slider: {min: "less", max: "more"},
          invertColors: 'Neutral button palette' ,
          invertColorsState: {true: "on", false: "off"},
          outline: 'Button outline',
          outlineState: {true: "on", false: "off"},
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
          type: 'Weather display type',
          types: {
            panel: 'In panel',
            lists: 'In lists', 
            //widget: 'Widget', 
            off: 'Off'
          },
          locations: 'Used Locations',
          add: 'Adding a new location',
          replace: 'Replace the selected location',
          //location: 'location',
          network: 'Defined by network',
          device: 'Determined by device',
          errorsDevice: {
            '0': 'No request',  
          },
          gettingState: {
            dvc: {
              '0': 'Click for info',
              '0.1': 'Waiting for permission',
              '0.2': 'Location permission denied',
              '0.3': 'Geolocation detection',
              '0.4': 'Geolocation determined',
              '0.5': 'Locality definition',
              '0.9': 'This location has already been added',
              '1': 'All information received',
            },
            net: {
              '0': 'No information',
              '0.1': 'Locality definition',
              '0.7': 'Locality not defined, access error possible',
              '0.9': 'This location has already been added',
              '1': 'All information received',
            }
          }
        },
        user: {
          name: "Name",
          accost: "How to contact you?",
        },
        info: { 
          userQR: "Your design", 
          scanQR: "Design scanner" 
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
      filtration: {today: 'for today', all: 'all'},
      taskAction: {
        delete: 'delete',
        edit: 'Edit',
        done: 'Done',
        add: 'Add'
      },
      categorys: {
        today: 'today',
        tomorrow: 'tomorrow',
        week: 'week',
        later: 'later',
        overdue: 'overdue'
      },
      pointer: {
        ClickAdd: 'Click to add a task',
      },
      noTaskMessage: {
        NoTasks: 'You have no tasks? - Lucky you!',
      },
      deleteAlert: {
        Warning: 'Warning',
        DeleteAll: 'Delete ALL tasks?',
        Cancel: 'Cancel',
        Ok: 'Ok',
      },
      intro: [
        'You can manage your tasks on this screen.',
        'At the moment you do not have a task, to add them use the button with this designation'
      ],
      modalInput: {
        newTask: 'New task',
        subTask: 'Stage',
        actions: {
          send: 'Add task',
          erase: 'Clear fields',
          time: 'Date and time',
          repeat: 'Repeat',
          notification: 'Notifications'
        },
        dateTime: {
          today: 'Today',
          endday: 'until the end of the day',
        },
         //
        //
        title: 'Task redactor',
        text: 'Text task',
        placeholderInputArea: "Text of your task",
        to: 'To',
        placeholderTimeArea: "Time",
        placeholderDateArea: "Date",
        deadlineTarget: 'Task burn',
        placeholderDeadlineTargetArea: "Time to fire",
        deadline: {
          title: 'Deadline Tracker (h.)',
          placeholder: 'Immediately',
        },
        accept: 'Set'
      },
      listItems: {
        to: 'To',
        from: 'From',
        end: 'fine'
      },
    },
    AnalyticsScreen: {
      HeaderTitle: 'analytics',
    },
    NotesScreen: {
      HeaderTitle: 'notes',
    },
    TimetableScreen: {
      HeaderTitle: 'timetable',
    },
    Weather: {
      actualWeather: 'weather',
      feelsLike: 'feels like',
      windFrom: ['N','NE','E','SE','S','SW','W','NW'],
      calm: 'calm',
      loadingData: 'Loading data',
      netConnectError: 'Network connection error',
      lastUpdate: 'Last updated',
      min: 'min.',
      hour: 'h.',
      ago: 'ago',
      dataSource: 'Data source'
      /*
      country: 'Country',
      area: 'Area',
      city: 'City',
      today: 'Today',
      morrow: 'Morrow',
      now: 'Now',
      ms: 'm/s',
      */
    }
}
