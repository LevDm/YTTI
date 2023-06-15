function mapStateToProps(component) {
    switch(component) {       
        case "HOME_SCREEN": {
            console.log('>'+component+'_FILE_LINK_REDUX_PROPS-VARIABLES')
            return function(state) {
                return {
                    appStyle: state.appStyle,
                    appConfig: state.appConfig,
                    languageApp: state.languageApp,
                    tasks: state.tasks,

                    testing: state.testing,
                    tests: state.tests,

                };
            }
        }
        case "N_SCREEN": {
            console.log('>'+component+'_FILE_LINK_REDUX_PROPS-VARIABLES')
            return function(state) {
                return {
                    testing: state.testing,
                    tests: state.tests,
                };
            }
        }
        case "NFC_SCREEN": {
            console.log('>'+component+'_FILE_LINK_REDUX_PROPS-VARIABLES')
            return function(state) {
                return {
                    appStyle: state.appStyle,
                    appConfig: state.appConfig,
                    hideMenu: state.hideMenu
                };
            }
        }    
        case "PALETTE_SCREEN": {
            console.log('>'+component+'_FILE_LINK_REDUX_PROPS-VARIABLES')
            return function(state) {
                return {
                    appStyle: state.appStyle,
                    appConfig: state.appConfig,
                    hideMenu: state.hideMenu,

                    testing: state.testing,
                    tests: state.tests,
                };
            }
        }
        case "SETTINGS_SCREEN": {
            console.log('>'+component+'_FILE_LINK_REDUX_PROPS-VARIABLES')
            return function(state) {
                return {
                    appStyle: state.appStyle,
                    appConfig: state.appConfig,
                    hideMenu: state.hideMenu,


                    testing: state.testing,
                    tests: state.tests,
                };
            }
        }
        case "NAVIGATER": {
            console.log('>'+component+'_FILE_LINK_REDUX_PROPS-VARIABLES')
            return function(state) {
                return {
                    appStyle: state.appStyle,
                    appConfig: state.appConfig,
                    hideMenu: state.hideMenu,


                    testing: state.testing,
                    tests: state.tests,
                };
            }
        }
        case "WEATHER_C": {
            console.log('>'+component+'_FILE_LINK_REDUX_PROPS-VARIABLES')
            return function(state) {
                return {
                    appStyle: state.appStyle,
                    appConfig: state.appConfig,
                    weatherData: state.weatherData
                    //hideMenu: state.hideMenu
                };
            }
        }
        case "SPLASH": {
            console.log('>'+component+'_FILE_LINK_REDUX_PROPS-VARIABLES')
            return function(state) {
                return {
                    appStyle: state.appStyle,
                    appConfig: state.appConfig,
                };
            };
        };
        default: return undefined;
    }
}

export default mapStateToProps;