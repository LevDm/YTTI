import { Dimensions } from 'react-native';
import Constants from "expo-constants";

//CONSTANS
const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width
const statusBarHeight = Constants.statusBarHeight+1
//fillets
export const borderRadiusValues = {min: 0, max: 32, step: 1}
//navigation menu
export const menuTypes = ['classical','classical_animated','hidden', 'not'];
export const positionNavigateMenu = {min: 20, max: 80, step: 5}
export const valuePosition = ['left','center','right']
export const heightNavigateMenu = {min: 35, max: 65, step: 5}
//lists
export const listsTextSize = {min: 10, max: 20, step: 1}
export const listsProximity = {min: 1, max: 5, step: 1}
//bobber button
export const sizeButton = {min: 46, max: 64, step: 2}
//export const valuePosition = ['left','center','right']


//APPERANCE
export const defaultAppStyle = {
    theme: "emerald",
    borderRadius: {
        basic: 12, 
        additional: 12
    },
    navigationMenu: {
        type: menuTypes[0],
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

//CONFIGURATION
export const defaultAppConfig = {
    languageApp: 'en',
    userName: '',
    location: {},
    appFunctions: {
        analitic: true,
        task: true,

        weather: true,
    } 

}

//LANGUAGES
// of "./Languages";

//THEMES
// of "./Themes";
