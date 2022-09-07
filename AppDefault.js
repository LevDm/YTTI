import { Dimensions } from 'react-native';
import Constants from "expo-constants";

//CONSTANS
const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width
const statusBarHeight = Constants.statusBarHeight+1

export const navigateMenuTypes = ["classical","classical_animated","hidden"]

//APPERANCE
export const defaultAppStyle = {
    theme: "emerald",
    borderRadius: {
        basic: 12, 
        additional: 12
    },
    navigationMenu: {
        type: navigateMenuTypes[0],
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
        position: 'right'
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
