function mapStateToProps(component) {
    switch(component) {       
        case "HOME_SCREEN": {
            console.log('>'+component+'_FILE_LINK_REDUX_PROPS-VARIABLES')
            return function(state) {
                return {
                    appStyle: state.appStyle,
                    appConfig: state.appConfig,
                    languageApp: state.languageApp,
                    tasks: state.tasks
                };
            }
        }
        case "SETTINGS_SCREEN": {
            console.log('>'+component+'_FILE_LINK_REDUX_PROPS-VARIABLES')
            return function(state) {
                return {
                    appStyle: state.appStyle,
                    appConfig: state.appConfig
                };
            }
        }
        case "BASE_PRESSABLE": {
            console.log('>'+component+'_FILE_LINK_REDUX_PROPS-VARIABLES')
            return function(state) {
                return {
                    appStyle: state.appStyle
                };
            }
        }
        case "BASE_MODAL": {
            console.log('>'+component+'_FILE_LINK_REDUX_PROPS-VARIABLES')
            return function(state) {
                return {
                    appStyle: state.appStyle
                };
            }
        }
        case "TABS_NAVIGATER": {
            console.log('>'+component+'_FILE_LINK_REDUX_PROPS-VARIABLES')
            return function(state) {
                return {
                    languageApp: state.languageApp,
                    appStyle: state.appStyle,
                    appConfig: state.appConfig,
                };
            }
        }
        case "NAVIGATER": {
            console.log('>'+component+'_FILE_LINK_REDUX_PROPS-VARIABLES')
            return function(state) {
                return {
                    appStyle: state.appStyle,
                    appConfig: state.appConfig,
                };
            }
        }
        default: return undefined;
    }
}

export default mapStateToProps;