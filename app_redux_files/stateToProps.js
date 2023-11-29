function mapStateToProps(component) {
    switch(component) {       
        case "TASKS": {
            return function(state) {
                return {
                    tasksData: state.tasksData
                }
            }
        }
        case "TASKS_LIST": {
            return function(state) {
                return {
                    tasksData: state.tasksData
                }
            }
        }
        case "UI_PROVIDER": {
            return function(state) {
                return {
                    r_uiStyle: state.uiStyle,
                    r_uiPalette: state.uiPalette,
                    r_uiComposition: state.uiComposition,
                }
            }
        }
        case "UI_SETTINGS": {
            return function(state) {
                return {
                    r_uiStyle: state.uiStyle,
                    r_uiPalette: state.uiPalette,
                    r_uiComposition: state.uiComposition,
                }
            }
        }
        case "WEATHER_SETTINGS": {
            return function(state) {
                return {
                    weatherConfig: state.weatherConfig,
                }
            }
        }
        case "USER_SETTINGS": {
            return function(state) {
                return {
                    userData: state.userData,
                }
            }
        }

        case "WEATHER": {
            return function(state) {
                return {
                    weatherConfig: state.weatherConfig,
                    weatherData: state.weatherData
                }
            }
        }
        case "WELCOME": {
            return function(state) {
                return {
                    userData: state.userData,
                }
            }
        }
        case "LANGUAGE_HOOK": {
            return function(state) {
                return {
                    appLanguage: state.appLanguage,
                }
            }
        }
        default: return function(state) {
            return {

            }
        }
    }
}

export default mapStateToProps;