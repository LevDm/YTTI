import { createStore, configureStore } from 'redux';

import { defaultAppStyle, defaultAppConfig } from '../app_values/AppDefault';


const initialState = {
    //DEFAULT SETTINGS
    loadStatusTasks: false,
    loadStatusStyle: false,
    loadStatusConfig: false,

    tasks: [],
    appStyle: defaultAppStyle,
    appConfig: defaultAppConfig,

    weatherData: undefined,

    //languageApp: 'en',
    //splash: false,
    hideMenu: false
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        //FOR WKR TESTS
        case 'SET_TESTS_LIST': {
            console.log('>'+action.type)

            return initialState
        }
        case 'SET_LOAD_STATUS_TESTS': {
            console.log('>'+action.type+'_'+String(action.value).toUpperCase())

            return initialState
        }
        case 'SET_TESTING_MOD': {
            console.log('>'+action.type+'_'+String(action.value).toUpperCase())

            return initialState
        }
        //APP

        case 'SET_TASKS_LIST_APP': {
            console.log('>'+action.type)
            initialState.tasks = action.value
            return initialState
        }
        case 'SET_STYLE_APP': {
            console.log('>'+action.type)
            initialState.appStyle =  initialState.loadStatusStyle? action.value : Object.assign(initialState.appStyle, action.value)
            return initialState
        }
        case 'SET_CONFIG_APP': {
            console.log('>'+action.type)
            initialState.appConfig = initialState.loadStatusConfig? action.value : Object.assign(initialState.appConfig, action.value)
            return initialState
        }
        case 'SET_WEATHER_DATA': {
            console.log('>'+action.type)
            initialState.weatherData = action.value
            return initialState
        }

        //variables
        case 'SET_MENU_HIDE': {
            console.log('>'+action.type+'_'+(`${action.value}`).toUpperCase())
            initialState.hideMenu = action.value
            return initialState
        }

        //load status
        case 'SET_LOAD_STATUS_TASKS_APP': {
            console.log('>'+action.type+'_'+String(action.value).toUpperCase())
            initialState.loadStatusTasks = action.value
            return initialState
        }
        case 'SET_LOAD_STATUS_STYLE_APP': {
            console.log('>'+action.type+'_'+String(action.value).toUpperCase())
            initialState.loadStatusStyle = action.value
            return initialState
        }
        case 'SET_LOAD_STATUS_CONFIG_APP': {
            console.log('>'+action.type+'_'+String(action.value).toUpperCase())
            initialState.loadStatusConfig = action.value
            return initialState
        }

        default: return state
    }
}

console.log('REDUX_STORE_ENABLE')
//const st = configureStore({
//    reducer: reducer
//})


  
const store = createStore(reducer);
export default store;

