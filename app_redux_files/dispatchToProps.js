function mapDispatchToProps(component) { 
    
    switch(component) {
        case "SETTINGS": return function(dispatch) {
            //console.log('>'+component+'_FILE_LINK_REDUX_PROPS-FUNCTIONS')
            return {
                r_setUiStyle: (value) => dispatch({type: 'SET_UI_STYLE', value: value}),
                r_setUiComposition: (value) => dispatch({type: 'SET_UI_COMPOSITION', value: value}),
                r_setUiPalette: (value) => dispatch({type: 'SET_UI_PALETTE', value: value}),
                r_setAppLanguage: (value) => dispatch({type: 'SET_APP_LANGUAGE', value: value}),
                r_setUserData: (value) => dispatch({type: 'SET_USER_DATA', value: value}),
                r_setWeatherConfig: (value) => dispatch({type: 'SET_WEATHER_CONFIG', value: value}),
            };
        }
        case "TASKS": return function(dispatch) {
            //console.log('>'+component+'_FILE_LINK_REDUX_PROPS-FUNCTIONS')
            return {
                r_setTasksData: (value) => dispatch({type: 'SET_TASKS_DATA', value: value}),
            }
        }
        case "NAVIGATER": return function(dispatch) {
            //console.log('>'+component+'_FILE_LINK_REDUX_PROPS-FUNCTIONS')
            return {
                
            }
        }
        case "WEATHER": return function(dispatch) {
            //console.log('>'+component+'_FILE_LINK_REDUX_PROPS-FUNCTIONS')
            return {
                
            }
        }
        default: return undefined;
    }
}

export default mapDispatchToProps;