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
import AsyncStorage from '@react-native-async-storage/async-storage';

import {connect} from 'react-redux';
import mapStateToProps from "../../../app_redux_files/stateToProps";
import mapDispatchToProps from "../../../app_redux_files/dispatchToProps";
import store from "../../../app_redux_files/store";

import dataRedactor from "../../../app_async_data_manager/data_redactor";

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

import { listsHorizontalProximity } from "../../../app_values/AppDefault";


import WeatherComponent from "../../../weather/WeatherComponent";


const horizontalProximity = listsHorizontalProximity['true']
const EVENTS = [
  {
    key: '1',
    date: '****',
    title:'08:00 - Завтрак'
  }, 
  {
    key: '2',
    date: '****',
    title:'09:00 - Выезд на работу'
  },
  {
    key: '3',
    date: '****',
    title:'10:00 - Начало рабочего дня'
  },
  {
    key: '4',
    date: '****',
    title:'12:00 - Обеденный перерыв'
  },
  {
    key: '5',
    date: '****',
    title:'13:00 - Возвращение на работу'
  },
  {
    key: '6',
    date: '****',
    title:'17:00 - Конец рабочего дня'
  },
  {
    key: '7',
    date: '****',
    title:'18:00 - Тренировка в спортзале'
  },
  {
    key: '8',
    date: '****',
    title:'19:00 - Душ и смена одежды'
  },
  {
    key: '9',
    date: '****',
    title:'19:30 - Приготовления'
  },
  {
    key: '10',
    date: '****',
    title:'20:00 - Ужин с друзьями'
  },
  {
    key: '11',
    date: '****',
    title:'22:00 - Просмотр фильма дома'
  },
]

