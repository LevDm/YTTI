import React, { useState, useEffect } from "react";
import { Keyboard, Appearance } from "react-native";
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
 

    const [tasks, setTasks] = useState(props.tasks);
    
    const [LanguageAppIndex, setLanguageAppIndex] = useState(languagesApp.indexOf(props.appConfig.languageApp));//ThemesColorsAppList[ThemeColorsAppIndex]
    const [ThemeColorsAppIndex, setThemeColorAppIndex] = useState(themesApp.indexOf(props.appStyle.palette.theme));//LanguagesAppList[LanguageAppIndex]

    const [appStyle, setAppStyle] = useState(props.appStyle);
    const [appConfig, setAppConfig] = useState(props.appConfig);
    const [hideMenu, setHideMenu] = useState(props.hideMenu);

    const [ThemeSchema, setThemeSchema] = useState(props.appStyle.palette.scheme == 'auto'? Appearance.getColorScheme() : props.appStyle.palette.scheme)

    store.subscribe(() => {
        const jstore = store.getState();

        if(LanguageAppIndex != languagesApp.indexOf(jstore.appConfig.languageApp)){
            setLanguageAppIndex(languagesApp.indexOf(jstore.appConfig.languageApp))
        }

        if(ThemeColorsAppIndex != themesApp.indexOf(jstore.appStyle.palette.theme)){
            setThemeColorAppIndex(themesApp.indexOf(jstore.appStyle.palette.theme));
        }

        if(ThemeSchema != jstore.appStyle.palette.scheme){
            setThemeSchema(jstore.appStyle.palette.scheme == 'auto'? Appearance.getColorScheme() : jstore.appStyle.palette.scheme);
        }

        if (appStyle != jstore.appStyle){
            setAppStyle(jstore.appStyle);
        }

        if (appConfig != jstore.appConfig){
            setAppConfig(jstore.appConfig);
        }

        if(hideMenu != jstore.hideMenu){
            setHideMenu(jstore.hideMenu)
        }
    })
    
    const [listenerColorSheme, setListinerColorScheme] = useState(Appearance.getColorScheme())
    useEffect(()=>{
        if(listenerColorSheme){
            if(appStyle.palette.scheme == 'auto' && listenerColorSheme != ThemeSchema){
                console.log('drawer accept new color sheme', listenerColorSheme, 'used shema', appStyle.palette.scheme)
                setThemeSchema(listenerColorSheme)
            }
        }
    },[listenerColorSheme])
    
    Appearance.addChangeListener(({colorScheme})=>{
        setListinerColorScheme(colorScheme)
    })

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex]

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

                appStyle={appStyle}
                appConfig={appConfig}
                ThemeColorsAppIndex={ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
                LanguageAppIndex = {LanguageAppIndex}
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