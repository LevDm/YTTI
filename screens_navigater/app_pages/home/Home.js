import React, { useState, useEffect, useRef } from "react";
import { 
    Keyboard, 
    Appearance,
    Dimensions,
    StyleSheet,
    View,
    Text,
    FlatList,
    Modal,
    TextInput,
    Pressable,
    TouchableOpacity,
    Vibration
} from "react-native";

import Constants from "expo-constants";

import { SwipeListView } from "react-native-swipe-list-view";

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
    Extrapolation 
} from 'react-native-reanimated';

import { BlurView } from "@react-native-community/blur";
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Application from 'expo-application';

import SkiaViewDisign from "../../../general_components/base_components/SkiaViewDisign";
// components
//import ListItems from "../../../componets/Listitems";
//import ModalInput from "../../../componets/ModalInput";
import TrojanButton from "../../../componets/TrojanButton";

import AsyncStorage from '@react-native-async-storage/async-storage';

import {connect} from 'react-redux';
import mapStateToProps from "../../../redux_files/stateToProps";
import mapDispatchToProps from "../../../redux_files/dispatchToProps";
import store from "../../../redux_files/store";

import dataRedactor from "../../../async_data_manager/data_redactor";

import { 
    BasePressable,
    BaseWindow,
    BaseCheckBox,
    BaseSwitch 
} from "../../../general_components/base_components/BaseElements";

import themesColorsAppList, {themesApp} from "../../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../../app_values/Languages";

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');
const statusBarHeight = Constants.statusBarHeight+1

