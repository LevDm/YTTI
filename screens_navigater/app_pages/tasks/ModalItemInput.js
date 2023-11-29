import React, { useState, useRef, useEffect, useMemo, useCallback, memo, forwardRef } from "react";
import {
    Appearance, 
    StyleSheet, 
    Text,
    Button, 
    Pressable,
    TextInput, 
    FlatList, 
    SectionList,
    View, 
    Dimensions,
    ToastAndroid,
    Keyboard,
    BackHandler,
    Vibration 
} from 'react-native';

import Constants from "expo-constants";

import Reanimated, {
    useSharedValue, 
    useAnimatedStyle, 
    withTiming,
    withDelay,
    withSequence, 
    useAnimatedScrollHandler,
    useAnimatedProps, 
    cancelAnimation,
    useAnimatedRef,
    useDerivedValue,
    scrollTo,
    runOnJS,
    interpolateColor,
    interpolate,
    Extrapolate,
    runOnUI,
    Easing,
    Extrapolation,

    Layout,
    SequencedTransition,
    CurvedTransition,
    FadingTransition,
    Transition,
    FadeIn,
    useAnimatedReaction,
    ZoomIn,
    FadeOut,
    ZoomOut,
    createAnimatedPropAdapter,
    convertToRGBA,
    useReducedMotion
} from 'react-native-reanimated';

import * as NavigationBar from 'expo-navigation-bar';

import { Svg, Path } from "react-native-svg";
import { BlurView } from "@react-native-community/blur";
import MaskedView from '@react-native-masked-view/masked-view';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import SkiaViewDisign from "../../../general_components/base_components/SkiaViewDisign";
import AsyncStorage from '@react-native-async-storage/async-storage';

import {connect, useSelector} from 'react-redux';
import mapStateToProps from "../../../app_redux_files/stateToProps";
import mapDispatchToProps from "../../../app_redux_files/dispatchToProps";
import store from "../../../app_redux_files/store";

import dataRedactor from "../../../app_async_data_manager/data_redactor";


import BaseBottomSheetModal from "../../../general_components/base_components/BaseBottomSheetModal";

import { listsHorizontalProximity } from "../../../app_values/AppDefault";

import { STRUCTURE, categorys, useGetTasks, getTasks, isEqual, getDateInfo } from "./tools";


import useTasksSizes, {TRANSPARENT_COLOR} from "./common_values";


import useLanguage from "../../../app_hooks/useLanguage";
import { BottomSheetFooter , BottomSheetTextInput, useBottomSheet } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DatePicker, TimePicker } from "../../../general_components/DateTimePicker.js/DateTimePicker";

const RBottomSheetTextInput = Reanimated.createAnimatedComponent(BottomSheetTextInput)
const RPressable = Reanimated.createAnimatedComponent(Pressable)

const STAGE_FORM = {
    keyId: null,//''
    description: null, //''
    compleated: false, //bool
}

const DATE_FORM = {
    str: {
        date: null, //'00.00.00'
        time: null, //'00:00'

        year: null,
        month: null,
        day: null,
        hour: null,
        minute: null,
    },
    date: null //'date-time'
}

const CONTENT_FORM = {
    description: null, //''
    stages: null, //[STAGE_FORM'S]
}

const ITEM_FORM = {
    keyId: null, //''
    content: null, //CONTENT_FORM

    tracking: null, //DATE_FORM

    compleated: null, //DATE_FORM

    created: null, //DATE_FORM

    repead: null, //?
    notification: null //?
}


const actionsStateInitial = {
    send: false,
    time: false,
    notification: false,
    repeat: false
}


