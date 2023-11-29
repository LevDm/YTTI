import { createStore, configureStore } from 'redux';

import { defaultAppStyle, defaultAppConfig } from '../app_values/AppDefault';

const prefix = 'REDUX>'

import uiStock from '../app_designs/stock'
import themesColorsAppList, {themesApp} from "../app_values/Themes";
import languagesAppList, {languagesApp} from "../app_values/languages/Languages";

const initialState = {

    uiConfigurationLoadStatus: false,

    appLanguage: {
        letter: languagesApp[1],
        storedIndex: 1
    },
    uiStyle: {
        presetUsed: 'YTTI-stock',
        ...uiStock.preset.options,
    },
    uiPalette: {
        scheme: 'auto',
        ...uiStock.palette
        //title: 'stock',
        //light: themesColorsAppList[1].light,
        //dark: themesColorsAppList[1].dark,
    },
    uiComposition: {
        welcome: {
            show: true,
        },
        appFunctions: {
            tasks: {
                useId: 0,
                used: true
            },
            timetable: {
                useId: 1,
                used: false
            },
            analytics: {
                useId: 2,
                used: false
            },      
            notes: {
                useId: 3,
                used: false
            }
        },
        weather: {
            type: 'off'
        }
    },

    userData: {
        name: null,
        onboarding: 0,
        role: 'u',
    },

    weatherConfig: {
        requestLanguage: languagesApp[1],
        locationInfo: [
            //{
            //    used: bool
            //    coords: {lat: num, lon: num}
            //    city: str
            //},
        ],
    },
    weatherData: undefined,

    tasksData: []
}

const reducer = (state=initialState, action) => {
    const stateCopy = JSON.parse(JSON.stringify(state))
    console.log(prefix+action.type)
    switch (action.type) {
        case 'SET_APP_LANGUAGE': {
            stateCopy.appLanguage = action.value
            return stateCopy
        }
        case 'SET_UI_STYLE': {
            stateCopy.uiStyle = action.value
            return stateCopy
        }
        case 'SET_UI_PALETTE': {
            const palette = action.value
            const i = themesApp.indexOf(palette.title)
            palette.light = palette.light?? themesColorsAppList[i].light
            palette.dark =  palette.dark?? themesColorsAppList[i].dark
            palette.scheme = palette.scheme?? 'auto'
            stateCopy.uiPalette = palette
            return stateCopy
        }
        case 'SET_UI_COMPOSITION': {
            stateCopy.uiComposition = action.value
            return stateCopy
        }

        case 'SET_UI_CONFIGURATION_LOAD_STATUS': {
            stateCopy.uiConfigurationLoadStatus = action.value
            return stateCopy
        }

        case 'SET_USER_DATA': {
            stateCopy.userData = action.value
            return stateCopy
        }

        case 'SET_WEATHER_CONFIG': {
            stateCopy.weatherConfig = action.value
            return stateCopy
        }
        case 'SET_WEATHER_DATA': {
            stateCopy.weatherData = action.value
            return stateCopy
        }

        case 'SET_TASKS_DATA': {
            stateCopy.tasksData = action.value
            return stateCopy
        }
        default: return state
    }
}


const store = createStore(reducer);
export default store;