const ColorsApp = themesColorsAppList[1]['light']


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


    const [ bottomBord, setBottomBord ] = useState(
        props.appStyle.functionButton.size 
        + 12.5 
        + props.appStyle.navigationMenu.height 
        + ((props.appStyle.navigationMenu.type == 'hidden' && props.appStyle.navigationMenu.position.horizontal == 'center' && props.appStyle.functionButton.position == 'center')? 
            20 + interpolate(props.appStyle.navigationMenu.position.vertical, [-150, 150] , [0, 30]) 
            : 0
        )
    ) 

    const animValueBobberButtonVisible = useSharedValue(0);

    const bobberButtonPress = () => {
        setInputModalVisible(true);
    }
   
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

    const handleDeleteTask = (rowKey) => {
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

    const menuPress = () => { 
        Vibration.vibrate([5,8])
        if(appStyle.navigationMenu.type == 'not' || (appConfig.weather.type == 'panel' && appConfig.weather.locationInfo.length>0)){
            props.navigation.openDrawer()
        } else {
            props.navigation.navigate('settingsStack')
        }

    }

    return (
        <>
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

                reaValueBobberButtonVisible = {animValueBobberButtonVisible}

                menuPress = {menuPress}

                appStyle={appStyle}
                appConfig={appConfig}
                ThemeColorsAppIndex={ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
                LanguageAppIndex = {LanguageAppIndex}
            />

            {/*!keyboardVisible && <>
            <TrojanButton
                setInputModalVisible = {setInputModalVisible}
                handleClearTasks = {handleClearTasks}
                trojanButtonVisible = {trojanButtonVisible}
                pointerVisible = {pointerVisible}
                LanguageStore = {languagesAppList[LanguageAppIndex]}
            />
            </>*/}


            <BobberButton 
                enabled={true}
        
                bottomBord = {bottomBord}
                reaValueBobberButtonVisible = {animValueBobberButtonVisible}

                onPress = {bobberButtonPress}

                appStyle = {appStyle}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />



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
        </>
        
    );
}
export default connect(mapStateToProps('HOME_SCREEN'),mapDispatchToProps('HOME_SCREEN'))(Home);

//====================================================================================================================================

const ripple = (color) => ({
    color: `${color}20`,
    borderless: true,
    foreground: false
})
//====================================================================================================================================

const BobberButton = (props) => {
    const {
        reaValueBobberButtonVisible,
        bottomBord,
        enabled,

        onPress,
 
        appConfig,
        LanguageAppIndex,

        appStyle,
        ThemeColorsAppIndex,
        ThemeSchema
    } = props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    
    const dynamicStyleBobberDown = useAnimatedStyle(() => {
        const duration = 200;
        return {
            //opacity: withTiming(animValueBobberButtonExpand.value == 1? 1 : 0.9, {duration: duration}),
        }
    })

    const dynamicStyleBobberButton = useAnimatedStyle(()=>{
        const duration = 300
        const durationTranslate = 400;
        const position =(buttonSize)=>({
            center: (deviceWidth*0.5-(buttonSize/2)),
            left: ((deviceWidth-12)-buttonSize),
            right: (12)
        })
        const bottom = interpolate(appStyle.navigationMenu.position.vertical, [-150, 150] , [0, 30])
        const addBottom = (appStyle.navigationMenu.type == 'hidden' && appStyle.navigationMenu.position.horizontal == 'center' && appStyle.functionButton.position == 'center')? (20+bottom) : 0
        return {
            height:  withTiming(5+2*appStyle.functionButton.size, {duration: duration}),
            width:  withTiming(appStyle.functionButton.size, {duration: duration}),
            bottom:  withTiming((appStyle.navigationMenu.height+12.5+addBottom), {duration: duration}),
            right: withTiming( (position(appStyle.functionButton.size)[appStyle.functionButton.position]), {duration: duration}),

            transform: [
                {translateY: withTiming((reaValueBobberButtonVisible.value == 0 && enabled)? 0 : bottomBord, {duration: durationTranslate})}
            ] 
        }
    })

    return(
        <Reanimated.View 
            style = {[dynamicStyleBobberButton, {
                position: 'absolute',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
            }]}
        >   
            <Reanimated.View
                style = {[dynamicStyleBobberDown,{
                    zIndex: 1,       
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: appStyle.functionButton.size ,
                    width: appStyle.functionButton.size ,
                    
                    //backgroundColor: 'red'
                    //borderRadius: appStyle.borderRadius.additional,
                }]}
            >        
                <SkiaViewDisign
                    isGeneralObject={true} 
                    borderRadius = {appStyle.borderRadius.additional}
                    backgroundColor = {(appStyle.functionButton.invertColors? Theme.basics.neutrals.tertiary : Theme.basics.accents.secondary)}
                    shadowColors = {Theme.specials.shadow}
                    shadowMargin={{horizontal: 5, vertical: 5}}
                    shadowStyle = {appStyle.effects.shadows}
                    adaptiveSizeForStyle={false}
                    innerShadow={{
                        used: true,
                        borderWidth: 0.5
                    }}
                />
                {appStyle.effects.blur && 
                <View 
                    style = {[StyleSheet.absoluteFillObject, {
                        left: 5,
                        top: 5,
                        height: appStyle.functionButton.size-10,
                        width: appStyle.functionButton.size-10,
                        //specialty blur for android
                        overflow: 'hidden',
                        borderRadius: appStyle.borderRadius.additional,
                    }]}
                >
                <BlurView
                    style = {{flex: 1, }}
                    blurType = {'light'}
                    blurAmount = {10}
                    
                    //ANDROID_PROPS
                    overlayColor={`${appStyle.functionButton.invertColors? Theme.basics.neutrals.tertiary : Theme.basics.accents.secondary}90`}
                    //overlayColor={'transparent'}
                    //blurRadius	= {10}
                    //downsampleFactor = {10}
                />
                </View>}  
                <View 
                    style={{
                        position: 'absolute',
                        height: appStyle.functionButton.size -10,
                        width: appStyle.functionButton.size -10,
                        borderWidth: appStyle.functionButton.outline? 0.5 : 0,
                        borderColor: `${Theme.specials.separator}20`,
                        borderRadius: appStyle.borderRadius.additional
                    }}
                />
                <BasePressable
                    type={"i"}
                    icon={{name: "pencil", size: 24, color: appStyle.functionButton.invertColors? Theme.icons.accents.primary : Theme.icons.neutrals.primary}}
                    style={[{
                        height: appStyle.functionButton.size-10,
                        width: appStyle.functionButton.size-10,
                        borderRadius: appStyle.borderRadius.additional,
                        //backgroundColor: appStyle.effects.blur? 'transparent' : (appStyle.functionButton.invertColors? Theme.basics.neutrals.secondary : Theme.basics.accents.secondary),
                
                        },
                    ]}
                    android_ripple={appStyle.effects.ripple == 'all'? ripple(Theme.icons.accents.primary) : false}
                    onPress={onPress}
                />
            </Reanimated.View>
        </Reanimated.View>
    )
}

//====================================================================================================================================
const headerPanel = 45
const headerParams = 35
const headerFullHeight = statusBarHeight+headerPanel+headerParams

const listItemHeight = 100

const Reanimated_SwipeList = Reanimated.createAnimatedComponent(SwipeListView)
const Reanimated_FlatList = Reanimated.createAnimatedComponent(FlatList)
const ListItems = (props) => {
    const {
    tasks, 
    handleTriggerEdit, 
    handleDeleteTask,
    setTrojanButtonVisible,
    setPointerVisible,

    LanguageStore,
    reaValueBobberButtonVisible,


    menuPress,

    appConfig,
    LanguageAppIndex,

    appStyle,
    ThemeColorsAppIndex,
    ThemeSchema

    } = props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].TasksScreen

    //для стилизации текущей строки списка задач
    const nullRow = {key: null, ref: null, toValue: null}
    const [swipedRow, setSwipedRow] = useState(nullRow);
    const [swipeDirections, setSwipeDirections] = useState(0);

    const [itemModalVisible, setItemModalVisible] = useState(false);

    //const [calendarHeigt, setCalendarHeigt] = useState(null);
    
    //const [fixed, setFixed] = useState(false);


    const headerShort = useSharedValue(headerFullHeight)

    const scrollY = useSharedValue(0)

    const onScrollList = useAnimatedScrollHandler({
        onScroll: (event, ctx) => {
            const {
                contentOffset,
                layoutMeasurement,
                contentSize,
                velocity
            } = event

            let isUpScroll = false;
            let isEnd = false;
            let isStart = false;

            if(Math.abs(velocity.y).toFixed(4) != 0){
                isUpScroll = (velocity.y).toFixed(4) < 0.0001;
            }
            isEnd = (layoutMeasurement.height + contentOffset.y) >= (contentSize.height - 5);
            isStart = contentOffset.y < 0.05//(statusBarHeight*0);
            const visibleBobber = ((isUpScroll) || isStart || isEnd)

            cancelAnimation(reaValueBobberButtonVisible);
            reaValueBobberButtonVisible.value = visibleBobber? 0 : 1

            const shortHeight = headerFullHeight-headerPanel

            headerShort.value = isStart? headerFullHeight : Math.min( Math.max((headerShort.value-(6*velocity.y)), shortHeight) , headerFullHeight)

            scrollY.value = contentOffset.y
        }
    })

    const dynamicHeader = useAnimatedStyle(()=>{
        const duration = 300
        return {
            
            height: headerShort.value,/* interpolate(
                scrollY.value, 
                [, 1],
                [headerFullHeight, headerFullHeight-headerPanel],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }  
            ), 
            */
        }
    })

    const dynamicPanel = useAnimatedStyle(()=>{
        const duration = 300
        return {
            transform: [
                {translateY: interpolate(
                    headerShort.value, 
                    [headerFullHeight-headerPanel, headerFullHeight],
                    [-statusBarHeight, statusBarHeight],
                    //extrapolation
                    {
                        extrapolateLeft: Extrapolation.CLAMP,
                        extrapolateRight: Extrapolation.CLAMP
                    })
                }
            ],
            opacity: interpolate(
                headerShort.value, 
                [headerFullHeight-headerPanel, headerFullHeight],
                [0, 1]
            )
        }
    })

    const dynamicParams = useAnimatedStyle(()=>{
        const duration = 300
        return {
            transform: [
                {translateY: interpolate(
                    headerShort.value, 
                    [ headerFullHeight-headerPanel, headerFullHeight ],
                    [ statusBarHeight, statusBarHeight+headerPanel ],
                    //extrapolation
                    {
                        extrapolateLeft: Extrapolation.CLAMP,
                        extrapolateRight: Extrapolation.CLAMP
                    })
                }
            ],
        }
    })

    const categorys = ['today', 'all']
    const [category, setCategory] = useState(0)

    const indicatorLine = useSharedValue({widths: [], left: []})

    const animStyleIndicatorLine = useAnimatedStyle(() => {
        const duration = 350; //(deviceWidth*category) + indicatorLine.value.left[category]
        //console.log(indicatorLine.value)
        return {
            width: withTiming(indicatorLine.value.widths.length>0? indicatorLine.value.widths[category] : 0, {duration: duration-20}),
            left: withTiming(indicatorLine.value.left.length>0? ((0.5*deviceWidth*category) + indicatorLine.value.left[category]) : 0, {duration: duration, easing: Easing.bezier(0.45, 0, 0.55, 1)}),
            //transform: [
            //    {translateX: animValueTranslateX.value}
            //] 
        }
    }, [indicatorLine, category])

    const changeCategory = (item, index) => {
        console.log('set',item, indicatorLine.value)
        setCategory(index)
    }


 
    return (
        <>
        <Reanimated.View
            style={[   
                {   
                    top: 0,
                    zIndex: 1,
                    position: 'absolute',
                    borderColor: appStyle.effects.blur? 'transparent' : `${Theme.specials.separator}25`,
                    borderBottomWidth: 0.4,
                    width: deviceWidth,
                    alignItems: 'flex-end'                    
                },
                appStyle.effects.blur? {} : {
                    backgroundColor: appStyle.lists.invertColorsHeader? Theme.basics.neutrals.secondary : Theme.basics.accents.primary,
                },
                dynamicHeader
            ]}
        >
            {appStyle.effects.blur && 
            <View 
                style = {[StyleSheet.absoluteFillObject, {
                    flex: 1,
                    //specialty blur for android
                    overflow: 'hidden',
                }]}
            >
            <BlurView
                style = {{flex: 1, }}
                blurType = {'light'}
                blurAmount = {10}
                
                //ANDROID_PROPS
                overlayColor={`${appStyle.lists.invertColorsHeader? Theme.basics.neutrals.secondary : Theme.basics.accents.primary}90`}
                //overlayColor={'transparent'}
                //blurRadius	= {10}
                //downsampleFactor = {10}
            />
            </View>}
        </Reanimated.View>
        <Reanimated.View
            style={[{
                //top: statusBarHeight,
                zIndex: 1,
                height: headerPanel,
                width: deviceWidth,
                position: 'absolute',
                //backgroundColor: 'red'
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexDirection: appStyle.navigationMenu.drawerPosition == 'left'? 'row' : 'row-reverse', 
            }, dynamicPanel]}
        >
            <BasePressable 
                type="i"
                icon={{
                    name: ((appStyle.navigationMenu.type == 'not' || (appConfig.weather.type == 'panel' && appConfig.weather.locationInfo.length>0)))? "menu" : 'cog', 
                    size: 24, 
                    color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary
                }}
                style={[{
                    height: 45, 
                    width: 45, 
                    paddingTop: 4,
                    borderRadius: appStyle.borderRadius.additional
                }, appStyle.navigationMenu.drawerPosition == 'left'? {marginLeft: 15,} : {marginRight: 15}]}
                onPress={menuPress}
                android_ripple={appStyle.effects.ripple == 'all'? ripple(appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary) : false}
            />
            <Text 
                style = {[{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: '500',
                    letterSpacing: 0.5,
                    fontVariant: ['small-caps'],
                    color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary
                }, appStyle.navigationMenu.drawerPosition == 'left'? {marginRight: 60,} : {marginLeft: 60}]}
            >
                {Language.HeaderTitle}
            </Text>
        </Reanimated.View>

        <Reanimated.View
            style={[{
                zIndex: 1,
                //top: statusBarHeight+headerPanel,
                width: deviceWidth,
                height: headerParams,
                position: 'absolute',
                //backgroundColor: 'blue'
            }, dynamicParams]}
        >
            <View
                style={{
                    flex: 1,
                    //paddingHorizontal: 5,
                    flexDirection: 'row'
                }}
            >
                {categorys.map((item, index)=>{
                    return (
                        <Pressable
                            key={item+index}
                            style={{
                                width: (deviceWidth)/2,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={()=>changeCategory(item, index)}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    fontVariant: ['small-caps'],
                                    color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary,
                                    //backgroundColor: 'red'
                                }}
                                onLayout={(event)=>{
                                    //const copy = indicatorLine.value? JSON.parse(JSON.stringify(indicatorLine.value)) : {widths: [], left: []}
                                    console.log(event.nativeEvent.layout)
                                    indicatorLine.value.widths[index] = event.nativeEvent.layout.width+10
                                    indicatorLine.value.left[index] = event.nativeEvent.layout.x-5
                                    //
                                    if(index == categorys.length-1){
                                        indicatorLine.value = JSON.parse(JSON.stringify(indicatorLine.value))
                                    }
                                }}
                            >
                                {Language.filtration[item]}
                            </Text>
                        </Pressable>
                    )
                })}
            </View>
            <Reanimated.View 
                style={[animStyleIndicatorLine, {
                    position: 'absolute',
                    height: 2.5,
                    minWidth: 5,
                    borderRadius: 1,
                    bottom: 0,
                    backgroundColor: appStyle.lists.invertColorsHeader? Theme.basics.accents.primary : Theme.basics.accents.quaternary
                }]}
            />
        </Reanimated.View>
        <Reanimated_SwipeList
            data = {tasks}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
                paddingTop: headerFullHeight,
                paddingBottom: appStyle.functionButton.size+13+(appStyle.navigationMenu.type != 'not'? appStyle.navigationMenu.height : 0)
            }}
            onScroll = {onScrollList}
            showsVerticalScrollIndicator = {false}
            style = {{flex: 1, 
                paddingBottom: 10, 
                marginBottom: 0, 
            }}
            renderItem = {(data) => {
                
                let timeInFire = 'none';

                let toDate = new Date(
                    parseInt(data.item.toDate.substr(6,10)),
                    parseInt(data.item.toDate.substr(3,5))-1,
                    parseInt(data.item.toDate.substr(0,2)),

                    parseInt(data.item.toTime.substr(0,2)),
                    parseInt(data.item.toTime.substr(3,5))
                );

                let thisDate = new Date();

                let across = (toDate - thisDate)/3600000

                if(across >= 0 && across <= 24){ // 
                    timeInFire = 'soon';
                }
                if(across >= 0 && across <= 1+parseInt(data.item.fireTarget)){ // 
                    timeInFire = 'soonBurn';
                }
                if(across >= 0 && across <= parseInt(data.item.fireTarget)){
                    timeInFire = 'burn';
                }
                if(across < 0){ //
                    timeInFire = 'burnOut';
                }
                //<Text style = {styles.TaskDate}>{LanguageStore.ListItems.from}: {data.item.date}</Text>

                let numberLinesInText = Math.round( (data.item.title).length / (((deviceWidth-10)-20)/(16*0.6)) )+1
                //console.log(numberLinesInText)
                
                //console.log(data)
      
                return (
                    <View 
                        style = {[{
                            height: listItemHeight,
                            width: deviceWidth,
                            marginVertical: appStyle.lists.proximity,
                        }]}
                    >
                        <SkiaViewDisign 
                            borderRadius = {appStyle.borderRadius.basic}
                            backgroundColor = {Theme.basics.neutrals.secondary}
                            shadowColors = {Theme.specials.shadow}
                            shadowMargin={{horizontal: appStyle.lists.fullWidth? 0 : 10, vertical: appStyle.lists.proximity}}
                            shadowStyle = {appStyle.effects.shadows}
                            adaptiveSizeForStyle={false}
                            innerShadow={{
                                used: true,
                                borderWidth: 2
                            }}
                        />
                        <View 
                            style = {[{
                                flex: 1,
                                paddingHorizontal: 10,
                                justifyContent: 'flex-end',
                                paddingVertical: 15,
                            }]}
                        >   
                        <Pressable 
                            style = {{flex: 1}}
                            android_ripple = {{color: ColorsApp.sky,borderless: true}}
                            unstable_pressDelay = {300}
                            onLongPress = {() => {}}
                            onPress = {() => {}}
                            //backgroundColor = 'red'
                        >   
                            <View margin = {10} marginBottom = {38} flex = {1}>
                                <Text numberOfLines = {numberLinesInText} style = {styles.TaskText}>{data.item.title}</Text> 
                            </View>
                        </Pressable>
                            <Text style = {[styles.TaskDate,{textDecorationLine: timeInFire == 'burnOut'?'line-through':'none',color: timeInFire == 'burn'?'red':ColorsApp.symbolNeutral}]}>{LanguageStore.ListItems.to}: {data.item.toDate} {data.item.toTime}</Text>
                        {timeInFire != 'none' &&
                            <View style = {{position: 'absolute', bottom: 10, left: 20}}>
                                <MaterialCommunityIcons 
                                    name = {timeInFire == 'burnOut'?"timer-off-outline":"timer-outline"} 
                                    size={30} 
                                    color={timeInFire == 'soon'?'grey':"black"} 
                                />
                                <View style = {{position: 'absolute', bottom: 10, left: -7}}>
                                    {(timeInFire != 'soon' && timeInFire != 'soonBurn')  &&
                                    <MaterialCommunityIcons name="fire" size={25} color = {timeInFire == 'burn'?'red':'grey'}/>
                                    }
                                </View>
                            </View>
                        }
                        </View>
                    </View>
                )
                          
            }}

            
            renderHiddenItem = {(data, rowMap) => {
                return (
                    <View 
                        style = {[{
                            //marginVertical: 15,
                            top: appStyle.lists.proximity+1,
                            marginVertical: appStyle.lists.proximity,
                            //marginHorizontal: 10,
                            borderRadius: appStyle.borderRadius.basic,
                            height: listItemHeight-2*(1+appStyle.lists.proximity),
                            left: appStyle.lists.fullWidth? 0 : 11,
                            width: deviceWidth-(appStyle.lists.fullWidth? 0 : 22),
                            marginVertical: appStyle.lists.proximity,
                            backgroundColor: Theme.basics.accents.quaternary
                        }]}
                    />
                )
            }}

            onRowOpen = {(rowKey, rowMap, toValue) => {
                const rowSate = {
                    key: rowKey, 
                    ref: rowMap[rowKey], 
                    toValue: toValue
                }
                console.log(rowKey)
                setSwipedRow(rowSate);
                setItemModalVisible(true)
            }}

            onRowClose = {() => {
                setSwipedRow(nullRow);
            }}

            previewRowKey = {"1"}
            previewOpenDelay = {800}
            {...appStyle.navigationMenu.drawerPosition == 'left'? {
                rightOpenValue: -70,
                stopRightSwipe: -70,  
                previewOpenValue: -70,
                disableRightSwipe: true
            } : {
                disableLeftSwipe: true,
                leftOpenValue: 70,
                stopLeftSwipe: 70,
                previewOpenValue: 70,
            }}            
        />
        <ModalItems
            itemModalVisible = {itemModalVisible}
            setItemModalVisible = {setItemModalVisible}
            swipedRow = {swipedRow}
            setSwipedRow = {setSwipedRow}
            tasks = {tasks}
            handleTriggerEdit = {handleTriggerEdit}
            handleDeleteTask = {handleDeleteTask}

            appStyle={appStyle}
            appConfig={appConfig}
            ThemeColorsAppIndex={ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
            LanguageAppIndex = {LanguageAppIndex}
        />
        </>

    );
}

