import React, { useState, useEffect } from "react";
import { Appearance} from 'react-native';
import store from "../app_redux_files/store";

const getScheme = (listenerColorScheme, styleScheme, oldScheme) => {
    return  listenerColorScheme? (styleScheme == 'auto'? listenerColorScheme : styleScheme) : (oldScheme? oldScheme : 'light')
}

function useTheme(wantScheme){

    const [palette, setPalette] = useState(store.getState().uiPalette)

    const listenerColorSheme = Appearance.getColorScheme()

    const [scheme, setScheme] = useState(getScheme(listenerColorSheme, palette.scheme, scheme))

    useEffect(()=>{
        store.subscribe(() => {
            const rstore = store.getState();
            if(JSON.stringify(rstore.uiPalette) != JSON.stringify(palette)){
                setPalette(rstore.uiPalette)
            }
            if(rstore.uiPalette.scheme != palette.scheme){
                setScheme(getScheme(listenerColorSheme, rstore.uiPalette.scheme, scheme))
            }
        })

        Appearance.addChangeListener(({colorScheme})=>{
            const newScheme = getScheme(colorScheme, palette.scheme, scheme)
            setScheme(newScheme)
        })
    })
    return palette[wantScheme?? scheme]
}

export default useTheme