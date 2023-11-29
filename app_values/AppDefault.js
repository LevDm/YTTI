//fillets
export const borderRadiusValues = {min: 0, max: 36, step: 1}
//navigation menu
export const menuTypes = ['type_1','type_2' , 'type_3']; //'classical','not','hidden' 
export const positionNavigateMenu = {min: -150, max: 150, step: 10}
export const valuePosition = [0,0.5,1]
export const heightNavigateMenu = {min: 40, max: 66, step: 2}
export const drawerPositions = [0, 1]
export const accentsType = ['filling', 'coloring']
//lists
export const listsTextSize = {min: 10, max: 20, step: 1}
export const listsProximity = {min: 0, max: 10, step: 0.25}
export const listsHorizontalProximity = {'true': 16, 'false': 0}
//bobber button
export const sizeButton = {min: 54, max: 72, step: 2}
export const positionFAB =  [0, 1] //['top','bottom']
export const FAB_bottomPosition = {min: 0, max: 1, step: 0.0625}

export const weatherTypes = ['panel', 'lists', 'off'] //['panel', 'lists',  'widget', 'off']

//effects
export const rippleValues = ['all', 'some', 'none']
//export const shadowsValues = ['none','neomorphism','square','full','material','materialSome',]
export const shadowsValues = ['material','full','neomorphism','square','none',]
//colors
export const schemes = ['auto', 'light', 'dark'] 
export const statusBarStyles =  ['auto','light','dark'] //['auto','inverted','light','dark']

//selectorsStyle:
export const switchDisign = ['type_1', 'type_2', 'type_3',]
export const checkBoxDisign = ['type_1', 'type_2',]
export const radioButtonDisign = ['type_1', 'type_2',]
//modals


import { stock } from './AppDesigns';
//APPERANCE
export const defaultAppStyle = {
    presetUsed: 'YTTI-stock',
    customTheme: undefined,
    ...stock
}

//CONFIGURATION
export const defaultAppConfig = {
    languageApp: 'ru',
    user: {
        name: null,
        onboarding: 0,
        role: 'u'
    },
    welcome: {
        show: true,
    },
    screenSubsequence: ['tasks', 'timetable', 'notes', 'analytics', ], 
    appFunctions: {
        tasks: {
            useId: 0,
            used: true
        },
        timetable: {
            useId: 1,
            used: false
        },
        notes: {
            useId: 3,
            used: false
        },
        analytics: {
            useId: 2,
            used: false
        },
    },
    weather: {
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

const weatherIconsPatch = '../assets/openWeather/'

export const ICONS_SET = { 
    '01d': require(weatherIconsPatch+'01d.png'),
    '02d': require(weatherIconsPatch+'02d.png'),
    '03d': require(weatherIconsPatch+'03d.png'),
    '04d': require(weatherIconsPatch+'04dn.png'),
    '09d': require(weatherIconsPatch+'09dn.png'),
    '10d': require(weatherIconsPatch+'10d.png'),
    '11d': require(weatherIconsPatch+'11dn.png'),
    '13d': require(weatherIconsPatch+'09dn.png'),
    '50d': require(weatherIconsPatch+'04dn.png'),

    '01n': require(weatherIconsPatch+'01n.png'),
    '02n': require(weatherIconsPatch+'02n.png'),
    '03n': require(weatherIconsPatch+'03n.png'),
    '04n': require(weatherIconsPatch+'04dn.png'),
    '09n': require(weatherIconsPatch+'09dn.png'),
    '10n': require(weatherIconsPatch+'10n.png'),
    '11n': require(weatherIconsPatch+'11dn.png'),
    '13n': require(weatherIconsPatch+'09dn.png'),
    '50n': require(weatherIconsPatch+'04dn.png'),
}