//====================================================================================================================================


const ModalItems = ({
    itemModalVisible, 
    setItemModalVisible,
    swipedRow,
    setSwipedRow,
    tasks,
    handleTriggerEdit,
    handleDeleteTask,

    appStyle,
    appConfig,
    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex,
    }) => {

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].TasksScreen
    

    const nullRow = {key: null, ref: null, toValue: null}

    const handleCloseModal = () => {
        swipedRow.ref.closeRow()
        setItemModalVisible(false);
        setSwipedRow(nullRow);
    }


    const taskIndexInList =  tasks.findIndex((task) => task.key === swipedRow.key);

    const horizontalProximity = 10

    return (
        <> 
            <BaseWindow
                visible = {itemModalVisible}
                dimOut = {appStyle.modals.highlightMethods.dimOutDark? `${Theme.specials.dimout}25`: false} 
                gradient = {appStyle.modals.highlightMethods.gradient? Theme.basics.accents.quaternary : false}
                blur={appStyle.effects.blur}
                outPress = {handleCloseModal}
                //onShow = {onShow}
                modalStyle = {{
                    width: deviceWidth - (appStyle.modals.fullWidth? 0 : 2*horizontalProximity),
                    left: appStyle.modals.fullWidth? 0 : horizontalProximity,
                }}
                style={{
                    backgroundColor: Theme.basics.neutrals.quaternary,
                    borderTopLeftRadius: appStyle.borderRadius.additional,
                    borderTopRightRadius: appStyle.borderRadius.additional,
                    borderWidth: appStyle.modals.highlightMethods.outline? 1 : 0,
                    borderColor: Theme.basics.accents.tertiary,
                    flex: 1,
                }}
            > 
                <View style = {[styles.ModalView,{height: 180}]}>
                <View >
                    <TouchableOpacity style = {styles.HiddenButton}>
                        <MaterialCommunityIcons name="check" size={25} color = {ColorsApp.symbolLight}  />
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.HiddenButton} 
                        onPress = {() => {
                            handleTriggerEdit(tasks[taskIndexInList])
                            handleCloseModal()
                            }}
                        >
                        <MaterialCommunityIcons name="pencil" size={25} color = {ColorsApp.symbolLight} />
                    </TouchableOpacity>     
                    <TouchableOpacity style = {styles.HiddenButton} 
                        onPress = {() => {
                            handleDeleteTask(tasks[taskIndexInList].key);
                            handleCloseModal()
                            }}
                        >
                        <MaterialCommunityIcons name="delete" size={25} color = {ColorsApp.symbolLight} />
                    </TouchableOpacity>
                                
                </View>
                </View>  
            </BaseWindow>
        </>
    );
}

