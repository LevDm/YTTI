import React, { useState, useEffect } from "react";
import { Keyboard } from "react-native";
// components
import ListItems from "../../../componets/Listitems";
import ModalInput from "../../../componets/ModalInput";
import TrojanButton from "../../../componets/TrojanButton";

import AsyncStorage from '@react-native-async-storage/async-storage';

import {connect} from 'react-redux';
import mapStateToProps from "../../../redux_files/stateToProps";
import mapDispatchToProps from "../../../redux_files/dispatchToProps";
import store from "../../../redux_files/store";

import themesColorsAppList, {themesApp} from "../../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../../app_values/Languages";


const Home = (props) => {
 
    //const [LanguageStore, setLanguageStore] = useState(LanguageStor[0])
    //const [tasks, setTasks] = useState(baseTasksList);

    //console.log('props home= ',props)
    const [tasks, setTasks] = useState(props.tasks);
    //const [language, setLanguage] = useState(props.languageApp == 'RU'?1:0])
    //const [LanguageStore, setLanguageStore] = useState(LanguageStor[props.languageApp == 'RU'?1:0])
    
    const [LanguageAppIndex, setLanguageAppIndex] = useState(languagesApp.indexOf(props.languageApp));//ThemesColorsAppList[ThemeColorsAppIndex]
    const [ThemeColorsAppIndex, setThemeColorAppIndex] = useState(themesApp.indexOf(props.appStyle.theme));//LanguagesAppList[LanguageAppIndex]
    const [appStyle, setAppStyle] = useState(props.appStyle);
    
    store.subscribe(() => {
        let jstore = store.getState();

        if(LanguageAppIndex != languagesApp.indexOf(jstore.languageApp)){
            setLanguageAppIndex(languagesApp.indexOf(jstore.languageApp))
        }

        if(ThemeColorsAppIndex != themesApp.indexOf(jstore.appStyle.theme)){
            setThemeColorAppIndex(themesApp.indexOf(jstore.appStyle.theme));
        }

        if (appStyle != jstore.appStyle) {
            setAppStyle(jstore.appStyle);
        }
    })

    /*
    const loadData = () => {
        
        AsyncStorage.getItem("storedTasks").then(data =>{
            if (data !== null){setTasks(JSON.parse(data));}
            //setLoad(0);
        }).catch((error) => console.log(error));

        AsyncStorage.getItem("storedLanguageSettings").then(data =>{
            //if (data !== null){setLanguageStore(JSON.parse(data)=='RU'? LanguageStor[1]:LanguageStor[0])}
            //setLoad(1);
        }).catch((error) => console.log(error));
        setLoad(false)
        
    }
    */
  
    //if (tasks.length == 2 && load) {loadData();} 

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {setKeyboardVisible(true);});
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
    
   
    //clear all
    const handleClearTasks = () => {
        //console.log(baseTasksList)
        setTasks([]);
        setPointerVisible(false);
        //console.log('clock');
        AsyncStorage.setItem("storedTasks", JSON.stringify([])).then(() => {
            //console.log(baseTasksList)
        }).catch((error) => console.log(error));
    }

    // Modal visible
    const [InputModalVisible, setInputModalVisible] = useState(false);
    const [taskInputValue, setTaskInputValue] = useState("");//строка ввода задачи

    // add
    const handleAddTask = (task) => { 
        /*
        //console.log(tasks)
        let keyLastObject = parseInt(task.key)+1
        //console.log('last key',lt_key)
        //let lastKey = (tasks[tasks.length-1] && parseInt(tasks[tasks.length-1].key) + 1)
        //console.log(lastKey)
        let lastObject = {
            title: '####last',
            date: 'none',
            key: `${keyLastObject}`
        } 

        const indexLastObject = tasks.findIndex((task) => task.key === tasks[tasks.length-1].key);
        if(tasks.length > 1){
        if (tasks[indexLastObject].title == '####last'){tasks.splice(indexLastObject, 1);}
        }*/

        const newTasks = [...tasks, task];
        
        AsyncStorage.setItem("storedTasks", JSON.stringify(newTasks)).then(() => {
            setTasks(newTasks);
            setInputModalVisible(false);
        }).catch((error) => console.log(error));
    }

    const handleDeleteTask = (rowMap, rowKey) => {
        const newTasks = [...tasks];
        const taskIndex = tasks.findIndex((task) => task.key === rowKey);
        newTasks.splice(taskIndex, 1);
        AsyncStorage.setItem("storedTasks", JSON.stringify(newTasks)).then(() => {
            setTasks(newTasks);
        }).catch((error) => console.log(error));
    }

    const [taskToBeEditer,setTaskToBeEditer] = useState(null);

    //redactor
    const handleTriggerEdit = (item) => {
        setTaskToBeEditer(item);
        setInputModalVisible(true);
        setTaskInputValue(item.title);
    }

    const handleEditTask = (editerTask) => {
        const newTasks = [...tasks];
        const taskIndex = tasks.findIndex((task) => task.key === editerTask.key);
        newTasks.splice(taskIndex, 1, editerTask);

        AsyncStorage.setItem("storedTasks", JSON.stringify(newTasks)).then(() => {
            setTasks(newTasks);
            setInputModalVisible(false);
            setTaskToBeEditer(null);
        }).catch((error) => console.log(error));
    }

    const [trojanButtonVisible, setTrojanButtonVisible] = useState(true);
    const [pointerVisible, setPointerVisible] = useState(false);

    const [calendarHeigt, setCalendarHeigt] = useState(null);

    
    
    const [fixed, setFixed] = useState(false);

    tasks.length < 1 && !pointerVisible? setPointerVisible(true): true

    return (
        <>
            <ModalInput
                InputModalVisible = {InputModalVisible}
                setInputModalVisible = {setInputModalVisible}
                taskInputValue = {taskInputValue}
                setTaskInputValue = {setTaskInputValue}
                handleAddTask = {handleAddTask}
                taskToBeEditer = {taskToBeEditer}
                setTaskToBeEditer = {setTaskToBeEditer}
                handleEditTask = {handleEditTask}
                tasks = {tasks}
                keyboardVisible = {keyboardVisible}

                LanguageStore = {languagesAppList[LanguageAppIndex]}
            />

            <ListItems
                tasks = {tasks}
                setTasks = {setTasks}
                handleTriggerEdit = {handleTriggerEdit}
                handleDeleteTask = {handleDeleteTask}
                setTrojanButtonVisible = {setTrojanButtonVisible}
                setPointerVisible = {setPointerVisible}

                calendarHeigt = {calendarHeigt}
                fixed = {fixed}
                setFixed = {setFixed}

                LanguageStore = {languagesAppList[LanguageAppIndex]}
            />

            {!keyboardVisible && <>
            <TrojanButton
                setInputModalVisible = {setInputModalVisible}
                handleClearTasks = {handleClearTasks}
                trojanButtonVisible = {trojanButtonVisible}
                pointerVisible = {pointerVisible}
                LanguageStore = {languagesAppList[LanguageAppIndex]}
            />
            </>}
        </>
        
    );
}
export default  connect(mapStateToProps('HOME_SCREEN'),mapDispatchToProps('HOME_SCREEN'))(Home);