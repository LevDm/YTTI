import React, { useState, useEffect } from "react";

import store from "../app_redux_files/store";

import languagesAppList from "../app_values/languages/Languages";

function useLanguage(){
    const [languageStore, setLanguageStore] = useState(languagesAppList[store.getState().appLanguage.storedIndex])
    useEffect(()=>{
        store.subscribe(() => {
            const rstore = store.getState();
            if(rstore.appLanguage.letter != languageStore.language){
                setLanguageStore(languagesAppList[rstore.appLanguage.storedIndex])
            }
        })
    })
    return languageStore
}

export default useLanguage