import DateTimePicker from "../../../componets/picker/DateTimePicker";

const ModalInput = ({
    InputModalVisible, 
    setInputModalVisible, 
    taskInputValue, 
    setTaskInputValue, 
    handleAddTask,
    taskToBeEditer,
    setTaskToBeEditer,
    handleEditTask,
    tasks,
    keyboardVisible,

    appStyle,
    appConfig,
    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex,
    }) => {

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const LanguageStore = languagesAppList[LanguageAppIndex]
        
    const [timePickerModalVisible, setTimePickerModalVisible] = useState(false);
    const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);

    const [timerPickerModalVisible, setTimerPickerModalVisible] = useState(false);

    const [toTimeValue, setToTimeValue] = useState(null);
    const [toDateValue, setToDateValue] = useState(null);
    const [inFireValue, setInFireValue] = useState(null);

    const setToValues = (values, type) => {
        if(type == 'time'){
            setToTimeValue(values);
            //setToValues(`${pikValueHour} ${pikValueMinute}`,typePicker)
        } 
        if(type == 'date') {
            setToDateValue(values);
            //setToValues(`${pikValueDay} ${pikValueMonth} ${pikValueYear}`,typePicker)
        }
        if(type == 'timer') {
            setInFireValue(values);
            //setToValues(`${pikValueTimer}`,typePicker)
        }
        //console.log(toTimeValue)
        //console.log(toDateValue)
    }

    const handleCloseModal = () => {
        setInputModalVisible(false);
        setTaskInputValue("");
        setTaskToBeEditer(null);

        setToTimeValue(null);
        setToDateValue(null);
        setInFireValue(null);
    }


    const handleSubmit = () => {
        if (!taskToBeEditer) {
            
            //console.log(tasks)
            let date = new Date()

            let thisDay = date.getDate();
            let thisMonth = 1+date.getMonth();
            let thisYear = date.getFullYear();

            let dateNewTask = date.toString().substring(8,23)
            dateNewTask = dateNewTask.substring(0,3)+(date.getMonth()+1)+dateNewTask.substring(2,)

            let keyNewTask = ((tasks[tasks.length-1] && parseInt(tasks[tasks.length-1].key)+1) || 1)
            //let keyNewTask = (tasks != []?(parseInt(tasks[tasks.length-1].key)+1): 1)
            //console.log(keyNewTask)
            //keyNewTask = keyNewTask == 0?1: keyNewTask 
            //console.log('task key',keyNewTask)
            let toTime;
            let toDate;
            let fireTarget;

            if (taskInputValue == '') {taskInputValue = '*'+keyNewTask}

            if (toTimeValue != null ) {
                toTime = toTimeValue
            } else {
                toTime = '23:59'
            }

            if (toDateValue != null) {
                toDate = toDateValue
            } else {
                toDate = `${thisDay>9?thisDay:'0'+thisDay} `+`${thisMonth>9?thisMonth:'0'+thisMonth} `+`${thisYear}`
            }
    
    
            if (inFireValue != null) {
                fireTarget = inFireValue
            } else {
                fireTarget = '1'
            }

            

            handleAddTask({
                title: taskInputValue,
                toTime: toTime,
                toDate: toDate,
                fireTarget: fireTarget,
                date: dateNewTask,
                key: `${keyNewTask}`
                //key: `${(tasks[tasks.length-1] && parseInt(tasks[tasks.length-1].key) ) }`
            });

        } else {
            handleEditTask({
                title: taskInputValue,
                toTime: taskToBeEditer.toTime,
                toDate: taskToBeEditer.toDate,
                fireTarget: taskToBeEditer.fireTarget,
                date: taskToBeEditer.date,
                key: taskToBeEditer.key
            })
        }
        setTaskInputValue("");
        setToTimeValue(null);
        setToDateValue(null);
        setInFireValue(null);
    }

    const horizontalProximity = 10

    return (
        <> 

            <BaseWindow
                visible = {InputModalVisible}
                dimOut = {appStyle.modals.highlightMethods.dimOutDark? `${Theme.specials.dimout}25`: false} 
                gradient = {appStyle.modals.highlightMethods.gradient? Theme.basics.accents.quaternary : false}
                blur={appStyle.effects.blur}
                outPress = {handleCloseModal}
                //onShow = {onShow}
                modalStyle = {{
                    width: deviceWidth - (appStyle.modals.fullWidth? 0 : 2*horizontalProximity),
                    left: appStyle.modals.fullWidth? 0 : horizontalProximity,
                }}
                style={{
                    backgroundColor: Theme.basics.neutrals.quaternary,
                    borderTopLeftRadius: appStyle.borderRadius.additional,
                    borderTopRightRadius: appStyle.borderRadius.additional,
                    borderWidth: appStyle.modals.highlightMethods.outline? 1 : 0,
                    borderColor: Theme.basics.accents.tertiary,
                    flex: 1,
                }}
            >
                <View style = {[styles.ModalView,{height: '50%'}]}> 
                    <View style = {styles.ModalIcon}>
                        <Text style = {styles.HeaderTitle}>{LanguageStore.ModalInput.title}</Text> 
                    </View>

                    <View style = {styles.ModalText}>
                    <Text style = {{fontSize: 16}}>{LanguageStore.ModalInput.text}:</Text>
                    

                    <TextInput style = {styles.StyledInput}
                        placeholder = {LanguageStore.ModalInput.placeholderInputArea}
                        placeholderTextColor = {Theme.texts.neutrals.tertiary}//{Colors.alternative}
                        selectionColor = {Theme.texts.neutrals.secondary}//'black'//{Colors.secondary}
                        autoFocus = {false}
                        onChangeText = {(text) => setTaskInputValue(text)}
                        value = {String(taskInputValue)}
                        //onSubmitEditing = {handleSubmit}
                    />
                    </View>

                    <View style = {styles.ModalText}>
                    <Text style = {{fontSize: 16}}>{LanguageStore.ModalInput.to}:</Text>
                    

                    <View
                        style = {{
                            //marginTop: 10,
                            width: 300,
                            height: 50,
                            backgroundColor: Theme.basics.accents.quaternary,//Colors.tertiary,
                            padding: 10,
                            borderRadius: 12,
                        }}
                    >
                        <Pressable
                            onPress = {()=>{
                                setTimePickerModalVisible(true)
                            }}
                        >
                            <Text 
                                style = {toTimeValue == null?{fontSize: 16,letterSpacing: 1,color: Theme.texts.neutrals.tertiary}:{fontSize: 16,letterSpacing: 1,color: Theme.texts.neutrals.secondary}}
                            >
                                {toTimeValue == null?LanguageStore.ModalInput.placeholderTimeArea:toTimeValue}
                            </Text>
                        </Pressable>
                    </View>
                    <View
                        style = {{
                            marginTop: 5,
                            width: 300,
                            height: 50,
                            backgroundColor: Theme.basics.accents.quaternary,//Colors.tertiary,
                            padding: 10,
                            borderRadius: 12,
                        }}
                    >
                        <Pressable
                            onPress = {()=>{
                                setDatePickerModalVisible(true)
                            }}
                        >
                            <Text 
                                style = {toDateValue == null?{fontSize: 16,letterSpacing: 1,color: Theme.texts.neutrals.tertiary}:{fontSize: 16,letterSpacing: 1,color: Theme.texts.neutrals.secondary}}
                            >
                                {toDateValue == null?LanguageStore.ModalInput.placeholderDateArea:toDateValue}
                            </Text>
                        </Pressable>
                    </View>
                    </View>

                    <View style = {styles.ModalText}>
                    <Text style = {{fontSize: 16}}>{LanguageStore.ModalInput.deadlineTarget}:</Text>
                    

                    <View
                        style = {{
                            //marginTop: 10,
                            width: 300,
                            height: 50,
                            backgroundColor: Theme.basics.accents.quaternary,//Colors.tertiary,
                            padding: 10,
                            borderRadius: 12,
                        }}
                    >
                        <Pressable
                            onPress = {()=>{
                                setTimerPickerModalVisible(true)
                            }}
                        >
                            <Text 
                                style = {inFireValue == null?{fontSize: 16,letterSpacing: 1,color: Theme.texts.neutrals.tertiary}:{fontSize: 16,letterSpacing: 1,color: Theme.texts.neutrals.secondary}}
                            >
                                {inFireValue == null?LanguageStore.ModalInput.placeholderDeadlineTargetArea:inFireValue}
                            </Text>
                        </Pressable>
                    </View>
                    </View>
                    <Pressable 
                        style = {styles.ModalAction} 
                        onPress = {handleSubmit}
                    >
                        <MaterialCommunityIcons name = "check" size = {28} color = {Theme.icons.neutrals.secondary}/>
                    </Pressable>
                </View>
            </BaseWindow>

            <DateTimePicker
                dateTimePickerModalVisible = {timePickerModalVisible} 
                setDateTimePickerModalVisible = {setTimePickerModalVisible}
                typePicker = {'time'}
                setToValues = {setToValues}
                LanguageStore = {LanguageStore}
            />

            <DateTimePicker 
                dateTimePickerModalVisible = {datePickerModalVisible} 
                setDateTimePickerModalVisible = {setDatePickerModalVisible}
                typePicker = {'date'}
                setToValues = {setToValues}
                LanguageStore = {LanguageStore}      
            />

            <DateTimePicker 
                dateTimePickerModalVisible = {timerPickerModalVisible} 
                setDateTimePickerModalVisible = {setTimerPickerModalVisible}
                typePicker = {'timer'}
                setToValues = {setInFireValue}
                LanguageStore = {LanguageStore}      
            />
        </>
    );
}



