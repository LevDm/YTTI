import { bindActionCreators } from 'redux';

function mapDispatchToProps(component) { 
    switch(component) {
        case "SETTINGS_SCREEN": return function(dispatch) {
            //console.log('>'+component+'_FILE_LINK_REDUX_PROPS-FUNCTIONS')
            return {
                r_setAppStyle: (value) => dispatch({type: 'SET_STYLE_APP', value: value}),
                r_setAppConfig: (value) => dispatch({type: 'SET_CONFIG_APP', value: value}),
                r_setHideMenu: (value) => dispatch({type: 'SET_MENU_HIDE', value: value}),

                r_setTests: (value) => dispatch({type: 'SET_TESTS_LIST', value: value}),
                r_setTestingMod: (value) => dispatch({type: 'SET_TESTING_MOD', value: value}),
            };
        };
        case "N_SCREEN": return function(dispatch) {
            //console.log('>'+component+'_FILE_LINK_REDUX_PROPS-FUNCTIONS')
            return {
                //r_setAppStyle: (value) => dispatch({type: 'SET_STYLE_APP', value: value}),
                //r_setAppConfig: (value) => dispatch({type: 'SET_CONFIG_APP', value: value}),
                r_setTasksList: (value) => dispatch({type: 'SET_TASKS_LIST_APP', value: value}),

                r_setTests: (value) => dispatch({type: 'SET_TESTS_LIST', value: value}),
                r_setTestingMod: (value) => dispatch({type: 'SET_TESTING_MOD', value: value}),
            };
        };

        case "NFC_SCREEN": return function(dispatch) {
            //console.log('>'+component+'_FILE_LINK_REDUX_PROPS-FUNCTIONS')
            return {
                r_setAppStyle: (value) => dispatch({type: 'SET_STYLE_APP', value: value}),
                r_setAppConfig: (value) => dispatch({type: 'SET_CONFIG_APP', value: value}),
                r_setHideMenu: (value) => dispatch({type: 'SET_MENU_HIDE', value: value}),
            };
        }; 
        case "PALETTE_SCREEN": return function(dispatch) {
            //console.log('>'+component+'_FILE_LINK_REDUX_PROPS-FUNCTIONS')
            return {
                r_setAppStyle: (value) => dispatch({type: 'SET_STYLE_APP', value: value}),
                r_setAppConfig: (value) => dispatch({type: 'SET_CONFIG_APP', value: value}),
                r_setHideMenu: (value) => dispatch({type: 'SET_MENU_HIDE', value: value}),

                r_setTests: (value) => dispatch({type: 'SET_TESTS_LIST', value: value}),
                r_setTestingMod: (value) => dispatch({type: 'SET_TESTING_MOD', value: value}),
            };
        };   
        case "NAVIGATER": return function(dispatch) {
            //console.log('>'+component+'_FILE_LINK_REDUX_PROPS-FUNCTIONS')
            return {
                r_setAppStyle: (value) => dispatch({type: 'SET_STYLE_APP', value: value}),

                r_setTests: (value) => dispatch({type: 'SET_TESTS_LIST', value: value}),
                r_setTestingMod: (value) => dispatch({type: 'SET_TESTING_MOD', value: value}),
            };
        };
        case "SPLASH": return function(dispatch) {
            //console.log('>'+component+'_FILE_LINK_REDUX_PROPS-FUNCTIONS')
            return {
                r_setSplash: (value) => dispatch({type: 'SET_SPLASH', value: value}),
            };
        };
        default: return undefined;
    }
}

export default mapDispatchToProps;