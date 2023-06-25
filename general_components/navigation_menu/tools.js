import languagesAppList from "../../app_values/Languages";


export const ripple = (color) => ({
    color: `${color}20`,
    borderless: true,
    foreground: false
})

export const getNavigateItems = (props) => {
    const {
        state = {
            index: 0, 
            routes: [
                {name: "tasks"},
                {name: "timetable"},
                {name: "notes"},
                {name: "settingsStack"},
                {name: "analytics"},
            ]
        },
        LanguageAppIndex,
        appConfig
    } = props

    const Language = languagesAppList[LanguageAppIndex]

    const answer = []

    state.routes.map((route, index) => {
        const routes =  {
            tasks : {name: "tasks"},
            timetable: {name: "timetable"},
            notes : {name: "notes"},
            analytics : {name: "analytics"},
            settings : {name: "settingsStack"},
        }

        let current 
        const uses = new Array(Object.keys(appConfig.appFunctions).length)//['','','','']
        Object.keys(appConfig.appFunctions).map((litem, lindex)=>{
            if(appConfig.appFunctions[litem].useId == index){
                current = litem
            } 
            if(appConfig.appFunctions[litem].used){
                uses[appConfig.appFunctions[litem].useId] = litem
            } 
        })

        const croute = routes[current]
        const cpage = appConfig.appFunctions[current]

        if(routes[current]){
            
            const cisFocused = state.routes[state.index].name === croute.name;
            const iconsNames = {focus: '', notFocus: ''}
            let screenName = ''

            switch(croute.name){
                case "tasks":
                    iconsNames.focus = 'sticker-check';//'home-edit';
                    iconsNames.notFocus = 'sticker-check-outline';//'home-edit-outline';
                    screenName = Language.TasksScreen.HeaderTitle;
                    break;

                case "analytics":
                    iconsNames.focus = 'circle-slice-1';
                    iconsNames.notFocus = 'circle-outline';
                    screenName = Language.AnalyticsScreen.HeaderTitle;
                    break;

                case "settingsStack": 
                    iconsNames.focus = 'cog'; 
                    iconsNames.notFocus = 'cog-outline';
                    screenName = Language.SettingsScreen.HeaderTitle;
                    break;

                case "notes":
                    iconsNames.focus = 'note-edit'; 
                    iconsNames.notFocus = 'note-edit-outline';
                    screenName = Language.NotesScreen.HeaderTitle;
                    break;

                case "timetable":
                    iconsNames.focus = 'timetable'; 
                    iconsNames.notFocus = 'timetable';
                    screenName = Language.TimetableScreen.HeaderTitle;
                    break;

                default:
                    iconsNames.focus = "border-none-variant"
                    iconsNames.notFocus = "border-none-variant"
                    screenName = 'screenName'
            }

            const item = {
                routeName: croute.name,
                screenTItle: screenName,
                iconFocus: {'true': iconsNames.focus, 'false': iconsNames.notFocus},
                isFocused: cisFocused
            }
            answer.push(item)
        } 
    })

    return answer
}