const styles = StyleSheet.create({
    BaseListView: {
        //flex: 1,
        minHeight: 100,
        margin: 5, 
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        //backgroundColor: 'red',
        //backgroundColor: ColorsApp.ground,
        borderRadius: 12,
        elevation: 0,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    ListView: {
        flex: 1,
        backgroundColor: 'white',
        minHeight: 100, 
        //padding: 10,
        //padding: 10,
        //marginRight: 15,
        justifyContent: 'space-around',
        borderBottomLeftRadius: 12,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        borderBottomRightRadius: 12,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,   
    },
    ListViewHidden: {
        margin: 7,
        //marginLeft: 70,
        flex: 1,
        backgroundColor: 'red',//ColorsApp.sky,
        minHeight: 85, 
        justifyContent: 'space-around', 
        alignItems: 'flex-end',
        borderRadius: 12,
        elevation: 4,
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,  
    },
    HiddenButton: {
        width: 55,
        marginRight: 5,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    TaskText: {
        fontSize: 16, 
        letterSpacing: 1, 
        //color:  ColorsApp.symbolDark
    },
    TaskDate: {
        fontSize: 10,
        //marginTop: 18, 
        letterSpacing: 1, 
        //color: ColorsApp.symbolNeutral,
        textAlign: 'right',
        textTransform: 'uppercase',
        position: 'absolute', bottom: 13, right: 25
    },
    
    ModalContainer: {
        padding: 4,
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        flex: 1,
        //backgroundColor: 'rgba(0, 0, 0, 0.4235)',
    },
    ModalView: {
        //backgroundColor: 'red',//Theme.skyUp,//Colors.primaryUp,
        //width: '98%',
        height: '50%',
        borderRadius: 12,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        padding: 10,
        alignItems: 'center',
        marginBottom: 3,
        //flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    ModalAction: {
        height: 50,
        borderRadius: 12,
        
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
        alignSelf: 'center',
    },
    HiddenButton: {
        width: 55,
        marginRight: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ModalActionGroup: {
        width: '98%',
        borderRadius: 12,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        backgroundColor: 'blue',//Theme.skyUp,
        flexDirection: 'row',
        justifyContent: 'space-around', 
        //marginBottom: keyboardVisible?10:'58%'
    },
    StyledInput: {
        width: 300,
        height: 50,
        backgroundColor: "green",//ColorsApp.skyUpUp,//Colors.tertiary,
        padding: 10,
        fontSize: 16, 
        borderRadius: 12,
        color: "green",//ColorsApp.symbolDark,//'black',//Colors.secondary,
        letterSpacing: 1,
    },
    ModalIcon: {
        alignItems: 'center', 
        marginBottom: 10,
    },
    ModalText: {
        marginTop: 10,
        alignItems: 'flex-start',
    },
    HeaderTitle: {
        fontSize: 30, 
        fontWeight: 'bold',
        color: "green",//ColorsApp.symbolDark,//Colors.tertiary, 
        letterSpacing: 2, 
        fontStyle: 'italic'
    },
});