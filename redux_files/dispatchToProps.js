import { bindActionCreators } from 'redux';

function mapDispatchToProps(component) { 
    switch(component) {
        case "SETTINGS_SCREEN": return function(dispatch) {
            console.log('>'+component+'_FILE_LINK_REDUX_PROPS-FUNCTIONS')
            return {
                r_setAppStyle: (value) => dispatch({type: 'SET_STYLE_APP', value: value}),
                r_setAppConfig: (value) => dispatch({type: 'SET_CONFIG_APP', value: value}),
                r_setPreviewOpen: (value) => dispatch({type: 'SET_PREVIEW_OPEN', value: value}),
            };
        };  
        case "TABS_NAVIGATER": return function(dispatch) {
            console.log('>'+component+'_FILE_LINK_REDUX_PROPS-FUNCTIONS')
            return {
                r_setAppStyle: (value) => dispatch({type: 'SET_STYLE_APP', value: value})
            };
        };
        case "NAVIGATER": return function(dispatch) {
            console.log('>'+component+'_FILE_LINK_REDUX_PROPS-FUNCTIONS')
            return {
                r_setAppStyle: (value) => dispatch({type: 'SET_STYLE_APP', value: value}),
            };
        };
        case "SPLASH": return function(dispatch) {
            console.log('>'+component+'_FILE_LINK_REDUX_PROPS-FUNCTIONS')
            return {
                r_setSplash: (value) => dispatch({type: 'SET_SPLASH', value: value}),
            };
        };
        default: return undefined;
    }
}

export default mapDispatchToProps;