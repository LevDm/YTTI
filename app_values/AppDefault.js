import { Dimensions } from 'react-native';
import Constants from "expo-constants";

//CONSTANS
export const deviceHeight = Dimensions.get('window').height
export const deviceWidth = Dimensions.get('window').width
export const statusBarHeight = Constants.statusBarHeight+1

//fillets
export const borderRadiusValues = {min: 0, max: 32, step: 1}
//navigation menu
export const menuTypes = ['classical','hidden', 'not'];
export const positionNavigateMenu = {min: -150, max: 150, step: 10}
export const valuePosition = ['left','center','right']
export const heightNavigateMenu = {min: 35, max: 65, step: 5}
export const drawerPositions = ['left', 'right']
//lists
export const listsTextSize = {min: 10, max: 20, step: 1}
export const listsProximity = {min: 0, max: 10, step: 1}
//bobber button
export const sizeButton = {min: 56, max: 74, step: 2}
//export const valuePosition = ['left','center','right']

export const weatherTypes = ['lists', 'panel', 'widget']

export const WEATHER_API_KEY = 'e2b94f1a4a4231151132fbd1a15e1633';
//effects
export const rippleValues = ['all', 'some', 'none']
export const shadowsValues = ['material', 'neomorphism', 'none']

//colors
export const schemes = ['auto', 'light', 'dark'] 
export const statusBarStyles = ['auto','inverted','light','dark']

//APPERANCE
export const defaultAppStyle = {
    palette: {
        theme: "olive",
        scheme: 'auto',
        statusBar: 'light',//'auto','inverted' ,'light' ,'dark'
    },
    customTheme: undefined,
    borderRadius: {
        basic: 12, 
        additional: 12
    },
    effects: {
        ripple: 'all',
        shadows: 'material',
        blur: true,
    },
    navigationMenu: {
        type: menuTypes[0],
        height: 50,
        position: {vertical: 0 , horizontal : 'right'},
        signatureIcons: true,
        //rippleEffect: true,
        drawerPosition: 'right'
    },
    lists: {
        textSize: 14,
        proximity: 5,
        //shadow: true,
        fullWidth: false,
        invertColorsHeader: true,
    },
    functionButton: {
        invertColors: true,
        position: 'right',
        size: 60,
    },
    modals: {
        horizontalProximity: 5,
        highlightMethods: {
            outline: false,
            dimOutDark: false,
            gradient: false,
        }
    }
}

//CONFIGURATION
export const defaultAppConfig = {
    languageApp: 'en',
    user: {
        name: '',
    },
    splash: {
        show: true,
        welcome: true
    },
    screenSubsequence: ['analytics', 'tasks', 'notes', 'settings'],
    appFunctions: {
        analytics: {
            useId: 1,
            used: true
        },
        tasks: {
            useId: 0,
            used: true
        },
        notes: {
            useId: 2,
            used: true
        },
        settings: {
            useId: 3,
            used: true
        }
        //weather: true,
    },
    weather: {
        used: false,
        type: weatherTypes[0],
        locationInfo: [
            //{
            //    used: bool
            //    coords: {lat: num, lon: num}
            //    city: str
            //},
            //{
            //    used: true,
            //    coords: {lat: 59, lon: 60},
            //    city: 'city 1',
            //},
        ],
        //data: [
            //{requestTime: num, answer: {}}
        //], 
        
    } 

}

//LANGUAGES
// of "./Languages";

//THEMES
// of "./Themes";
