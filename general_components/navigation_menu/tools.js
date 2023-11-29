

export const ripple = (color) => ({
    color: `${color}20`,
    borderless: true,
    foreground: false
})

export const fromSharedObject = (obj, rec) => {
    'worklet'
    const newObj = {}
    for(const key in obj){
        if(obj[key].value != undefined){
            newObj[key] = obj[key].value
        } else {
            newObj[key] = rec(obj[key], rec)
        }
    }
    return newObj
}

export const getNavigateItems = (props) => {
    const {
        state = {
            index: 0, 
            routes: [
                {name: "tasks"},
                {name: "timetable"},
                {name: "notes"},
                {name: "analytics"},
            ]
        },
        LanguageAppIndex,
        appFunctions
    } = props


    const answer = []

    //console.log(appFunctions)

    state.routes.map((route, index) => {
        const routes =  {
            tasks : {name: "tasks"},
            timetable: {name: "timetable"},
            notes : {name: "notes"},
            analytics : {name: "analytics"},
        }

        let current 
        Object.keys(appFunctions).map((litem, lindex)=>{
            if(appFunctions[litem].useId == index){
                current = litem
            } 
        })

        
        const croute = routes[current]
        const useScreen = appFunctions[croute.name].used

        if(useScreen){
            const cisFocused = state.routes[state.index].name === croute.name;
            const iconsNames = {focus: '', notFocus: ''}
            let screenName = ''

            switch(croute.name){
                case "tasks":
                    iconsNames.focus = 'sticker-check';//'home-edit';
                    iconsNames.notFocus = 'sticker-check-outline';//'home-edit-outline';
                    screenName = 'TasksScreen'
                    break;

                case "analytics":
                    iconsNames.focus = 'circle-slice-1';
                    iconsNames.notFocus = 'circle-outline';
                    screenName = 'AnalyticsScreen'
                    break;

                case "notes":
                    iconsNames.focus = 'note-edit'; 
                    iconsNames.notFocus = 'note-edit-outline';
                    screenName = 'NotesScreen'
                    break;

                case "timetable":
                    iconsNames.focus = 'timetable'; 
                    iconsNames.notFocus = 'timetable';
                    screenName = 'TimetableScreen'
                    break;

                default:
                    iconsNames.focus = "border-none-variant"
                    iconsNames.notFocus = "border-none-variant"
                    screenName = 'screenName'
            }

            const item = {
                routeName: croute.name,
                screenName: screenName,
                iconFocus: {'true': iconsNames.focus, 'false': iconsNames.notFocus},
                isFocused: cisFocused
            }
            answer.push(item)
        } 
    })

    return answer
}