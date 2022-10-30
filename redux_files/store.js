import { createStore } from 'redux';
//import baseTasksList from '../base_value/base_value'
import ThemesColorsAppList from '../styles/ColorsApp';

const types = ["classical","classical_animated","hidden"]

import { defaultAppStyle, defaultAppConfig } from '../app_values/AppDefault';

const appStyle = {
    theme: "emerald",
    borderRadius: {
        basic: 12, 
        additional: 12
    },
    statusBar: {
        style: 'auto', 
        hidden: false,
        backgroundColor: ThemesColorsAppList[0].statusBar
    },
    navigationMenu: {
        type: types[0],
        height: 50,
        position: {vertical: 0 , horizontal : 'right'},
        signatureIcons: true
    },
    splachLoadShow: true,
    lists: {
        textSize: 14,
        proximity: 5,
        shadow: true,
        fullWidth: false
    },
    functionButton: {
        position: 'right',
        size: 60,
    }
}

const appConfig = {
    languageApp: 'en',
    userName: '',
    location: {},
    appFunctions: {
        analitic: true,
        task: true,

        weather: true,
    } 

}


const initialState = {
    //DEFAULT SETTINGS
    loadStatusTasks: false,
    loadStatusStyle: false,
    loadStatusConfig: false,

    loadStatusLanguage: false,

    tasks: [],
    appStyle: defaultAppStyle,
    appConfig: defaultAppConfig,

    languageApp: 'en',
    splash: false,
    hideMenu: false
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case 'SET_TASKS_LIST_APP': {
            console.log('>'+action.type)
            initialState.tasks = action.value
            return initialState
        }
        case 'SET_LANGUAGE_APP': {
            console.log('>'+action.type+'_'+(action.value).toUpperCase())
            initialState.languageApp = action.value
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
        case 'SET_LOAD_STATUS_LANGUAGE_APP': {
            console.log('>'+action.type+'_'+String(action.value).toUpperCase())
            initialState.loadStatusLanguage = action.value
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
  
const store = createStore(reducer);
export default store;