const Timetable = (props) => {


  const [tasks, setTasks] = useState(EVENTS);
    
  const [LanguageAppIndex, setLanguageAppIndex] = useState(languagesApp.indexOf(props.appConfig.languageApp));//ThemesColorsAppList[ThemeColorsAppIndex]
  const [ThemeColorsAppIndex, setThemeColorAppIndex] = useState(themesApp.indexOf(props.appStyle.palette.theme));//LanguagesAppList[LanguageAppIndex]

  const [appStyle, setAppStyle] = useState(props.appStyle);
  const [appConfig, setAppConfig] = useState(props.appConfig);
  const [hideMenu, setHideMenu] = useState(props.hideMenu);

  const [ThemeSchema, setThemeSchema] = useState(props.appStyle.palette.scheme == 'auto'? Appearance.getColorScheme() : props.appStyle.palette.scheme)


  const [allTests, setAllTests ] = useState(props.tests)

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

      if (allTests != jstore.tests){
        setAllTests(jstore.tests);
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

  const addTestActions = (action) => {
    const lastIndex = Math.max(0, allTests.length-1)
    const currentTest = allTests[lastIndex]
    const currentAction = {title: action, checkPoint: new Date().getTime()}
    const newActions = [...currentTest.actions,  currentAction] 
    currentTest.actions = newActions

    const newTests = [...allTests.slice(0, lastIndex), currentTest]
    console.log('|||  NEW_ACTION', newActions)
    props.r_setTests(newTests)
    setAllTests(newTests);
  }

  const animValueBobberButtonVisible = useSharedValue(0);

  const bobberButtonPress = () => {

  }

  
  const handleClearTasks = () => {

  }


  const handleAddTask = (task) => { 

  }


  const handleDeleteTask = (rowKey, some = false) => {
      
  }

  const menuPress = () => { 
      Vibration.vibrate([5,8])
      if(appStyle.navigationMenu.type == 'not' || (appConfig.weather.type == 'panel' && appConfig.weather.locationInfo.length>0)){
          props.navigation.openDrawer()
      } else {
          addTestActions('settingsStack')
          props.navigation.navigate('settingsStack')
      }

  }

  return (
    <>
      <ListItems
        tasks = {tasks}

        handleDeleteTask = {handleDeleteTask}
        clearAllTasks = { handleClearTasks}

        //setModal={setModal}
        //getDateInfo={getDateInfo}

        reaValueBobberButtonVisible = {animValueBobberButtonVisible}

        menuPress = {menuPress}

        fabPress = {bobberButtonPress}

        appStyle={appStyle}
        appConfig={appConfig}
        ThemeColorsAppIndex={ThemeColorsAppIndex}
        ThemeSchema = {ThemeSchema}
        LanguageAppIndex = {LanguageAppIndex}
      />

      <BobberButton 
        enabled={appStyle.functionButton.position != 'top'}

        bottomBord = {bottomBord}
        reaValueBobberButtonVisible = {animValueBobberButtonVisible}

        onPress = {bobberButtonPress}

        appStyle = {appStyle}
        ThemeColorsAppIndex = {ThemeColorsAppIndex}
        ThemeSchema = {ThemeSchema}
      />
  
    
    </>
  );
}
export default connect(mapStateToProps('HOME_SCREEN'),mapDispatchToProps('N_SCREEN'))(Timetable);


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
                  icon={{name: 'sticker-plus-outline', size: 24, color: appStyle.functionButton.invertColors? Theme.icons.accents.primary : Theme.icons.neutrals.primary}}
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
const headerParams = 46
const headerFullHeight = statusBarHeight+headerPanel+headerParams

const listItemHeight = 110


const Reanimated_FlatList = Reanimated.createAnimatedComponent(FlatList)
const ListItems = (props) => {
    const {

    tasks, 

    handleDeleteTask,
    clearAllTasks,

    reaValueBobberButtonVisible,

    menuPress,
    fabPress,

    appConfig,
    LanguageAppIndex,

    appStyle,
    ThemeColorsAppIndex,
    ThemeSchema

    } = props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex]
    const [ changesTask, setChangesTask ] = useState([])

    const categorys = ['today', 'all']
    const [category, setCategory] = useState(0)

    const changeCategory = (item, index) => {
        console.log('set',item, indicatorLine.value)
        setCategory(index)
    }

    const taskLongPress = (key) =>{
        Vibration.vibrate([5,8])
        if(!changesTask.includes(key)){
            setChangesTask([key, ...changesTask])
        }
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
 
        }
    }

    const changesCheck = () => {

    }

    const changesClose = () => {
        setChangesTask([])
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
                    [statusBarHeight, statusBarHeight],
                    //extrapolation
                    {
                        extrapolateLeft: Extrapolation.CLAMP,
                        extrapolateRight: Extrapolation.CLAMP
                    })
                }
            ],
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
            opacity: interpolate(
                headerShort.value, 
                [headerFullHeight-headerPanel, headerFullHeight],
                [0, 1]
            )
        }
    })

    const areaFrameBut = 100
    const paddingLeftCategorys = 45
    const indicatorLine = useSharedValue({widths: [], left: []})
    const animStyleIndicatorLine = useAnimatedStyle(() => {
        const duration = 350; 
        return {
            width: withTiming(indicatorLine.value.widths.length>0? indicatorLine.value.widths[category] : 0, {duration: duration-20}),
            left: withTiming(indicatorLine.value.left.length>0? ((0.5*(deviceWidth-areaFrameBut)*category) + indicatorLine.value.left[category]) : 0, {duration: duration, easing: Easing.bezier(0.45, 0, 0.55, 1)}),
        }
    }, [indicatorLine, category])

    

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
            title,

        } = item
        

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
                        horizontal: appStyle.lists.fullWidth? 1 : horizontalProximity, 
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
                        marginHorizontal: appStyle.lists.fullWidth? 0 : horizontalProximity,
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
                backgroundColor = {Theme.basics.accents.tertiary}
                shadowColors = {Theme.specials.shadow}
                shadowMargin={{horizontal: appStyle.lists.fullWidth? 0 : horizontalProximity, vertical: appStyle.lists.proximity}}
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
                    marginHorizontal: appStyle.lists.fullWidth? 0 : horizontalProximity,
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

    //const horizontalProximityModal = 10
    const cogButtonVisible = !(appConfig.appFunctions.settings.used && appStyle.navigationMenu.type == 'classical') ||
                            appStyle.navigationMenu.type == 'not' ||
                            (appConfig.weather.type == 'panel' && appConfig.weather.locationInfo.length>0)

    const cogIconType = ((appStyle.navigationMenu.type == 'classical' && (appConfig.weather.type == 'panel' && appConfig.weather.locationInfo.length>0)))? "weather-partly-snowy-rainy" 
    : appStyle.navigationMenu.type == 'not'? "menu" : 'cog'


    const iconsSize = 28
    
 
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
                zIndex: 2,
                height: headerPanel,
                width: deviceWidth,
                position: 'absolute',
                //backgroundColor: 'red'
                //justifyContent: 'flex-start',
                //alignItems: 'center',
                //flexDirection: appStyle.navigationMenu.drawerPosition == 'left'? 'row' : 'row-reverse', 
            }, dynamicPanel]}
        >
            {changesTask.length == 0 &&
            <Reanimated.View
                entering={entering}
                style = {{
                    height: headerPanel,
                    width: deviceWidth,
                    position: 'absolute',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    //backgroundColor: 'red',
                    paddingBottom: 5,
                    flexDirection: appStyle.navigationMenu.drawerPosition == 'left'? 'row' : 'row-reverse', 
                }}
            >
                <BasePressable 
                    type="i"
                    icon={{
                        name: cogIconType, 
                        size: iconsSize, 
                        color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary
                    }}
                    style={[{
                            flex: 1,
                            height: 46, 
                            width: 46, 
                            paddingTop: 4,
                            borderRadius: appStyle.borderRadius.additional,
                            marginHorizontal: 12,
                            opacity: cogButtonVisible? 1 : 0
                        }, 
                        //appStyle.navigationMenu.drawerPosition == 'left'? {marginLeft: 15,} : {marginRight: 15}
                    ]}
                    onPress={menuPress}
                    disabled = {!cogButtonVisible}
                    android_ripple={appStyle.effects.ripple == 'all'? ripple(appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary) : false}
                />

                <BasePressable 
                    type="i"
                    icon={{
                        name: "weather-partly-snowy-rainy", 
                        size: iconsSize, 
                        color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary
                    }}
                    style={[{
                            flex: 1,
                            height: 46, 
                            width: 46, 
                            paddingTop: 4,
                            borderRadius: appStyle.borderRadius.additional,
                            marginHorizontal: 12,
                            opacity: (changesTask.length == 0 && (appConfig.weather.type == 'widget' && appConfig.weather.locationInfo.length>0))? 1 : 0
                        }, 
                    ]}
                    onPress={()=>setWeatherModal(true)}
                    disabled = {!(changesTask.length == 0 && (appConfig.weather.type == 'widget' && appConfig.weather.locationInfo.length>0))}
                    android_ripple={appStyle.effects.ripple == 'all'? ripple(appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary) : false}
                />
                
                <Text 
                    style = {[{
                        flex: 8,
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: '500',
                        letterSpacing: 0.5,
                        fontVariant: ['small-caps'],
                        color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary
                    }, appStyle.navigationMenu.drawerPosition == 'left'? {marginRight: 60,} : {marginLeft: 60}]}
                >
                    {Language.TimetableScreen.HeaderTitle}
                </Text>

                <BasePressable 
                    type="i"
                    icon={{
                        name: 'sticker-plus-outline', 
                        size: iconsSize, 
                        color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary
                    }}
                    style={[{
                            flex: 2,
                            height: 46, 
                            width: 46, 
                            paddingTop: 4,
                            borderRadius: appStyle.borderRadius.additional,
                            marginHorizontal: 12,
                            opacity: (appStyle.functionButton.position == 'top')? 1 : 0
                        }, 
                    ]}
                    onPress={fabPress}
                    disabled = {!(appStyle.functionButton.position == 'top')}
                    android_ripple={appStyle.effects.ripple == 'all'? ripple(appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary) : false}
                />
            </Reanimated.View>}

            {changesTask.length > 0 &&
            <Reanimated.View
                entering={entering}
                style = {{
                    height: headerPanel,
                    width: deviceWidth,
                    position: 'absolute',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    //backgroundColor: 'red',
                    paddingBottom: 5,
                    flexDirection: appStyle.navigationMenu.drawerPosition == 'left'? 'row' : 'row-reverse', 
                }}
            >
                <BasePressable 
                    type="i"
                    icon={{
                        name: 'close', 
                        size: iconsSize, 
                        color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary
                    }}
                    style={[{
                            height: 46, 
                            width: 46, 
                            paddingTop: 4,
                            borderRadius: appStyle.borderRadius.additional,
                            marginHorizontal: 12,
                            //opacity: (appStyle.functionButton.position == 'top')? 1 : 0
                        }, 
                    ]}
                    onPress={changesClose}
                    android_ripple={appStyle.effects.ripple == 'all'? ripple(appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary) : false}
                />

                <View
                    //entering={entering}
                    style={{
                        alignItems: 'center',
                        flexDirection:  appStyle.navigationMenu.drawerPosition == 'left'? 'row' : 'row-reverse', 
                        //backgroundColor: 'red'
                    }}
                >
                    <View
                        style={{
                            width: 26,
                            height: 26,
                            backgroundColor: Theme.basics.accents.quaternary,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: appStyle.borderRadius.additional
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 15,
                                color: Theme.texts.neutrals.secondary
                            }}
                        >
                            {changesTask.length}
                        </Text>
                    </View>
                    <BasePressable
                        type="i"
                        style={{
                            width: 60
                        }}
                        icon = {{
                            name: 'check',
                            size: iconsSize,
                            color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary
                        }}
                        android_ripple={appStyle.effects.ripple == 'all'? ripple(appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary) : false}
                        onPress = {changesCheck}
                    />
                    <BasePressable
                        type="i"
                        style={{
                            width: 60
                        }}
                        icon = {{
                            name: 'delete',
                            size: iconsSize,
                            color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary
                        }}
                        android_ripple={appStyle.effects.ripple == 'all'? ripple(appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary) : false}
                        onPress = {changesDelete}
                        onLongPress = {clearAllTasks}
                    />
                </View>
            </Reanimated.View>}
        </Reanimated.View>

        <Reanimated.View
            style={[{
                zIndex: 1,
                //top: statusBarHeight+headerPanel,
                width: deviceWidth,
                height: headerParams,
                position: 'absolute',
                //backgroundColor: 'blue',
                paddingLeft: paddingLeftCategorys
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
                                width: (deviceWidth-areaFrameBut)/2,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={()=>changeCategory(item, index)}
                        >
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: '500',
                                    fontVariant: ['small-caps'],
                                    color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary,
                                    //backgroundColor: 'red'
                                }}
                                onLayout={(event)=>{
                                    indicatorLine.value.widths[index] = event.nativeEvent.layout.width+10
                                    indicatorLine.value.left[index] = event.nativeEvent.layout.x-5+paddingLeftCategorys
                                    //
                                    if(index == categorys.length-1){
                                        indicatorLine.value = JSON.parse(JSON.stringify(indicatorLine.value))
                                    }
                                }}
                            >
                                {Language.TasksScreen.filtration[item]}
                            </Text>
                        </Pressable>
                    )
                })}
                <View
                    style={{
                        flex: 1,
                        width: areaFrameBut,
                        //flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',//'space-around',
                        //backgroundColor: 'blue'
                    }}
                >
                    <BasePressable
                        type="i"
                        style={{
                            width: areaFrameBut*0.9,
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
            <View style = {[styles.ModalView,{height: 355}]}>
            <WeatherComponent />
            </View> 
        </BaseWindow>
        </>

    )
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
  TaskText: {
      fontSize: 16, 
      letterSpacing: 1, 
      //color:  ColorsApp.symbolDark
  },
  TaskDate: {
      fontSize: 9,
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