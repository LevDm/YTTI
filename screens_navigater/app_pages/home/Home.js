import React, { useState, useEffect, useRef } from "react";
import { 
    Keyboard, 
    Appearance,
    Dimensions,
    StyleSheet,
    View,
    ScrollView,
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
            setBottomBord(
                jstore.appStyle.functionButton.size 
                + 12.5 
                + jstore.appStyle.navigationMenu.height
                + ((jstore.appStyle.navigationMenu.type == 'hidden' && jstore.appStyle.navigationMenu.position.horizontal == 'center')? 
                    20 + interpolate(jstore.appStyle.navigationMenu.position.vertical, [-150, 150] , [0, 30])
                    : 0
                )
            )
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
        setModal({
            task: undefined,
            modalType: 'add'
        })
    }

    const buildDate = (item) => {
        const time = item.toTime.split(':')
        const date = item.toDate.split('.')
        return new Date(date[2], date[1], date[0], time[1], time[0])
    }

    const taskSort = (a, b) => {
        const a_c = buildDate(a).getTime()
        const b_c = buildDate(b).getTime()

        if ( a_c < b_c){
            return -1;
        }
        if ( a_c > b_c ){
            return 1;
        }
        return 0;
    }
   
    
    const handleClearTasks = () => {
        //clear all
        AsyncStorage.setItem("storedTasks", JSON.stringify([])).then(() => {
            setTasks([]);
        }).catch((error) => console.log(error));
    }


    const handleAddTask = (task) => { 
        const newTasks = [...tasks, task].sort(taskSort);

        AsyncStorage.setItem("storedTasks", JSON.stringify(newTasks)).then(() => {
            setTasks(newTasks);
            resetModal();
        }).catch((error) => console.log(error));
    }

    const inputTask = (data) => {
        if (!modal.task) {
            const {
                title,
                toTime,
                toDate,
                fireTarget,
            } = data

            const date = getDateInfo()
            const keyNewTask = ((tasks[tasks.length-1] && parseInt(tasks[tasks.length-1].key)+1) || 1)

            let newToTime;
            let newToDate;
            let newFireTarget;
            let newTitle = title? title : ''

            if (newTitle == '') {newTitle = '*'+keyNewTask}

            if (toTime) {
                newToTime = toTime
            } else {
                newToTime = '23:59'
            }

            if (toDate) {
                newToDate = toDate
            } else {
                newToDate = date.formatDate
            }
    
    
            if (fireTarget) {
                newFireTarget = fireTarget
            } else {
                newFireTarget = '1'
            }

            const t = newToTime.split(':')
            const d = newToDate.split('.')

            const to = new Date(date.source)
            //to.setHours(])
            to.setUTCHours(t[0], t[1], 59, 999)
            to.setUTCDate(d[0])
            //to.setMinutes()
            //to.setDate(d[0])
            to.setMonth(d[1]-1)
            to.setFullYear(d[2])

            const newTask = {
                title: newTitle,
                toTime: newToTime,
                toDate: newToDate,
                fireTarget: newFireTarget,
                date: to,
                dateString: to.toDateString(),
                key: `${keyNewTask}`
                //key: `${(tasks[tasks.length-1] && parseInt(tasks[tasks.length-1].key) ) }`
            }
            console.log('BUILD_NEW_TASK', newTask)
            handleAddTask(newTask);

        } else {
            const {
                title,
                toTime,
                toDate,
                fireTarget,
            } = data

            const newData = {
                title: title? title : modal.task.title,
                toTime: toTime? toTime : modal.task.toTime,
                toDate: toDate? toDate : modal.task.toDate,
                fireTarget: fireTarget? fireTarget : modal.task.fireTarget,
                date: modal.task.date,
                key: modal.task.key
            }

            handleEditTask(newData)
        }
    }

    const handleDeleteTask = (rowKey, some = false) => {
        console.log('DELETED_TASKS', rowKey)
        const newTasks = [...tasks];
        for(const row of (some? rowKey : [rowKey])){
            console.log(row)
            newTasks.splice(tasks.findIndex((task) => task.key === row), 1);
        }

        AsyncStorage.setItem("storedTasks", JSON.stringify(newTasks)).then(() => {
            setTasks(newTasks);
            resetModal();
        }).catch((error) => console.log(error));
    }

    const handleTriggerEdit = (item) => {
        setModal({
            task: item,
            modalType: 'edit'
        })
    }

    const handleEditTask = (editerTask) => {
        const newTasks = [...tasks];
        const taskIndex = tasks.findIndex((task) => task.key === editerTask.key);
        newTasks.splice(taskIndex, 1, editerTask);

        AsyncStorage.setItem("storedTasks", JSON.stringify(newTasks)).then(() => {
            setTasks(newTasks);
            resetModal();
        }).catch((error) => console.log(error));
    }

    const menuPress = () => { 
        Vibration.vibrate([5,8])
        if(appStyle.navigationMenu.type == 'not' || (appConfig.weather.type == 'panel' && appConfig.weather.locationInfo.length>0)){
            props.navigation.openDrawer()
        } else {
            props.navigation.navigate('settingsStack')
        }

    }

    const [ modal, setModal ] = useState({
        modalType: undefined,
        task: undefined
    })

    const resetModal = () => {
        setModal({
            modalType: undefined,
            task: undefined
        })
        
    }

    const getDateInfo = () => {
        const date = new Date()

        const hours = date.getHours()
        const minutes = date.getMinutes()

        const month = 1+date.getMonth();
        const day = date.getDate();
        const year = date.getFullYear();

        const currentDate = {

            minutes: minutes,
            hours:  hours,
            numberWeekDay: date.getDay(),
            day: day,
            month: `${month>9?month:'0'+month}`,
            year: year,
            
            string: date.toString(),
            source: date,

            formatTime: `${hours>9?hours:'0'+hours}:${minutes>9?minutes:'0'+minutes}`,
            formatDate: `${day>9?day:'0'+day}.${month>9?month:'0'+month}.${year}`
        }
        //console.log(currentDate, date)
        return currentDate
    }

    return (
        <>
            <ListItems
                tasks = {tasks}

                handleDeleteTask = {handleDeleteTask}
                clearAllTasks = { handleClearTasks}

                setModal={setModal}

                getDateInfo={getDateInfo}

                reaValueBobberButtonVisible = {animValueBobberButtonVisible}

                menuPress = {menuPress}

                appStyle={appStyle}
                appConfig={appConfig}
                ThemeColorsAppIndex={ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
                LanguageAppIndex = {LanguageAppIndex}
            />

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
                visible = {modal.modalType == 'add' || modal.modalType == 'edit'} 
                task = {modal.task}
                outModalPress = {resetModal}

                getDateInfo={getDateInfo}
                inputTask={inputTask}

                appStyle={appStyle}
                appConfig={appConfig}
                ThemeColorsAppIndex={ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
                LanguageAppIndex = {LanguageAppIndex}
            />

            <ModalItems
                visible = {modal.modalType == 'view'}
                task = {modal.task}
                outModalPress = {resetModal}

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
const headerPanel = 55
const headerParams = 30
const headerFullHeight = statusBarHeight+headerPanel+headerParams

const listItemHeight = 110

import WeatherComponent from "../../../weather/WeatherComponent";

const Reanimated_SwipeList = Reanimated.createAnimatedComponent(SwipeListView)
const Reanimated_FlatList = Reanimated.createAnimatedComponent(FlatList)
const ListItems = (props) => {
    const {

    tasks, 

    handleDeleteTask,
    clearAllTasks,

    setModal, 

    getDateInfo,

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

    const [ changesTask, setChangesTask ] = useState([])

    const categorys = ['today', 'all']
    const [category, setCategory] = useState(0)

    const changeCategory = (item, index) => {
        console.log('set',item, indicatorLine.value)
        setCategory(index)
    }

    const taskLongPress = (key) =>{
        Vibration.vibrate([5,8])
        setChangesTask([key, ...changesTask])
    }

    const taskPress = (task) =>{
        const {
            key
        } = task
        if(changesTask.length > 0){
            let newChangesTask// = changesTask.includes(key)? changesTask.filter(item=>item != key) : [key, ...changesTask]
            if(changesTask.includes(key)){
                Vibration.vibrate([5,3, 30, 3])
                newChangesTask = changesTask.filter(item=>item != key)                           
            } else {
                Vibration.vibrate([5,8])
                newChangesTask = [key, ...changesTask]
            }
            setChangesTask(newChangesTask)
        } else {
            //setSwipedRow(key);
            setModal({
                modalType: 'view',
                task: task
            })
            //setItemModalVisible(true)
        }
    }

    const changesCheck = () => {

    }

    const changesDelete = () => {
        handleDeleteTask(changesTask, true)
        setChangesTask([])
    }



    const headerShort = useSharedValue(headerFullHeight)

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

            
            if(reaValueBobberButtonVisible.value != (visibleBobber? 0 : 1)){
                cancelAnimation(reaValueBobberButtonVisible);
                reaValueBobberButtonVisible.value = visibleBobber? 0 : 1
            }
            

            const shortHeight = headerFullHeight-headerPanel

            
            const newShortHeight = isStart? headerFullHeight : Math.min( Math.max((headerShort.value-(6*velocity.y)), shortHeight) , headerFullHeight)

            if(headerShort.value != newShortHeight){
                cancelAnimation(headerShort)
                headerShort.value = newShortHeight
            }

        }
    })

    const dynamicHeader = useAnimatedStyle(()=>{
        const duration = 300
        return {
            transform: [
                {translateY: interpolate(
                    headerShort.value, 
                    [headerFullHeight-headerPanel, headerFullHeight],
                    [-headerPanel, 0],
                    //extrapolation
                    {
                        extrapolateLeft: Extrapolation.CLAMP,
                        extrapolateRight: Extrapolation.CLAMP
                    })
                }
            ],
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

    
    const indicatorLine = useSharedValue({widths: [], left: []})
    const animStyleIndicatorLine = useAnimatedStyle(() => {
        const duration = 350; 
        return {
            width: withTiming(indicatorLine.value.widths.length>0? indicatorLine.value.widths[category] : 0, {duration: duration-20}),
            left: withTiming(indicatorLine.value.left.length>0? ((0.5*(deviceWidth-100)*category) + indicatorLine.value.left[category]) : 0, {duration: duration, easing: Easing.bezier(0.45, 0, 0.55, 1)}),
        }
    }, [indicatorLine, category])

    

    const currentDate = getDateInfo();

    const tingDuration = 300
    const entering = (targetValues) => {
        'worklet';
        const animations = {
          opacity: withTiming(1, { duration: tingDuration }),
          transform: [
            {scale: withTiming(1, { duration: tingDuration })}
          ]
        };
        const initialValues = {
          opacity: 0,
          transform: [
            {scale: .97}
          ]
        };
        return {
          initialValues,
          animations,
        };
    }

    const [ listFormatRow, setListFormatRow ] = useState(true)


    const renderTasks = ({index, item }) => {
        const {
            key,
            date,
            fireTarget,
            title,
            toDate,
            toTime,
        } = item
        
        const taskDate = new Date(date)
        console.log(key, toDate, currentDate.formatDate)
       
        //const TODAY = taskDate.getDate() == (currentDate.day-1) && taskDate.getMonth() == parseInt(currentDate.month)-1 && taskDate.getFullYear() == currentDate.year
        const TODAY = toDate == currentDate.formatDate
        //TODAY 
        if( category == 0 && !TODAY){ return null}
        
        let timeInFire = 'none';

        let burnProgress = 0

        let across = (taskDate - currentDate.source)/3600000

        //console.log((taskDate.getTime() - currentDate.source.getTime())/3600000,across)

        if(across >= 0 && across <= 24){ // 
            timeInFire = 'soon';
            
        } 
        if(across >= 0 && across <= parseInt(fireTarget)){
            timeInFire = 'burn';
            const procent = (fireTarget-across)/fireTarget
            burnProgress =  Math.min(Math.max(procent, 0), 1)
        }
        if(across < 0){ 
            timeInFire = 'burnOut';
        }

        //console.log(across, fireTarget, burnProgress,(fireTarget-across)/fireTarget)

        return (
            <View 
                style = {[{
                    height: listItemHeight * (listFormatRow? 1 : 2),
                    width:  deviceWidth  * (listFormatRow? 1 : 0.5),
                    marginVertical: listFormatRow? appStyle.lists.proximity : appStyle.lists.fullWidth? 0.5 : 5,
                    backgroundColor: '#00000001'
                }]}
            >
                <SkiaViewDisign 
                    borderRadius = {appStyle.borderRadius.basic}
                    backgroundColor = {Theme.basics.neutrals.secondary}
                    shadowColors = {Theme.specials.shadow}
                    shadowMargin={{
                        horizontal: appStyle.lists.fullWidth? 1 : 10, 
                        vertical: listFormatRow? appStyle.lists.proximity : appStyle.lists.fullWidth? 0.5 : 5,
                    }}
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
                        marginHorizontal: appStyle.lists.fullWidth? 0 : 10,
                        marginVertical:  listFormatRow? appStyle.lists.proximity : appStyle.lists.fullWidth? 0.5 : 5,
                        borderRadius: appStyle.borderRadius.basic,
                        backgroundColor: '#00000001'
                    }]}
                >
                <Pressable 
                    style = {{
                        flex: 1,
                        paddingHorizontal: 10,
                        paddingTop: 5,
                        paddingBottom: appStyle.borderRadius.basic * (15/35),
                    }}
                    android_ripple={appStyle.effects.ripple == 'all'? ripple(Theme.basics.accents.quaternary) : false}
                    unstable_pressDelay = {300}
                    onLongPress = {() => {taskLongPress(key)}}
                    onPress = {() => {taskPress(item)}}
                    //backgroundColor = 'red'
                >   
                    <View
                        style = {{
                            flexDirection: 'row',
                            //backgroundColor: 'red',
                            justifyContent: 'flex-end',
                            alignItems: 'center'
                        }}
                    >
                        <MaterialCommunityIcons 
                            style={{
                                height: 16,
                                width: 16,
                                position: 'absolute',
                                left: 0,
                                borderRadius: appStyle.borderRadius.additional,
                                padding: 2,
                                backgroundColor: changesTask.includes(key)? Theme.icons.accents.primary : 'transparent'
                            }}
                            name = {'check'} 
                            size={12} 
                            color={changesTask.includes(key)? Theme.basics.neutrals.secondary : 'transparent'} 
                        />
                        <Text 
                            style = {[styles.TaskDate,{
                                textDecorationLine: timeInFire == 'burnOut'?'line-through':'none',
                                color: Theme.texts.neutrals.tertiary
                            }]}
                        >
                            {Language.listItems.to}: {toTime}  {toDate} 
                        </Text>
                        {timeInFire != 'none' &&
                        <View style = {{marginLeft: 10}}>

                            <MaterialCommunityIcons 
                                name = {timeInFire == 'burnOut'?"timer-off-outline":"timer-outline"} 
                                size={20} 
                                color={Theme.icons.neutrals.tertiary} 
                            />
                            
                            <MaskedView
                                androidRenderingMode = {'software'}
                                style={{
                                    width: 16, 
                                    height: 16,
                                    position: 'absolute', 
                                    bottom: 6, 
                                    left: -5,
                                    justifyContent: 'flex-end', 
                                    backgroundColor: (timeInFire == 'burn')? Theme.specials.fire.secondary : 'transparent'
                                }}
                                maskElement={<MaterialCommunityIcons //timeInFire == 'burn'?Theme.specials.fire.primary:Theme.specials.fire.secondary
                                    name="fire" 
                                    size={16} 
                                    color = {'black'}
                                />}
                            >
                            {/* COLOR*/}
                            <View 
                                style={[{
                                    width: 16,
                                    height: 16*burnProgress,
                                    backgroundColor: Theme.specials.fire.primary
                                }]}
                            />  
                            </MaskedView>
                        </View>}                 
                    </View> 
                    <View flex = {1}>
                        <Text 
                            numberOfLines = {(listFormatRow? 2 : 8)} 
                            style = {[styles.TaskText, {color: Theme.texts.neutrals.secondary}]}
                        >
                            {title}
                        </Text> 
                    </View>
                </Pressable> 
                </View>                                    
            </View>
        )
    }

    const [weatherModal, setWeatherModal] = useState(false)

    const primaryComponent = (
        <View 
            style = {[{
                height: listItemHeight,
                width: deviceWidth,
                marginVertical: appStyle.lists.proximity,
                backgroundColor: '#00000001'
            }]}
        >
            <SkiaViewDisign 
                borderRadius = {appStyle.borderRadius.basic}
                backgroundColor = {Theme.basics.accents.quaternary}
                shadowColors = {Theme.specials.shadow}
                shadowMargin={{horizontal: appStyle.lists.fullWidth? 0 : 10, vertical: appStyle.lists.proximity}}
                shadowStyle = {appStyle.effects.shadows}
                adaptiveSizeForStyle={false}
                innerShadow={{
                    used: true,
                    borderWidth: 2
                }}
            />
            <Pressable
                style = {[{
                    flex: 1,
                    marginHorizontal: appStyle.lists.fullWidth? 0 : 10,
                    marginVertical:  appStyle.lists.proximity,
                    borderRadius: appStyle.borderRadius.basic,
                    backgroundColor: '#00000001'
                }]}
                onPress = {()=>setWeatherModal(true)}
            >
                <WeatherComponent type = {'lists'} />
            </Pressable>
        </View>
    )

    const horizontalProximityModal = 10
 
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
                    height: headerFullHeight,
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
                        borderRadius: appStyle.borderRadius.additional,
                        marginHorizontal: 15
                    }, 
                    //appStyle.navigationMenu.drawerPosition == 'left'? {marginLeft: 15,} : {marginRight: 15}
                ]}
                onPress={menuPress}
                android_ripple={appStyle.effects.ripple == 'all'? ripple(appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary) : false}
            />
            <Text 
                style = {[{
                    flex: 1,
                    textAlign: 'left',
                    fontSize: 20,
                    fontWeight: '500',
                    letterSpacing: 0.5,
                    fontVariant: ['small-caps'],
                    color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary
                }, appStyle.navigationMenu.drawerPosition == 'left'? {marginRight: 60,} : {marginLeft: 60}]}
            >
                {Language.HeaderTitle}
            </Text>
            {(changesTask.length == 0 && (appConfig.weather.type == 'widget' && appConfig.weather.locationInfo.length>0)) &&
            //WEATHER
            <Reanimated.View
                entering={entering}
                style={{
                    height: 55,
                    width: 180,
                    //backgroundColor :'red'
                }} //
            >
                <Pressable
                    style={{flex: 1}}
                    onPress = {()=>setWeatherModal(true)}
                >
                    <WeatherComponent type = {'widget'} />
                </Pressable>        
            </Reanimated.View>}
            {changesTask.length > 0 &&
            <Reanimated.View
                entering={entering}
                style={{
                    flexDirection:  appStyle.navigationMenu.drawerPosition == 'left'? 'row' : 'row-reverse', 
                    //backgroundColor: 'red'
                }}
            >
                <View
                    style={{
                        width: 25,
                        height: 25,
                        backgroundColor: Theme.basics.accents.quaternary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: appStyle.borderRadius.additional
                    }}
                >
                    <Text
                        style={{
                            fontSize: 15,
                            color: Theme.texts.neutrals.primary
                        }}
                    >
                        {changesTask.length}
                    </Text>
                </View>
                <BasePressable
                    type="i"
                    style={{
                        width: 70
                    }}
                    icon = {{
                        name: 'check',
                        size: 22,
                        color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary
                    }}
                    android_ripple={appStyle.effects.ripple == 'all'? ripple(appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary) : false}
                    onPress = {changesCheck}
                />
                <BasePressable
                    type="i"
                    style={{
                        width: 70
                    }}
                    icon = {{
                        name: 'delete',
                        size: 22,
                        color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary
                    }}
                    android_ripple={appStyle.effects.ripple == 'all'? ripple(appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary) : false}
                    onPress = {changesDelete}
                    onLongPress = {clearAllTasks}
                />

            </Reanimated.View>}
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
                    //backgroundColor: 'red',
                    flexDirection: 'row'
                }}
            >
                {categorys.map((item, index)=>{
                    return (
                        <Pressable
                            key={item+index}
                            style={{
                                width: (deviceWidth-100)/2,
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
                <View
                    style={{
                        flex: 1,
                        width: 100,
                        //flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',//'space-around',
                        //backgroundColor: 'blue'
                    }}
                >
                    <BasePressable
                        type="i"
                        style={{
                            width: 90,
                            height: headerParams,
                            borderRadius: appStyle.borderRadius.additional
                        }}
                        icon = {{
                            name: listFormatRow? "view-sequential-outline" : "view-grid-outline",
                            size: 22,
                            color: appStyle.lists.invertColorsHeader? Theme.icons.neutrals.secondary : Theme.icons.neutrals.primary,
                        }}
                        android_ripple={appStyle.effects.ripple != 'off'? ripple(appStyle.lists.invertColorsHeader? Theme.icons.neutrals.secondary : Theme.icons.neutrals.primary) : false}
                        onPress = {()=>{setListFormatRow(!listFormatRow)}}                
                    />
                </View>
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

        <Reanimated_FlatList
            key={listFormatRow? 'row' : 'half_row'}
            data = {tasks}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
                paddingTop: headerFullHeight,
                paddingBottom: appStyle.functionButton.size+13+(appStyle.navigationMenu.type != 'not'? appStyle.navigationMenu.height : 0),
            }}
            onScroll = {onScrollList}
            showsVerticalScrollIndicator = {false} 
            numColumns={listFormatRow? 1 : 2}
            style = {{
                flex: 1, 
                paddingBottom: 10, 
                marginBottom: 0, 
            }}
            renderItem = {renderTasks}
            ListHeaderComponent= {(appConfig.weather.type == 'lists' && appConfig.weather.locationInfo.length>0)? primaryComponent : undefined}
        />

        <BaseWindow
            visible = {weatherModal}
            dimOut = {appStyle.modals.highlightMethods.dimOutDark? `${Theme.specials.dimout}25`: false} 
            gradient = {appStyle.modals.highlightMethods.gradient? Theme.basics.accents.quaternary : false}
            blur={appStyle.effects.blur}
            outPress = {()=>setWeatherModal(false)}
            //onShow = {onShow}
            modalStyle = {{
                width: deviceWidth - (appStyle.modals.fullWidth? 0 : 2*horizontalProximityModal),
                left: appStyle.modals.fullWidth? 0 : horizontalProximityModal,
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
            <View style = {[styles.ModalView,{height: 355}]}>
            <WeatherComponent />
            </View> 
        </BaseWindow>
        </>

    )
}

//====================================================================================================================================


const ModalItems = ({
    visible,
    task,
    outModalPress,

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
    
    const handleCloseModal = () => {

        outModalPress()
    }

    const checkTask = () => {

    }

    const deleteTask = () => {
        handleDeleteTask(task? task.key : undefined);
    }

    const editTask = () => {
        handleTriggerEdit(task)
    }

    const horizontalProximity = 10

    return (

        <BaseWindow
            visible = {visible}
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
            <View style = {[styles.ModalView,{height: 250}]}>
            <ScrollView
                style = {{
                    height: 200,
                    width: '96%',
                }}
            >
                <Text 
                    style = {[styles.TaskDate,{
                        color: Theme.texts.neutrals.tertiary,
                        width: '100%',
                        textAlign: 'right'
                    }]}
                >
                    {Language.listItems.to}: {task? task.toTime: '-'}  {task? task.toDate : '-'} 
                </Text>
                <Text
                    style={{
                        fontSize: 15,
                        color: Theme.texts.neutrals.secondary
                    }}
                    
                >
                    {task? task.title : ''}
                </Text>
            </ScrollView>
            <View 
                style ={{
                    flexDirection: 'row',
                    height: 50
                }}
            >
                <BasePressable
                    type="ti"
                    text={Language.taskAction['done']}
                    textStyle={{
                        fontSize: 12,
                        color: Theme.texts.neutrals.secondary
                    }}
                    style={{
                        width: '32%',
                        borderRadius: appStyle.borderRadius.additional
                    }}
                    direction={'row-reverse'}
                    icon = {{
                        name: 'check',
                        size: 22,
                        color:Theme.texts.neutrals.secondary 
                    }}
                    android_ripple={appStyle.effects.ripple != 'off'? ripple(Theme.texts.neutrals.secondary) : false}
                    onPress = {checkTask}
                    
                />
                <BasePressable
                    type="ti"
                    text={Language.taskAction['edit']}
                    textStyle={{
                        fontSize: 12,
                        color: Theme.texts.neutrals.secondary
                    }}
                    style={{
                        width: '32%',
                        borderRadius: appStyle.borderRadius.additional
                    }}
                    direction={'row-reverse'}
                    icon = {{
                        name: "pencil",
                        size: 22,
                        color:Theme.texts.neutrals.secondary 
                    }}
                    android_ripple={appStyle.effects.ripple != 'off'? ripple(Theme.texts.neutrals.secondary) : false}
                    onPress = {editTask}                
                />
                <BasePressable
                    type="ti"
                    text={Language.taskAction['delete']}
                    textStyle={{
                        fontSize: 12,
                        color: Theme.texts.neutrals.secondary
                    }}
                    style={{
                        width: '32%',
                        borderRadius: appStyle.borderRadius.additional
                    }}
                    direction={'row-reverse'}
                    icon = {{
                        name: 'delete',
                        size: 22,
                        color:Theme.texts.neutrals.secondary 
                    }}
                    android_ripple={appStyle.effects.ripple != 'off'? ripple(Theme.texts.neutrals.secondary) : false}
                    onPress = {deleteTask}
                />
            </View>
            </View>  
        </BaseWindow>
    )
}

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DatePicker, TimePicker, TimerPicker } from "../../../general_components/DateTimePicker.js/DateTimePicker";

const ModalInput = ({
    visible,
    task,

    outModalPress,

    getDateInfo,
    inputTask,

    appStyle,
    appConfig,
    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex,
    }) => {

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].TasksScreen
        
    const [picker, setPicker] = useState({type: undefined, value: undefined});

    const [ inputValue, setInputValue ] = useState('');
    const [toTimeValue, setToTimeValue] = useState(undefined);
    const [toDateValue, setToDateValue] = useState(undefined);
    const [inFireValue, setInFireValue] = useState(undefined);


    const resetValues=()=>{
        setInputValue('');
        setToTimeValue(undefined);
        setToDateValue(undefined);
        setInFireValue(undefined);
    }

    const handleCloseModal = () => {
        outModalPress()
        resetValues()
    }

    const callPicker = (type) => {
        setPicker({type: type, value: undefined})
    }

    const resetPicker = () => {
        setPicker({type: undefined, value: undefined})
    }

    const closePicker = () => {
        resetPicker()
    }

    const setPickerValue = (dataList) => {
        //setPicker({type: picker.type, value: dataList})
        picker.value = dataList
    }

    const accept = () => {
        if(picker.type == 'time' && picker.value){
            const time = `${picker.value[0].item}:${picker.value[1].item}`
            setToTimeValue(time);
        } 
        if(picker.type == 'date' && picker.value) {
            const date = `${picker.value[0].item}.${picker.value[1].item}.${picker.value[2].item}`
            setToDateValue(date);
        }
        if(picker.type == 'timer' && picker.value) {
            setInFireValue(picker.value.item);
        }
        closePicker()
    }

    const handleSubmit = () => {
        inputTask({
            title: inputValue,
            toTime: toTimeValue,
            toDate: toDateValue,
            fireTarget: inFireValue,
            //date: task.date,
            //key: task.key
        })
        resetValues()
    }

    const horizontalProximity = 10

    return (
        <> 
            <BaseWindow
                visible = {visible}
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
                <ScrollView 
                    style = {[{height: (deviceHeight*0.6)-50}]}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 10,
                        paddingTop: 10,
                        paddingBottom: 300,
                        alignItems :'center'
                    }}
                > 
                    <View
                        style = {{
                            width: 320,
                            minHeight: 250,
                        }}
                    >
                        <SkiaViewDisign 
                            borderRadius = {appStyle.borderRadius.additional}
                            backgroundColor = {Theme.basics.neutrals.secondary}
                            shadowColors = {Theme.specials.shadow}
                            shadowMargin={{horizontal: 10, vertical: 10}}
                            shadowStyle = {appStyle.effects.shadows}
                            adaptiveSizeForStyle={false}
                            innerShadow={{
                                used: true,
                                borderWidth: 2
                            }}
                        />
                        <TextInput 
                            style = {{
                                width: 300,
                                margin: 10,
                                minHeight: 230,
                                textAlignVertical: 'top',
                                //backgroundColor: Theme.basics.neutrals.secondary,
                                padding: 10,
                                fontSize: 16, 
                                borderRadius: appStyle.borderRadius.additional,
                                color: Theme.texts.neutrals.secondary,
                                letterSpacing: 1,
                            }}
                            multiline
                            placeholder = {Language.modalInput.placeholderInputArea}
                            placeholderTextColor = {Theme.texts.neutrals.tertiary}//{Colors.alternative}
                            selectionColor = {Theme.texts.neutrals.tertiary}//'black'//{Colors.secondary}
                            autoFocus = {false}
                            onChangeText = {(text) => setInputValue(text)}
                            value = {inputValue? inputValue : (task? task.title : '')}
                            //onSubmitEditing = {handleSubmit}
                        />
                    
                    </View>
                    
                    
                    <View style = {[styles.ModalText, {flexDirection: 'row', width: 320, alignItems: 'center', justifyContent: 'space-between'}]}>                     
                        <Text 
                            style = {{fontSize: 16, color: Theme.texts.neutrals.secondary}}
                        >
                            {Language.modalInput.to}:
                        </Text>
                        
                        <View
                            style={{
                                width: 140,
                                height: 60,
                            }}
                        >
                            <SkiaViewDisign 
                                borderRadius = {appStyle.borderRadius.additional}
                                backgroundColor = {Theme.basics.accents.quaternary}
                                shadowColors = {Theme.specials.shadow}
                                shadowMargin={{horizontal: 10, vertical: 10}}
                                shadowStyle = {appStyle.effects.shadows}
                                adaptiveSizeForStyle={false}
                                innerShadow={{
                                    used: true,
                                    borderWidth: 2
                                }}
                            />
                            <BasePressable
                                type="t"
                                text={ toTimeValue? toTimeValue : (task? task.toTime : '23:59') }
                                textStyle={{
                                    fontSize: 14,
                                    //textAlign: 'center',
                                    color: Theme.texts.neutrals.primary
                                }}
                                style={{
                                    margin: 10,
                                    width: 120,
                                    height: 40,
                                    //;backgroundColor: Theme.basics.accents.quaternary,
                                    borderRadius: appStyle.borderRadius.additional
                                }}
                                android_ripple={appStyle.effects.ripple != 'off'? ripple(Theme.texts.neutrals.primary) : false}
                                onPress = {()=>{
                                    callPicker('time')
                                }}
                            />
                        </View>

                        <View
                            style={{
                                width: 140,
                                height: 60,
                            }}
                        >
                            <SkiaViewDisign 
                                borderRadius = {appStyle.borderRadius.additional}
                                backgroundColor = {Theme.basics.accents.quaternary}
                                shadowColors = {Theme.specials.shadow}
                                shadowMargin={{horizontal: 10, vertical: 10}}
                                shadowStyle = {appStyle.effects.shadows}
                                adaptiveSizeForStyle={false}
                                innerShadow={{
                                    used: true,
                                    borderWidth: 2
                                }}
                            />
                            <BasePressable
                                type="t"
                                text={ toDateValue? toDateValue : (task? task.toDate : getDateInfo().formatDate) }
                                textStyle={{
                                    fontSize: 14,
                                    color: Theme.texts.neutrals.primary
                                }}
                                style={{
                                    width: 120,
                                    height: 40,
                                    margin: 10,
                                    //backgroundColor: Theme.basics.accents.quaternary,
                                    borderRadius: appStyle.borderRadius.additional
                                }}
                                android_ripple={appStyle.effects.ripple != 'off'? ripple(Theme.texts.neutrals.primary) : false}
                                onPress = {()=>{
                                    callPicker('date')
                                }}
                            />
                        </View>
                    </View>

                    <View style = {[styles.ModalText, {width: 320,}]}>
                        <Text 
                            style = {{fontSize: 16, color: Theme.texts.neutrals.secondary}}
                        >
                            {Language.modalInput.deadline.title}:
                        </Text>
                        <View
                            style={{
                                width: 320,
                                height: 60,
                            }}
                        >
                            <SkiaViewDisign 
                                borderRadius = {appStyle.borderRadius.additional}
                                backgroundColor = {Theme.basics.accents.quaternary}
                                shadowColors = {Theme.specials.shadow}
                                shadowMargin={{horizontal: 10, vertical: 10}}
                                shadowStyle = {appStyle.effects.shadows}
                                adaptiveSizeForStyle={false}
                                innerShadow={{
                                    used: true,
                                    borderWidth: 2
                                }}
                            />
                            <BasePressable
                                type="t"
                                text={ inFireValue? inFireValue : (task? task.fireTarget : Language.modalInput.deadline.placeholder)}
                                textStyle={{
                                    fontSize: 14,
                                    color: Theme.texts.neutrals.primary
                                }}
                                style={{
                                    margin: 10,
                                    width: 300,
                                    height: 40,
                                    borderRadius: appStyle.borderRadius.additional
                                }}
                                android_ripple={appStyle.effects.ripple != 'off'? ripple(Theme.texts.neutrals.primary) : false}
                                onPress = {()=>{
                                    callPicker('timer')
                                }}
                            />
                        </View>
                        

                    </View>
                </ScrollView>
                <BasePressable
                    type="ti"
                    text={Language.taskAction[task? 'edit' : 'add' ]}
                    textStyle={{
                        fontSize: 14,
                        color: Theme.texts.neutrals.secondary
                    }}
                    style={{
                        height: 50,
                        width: '100%',
                        borderRadius: appStyle.borderRadius.additional
                    }}
                    direction={'row-reverse'}
                    icon = {{
                        name: task? 'pencil': "playlist-plus",
                        size: 28,
                        color: Theme.texts.neutrals.secondary
                    }}
                    android_ripple={appStyle.effects.ripple != 'off'? ripple(Theme.texts.neutrals.secondary) : false}
                    onPress = {handleSubmit}
                />
            </BaseWindow>

            <BaseWindow
                visible = {picker.type != undefined}
                dimOut = {appStyle.modals.highlightMethods.dimOutDark? `${Theme.specials.dimout}25`: false} 
                gradient = {appStyle.modals.highlightMethods.gradient? Theme.basics.accents.quaternary : false}
                blur={appStyle.effects.blur}
                outPress = {closePicker}
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
                <GestureHandlerRootView 
                    style={{
                        height: 210,
                        width: deviceWidth - (appStyle.modals.fullWidth? 0 : 2*horizontalProximity),
                        alignItems: 'center'
                    }}
                >
                {picker.type == 'time' && 
                <TimePicker 
                    setValue = {setPickerValue}
                    colors={{
                        backgroundColor: Theme.basics.neutrals.quaternary,
                        textColor: Theme.texts.neutrals.secondary,
                        separatorColor: Theme.icons.neutrals.secondary,
                    }}
                />}
                {picker.type == 'date' && 
                <DatePicker 
                    setValue = {setPickerValue}
                    colors={{
                        backgroundColor: Theme.basics.neutrals.quaternary,
                        textColor: Theme.texts.neutrals.secondary,
                        separatorColor: Theme.icons.neutrals.secondary,
                    }}
                    LanguageAppIndex = {LanguageAppIndex}
                />}
                {picker.type == 'timer' &&  
                <TimerPicker 
                    setValue = {setPickerValue}
                    colors={{
                        backgroundColor: Theme.basics.neutrals.quaternary,
                        textColor: Theme.texts.neutrals.secondary,
                        separatorColor: Theme.texts.neutrals.secondary,
                    }}
                />}
                </GestureHandlerRootView>
                <BasePressable
                    type="ti"
                    text={Language.modalInput.accept}
                    textStyle={{
                        fontSize: 14,
                        color: Theme.texts.neutrals.secondary
                    }}
                    style={{
                        height: 50,
                        width: '100%',
                        borderRadius: appStyle.borderRadius.additional
                    }}
                    direction={'row-reverse'}
                    icon = {{
                        name: "check",
                        size: 28,
                        color: Theme.texts.neutrals.secondary
                    }}
                    android_ripple={appStyle.effects.ripple != 'off'? ripple(Theme.texts.neutrals.secondary) : false}
                    onPress = {accept}
                />
            </BaseWindow>
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
        //letterSpacing: 1, 
        //color: ColorsApp.symbolNeutral,
       // textAlign: 'right',
        textTransform: 'uppercase',
        //position: 'absolute', bottom: 13, right: 25
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
        minHeight: 250,
        textAlignVertical :'top',
        //height: 50,
        backgroundColor: "green",//ColorsApp.skyUpUp,//Colors.tertiary,
        padding: 10,
        fontSize: 16, 
        borderRadius: 12,
        color: "red",//ColorsApp.symbolDark,//'black',//Colors.secondary,
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