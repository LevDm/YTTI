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
export const listsProximity = {min: 1, max: 5, step: 1}
//bobber button
export const sizeButton = {min: 46, max: 64, step: 2}
//export const valuePosition = ['left','center','right']


export const WEATHER_API_KEY = 'e2b94f1a4a4231151132fbd1a15e1633';

//APPERANCE
export const defaultAppStyle = {
    theme: "emerald",
    colorScheme: 'auto',
    borderRadius: {
        basic: 12, 
        additional: 12
    },
    navigationMenu: {
        type: menuTypes[0],
        height: 50,
        position: {vertical: 0 , horizontal : 'right'},
        signatureIcons: true,
        rippleEffect: true,
        drawerPosition: 'right'
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
    },
    modals: {
        horizontalProximity: 5,
        outline: true,
        dimOut: true
    }
}

//CONFIGURATION
export const defaultAppConfig = {
    languageApp: 'en',
    userName: '',
    location: {},
    appFunctions: {
        analitic: true,
        task: true,

        weather: true,
    },
    weather: {
        use: false,
        locationInfo: [
            //{
            //    coords: null, {lat: num, lon: num}
            //    city: ''
            //}
        ],
        data: [
            //{requestTime: num, answer: {}}
        ], 
        
    } 

}

//LANGUAGES
// of "./Languages";

//THEMES
// of "./Themes";