function InputModal(props){
    const {
        modalRef,

        taskAdd,
        taskEdit,

        uiStyle,
        uiTheme,
        uiComposition,
    } = props

    const {
        borderRadius: {
            secondary
        },
        modals: {
            proximity: {h: fullWidth},
            highlight: {
                dimOutDark,
                gradient,
                outline
            }
        },
        effects: {
            blur
        },
        navigationMenu: {
            type: navigaterType,
            height: navigaterHeight
        }
    } = uiStyle

    const {
        basics: {
            accents: {
                secondary: basicAS,
                tertiary: basicAT,
                
            },
            neutrals: {
                quaternary: basicNQ
            }
        },
        texts: {
            accents: {
                
            },
            neutrals: {
                primary: textNP,
                secondary: textNS,
                tertiary: textNT,
            }
        },
        icons: {
            accents: {
                secondary: iconAS,
                tertiary: iconAT
            },
            neutrals: {

            }
        },
        specials: {
            dimout
        }
    } = uiTheme

    const {
        appFunctions
    } = uiComposition

    const {
        SCREEN_PROXIMYTY_HRZ,

        OS_NAVIGATION_BAR_HEIGHT,

        STYCKYS_HEIGHT,
        HEADER_TOOL_HEIGHT,
        SECTIONS_SELECTOR_HEIGHT,
        PRIMARY_HEADER_HEIGHT,
        SECONDARY_HEADER_HEIGHT,

        HEAD_COMPONENT_HEIGHT,
        LIST_ITEM_SIZE,

        DEVICE_H,
        DEVICE_W
    } = useTasksSizes()

    
    const getEnabled = (sharedAppFunctions) => {
        'worklet';
        return ((Object.values(sharedAppFunctions).filter((el)=>el.used.value)).length > 1)
    }

    const menuEnabled = useSharedValue(getEnabled(appFunctions))

    useAnimatedReaction(()=>getEnabled(appFunctions),
        (newValue, oldValue)=>{
            if(newValue != menuEnabled.value){
                menuEnabled.value = newValue
            }      
        }
    )

    const modalStyle = useAnimatedStyle(()=>({
        marginHorizontal: (fullWidth.value?? 0 )/2,
        borderRadius: secondary.value,
    }))

    const HEIGHT_TOOLBAR = 50

    const rippleProps = useAnimatedProps(()=>({
        android_ripple: {
            color: `${textNS.value}18`,
            //borderless: true,
            foreground: false
        }
    }))

    const Tool = (props) => {
        const {
            keyId,
            icon,
            proximity,
            flexValue = 1,
            pressableProps,
            buttonStyle,
            textStyle
        } = props

        const Language = proximity? useLanguage().TasksScreen.modalInput.actions : null
        const title = proximity? '\n'+ Language[proximity] : ''

        return (
            <Reanimated.View
                flex = {flexValue}
                style = {[{
                    minWidth: HEIGHT_TOOLBAR-2,
                    borderRadius: proximity? 6 : 25,
                    overflow: 'hidden'
                }, buttonStyle,]}
                entering={FadeIn}
            >
            <RPressable
                key = {keyId}
                style={{
                    flex: 1,
                    justifyContent: 'center'
                }}
                {...pressableProps}
                animatedProps={rippleProps}
            >
                <Reanimated.Text
                    style={[{
                        textAlign: 'center',
                        fontSize: 14,
                    }, toolsSymbolColor, textStyle,]}
                >
                    <MaterialCommunityIcons size={24} name={icon}/>
                    {title}
                </Reanimated.Text>
            </RPressable>
            </Reanimated.View>
        )
    }

    const refContent = useRef({})
    const savedItemInput = useRef(ITEM_FORM)

    const setItemContent = (item) => {
        console.log("content set")
        savedItemInput.current = item
        refContent.current.setText(item.content.description)
        refContent.current.setStages(item.content.stages?? [])
        dateTimeRef.current.setDateList(item.tracking.dateList)
        const newActionsStateInitial = {...actionsStateInitial}
        newActionsStateInitial.send = true
        //newActionsStateInitial.

    }


    const clearInputItem = () => {
        savedItemInput.current = ITEM_FORM
        inputState.value = actionsStateInitial
        refContent.current.setText(null)
        refContent.current.setStages([])
        dateTimeRef.current.setDateList(null)
        console.log("content clear")
    }

    useEffect(()=>{
        modalRef.current.setItemContent = setItemContent
    }, [])


    const buildItem = (copyInput) => {
        if(!copyInput.keyId){
            // -> new task 
            const currentDate = getDateInfo()

            copyInput.keyId = keyIdGen('task')

            if(!copyInput.created){
                copyInput.created = {
                    dateList: currentDate,
                    //date: ''
                }
            }
            

            if(!copyInput.tracking){
                const todayEnd = [...currentDate]
                todayEnd.splice(3, 3, /*last time ->*/  23, 59, 59);
                copyInput.tracking = {
                    dateList: todayEnd,
                    //date: ''
                }
            }
            
            taskAdd(copyInput)
        } else {
            // -> editing task
            taskEdit(copyInput)
        }
    }


    const sendInputItem = () => {
        Keyboard.dismiss()
        setTimeout(()=>{
            modalRef.current.dismiss() 
            setTimeout(()=>{
                modalRef.current.present()
            }, 600)
        }, 600)
        
        if(inputState.value.send){
            const copy = {...savedItemInput.current}
            clearInputItem()
            buildItem(copy)
        }
    }

    const inputState = useSharedValue(actionsStateInitial)

    const buttonsReaction = (action, value) => {
        switch(action){
            case 'text':
                //console.log(action, value)
                const check = value && (value.replaceAll(' ', '').length > 0)
                inputState.value = {...inputState.value, send: check}
                break;
        }
            
    }



    const sendButtonStyle = useAnimatedStyle(()=>({
        opacity: inputState.value.send? 1 : 0.6
    }))
    const timeButtonStyle = useAnimatedStyle(()=>(inputState.value.time?{}:{
        color: textNT.value
    }))
    const repeatButtonStyle = useAnimatedStyle(()=>(inputState.value.repeat?{}:{
        color: textNT.value
    }))
    const notificationButtonStyle = useAnimatedStyle(()=>(inputState.value.notification?{}:{
        color: textNT.value
    }))

    const toolsSymbolColor = useAnimatedStyle(()=>({
        color: textNP.value,
    }))

    const groundTools = [
        {
            keyId: 'modal_tool_5',
            icon: "eraser",
            proximity: 'erase',
            pressableProps: {
                onPress: clearInputItem,
            }
        },
        {
            keyId: 'modal_tool_6',
            icon: "arrow-up-bold",
            proximity: 'send',
            flexValue: 2,
            pressableProps: {
                onPress: sendInputItem,
            },
            textStyle: sendButtonStyle
        },
    ]


    const dateTimeRef = useRef()

    const addTools = [
        /* 
        {
            keyId: 'modal_tool_1',
            icon: "clock-time-five",
            proximity: 'time',
            pressableProps: {

            },
            textStyle: timeButtonStyle
        },*/
        {
            keyId: 'modal_tool_3',
            icon: "repeat-variant",
            proximity: 'repeat',
            pressableProps: {
                onPress: undefined,
                onLongPress: undefined,
            },
            textStyle: repeatButtonStyle
        },
        {
            keyId: 'modal_tool_4',
            icon: "bell",
            proximity: 'notification',
            pressableProps: {
                onPress: undefined,
                onLongPress: undefined,
            },
            textStyle: notificationButtonStyle
        },
    ]

    

    const ToolBar = () => {
        const [tools, setTools] = useState(groundTools)

        const switchTools = () => {
            const isGround = tools[0].keyId == groundTools[0].keyId
            setTools(isGround? addTools : groundTools)
        }

        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row'
                }}
            >
                <Tool 
                    keyId = "modal_tool_0"
                    icon = "dots-vertical-circle"
                    flexValue = {0}
                    pressableProps = {{
                        onPress: switchTools,
                    }} 
                />
                {tools.map((item)=>(<Tool key={item.keyId} {...item}/>))}
            </View>
        )
    }

    const renderFooterModalTools = useCallback((props) => {
        const {
            animatedFooterPosition
        } = props
        const {
            animatedIndex,
            animatedPosition
        } = useBottomSheet()

        const keyboardShow = useSharedValue(false)

        useEffect(() => {
            const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
                keyboardShow.value = true
            });
            const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
                keyboardShow.value = false
            });
      
            return () => {
                showSubscription.remove();
                hideSubscription.remove();
            };
        }, []);

        const footerStyleLayout = useAnimatedStyle(()=>{
            const menu = (navigaterType.value == 'type_1' && menuEnabled.value && !keyboardShow.value)? navigaterHeight.value : 0
            return {
                height: (HEIGHT_TOOLBAR +OS_NAVIGATION_BAR_HEIGHT +menu),
                paddingBottom: (OS_NAVIGATION_BAR_HEIGHT +menu),
                backgroundColor: basicAT.value,//`${}${blur.value? 'e0' : 'ff'}`,
                marginHorizontal: ((fullWidth.value?? 0 )/2),
            }
        })

        return (
            <BottomSheetFooter
                animatedFooterPosition = {animatedFooterPosition}
                bottomInset={0}
            >
                <Reanimated.View 
                    style={[footerStyleLayout, 
                        {
                        paddingHorizontal: 8,
                        flex: 1,
                        paddingTop: 4,
                    }]}
                >
                    <ToolBar />
                </Reanimated.View>
            </BottomSheetFooter>
        )
    },[]);

    const textInputColor = useAnimatedStyle(()=>({
        color: textNS.value,
    }))

    const iconInputColor = useAnimatedStyle(()=>({
        color: iconAT.value,
    }))


    const text = (value) => {
        buttonsReaction('text', value)
        const copy = JSON.parse(JSON.stringify(savedItemInput.current))
        copy.content = {
            ...copy.content,
            description: value,
        } 
        savedItemInput.current = copy 
    }

    const textRef = useRef()
    const TextContentInput = () => {
        const Language = useLanguage().TasksScreen.modalInput

        const [value, setValue] = useState(savedItemInput.current.content?.description)

        useEffect(()=>{
            refContent.current = {...refContent.current, setText: setValue}
        })

        const settingText = (newValue) => {
            text(newValue)
            setValue(newValue)
        }

        const end = () => {
            text(value)
        }
        return (
            <Reanimated.View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width:'100%',
                }}
                layout={Layout}
            >
                <Reanimated.Text
                    style={[iconInputColor, {
                        width: 24,
                        height: 24,
                    }]}
                    layout={Layout}
                >
                    <MaterialCommunityIcons name="sticker-text-outline" size={24}/> 
                </Reanimated.Text>
                <RBottomSheetTextInput
                    ref={textRef}
                    multiline
                    maxLength={195}
                    style={[textInputColor, {
                        minHeight: 40,
                        //width:'100%',
                        flex: 1,
                        fontSize: 16,
                        marginLeft: 4,
                    }]}
                    value={value}
                    onChangeText={settingText}
                    onEndEditing={end}
                    //animatedProps={textInputValue}

                    placeholder={Language.newTask}
                    cursorColor={textNS.value}
                    placeholderTextColor={textNT.value}
    
                    keyboardType={'default'}

                    layout={Layout}
                />
            </Reanimated.View>
        )
    }

    const StageItem = (props) => {
        const {
            keyId,
            description,
            //index
            delItem,
            addItem,
            isCreater
        } = props

        const Language = useLanguage().TasksScreen.modalInput

        const [value, setValue] = useState(description)

        const end = () => {
            //console.log(value.length)
            if(isCreater){
                if(value){
                    const newItem = {...STAGE_FORM}
                    newItem.description = value
                    const stateAddet = addItem(newItem)
                    if(stateAddet){
                        setValue(null) 
                    } 
                }
            } else {
                const check = value && (value.replaceAll(' ', '').length > 0)
                if(!check){
                    delItem(keyId)
                    return
                }
                const index = (savedItemInput.current.content.stages).findIndex((item)=>item.keyId == keyId)
                if(index != -1){
                    savedItemInput.current.content.stages[index].description = value
                }
            }
        }

        const buttonPress = () => {
            delItem(keyId)
        }

        return (
            <Reanimated.View
                style={{
                    flexDirection: 'row',
                    width: '100%',
                    paddingRight: 4,
                    height: 40,
                }}
                layout={Layout}
            >
                <RPressable
                    disabled={isCreater}
                    style={{
                        width: 46,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    animatedProps={rippleProps}
                    onPress={buttonPress}
                >
                    <Reanimated.Text
                        style = {iconInputColor}
                    >
                        <MaterialCommunityIcons size={28} name={isCreater? "timeline-plus" : "timeline-minus"}/>
                    </Reanimated.Text>
                </RPressable>
                <RBottomSheetTextInput
                    maxLength={36}
                    //multiline
                    numberOfLines={2}
                    placeholder={Language.subTask}
                    enterKeyHint={"send"}

                    style={[textInputColor, {
                        flex: 1,
                        fontSize: 16,
                    }]}
                    cursorColor={textNS.value}
                    placeholderTextColor={textNT.value}

                    value={value}
                    onChangeText={setValue}
                    onEndEditing={end}
                />
            </Reanimated.View>
        )
    }

    const keyIdGen = (prefix) => String(`${prefix}_${new Date().getTime()}`)

    const updStages = (value) => {
        const copy = JSON.parse(JSON.stringify(savedItemInput.current))
        copy.content = {
            ...copy.content,
            stages: value
        } 
        savedItemInput.current = copy 
    }

    const StagesContentInput = () => {
        const MAX_STAGES = 10

        const [stages, setStages] = useState(savedItemInput.current.content?.stages??[])

        useEffect(()=>{
            refContent.current = {...refContent.current, setStages: setStages}
        })

        const addItem = (item = STAGE_FORM) => {
            const exit = stages.length > MAX_STAGES || (stages.length > 0? !stages[stages.length-1].description : false)
            if(exit){return false}
            const newItem = item
            newItem.keyId = keyIdGen('task_stage')
            setStages([...stages, item])
            updStages([...stages, item])
            return true
        }

        const delItem = (itemKeyId) => {
            const newStages = stages.filter((stage)=>stage.keyId != itemKeyId)
            setStages(newStages)
            updStages(newStages)
        }

        return (
            <Reanimated.View
                style={{
                    //paddingBottom: 50
                }}
                layout={Layout}
            >
                {stages.map((item)=>(<StageItem key={item.keyId} {...item} delItem={delItem}/>))}
                {stages.length < MAX_STAGES &&
                <StageItem 
                    key={'creater'}
                    isCreater = {true}
                    addItem={addItem}
                />}
            </Reanimated.View>
        )
    }

    const updTracking = (value) => {
        const copy = JSON.parse(JSON.stringify(savedItemInput.current))
        copy.tracking = {
            ...copy.tracking,
            dateList: value
        } 
        savedItemInput.current = copy 
    }

    const DateTimeSelector = () => {
        const [dateList, setDateList] = useState(savedItemInput.current.tracking?.dateList)  

        useEffect(()=>{
            dateTimeRef.current = {
                setDateList: setDateList
            }
        },[])
        
        const formatNum = (num) => `${num > 9?'':'0'}${num}`

        const dateText = dateList? `${formatNum(dateList[2])}.${formatNum(dateList[1])}.${dateList[0]}` : 'today'
        const timeText = dateList? `${formatNum(dateList[3])}:${formatNum(dateList[4])}` : 'endday'

        const onChange = (event, selectedDate) => {
            const check = (selectedDate.getTime() - new Date().getTime()) > 0
            if(event.type == "set" && check){
                const currentDate = getDateInfo(selectedDate)
                console.log('ev', event, currentDate)
                updTracking(currentDate)
                setDateList(currentDate);
            }
        }

        const showMode = (currentMode, value) => {
            console.log('ddttp', currentMode, value)
            DateTimePickerAndroid.open({
            value: new Date(...value),
            onChange,
            mode: currentMode,
            display: "spinner",
            is24Hour: true,
            });
        }


        const changeDate = () => {

            showMode('date', getDateInfo())
        }

        const changeTime = () => {

            showMode('time', getDateInfo())
        }

        const DateTimeButton = (props) => {
            const {
                title,
                onPress,
            } = props
            const isList = !(title == 'today' || title == 'endday')

            const Language = useLanguage().TasksScreen.modalInput.dateTime

            const colorTitle = useAnimatedStyle(()=>({
                color: isList? textNS.value : textNT.value
            }))

            return( 
                <Reanimated.View
                    style={{
                        borderRadius: 12,
                        overflow: 'hidden'
                    }}
                    layout={Layout}
                >
                <RPressable
                    style={{
                        height: 36,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 12,
                    }}
                    onPress={onPress}
                    animatedProps={rippleProps}
                >
                    <Reanimated.Text
                        style={[colorTitle, {
                            fontSize: 16,
                        }]}
                    >
                        {isList? title : Language[title]}
                    </Reanimated.Text>
                </RPressable>
                </Reanimated.View>
            )
        }

        return (
            <Reanimated.View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    height: 36,
                    //backgroundColor: 'red',
                    paddingHorizontal: 12,
                    width: '100%',
                }}
                layout={Layout}
            >
                <DateTimeButton 
                    title={dateText}
                    onPress={changeDate}
                />
                <DateTimeButton 
                    title={timeText}
                    onPress={changeTime}
                />
            </Reanimated.View>
        )
    }

    const addHeight = (navigaterType.value == 'classical' && menuEnabled.value)? navigaterHeight.value : 0

    return (
        <BaseBottomSheetModal 
            modalRef = {modalRef}
            snapHeights = {[(200+addHeight), (420+addHeight)]}
            contentStyle = {{
                paddingBottom: 80 +HEIGHT_TOOLBAR +OS_NAVIGATION_BAR_HEIGHT +addHeight,
                paddingHorizontal: 8,
            }}
           
            modalStyle = {modalStyle}

            aBlur={blur}
            aHighlight = {{
                //highlightMethods
                dimOutDark: dimOutDark,
                gradient: gradient,
                outline: outline
            }}
            aColors={{
                bg: basicNQ,
                handle: basicAS,
                accent: basicAT,
                dimout: dimout,
            }}

            sheetProps={{
                activeOffsetY: [-16, 16],
                keyboardBlurBehavior: "restore",
                footerComponent: renderFooterModalTools
            }}
        >
            <TextContentInput />
            <DateTimeSelector />
            <StagesContentInput />
        </BaseBottomSheetModal>
    )
}
export default InputModal


import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const ControlModal = (props) => {
    const {
        reff,

        uiStyle,
        uiTheme,
    } = props 

    const showDatepicker = () => {
        showMode('default');
    };

    useEffect(()=>{
        reff.current = {
            setVisible: showDatepicker
        }
    }, [])

    const [date, setDate] = useState(new Date());

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
        value: date,
        onChange,
        mode: currentMode,
        display: "spinner",
        is24Hour: true,
        });
    };

    
    return <></>   
}