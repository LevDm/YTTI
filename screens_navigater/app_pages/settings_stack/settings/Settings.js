import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import {
    Appearance, 
    StyleSheet, 
    Text,
    Button, 
    Pressable,
    TextInput, 
    FlatList, 
    ScrollView,
    SectionList,
    View, 
    Dimensions,
    ToastAndroid,
    Keyboard,
    BackHandler,
    Vibration 
} from 'react-native';
import Constants from "expo-constants";
const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');
const statusBarHeight = Constants.statusBarHeight//+1

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
    useAnimatedGestureHandler,
    interpolateColor,
    interpolate,
    Extrapolate,
    runOnUI,
    Easing,
    Extrapolation,
    StretchInY,
    StretchOutY,
    FadeIn,
    FadeOut,
    SlideInUp,
    SlideOutDown
} from 'react-native-reanimated';

import * as NavigationBar from 'expo-navigation-bar';

import { Svg, Path } from "react-native-svg";

const ReanimatedPath = Reanimated.createAnimatedComponent(Path);
const ReanimatedSVG = Reanimated.createAnimatedComponent(Svg);

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
//import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetScrollView,
    BottomSheetVirtualizedList,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

import themesColorsAppList, {themesApp} from "../../../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../../../app_values/Languages";

import store from "../../../../app_redux_files/store";
import {connect} from 'react-redux';
import mapStateToProps from "../../../../app_redux_files/stateToProps";
import mapDispatchToProps from "../../../../app_redux_files/dispatchToProps";

import dataRedactor from "../../../../app_async_data_manager/data_redactor";

import { 
    BasePressable,
    BaseCheckBox,
    BaseSwitch 
} from "../../../../general_components/base_components/BaseElements";


import LanguageRedactor from "./redactors_settings/system/LanguageRedactor";
import UserRedactor from "./redactors_settings/system/UserRedactor";

import PresetsSelector from "./redactors_settings/interface/PresetsSelector";
import BorderRadiusRedactor from "./redactors_settings/interface/BorderRadiusRedactor";
import ThemeRedacor from "./redactors_settings/interface/ThemeRedactor";
import EffectsRedactor from "./redactors_settings/interface/EffectsRedactor";

import SelectorsRedactor from "./redactors_settings/interface/SelectorsRedactor";
import ListsRedactor from "./redactors_settings/interface/ListsRedactor";
import FunctionButtonRedactor from "./redactors_settings/interface/FunctionButtonRedactor";
import ModalsRedactor from "./redactors_settings/interface/ModalsRedactor";
import NavigateMenuRedactor from "./redactors_settings/interface/NavigateMenuRedactor";

import LoadSplashRedactor  from "./redactors_settings/functions/LoadSplashRedactor";
import AppFunctionsRedactor from "./redactors_settings/functions/AppFunctionsRedactor";
import WeatherRedactor from "./redactors_settings/functions/WeatherRedactor";

import Info from "./redactors_settings/ohter/Ohter";

import { BlurView } from "@react-native-community/blur";
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { Ionicons } from '@expo/vector-icons';
import * as Application from 'expo-application';

import { listsHorizontalProximity } from "../../../../app_values/AppDefault";

import SkiaViewDisign from "../../../../general_components/base_components/SkiaViewDisign";
import { CONTACTS } from "expo-permissions";

const ReanimatedFlatList = Reanimated.createAnimatedComponent(FlatList);
const ReanimatedSectionList = Reanimated.createAnimatedComponent(SectionList);
const ReanimatedTextInput = Reanimated.createAnimatedComponent(TextInput);
const ReanimatedIcon = Reanimated.createAnimatedComponent(MaterialCommunityIcons);

const ripple = (color) => ({
    color: `${color}20`,
    borderless: true,
    foreground: false
})


import StyleChangePreview from "./preview/StyleChangePreview";

const STRUCTURE = {
    settingsData: [
        {
            param: "language",
            icon:  "earth",
            paramRedactorComponent: LanguageRedactor
        },
        {
            param:"user",
            icon:  "account",
            paramRedactorComponent: UserRedactor
        },
    ],
    customizer: [
        {   
            //indexSection: 2,
            category: "additional",
            data: [
                {
                    param:"ohters",
                    icon:  "qrcode-scan",
                    paramRedactorComponent: Info
                },
            ]
        },
        {
            category: "app",            
            data: [
                {
                    param: "language",
                    icon:  "earth",
                    paramRedactorComponent: LanguageRedactor
                },
                {
                    param:"user",
                    icon:  "account",
                    paramRedactorComponent: UserRedactor
                },
            ]
        },
        {   
            category: "functions",
            data: [
                {
                    param:"appFunctions",
                    icon:  "cards",//"store",
                    paramRedactorComponent: AppFunctionsRedactor
                },                
                {
                    subCategory: "additionalFunctions",
                    data: [
                        /*
                        {
                            param: "loadAnimation",
                            icon:  "animation-play",
                            paramRedactorComponent: LoadSplashRedactor
                        }, 
                        */
                        {
                            param:"weather",
                            icon:  "weather-cloudy-clock",
                            paramRedactorComponent: WeatherRedactor
                        }, 
                    ]
                },                                            
            ]
        },
        {
            category: "appearance",            
            data: [
                
                {
                    param: "presets",
                    icon:  "storefront" ,
                    paramRedactorComponent: PresetsSelector
                },
                {
                    subCategory: "globalProperties",
                    data: [
                        {
                            param: "thema",
                            icon:  "palette",
                            paramRedactorComponent: ThemeRedacor
                        },
                        {
                            param: "borderRadius",
                            icon:  "vector-rectangle",
                            paramRedactorComponent: BorderRadiusRedactor
                        },
                        {
                            param: "effects",
                            icon:  "magic-staff",
                            paramRedactorComponent: EffectsRedactor
                        },
                    ]
                },              
                {
                    subCategory: "elements",
                    data: [                   
                        
                        {
                            param: "selectors",
                            icon:  "gesture-tap-box",
                            paramRedactorComponent: SelectorsRedactor
                        },
                        {
                            param: "bobberButton",
                            icon:  "balloon",
                            paramRedactorComponent: FunctionButtonRedactor
                        },
                        {
                            param: "lists",
                            icon:  "view-list",
                            paramRedactorComponent: ListsRedactor
                        },
                        {
                            param: "modals",
                            icon:  "window-restore",
                            paramRedactorComponent: ModalsRedactor
                        },  
                        {
                            param: "navigationMenu",
                            icon:  "menu",
                            paramRedactorComponent: NavigateMenuRedactor
                        },
                    ]
                },                  
            ]
        },
        
        
    ]
}

const categorysCustomizer = []
const structureCustomizer = []

for(let id = 0; id<STRUCTURE.customizer.length; id++){
    const itemCust = STRUCTURE.customizer[id]

    const category = itemCust.category
    const rawData = itemCust.data

    const subCategorys = []
    const data = []
    
    for(let el of rawData){
        let newEl
        if(el.subCategory){
            newEl = el.data.map((item, index)=>{               
                const res = {
                    ...item,
                    fromCustom: true,
                    indexSection: id,
                    category: category, 
                    subCategory: el.subCategory,
                    title: false, 
                    subTitle: index === 0, 
                } 
                return  res        
            })
        } else {
            newEl = {
                ...el,
                fromCustom: true,
                indexSection: id,
                category: category,
                title: true,
                subTitle: false, 
            }
        }
        data.push(newEl)
    }

    

    let startIndexSect = 0
    for(let i = 0; i < id; i ++){
        startIndexSect += structureCustomizer[i].data.length
    }
    //console.log(startIndexSect)

    structureCustomizer.push({
        indexSection: id,
        category: category,
        //subCategorys: subCategorys,
        data: data.flat()
    })



    categorysCustomizer.push(
        category,
    )
}


const allStructurParams = [];
for (let el of structureCustomizer){
    /* 
    for (let item of el.data){
        allStructurParams.push({
            param: item.param, 
            icon: item.icon, 
            category: el.category, 
            indexSection: el.indexSection
        })
    }*/
    let startIndexSect = 0
    for(let i = 0; i < el.indexSection; i ++){
        startIndexSect += el.data.length
    }

    el.data.map((item, index)=>{
        
        newItem = {
            //param: item.param, 
            //icon: item.icon,
            globalIndex: startIndexSect+index,
            ...item,
            //category: el.category,
            //indexSection: el.indexSection,
            indexInSection: index,
        }
        //delete newItem.paramRedactorComponent 
        allStructurParams.push(newItem)
    })
}

const OS_NAVIGATION_BAR_HEIGHT = Dimensions.get('screen').height - (Dimensions.get('window').height + Constants.statusBarHeight)
const FRAME_PREVIEW = 5

const ITEM_HEIGHT = 38
const COUNT_PARAMS = 5

const HEADER_PANEL_SIZE = {
    h: ITEM_HEIGHT*COUNT_PARAMS + 70,//- OS_NAVIGATION_BAR_HEIGHT, //(deviceHeight/2)+OS_NAVIGATION_BAR_HEIGHT-(2*FRAME_PREVIEW), 
    w: (deviceWidth/2)-(2*FRAME_PREVIEW) + 70, 
    w2: 60
}

const PREVIEW_SIZE = {
    h: (2*FRAME_PREVIEW)+(deviceHeight/2), 
    w: (2*FRAME_PREVIEW)+(deviceWidth/2), 
    w2: deviceWidth
}

const REDACTORS_SIZE = {
    h: HEADER_PANEL_SIZE.h, 
    w: deviceWidth-HEADER_PANEL_SIZE.w2,

    ih: HEADER_PANEL_SIZE.h+OS_NAVIGATION_BAR_HEIGHT
}

const initIndex = 2

const TRANSITION_DURATION = 300
    
const itemCategoryHeight = 50
const selectorLineHeight = 46


import {
    PanGestureHandler,
} from 'react-native-gesture-handler';

const HADLE_AREA_SIZE = {h: 30, w: deviceWidth}


//console.log('OS_NAVIGATION_BAR_HEIGHT', OS_NAVIGATION_BAR_HEIGHT)


const isEqual = (item_1, item_2) => JSON.stringify(item_1) == JSON.stringify(item_2)

const Settings = function(props){
    //console.log(props.navigation.isFocused(), store.getState().hideMenu,props.hideMenu)
    /*
    if(props.navigation.isFocused() && store.getState().hideMenu){
        //console.log('settings open', props.hideMenu)
        //props.r_setHideMenu(false)
        //bottomSheetVisible? props.r_setHideMenu(false) : null;
    } 
    */

    const {
        //appStyle,
        //appConfig,
        r_setAppStyle,
        r_setAppConfig,

        windowState,
        closeWindow,

        tagStyle,

        uiStyle, 
        uiTheme,
        uiCompositions,

        aPalette,
        uiScheme, 
   
        showAllSettings,

        updateFullStyle,
        updateFullTheme,

    } = props



    const [appStyle, setAppStyle] = useState(props.appStyle);
    const [appConfig, setAppConfig] = useState(props.appConfig);

    const LanguageAppIndex = languagesApp.indexOf(appConfig.languageApp)
    const ThemeColorsAppIndex = themesApp.indexOf(appStyle.palette.theme)

    //const previewAppStyleA = useSharedValue(appStyle)
   
    store.subscribe(() => {
        const jstore = store.getState();

        if(!isEqual(appStyle, jstore.appStyle)){
            console.log('app style upd')
            setAppStyle(jstore.appStyle);
            //previewAppStyleA.value = jstore.appStyle
        }

        if(!isEqual(appConfig, jstore.appConfig)){
            console.log('app config upd')
            setAppConfig(jstore.appConfig);
        }
    })

    const listenerColorSheme = Appearance.getColorScheme()
    const ThemeSchema = listenerColorSheme? appStyle.palette.scheme == 'auto'? listenerColorSheme : appStyle.palette.scheme : ThemeSchema

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    /*
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            console.log('keyboard Will Show')
            setKeyboardVisible(true);
            animValueBobberButtonVisible.value = 1//bottomBord
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
    */
    
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen

    const aPreviewAppSchema = useSharedValue(ThemeSchema)

    const previewAppStyleA = useDerivedValue(()=>{
        //console.log('TASK STYLE', global_aStyle.value? '1' : '2')
        return  appStyle
    })



    const previewAppPalette = useDerivedValue(()=>{
  
        const sourceStyle = previewAppStyleA.value? previewAppStyleA.value : appStyle
        const index = themesApp.indexOf(sourceStyle.palette.theme)
        const schema = previewAppStyleA.value? previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : listenerColorSheme : ThemeSchema// sourceStyle.palette.scheme == 'auto'? runOnJS(Appearance.getColorScheme)() : sourceStyle.palette.scheme

        console.log('SETINGS PREV UPD', index, schema)

        if(index == 0 && !themesColorsAppList[index] && appStyle.customTheme){ //
            console.log('SETINGS PREV PALETTE *custom', schema)
            return appStyle.customTheme//[schema]
        } else {
            console.log('SETINGS PREV PALETTE', themesColorsAppList[index].title, schema)
            return themesColorsAppList[index]//[schema]
            
        }
    },[previewAppStyleA, ThemeSchema, appStyle, themesColorsAppList]) 


    const applyAppStyle = ()=>{
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        const equal = (JSON.stringify(appStyle) === JSON.stringify(newAppStyle))
        if(!equal){
            Vibration.vibrate([5,12,50,12])
            const usedSubsequence = Object.values(appConfig.appFunctions).filter(item => item.used && true)
            
            if(usedSubsequence.length == 1 && newAppStyle.navigationMenu.type == 'classical'){
                console.log('hide menu in app style', usedSubsequence)
                newAppStyle.navigationMenu.height = 0
            }

            //setAppStyle(newAppStyle)
            dataRedactor("storedAppStyle",newAppStyle);
            r_setAppStyle(newAppStyle);

        }
    }

    

    /*
    useEffect(() => {
        const backAction = () => {
            backBurgerPress()
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        console.log('add even back swipe')
        return () => backHandler.remove();
    }, []);
    

    const backBurgerPress = () => {
        Vibration.vibrate([5,8])
        props.navigation.goBack()
    }
 */

    const goToNFC = () => {
        //props.navigation.navigate('NFC')
    }


    const goToPalleteScreen = (index = 0, mod = 0) => {
        /* 
        ToastAndroid.show(Language.stackTransition.loadPainter, ToastAndroid.SHORT);   
        const colors = JSON.parse(JSON.stringify(previewAppPalette.value))
        colors.theme = 'custom'
        console.log('TO PALETTE OPE COLORS', colors)

        const styles = JSON.parse(JSON.stringify(previewAppStyleA.value))
        styles.palette.theme = 'custom'

        const ground = themesColorsAppList[index]
        ground.title = 'custom'
        ground.light.theme = 'custom'
        ground.dark.theme = 'custom'

        props.navigation.navigate('palette', {
            themeIndex: index, 
            modIndex: mod, 
            styles: previewAppStyleA.value,
            fullPalette: ground,
            openedScheme: ThemeSchema,
        })
        */
    }

   


    const aListsState = useSharedValue(({n: initIndex, o: initIndex-1}))

    const aScaleState = useSharedValue(0)
    const aScalePreview = useSharedValue(0)

    const paramsRef = useAnimatedRef(); 
    const previewsRef = useAnimatedRef();
    const redactorsRef = useAnimatedRef();

    const svgUP = useSharedValue(1) // 
    const indicatorMargin = useSharedValue(initIndex*ITEM_HEIGHT)


    const settingIndex = (index) => {
        "worklet";
        if(index != aListsState.value.n){
            //console.log('index', index, aListsState.value)
            aListsState.value = {n: index, o: aListsState.value.o};
            cancelAnimation(svgUP);
            svgUP.value = withSequence(withTiming(0, {duration: TRANSITION_DURATION*0.4}), withDelay(TRANSITION_DURATION*0.2, withTiming(1, {duration: TRANSITION_DURATION*0.4})))
            cancelAnimation(indicatorMargin);
            indicatorMargin.value = withTiming(index * ITEM_HEIGHT, {duration: TRANSITION_DURATION, easing: Easing.bezier(0.45, 0, 0.55, 1)})
            //console.log('index', aListsState.value)
        }
    }

    const openRedactor = (index = 0) => {
        redactorsRef.current.scrollToOffset({
            offset: REDACTORS_SIZE.w*index,
            animated: false
        })
        settingIndex(index)
    }

    console.log('$$$$$$$ SETTINGS screen RENDER', )
    //aScaleState.value = withSequence(withDelay(400, withTiming(0)), withDelay(400, withTiming(1)))


    const aStyleIsEqual = useDerivedValue(()=>{
        return (JSON.stringify(appStyle) === JSON.stringify(previewAppStyleA.value))
    })

    const saveCustomTheme = () => {
        console.log('SAVE THEME')
        const saveObject = JSON.parse(JSON.stringify(previewAppPalette.value));
        const equal = (JSON.stringify(appStyle.customTheme) === JSON.stringify(saveObject))
        if(!equal){
            saveObject.title = 'custom'
            //themesColorsAppList.splice(0,1, saveObject)
            //themesColorsAppList[0] = saveObject
            //themesSet(saveObject)
            //console.log('FROM LIST THEMES', themesColorsAppList[0])
            const newAppStyle = JSON.parse(JSON.stringify(appStyle));
            newAppStyle.customTheme = saveObject;
            r_setAppStyle(newAppStyle);
            dataRedactor("storedAppStyle",newAppStyle);
            ToastAndroid.show(Language.PainterScreen.saved, ToastAndroid.LONG);
        }
    }


    const closeMenu = () =>{
        'worklet'; 
        if(aScaleState.value == 0){
            console.log('close menu')
            cancelAnimation(aScaleState)
            aScaleState.value = 1
        }
    }

    const openMenu = ()=>{
        cancelAnimation(aScaleState)
        aScaleState.value = (aScaleState.value == 0? 1 : 0)
        //test.value = test.value == 0? 1 : 0
    }


    const dragParams = useSharedValue({x: 0, y: -OS_NAVIGATION_BAR_HEIGHT})

    const settingDragParams = (newValue) => {
        "worklet";
        dragParams.value = {
            x: Math.min(Math.max( (dragParams.value.x + newValue.x) ,0 ),0 ),
            y: Math.min(Math.max( (dragParams.value.y + newValue.y) , HEADER_PANEL_SIZE.h-deviceHeight+(statusBarHeight-8)), HADLE_AREA_SIZE.h),
        } 
    }

    const dragStyle = useAnimatedStyle(()=>{
        return {
            transform: [
                {translateY: dragParams.value.y}
            ]
        }
    })


    const [visible, setVisible] = useState(false)
    useDerivedValue(()=>{
        //{visible: 0|1, page: undefined|index}
        if(windowState.value.visible == 1 && !visible){
            
            runOnJS(setVisible)(true)
        }

    }, [windowState])
    
    const applyPress =()=>{
        applyAppStyle()
        setVisible(false)

        closeWindow()
        //applyAppStyle()
    }

    if(!visible){return null}
    return (
        <Reanimated.View
            entering={StretchInY} 
            exiting={FadeOut}
            style={[dragStyle, {
                position: 'absolute',
                
                backgroundColor: `${Theme.basics.neutrals.quaternary}80`,
                height: HEADER_PANEL_SIZE.h+2*HADLE_AREA_SIZE.h,
                width: deviceWidth,
                borderRadius: HADLE_AREA_SIZE.h,
                bottom: OS_NAVIGATION_BAR_HEIGHT
            }]}
        >
            <DragHandle 
                settingDragParams={settingDragParams}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />
            <Reanimated.View
                //entering={StretchInY} 
                //exiting={StretchOutY}
                style={{ 
                    flexDirection: 'row',
                    paddingLeft: HEADER_PANEL_SIZE.w2,

                }}
            >
                <HeaderPanel 
                    listRef={paramsRef}

                    aStyleIsEqual={aStyleIsEqual}
                    aListsState={aListsState}
                    svgUP={svgUP}
                    indicatorMargin={indicatorMargin}
                    aScaleState={aScaleState}

                    closeMenu={closeMenu}
                    openMenu={openMenu}
                    openRedactor={openRedactor}
                    //backScreen={backBurgerPress}
                    applyNewStyle={applyPress}

                    appConfig = {appConfig}
                    LanguageAppIndex = {LanguageAppIndex}
                    appStyle = {appStyle}
                    ThemeColorsAppIndex = {ThemeColorsAppIndex}
                    ThemeSchema = {ThemeSchema}
                />
                <Redactors 
                    listRef={redactorsRef}

                    uiStyle = {uiStyle}
                    uiTheme = {uiTheme}
                    uiScheme={uiScheme}
                    uiCompositions = {uiCompositions}

                    showAllSettings = {showAllSettings}

                    updateFullStyle={updateFullStyle}
                    updateFullTheme={updateFullTheme}

                    tagStyle = {tagStyle}

                    aPalette = {aPalette}

                    setIndex={settingIndex}
                    closeMenu={closeMenu}

                    appConfig = {appConfig}
                    LanguageAppIndex = {LanguageAppIndex}
                    appStyle = {appStyle}
                    ThemeColorsAppIndex = {ThemeColorsAppIndex}
                    ThemeSchema = {ThemeSchema}
                />
            </Reanimated.View>
            <DragHandle 
                settingDragParams={settingDragParams}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />
        </Reanimated.View>
    )  
}
export default connect(mapStateToProps('SETTINGS_SCREEN'), mapDispatchToProps('SETTINGS_SCREEN'))(Settings);



const DragHandle = (props) =>{
    const {
        //dragParams,
        settingDragParams,

        //appStyle,
        ThemeColorsAppIndex,
        ThemeSchema,
    } = props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]

    const panGestureEvent = useAnimatedGestureHandler({
        onActive: (event, context) => {
            settingDragParams({
                x: event.x,
                y: event.y
            })
        },
    })

    return (
        <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Reanimated.View
            style={{
                height: HADLE_AREA_SIZE.h,
                width: HADLE_AREA_SIZE.w,
                justifyContent: 'center',
                alignItems: 'center',
                //backgroundColor: 'red'
            }}
        >
            <Reanimated.View 
                style = {[{
                    height: 6,
                    width: HADLE_AREA_SIZE.w * 0.2,
                    position: 'absolute',
                    borderRadius: 4,
                    backgroundColor: `${Theme.icons.accents.primary}80`
                }]}
            />
        </Reanimated.View>
        </PanGestureHandler>
    )
}

const DISTORION = 8
const MENU_TRANSFORM_DURATION = 150
const SELECTOR_TRANSITION_DURATION = 250

const HeaderPanel = (props) => {
    const {
        listRef: paramsList,

        aStyleIsEqual,

        aListsState,

        

        svgUP,
        indicatorMargin,
        aScaleState,


        closeMenu,
        openMenu,

        openRedactor,
        //backScreen, 
        applyNewStyle, 

        appStyle,
        appConfig,
        LanguageAppIndex, 
        ThemeColorsAppIndex, 
        ThemeSchema 
    } = props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen
    


    const animValueTranslateY = useSharedValue(0);
    const accentCategory = useDerivedValue(()=> allStructurParams[aListsState.value.n].indexSection) 

    

    const headerAStyle = useAnimatedStyle(()=>{
        return {
            width: withTiming(interpolate(
                aScaleState.value,
                [0, 1],
                [HEADER_PANEL_SIZE.w, HEADER_PANEL_SIZE.w2]
            ), {duration: MENU_TRANSFORM_DURATION}),
        }
    })

    const paramsScroll = useAnimatedScrollHandler({
        onScroll: (e, ctx) => {
            animValueTranslateY.value = -(e.contentOffset.y)            
        }
    })

    const categoryStyle = useAnimatedStyle(()=>{
        return {
            opacity: withSequence(withTiming(0*accentCategory.value, {duration: 0}), withTiming(1, {duration: SELECTOR_TRANSITION_DURATION})),
            transform: [
                {scale: withSequence(withTiming(0.9, {duration: 0}), withTiming(1, {duration: SELECTOR_TRANSITION_DURATION})),}
            ],
        }
    })

    const categoryText = useAnimatedProps(()=>{
        return {
            value: Language.StructureScreen.typesSettings[`${categorysCustomizer[accentCategory.value]}`].type,
            text: Language.StructureScreen.typesSettings[`${categorysCustomizer[accentCategory.value]}`].type,
        }
    })

    const animStyleIndicatorLine = useAnimatedStyle(() => {
        return {
            transform: [
                {translateY: indicatorMargin.value + animValueTranslateY.value}
            ] 
        }
    }, [indicatorMargin])

    const maskIndicator = useAnimatedStyle(()=>{
        const up = Math.abs(Math.max(Math.min(((aListsState.value.n) * ITEM_HEIGHT) + animValueTranslateY.value , 0), -ITEM_HEIGHT))//<0
        const i = (aListsState.value.n-COUNT_PARAMS+1)
       // const down = -(DISTORION+ Math.min(Math.max((ITEM_HEIGHT*(5 - (i < 5? i : 0) ))  + animValueTranslateY.value, 0), ITEM_HEIGHT))
       const down = -(DISTORION+ Math.min(Math.max((ITEM_HEIGHT*i)  + animValueTranslateY.value, 0), ITEM_HEIGHT))
        

        //const t = aListsState.value.n < 5?  : aListsState.value.n > 14-5?  :  

        const scroll = Math.abs(animValueTranslateY.value)

        let action = 0

        if(aListsState.value.n < COUNT_PARAMS){
            action = up
        } else if (aListsState.value.n > (allStructurParams.length-COUNT_PARAMS)) {
            action = down
        } else {
           if(scroll > aListsState.value.n*ITEM_HEIGHT){
            action = up
           } else if (scroll < i*ITEM_HEIGHT) {
            action = down
           }
        }
        
        //console.log(animValueTranslateY.value, aListsState.value.n, action)

        return {
            top: action,
        }
    }, [animValueTranslateY, aListsState])


    const pathSVG = useAnimatedProps(()=>{
        const W2 = 7
        const open = interpolate(svgUP.value, [0, 1], [W2, 2], {extrapolateLeft: Extrapolation.CLAMP, extrapolateRight: Extrapolation.CLAMP})
        const iHeight = ITEM_HEIGHT + interpolate(svgUP.value, [0, 1], [DISTORION, 0], {extrapolateLeft: Extrapolation.CLAMP, extrapolateRight: Extrapolation.CLAMP})
        // view-box = 9
        const d2 = `
            M ${W2}     ${iHeight}
            C ${W2}     ${iHeight}       ${W2}     ${iHeight*0.9}     ${W2}       ${iHeight*0.75}
            C ${W2}     ${iHeight*0.6}   ${open}   ${iHeight*0.5}     ${open}     ${iHeight*0.5}
            C ${open}   ${iHeight*0.5}   ${W2}     ${iHeight*0.4}     ${W2}       ${iHeight*0.25}
            C ${W2}     ${iHeight*0.1}   ${W2}     0                      ${W2}       0
        `
        return ({
            d: d2
        })
    })

    const textHide = useAnimatedStyle(()=>{
        return {
            opacity: withTiming(interpolate(aScaleState.value, [0, 1], [1, 0]), {duration: MENU_TRANSFORM_DURATION})
        }
    })

    useDerivedValue(()=>{
        const index = aListsState.value.n
        const to = (Math.round(COUNT_PARAMS/2)-1) >= index? 0 : (index >= allStructurParams.length-(Math.round(COUNT_PARAMS/2))? allStructurParams.length-(Math.round(COUNT_PARAMS/2)) : index-(Math.round(COUNT_PARAMS/2)-1))
        scrollTo(
            paramsList,
            0,
            to*ITEM_HEIGHT,
            true
        )
    })

    const showSaveButtom = useAnimatedStyle(()=>{
        return {
            opacity: aStyleIsEqual.value? 0 : 1
        }
    })

    const iconExpand = useAnimatedStyle(()=>{
        return {
            opacity: withTiming(interpolate(aScaleState.value, [0, 1], [0, 1]), {duration: MENU_TRANSFORM_DURATION})
        }
    })

    const iconCollapse = useAnimatedStyle(()=>{
        return {
            opacity: withTiming(interpolate(aScaleState.value, [0, 1], [1, 0]), {duration: MENU_TRANSFORM_DURATION})
        }
    })


    const renderParams = ({item, index})=> {
        console.log('--> RENDER TITLE', index)
        const icon = (item.icon != null? item.icon : "border-none-variant");
        return (
            <Pressable
                key={String(item+index)}
                style={[{
                    height: ITEM_HEIGHT,
                    //backgroundColor: 'blue',
                    //marginBottom: 2,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                }]}
                onPress={()=>{
                    closeMenu()
                    openRedactor(index)
                }}
            >   
                <Reanimated.Text 
                    style={[staticStyles.frontFLText, textHide, {
                        position: 'absolute',
                        //backgroundColor: 'red',
                        right: 30,
                        color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary
                    }]}
                >
                    {Language.StructureScreen.params[item.param]}
                </Reanimated.Text>
                <MaterialCommunityIcons name={icon} size={26} color={appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary} />  
            </Pressable>
        )
    }

    
    console.log('-> HEADER RENDER')
    return (
        <Reanimated.View
            style={[headerAStyle, {
                height:HEADER_PANEL_SIZE.h,
                position: 'absolute',
                zIndex: 2,
                backgroundColor: appStyle.lists.invertColorsHeader? Theme.basics.neutrals.secondary : Theme.basics.accents.primary, 
                borderRightWidth: 0.75,
                borderColor: `${Theme.specials.separator}20`,
                //borderTopRightRadius: 5,
                //borderBottomRightRadius: 5
                borderRadius: 5
                //width: HEADER_PANEL_SIZE.w,
                //backgroundColor: 'lightblue',
            }]}
        >
            

            <View
                style = {{
                    marginTop: 0,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: 64,
                    paddingLeft: 4,
                }}
            >
                <Reanimated.View
                    style={[textHide, {
                        width: 60,
                        height: 60,
                        position: 'absolute',
                        left: 0,
                        top: 0
                        //backgroundColor: 'red'
                    }]}
                >
                    <BasePressable
                        type="i" //content-save-cog-outline
                        icon={{name: "close", size: 30, color: appStyle.functionButton.invertColors? Theme.icons.accents.primary : Theme.icons.neutrals.primary}}
                        style={{
                            width: itemCategoryHeight,
                            height: itemCategoryHeight,
                            margin: 5,
                            borderRadius: appStyle.borderRadius.additional
                        }}
                        android_ripple={appStyle.effects.ripple != 'off'? ripple(Theme.texts.neutrals.primary) : false}
                        onPress = {applyNewStyle}
                        direction="column-reverse"
                    />
                </Reanimated.View>  
                <Reanimated.View
                    style = {[ textHide,{
                        //zIndex: 0,
                        position: 'absolute',
                        //backgroundColor: 'red',
                        top: 8,
                        right: 56,
                        //left: 0,
                        width: HEADER_PANEL_SIZE.w - 60 - 60,
                    }]}
                >
                    <Reanimated.Text 
                        style = {[staticStyles.AnimatedHeaderText,  {
                            //paddingLeft: appStyle.navigationMenu.type == 'not'? 28 : 32, 
                            //zIndex: 0,
                            //position: 'absolute',
                            //backgroundColor: 'red',
                            //right: 0,
                            //width: HEADER_PANEL_SIZE.w - 50,
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary
                        }]}
                    >
                        {Language.HeaderTitle}
                    </Reanimated.Text>
                    <ReanimatedTextInput     
                        editable = {false}
                        style = {[staticStyles.AnimatedHeaderText, categoryStyle,{
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary
                            }]}
                        animatedProps={categoryText}
                    />
                </Reanimated.View>
                <Pressable
                    style={{
                        position: 'absolute', right: 0, top: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 60,
                        height: 60,
                        //margin: 5,
                        borderRadius: appStyle.borderRadius.additional
                    }}
                    android_ripple={appStyle.effects.ripple != 'off'? ripple(Theme.texts.neutrals.primary) : false}
                    onPress = {openMenu}
                >
                    <SkiaViewDisign 
                        borderRadius = {appStyle.borderRadius.additional}
                        backgroundColor = {Theme.basics.accents.tertiary}
                        shadowColors = {Theme.specials.shadow}
                        shadowMargin={{horizontal: 5, vertical: 5}}
                        shadowStyle = {appStyle.effects.shadows}
                        adaptiveSizeForStyle={false}
                        innerShadow={{
                            used: true,
                            borderWidth: 1
                        }}
                        initSize={{height: 60, width: 60}}
                    />
                    <ReanimatedIcon
                        style={[iconCollapse, {position: 'absolute'}]}
                        name={"arrow-collapse"}
                        size={30}
                        color={appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary}
                    />
                    <ReanimatedIcon
                        style={[iconExpand, {position: 'absolute'}]}
                        name={"arrow-expand"}
                        size={30}
                        color={appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary}
                    />
                </Pressable>
            </View>

            {/*HEADER PARAMS*/}
            <Reanimated.View
                style={[{
                    height: COUNT_PARAMS*ITEM_HEIGHT,
                    overflow: 'hidden',
                    //width: 10,// selectorLineHeight,
                    //zIndex: 5
                }]}
            >
                <ReanimatedFlatList
                    ref={paramsList}
                    getItemLayout={(data, index) => ({length: ITEM_HEIGHT, offset:  ITEM_HEIGHT * index, index: index})}
                    showsVerticalScrollIndicator={false} 
                    style={{
                        //height: ITEM_HEIGHT*5,
                        //width:  REDACTORS_SIZE.w,      
                        //backgroundColor: 'grey',
                        //paddingBottom: OS_NAVIGATION_BAR_HEIGHT
                        marginRight: 10,
                    }}
                    data={allStructurParams}
                    //extraData={}
                    keyExtractor={item => item.param}
                    initialNumToRender={16}
                    maxToRenderPerBatch={16}
                    renderItem={renderParams}
                    onScroll={paramsScroll}
                />
                <Reanimated.View 
                    style={[ animStyleIndicatorLine, {
                        position: 'absolute',
                        height: ITEM_HEIGHT+DISTORION,//2.5,
                        width: 10,
                        right: -2.2,
                        //paddingTop:3
                        //backgroundColor: 'red'
                        //right: -1.85,
                    }]}  
                >
                    <Svg                                                     
                        width="100%"                   
                        height="100%" 
                        fill={"none"} //
                    >
                        <ReanimatedPath
                            animatedProps={pathSVG}
                            stroke={appStyle.lists.invertColorsHeader? Theme.basics.accents.primary : Theme.basics.accents.quaternary}
                            strokeWidth={2.5}
                        />
                    </Svg>
                    {false && 
                    <MaskedView
                        androidRenderingMode = {'software'}
                        style={{
                            width: '100%',
                            height: "100%",
                            position: 'absolute', 
                            //height: selectorLineHeight,
                            justifyContent: 'flex-end', 
                            backgroundColor: 'transparent'
                        }}
                        maskElement={
                            <></>
                        }
                    >
                        {/* COLOR*/}
                        <Reanimated.View style={[maskIndicator, {position: 'absolute', height: ITEM_HEIGHT+DISTORION, width: '100%', backgroundColor: appStyle.lists.invertColorsHeader? Theme.basics.accents.primary : Theme.basics.accents.quaternary}]}/>  
                    </MaskedView>}
                </Reanimated.View>
            </Reanimated.View>
        </Reanimated.View>
    )
}


const Redactors = (props) => {
    const {
        listRef: redactorsList,

        updateFullStyle,
        updateFullTheme,
        
        uiStyle, 
        uiTheme,
        uiScheme,
        uiCompositions,

        aPalette, 

        showAllSettings,

        tagStyle,

        closeMenu,

        setIndex: settingIndex,

        appStyle,
        appConfig,
        LanguageAppIndex, 
        ThemeColorsAppIndex, 
        ThemeSchema 
    } = props
    //const redactorsList = useAnimatedRef();


    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen

    const redactorsScroll = useAnimatedScrollHandler({
        onBeginDrag: (event, ctx) => {
            closeMenu()
        },
        onScroll: (event, ctx) => {
            //setIndex(event.contentOffset.x)
        },
        onMomentumEnd: (event, ctx) => {
            settingIndex(Math.abs(Math.round(event.contentOffset.x / REDACTORS_SIZE.w)))
        },
    })

    const keyExtractor = (item) => "redactor_"+String(item.param)

    const renderRedactors = useCallback(({item, index}) => {
        console.log('--> RENDER R_ITEMS ', index)
        const RedactorComponent = item.paramRedactorComponent //? item.paramRedactorComponent :;
        const keys = keyExtractor(item)
        return (
            <R_Item 
                key={keys}
                keyID={keys}
                redactorName={Language.StructureScreen.params[item.param]}
            >
                <RedactorComponent
                    uiStyle = {uiStyle}
                    uiTheme = {uiTheme}
                    uiScheme={uiScheme}
                    uiCompositions={uiCompositions}

                    showAllSettings={showAllSettings}

                    updateFullStyle={updateFullStyle}
                    updateFullTheme={updateFullTheme}

                    tagStyle = {tagStyle}

                    aPalette = {aPalette}

                    appStyle={appStyle}
                    appConfig={appConfig}
                    ThemeColorsAppIndex={ThemeColorsAppIndex}
                    ThemeSchema={ThemeSchema}
                    LanguageAppIndex={LanguageAppIndex}
                />
            </R_Item>
        )
    })

    const R_Item = memo((props) => {
        const {
            keyID,
            redactorName,
            children
        } = props
        console.log('---> RENDER R_ITEM', keyID)
        return (
            <ScrollView
                key={keyID}
                style={{
                    height: REDACTORS_SIZE.h,
                    width:  REDACTORS_SIZE.w,
                    backgroundColor: Theme.basics.neutrals.secondary 
                }}
                contentContainerStyle = {{
                    //paddingBottom: OS_NAVIGATION_BAR_HEIGHT
                }}

                showsVerticalScrollIndicator={false}

                onStartShouldSetResponder={()=>true}
                onMoveShouldSetResponde={()=>true}
                onResponderTerminationRequest={()=>true}
            >
                <View
                    style={{
                        minHeight: REDACTORS_SIZE.h,
                        width:  REDACTORS_SIZE.w-16, 
                        marginHorizontal: 8,
                        paddingTop: 2,
                        //backgroundColor: 'blue',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}
                >
                    <Text 
                        style = {[{
                            color: Theme.texts.accents.primary,// : Theme.texts.neutrals.tertiary,
                            fontSize: 20,
                            fontWeight: '500',
                            letterSpacing: 4,
                            fontVariant: ['small-caps'],
                            marginBottom: 8
                        }]}
                    >
                        {redactorName}
                    </Text>
                    <View 
                        style={{
                            width: '100%'
                        }}
                    >
                        {children}
                    </View>
                </View>
            </ScrollView>
        )
    }, ()=>true)

    console.log('-> REDACTORS RENDER')
    return (
        <ReanimatedFlatList
            ref={redactorsList}
            horizontal
            //nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate={'fast'}
            snapToInterval={REDACTORS_SIZE.w}
            getItemLayout={(data, index) => ({length: REDACTORS_SIZE.w, offset: REDACTORS_SIZE.w * index, index: index})} 

            style={{
                height: REDACTORS_SIZE.h,
                width:  REDACTORS_SIZE.w,      
                backgroundColor: Theme.basics.neutrals.primary,
                //paddingBottom: OS_NAVIGATION_BAR_HEIGHT
            }}
            
            //extraData={}
            data={allStructurParams}
            keyExtractor={keyExtractor}
            renderItem={renderRedactors}
            contentOffset={{x: initIndex*REDACTORS_SIZE.w, y: 0}}//initialScrollIndex={initIndex}
            
            onScroll={redactorsScroll}

            initialNumToRender={3}
            maxToRenderPerBatch={16}
            windowSize={7} //16 + 1 + 16
            removeClippedSubviews={false}        
            
            onResponderTerminationRequest={()=>true}
            onStartShouldSetResponder={()=>false}
            onMoveShouldSetResponde={()=>false}
        />
    )
}





//====================================================================================================================================
//====================================================================================================================================

//====================================================================================================================================

const BobberButton = (props) => {
    const {
        reaValueBobberButtonVisible,
        bottomBord,
        aBottomMargin,

        aEnabled,

        upPress,
        downPress,

        appConfig,
        LanguageAppIndex,

        appStyle,
        ThemeColorsAppIndex,
        ThemeSchema
    } = props

    const enabled = useDerivedValue(()=>aEnabled.value)
    const bottomMargin = useDerivedValue(()=>aBottomMargin.value)

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    
    const dynamicStyleBobberUp = useAnimatedStyle(() => {
        const duration = 200;
        return {
            transform: [
                {translateY: withTiming((reaValueBobberButtonVisible.value == 0 && enabled.value)? -(5+appStyle.functionButton.size) : 0, {duration: duration})}
            ] 
        }
    })

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
            height:  withTiming(appStyle.functionButton.size, {duration: duration}),
            width:  withTiming(appStyle.functionButton.size, {duration: duration}),
            bottom:  withTiming((appStyle.navigationMenu.height+12.5+ bottomMargin.value +addBottom), {duration: duration}),
            right: withTiming( (position(appStyle.functionButton.size)[appStyle.functionButton.position]), {duration: duration}),

            transform: [
                {translateY: withTiming((reaValueBobberButtonVisible.value == 0 && enabled.value)? 0 : bottomBord, {duration: durationTranslate})}
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
            {console.log('-- BOBBER BUTTUN RENDER')}
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
                    shadowStyle = {appStyle.effects.shadows == 'none' && appStyle.functionButton.ignoredShadows.disable? 'material' : appStyle.effects.shadows}
                    adaptiveSizeForStyle={false}
                    innerShadow={{
                        used: true,
                        borderWidth: 0.5
                    }}
                    initSize={{height: appStyle.functionButton.size, width: appStyle.functionButton.size}}
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
                        borderRadius: appStyle.borderRadius.additional,
                    }}
                />
                <Pressable
                    style={[{
                        height: appStyle.functionButton.size-10,
                        width: appStyle.functionButton.size-10,
                        borderRadius: appStyle.borderRadius.additional,
                        justifyContent: 'center',
                        alignItems: 'center',
                        //backgroundColor: appStyle.effects.blur? 'transparent' : (appStyle.functionButton.invertColors? Theme.basics.neutrals.secondary : Theme.basics.accents.secondary),
                        //transform: [{rotate: rotate? '180deg' : '0deg'}]
                        },
                    ]}
                    android_ripple={appStyle.effects.ripple == 'all'? ripple(Theme.icons.accents.primary) : false}
                    onPress={upPress}
                    delayLongPress={250}
                    onLongPress={downPress}
                >
                    <MaterialCommunityIcons 
                        name = {"cellphone-check"} // "cellphone-cog";
                        size = {24}
                        color = {appStyle.functionButton.invertColors? Theme.icons.accents.primary : Theme.icons.neutrals.primary}
                    />
                </Pressable>
            </Reanimated.View>
        </Reanimated.View>
    )
}

//====================================================================================================================================


const headerStickysHeight = 33

const headerHeight = statusBarHeight+itemCategoryHeight//+selectorLineHeight
const packHeight = 300

const headerStickysFullHeight = headerStickysHeight //+(2*appStyle.lists.proximity)
const selectorLineHeightFull = itemCategoryHeight + selectorLineHeight
const headHeight = packHeight-itemCategoryHeight


const horizontalProximity = listsHorizontalProximity['true']



const BasisList = React.memo(function (props) {
    const {
        reaValueBobberButtonVisible,

        toolbarVisibleHeight, //

        r_setAppStyle,
        r_setAppConfig,

        previewAppStyleA,


        goToPalleteScreen,
        goToNFC,

        backBurgerPress,
        applyPress,
        showPress,

        bottomBord, //

        appStyle,
        appConfig,
        LanguageAppIndex, //
        ThemeColorsAppIndex, //
        ThemeSchema //
    } = props

    //console.log('BL: ', bottomBord, toolbarVisibleHeight, LanguageAppIndex, ThemeColorsAppIndex, ThemeSchema, reaValueBobberButtonVisible, previewAppStyleA.value.presetUsed)

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen

    
    //const [headHeightTop.value, setHeadHeightTop] = useState(headHeight);
    const headHeightTop = useSharedValue(headHeight) //useRef(headHeight)

    const topToolBar = 0//appStyle.functionButton.position == 'top'? 2 : 0
    const headFullHeight =  selectorLineHeightFull+topToolBar //+headHeightTop.value.value headHeightTop.value.current
    
    const animSelectorLine = useDerivedValue(()=> (headFullHeight+headHeightTop.value-(headerStickysHeight+12.5)), [headHeightTop])


    const sectListRef = useRef();
    //useEffect(()=>{
    //    console.log('...........................')
    //},[sectListRef])
    const flatCategorysListRef = useAnimatedRef(); 
    const flatListRef = useAnimatedRef(); 

    const accentCategory = useSharedValue(0);

    //const [listWidths, setListWidths] = useState([]);
    //const [listHeights, setListHeights] = useState([]);

    const listWidths = useRef([]);
    const stackWidths = useRef(new Array(allStructurParams.length));
    //const setStackWidths = (value) => {stackWidths.current = value}

    const listHeights = useRef([]);
    const stackHeights = useRef(new Array(allStructurParams.length));
    //const setStackHeights = (value) => {stackHeights.current  = value}

    const derivedValues = useSharedValue({
        listHeights: [],
        listWidths: [],
        shifts: [],
        intervals: [],
        limits: [],
        categorys: []
    })

    const countDerivedValues = ({listHeights: heights, listWidths: widths, headHeightTop: top}) =>{
        console.log('>>DERIVED_VALUES_UPD',)
        //const heights = [...listHeights.current] 
        //const widths = [...listWidths.current] 
        //headHeightTop.value

        const intervals = []//[{left: 0, right: 100}, ...]
        for(let i = 0; i < allStructurParams.length; i++){
            let right = -1;
            let left = -1;
            
            right += (headFullHeight+top) -selectorLineHeight//+headerStickysFullHeight
            
            if(allStructurParams[i].indexSection != 0){               
                right += allStructurParams[i].indexSection*(headerStickysFullHeight)
            }

            left += heights.reduce(((countValue, currentValue, index)=>(index <= (i>=1?i-1:0)? (countValue+currentValue) : countValue)), 0)
            right += heights.reduce(((countValue, currentValue, index)=>(index <= i? (countValue+currentValue) : countValue)), 0)
            //console.log('interval', i)
            const res = {
                left: left,
                right: right
            }
            intervals.push(res)
        }

    
        const shifts = []
        for(let param = 0; param <= allStructurParams.length; param++){
            const maxAccepIndex = widths.length-1;
            let centrallFront = 0;
            //left shift 
            const shift = widths.reduce(((countValue, currentValue, index)=>(index < param? (countValue+currentValue) : countValue)), 0)
            //shifts for position in center
            if(1 <= param && param <= maxAccepIndex-1){ 
                centrallFront = -((deviceWidth-widths[param])/2) //-Math.round((deviceWidth-listWidths[param])/2) 
            }
            let resOffset = centrallFront+shift
            if(resOffset < 0){resOffset = 0}
            shifts.push(resOffset)
        } 

        const lessCooef = 0.2
        const moreCooef = 1 - 0.4 //default 1-lessCooef
     
        const limList = []//[{less: 30, more: 70}, ...]
        for(let param = 0; param < allStructurParams.length; param++){
            const interval = heights.reduce(((countValue, currentValue, index)=>(index < param? (countValue+currentValue) : countValue)), 0)
            limList.push({
                less: lessCooef*heights[param]+interval, 
                more: moreCooef*heights[param]+interval
            })
        }

        const indexs = []
        for(let i=0; i<structureCustomizer.length; i++){
            indexs[i] = 0 + i>0? (indexs[i-1]+structureCustomizer[i-1].data.length) : 0
        }
        const categoryIntervals = []
        for(let i = 0; i<indexs.length ; i++){
            let value = (widths).reduce(((countValue, currentValue, index)=>(index < indexs[i]? (countValue+currentValue) : countValue)), 0)
            let center = deviceWidth/2 - (widths)[indexs[i]]/2
            center = (center >  value? 0 : center)
            categoryIntervals.push(value-center)      
        }

        //return 

        const res = {
            listHeights: heights,
            listWidths: widths,
            shifts: shifts,
            intervals: intervals,
            limits: limList,
            categorys: categoryIntervals
        }
        derivedValues.value = res
        
        return res
    }

    const animValueWidthLine = useSharedValue(0) //((Language.StructureScreen.params[allStructurParams[0].param]).length) * (staticStyles.frontFLText.fontSize * 0.75) + 10)
    //((Language.StructureScreen.params[allStructurParams[0].param]).length)*(staticStyles.frontFLText.fontSize * 0.75)+10
    const animValueMarginLeft = useSharedValue(0);
    const animValueTranslateX = useSharedValue(0);
    const animValueScrollXCategorys = useSharedValue(0);
    const animValueCategorysScrolling = useSharedValue(0);

    const animValueScrollY = useSharedValue(0)
    
    const topButtonVisible = useSharedValue(0)

    const logg = (info) =>{
        'worklet';
        console.log('lg_'+info)
    }

    const scrollHandlerFlatListParams = useAnimatedScrollHandler({
        onScroll: (e, ctx) => {
            animValueCategorysScrolling.value = 0;
            animValueTranslateX.value = -(e.contentOffset.x)            
        }
    })

    useDerivedValue(() => {
        const scroll = Math.abs(animValueTranslateX.value)
        if(animValueCategorysScrolling.value == 0){
            const categoryIntervals = derivedValues.value.categorys //countDerivedValues.categorys//
            //runOnJS(logg)(` ${(scroll)} bords ${categoryIntervals} ${indexs}`)
            let to = 0
            for(let i = 0; i<categoryIntervals.length ; i++){   
                if(scroll >= categoryIntervals[i]){
                    to = i
                }
            }
            scrollTo(
                flatCategorysListRef, //ref
                to*(deviceWidth), //x offset
                0, //y offset
                true //animate
            )
        } 
    }, [animValueTranslateX])

    const scrollHandlerFlatListCategorys = useAnimatedScrollHandler({
        onBeginDrag: (e) => {
            animValueCategorysScrolling.value = 1;
        },
        onEndDrag: (e) => {
            //runOnJS(logg)(`end ${e.contentOffset.x}`)
            animValueCategorysScrolling.value = 0;
        },
        onMomentumEnd: (e) => {
            //runOnJS(logg)(`momentum end ${e.contentOffset.x}`)
            animValueScrollXCategorys.value = (e.contentOffset.x)
            animValueCategorysScrolling.value = 0.5;
            
        },
        onScroll: (e, ctx) => {
            //animValueCategorysScrolling.value = true;
            animValueScrollXCategorys.value = (e.contentOffset.x)
        }
    })

    useDerivedValue(() => {
        const scroll = Math.abs(animValueScrollXCategorys.value)
        if(animValueCategorysScrolling.value >= 0.5){
            const categoryIntervals =  derivedValues.value.categorys //countDerivedValues.categorys 

            const yetIndex = Math.floor((scroll/(deviceWidth)))
            const yetScroll = yetIndex*(deviceWidth)
            const toIndex = Math.floor(( (Math.max((scroll-yetScroll),0) )/ (deviceWidth/2)))

            const fineIndex = Math.min(yetIndex+toIndex, (categoryIntervals.length-1))
            runOnJS(logg)(`index category ${yetIndex+toIndex}`)
            scrollTo(
                flatListRef, //ref
                categoryIntervals[fineIndex]+1, //x offset
                0, //y offset
                true //animate
            )
        }
        
    }, [animValueScrollXCategorys, animValueCategorysScrolling])
    
    const listPaddingLeft = 12
    const svgWidth = useSharedValue(0)
    const svgUP = useSharedValue(6)
    
    const animStyleIndicatorLine = useAnimatedStyle(() => {
        const duration = 450;
        const primaryXOffsetIndicator = listPaddingLeft - 6
        return {
            width: withTiming(animValueWidthLine.value, {duration: duration-20}),
            left: withTiming(primaryXOffsetIndicator+animValueMarginLeft.value, {duration: duration, easing: Easing.bezier(0.45, 0, 0.55, 1)}),
            transform: [
                {translateX: animValueTranslateX.value}
            ] 
        }
    })

    const lastCountAccent = useSharedValue({n: 0, o: -1})

    const pathSVG = useAnimatedProps(()=>{
        
        const UP = svgUP.value
        const WIDTH = svgWidth.value

        const HEIGHT = 7

        const d = `
                M 2            ${HEIGHT}
                C 2            ${HEIGHT} ${WIDTH*0.1} ${HEIGHT} ${WIDTH*0.25}  ${HEIGHT}
                C ${WIDTH*0.4} ${HEIGHT} ${WIDTH*0.5} ${UP}     ${WIDTH*0.5}   ${UP}
                C ${WIDTH*0.5} ${UP}     ${WIDTH*0.6} ${HEIGHT} ${WIDTH*0.75}  ${HEIGHT}
                C ${WIDTH*0.9} ${HEIGHT} ${WIDTH}     ${HEIGHT} ${WIDTH}       ${HEIGHT}
            `
        return ({
            d: d
        })
    })

    const contentContainerStylePaddingRight = useAnimatedProps(()=>{
        const widths = derivedValues.value.listWidths
        return (
            {
                contentContainerStyle: {
                    paddingRight: (deviceWidth/2) - (
                        (widths).length == allStructurParams.length? 
                            (widths[allStructurParams.length-1])/2 
                        :
                            ((Language.StructureScreen.params[allStructurParams[allStructurParams.length-1].param]).length*0.75*staticStyles.frontFLText.fontSize)/2
                        )
                }   
            }
        )
    }, [ Language])
    

    const scrollSectionsList = useAnimatedScrollHandler({
        onScroll: (event, ctx) => {
            //runOnJS(logg)(`|scroll|| ${event.contentOffset.y}`)
            let isUpScroll = false;
            let isEnd = false;
            let isStart = false;
            const hht = headHeightTop.value
            
            if(Math.abs(event.velocity.y).toFixed(4) != 0){
                isUpScroll = (event.velocity.y).toFixed(4) < 0.0001;
            }
            isEnd = (event.layoutMeasurement.height + event.contentOffset.y) >= (event.contentSize.height - 5);
            isStart = event.contentOffset.y > ((headFullHeight+hht)-itemCategoryHeight-selectorLineHeight-10);
            const visibleBobber = ((isUpScroll ) && isStart)

            cancelAnimation(reaValueBobberButtonVisible);
            reaValueBobberButtonVisible.value = visibleBobber? 0 : 1//bottomBord
            cancelAnimation(topButtonVisible);
            topButtonVisible.value = isEnd? 1 : 0

            const useScroll = -Math.max(event.contentOffset.y, 0)

            cancelAnimation(animValueScrollY);
            animValueScrollY.value = useScroll
            //headerStickysHeight+4 = 37 0=4 , 1.25 = 12.5
            const selectLine = Math.max((headFullHeight+hht -headerStickysHeight-12.5 + useScroll ), 0)
            //logg(`sc ${hht} ${selectLine}`)
            cancelAnimation(animSelectorLine);
            animSelectorLine.value = selectLine
            //runOnJS(logg)(`anim scrl ${selectLine}`)
            
        },
    }, [appStyle, headHeightTop]) //

    
    //useEffesct(()=>{countDerivedValues()})//appStyle.lists.proximity//Language, LanguageAppIndex, ,[appStyle]


    useDerivedValue(() => {
        const {
            listHeights: aListHeights, //
            listWidths: aListWidths,
            intervals,
            shifts,
            limits : limList
        } = derivedValues.value

        //logg(` derived, ${aListHeights}`)

        if(
            aListHeights.length == 0 ||
            aListWidths.length == 0 ||
            intervals.length == 0 ||
            shifts.length == 0 ||
            limList.length == 0  
        ){return}

        //logg('run')

        const yScroll = Math.abs(animValueScrollY.value)


        const countAccent = intervals.findIndex((el, index)=>(
            (el.left<=yScroll && yScroll<=el.right) || 
            (index == 0 && yScroll < el.left) || 
            (index == intervals.length-1 && yScroll > el.right) 
        ))


        let accentBarXScroll = Math.max((yScroll- ((headFullHeight+headHeightTop.value)-selectorLineHeight)), 0)
        //console.log(accentBarXScroll)
        //if(accentBarXScroll<0){accentBarXScroll = 0}

        let compens = 0
        const over = aListHeights.reduce(((countValue, currentValue, index)=>(index <= (countAccent-1)? (countValue+currentValue) : countValue)), 0)
        if(allStructurParams[countAccent].indexSection != 0){
            if(over < accentBarXScroll){
                compens =  accentBarXScroll-over
                let ignoreHeight = headerStickysFullHeight//-headerStickysFullHeight//+2*appStyle.lists.proximity

                if(compens > ignoreHeight){compens = ignoreHeight}

                accentBarXScroll -= compens
            }
        }
        

        // 0.5 free
        const getAction = (scrollX, paramIndex) => {
            //l - local
            const l_past = shifts[paramIndex-1]
            const l_current = shifts[paramIndex]
            const l_next = shifts[paramIndex+1]
            const l_newDistance = l_next-l_current
            const l_oldDistance = l_current-l_past
            let alignmentCoeff = 1
            let alignmentAction = 0

            if(scrollX != l_current && scrollX != l_next){
                alignmentCoeff = Math.abs((scrollX - l_current) / (l_next - scrollX))
            }
            alignmentAction = (scrollX-limList[paramIndex].more)*alignmentCoeff
            if(alignmentAction > l_newDistance){alignmentAction = l_newDistance}

            return alignmentAction
        }

        
        const past = shifts[countAccent-1]
        const current = shifts[countAccent]
        const next = shifts[countAccent+1]
        const newDistance = next-current
        const oldDistance = current-past
        let action = 0

        if(accentBarXScroll >= limList[countAccent].more){       
            action = getAction(accentBarXScroll, countAccent)

        } else if(accentBarXScroll <= limList[countAccent].less){      
            action = oldDistance - getAction(accentBarXScroll, (countAccent>=1? countAccent-1 : 0))
            action *= (-1)
        }
        //runOnJS(logg)(`lim l ${limList[countAccent].less} res ${accentBarXScroll} lim r ${limList[countAccent].more}`)
        accentBarXScroll = current + action
        //runOnJS(logg)(`cur act ${current} ${action}`)
       

        let width = aListWidths[countAccent]-10//Math.round(aListWidths[countAccent]-10);
        if(isNaN(width) || width  === undefined){
            const numberPrimelSymbols = (Language.StructureScreen.params[allStructurParams[0].param]).length;
            const widthSymbol = staticStyles.frontFLText.fontSize * 0.75;
            width = numberPrimelSymbols * widthSymbol + 10;
        }
        const left = aListWidths.reduce(((countValue, currentValue, index)=>(index < countAccent? (countValue+currentValue) : countValue)), 0);

        //runOnJS(logg)( `${ [animValueWidthLine.value, 6 + listPaddingLeft+animValueMarginLeft.value, animValueTranslateX.value]}`)

        cancelAnimation(animValueWidthLine);
        animValueWidthLine.value = width;

        cancelAnimation(animValueMarginLeft);
        animValueMarginLeft.value = left;

        cancelAnimation(accentCategory);
        accentCategory.value = allStructurParams[countAccent].indexSection

        //lastCountAccent.value = {n: countAccent, o:lastCountAccent.value.o}
        if(countAccent != lastCountAccent.value.o){
            cancelAnimation(lastCountAccent);
            lastCountAccent.value = {n: countAccent, o: countAccent}
            logg(`??, ${animValueWidthLine.value} , ${svgWidth.value}`)
            cancelAnimation(svgWidth);
            svgWidth.value = withTiming(Math.round(animValueWidthLine.value), {duration: 430})
            cancelAnimation(svgUP);
            svgUP.value = withSequence(withTiming(6, {duration: 180}), withDelay(90, withTiming(2, {duration: 180})))
        }

        //runOnJS(logg)(`^ ${accentBarXScroll}`)
        scrollTo(
            flatListRef, //ref
            accentBarXScroll, //x offset
            0, //y offset
            true //animate
        )
    })


    const selectParametr = (item, index, type) => {
        console.log('selectParam', item, index)
        let itemIndex = 0;
        let sectionIndex = 0;
        if(type == 'params'){
            itemIndex = item.indexInSection;
            sectionIndex = item.indexSection;
        } else {
            itemIndex = 0;
            sectionIndex = index;
        }
        
        
        sectListRef.current.scrollToLocation({
            itemIndex: itemIndex+1,
            sectionIndex: sectionIndex,
            animated: false,
            viewOffset: headerStickysHeight +appStyle.lists.proximity//1.5*appStyle.lists.proximity//30+appStyle.lists.proximity
            //viewPosition: 0
        })
    }


    const stacker = (index, stack, newValue, type = '?') => {
        //newValue = Math.round(newValue);

        /*
        if (stack.length >= allStructurParams.length){
            setStack([newValue]);
        } else {
            const newList = [...stack, newValue]
            setStack(newList); 
        } */

        stack.current[index] = newValue

        //console.log('st0', type, index+1, '//', stack.current.length, '|', allStructurParams.length)

        //const eqh = listHeights.map((item, index)=>item-derivedValues.value.value.listHeights[index])
        //const eqw = listWidths.map((item, index)=>item-derivedValues.value.value.listWidths[index])
        if(!stackHeights.current.includes(undefined) && !stackWidths.current.includes(undefined)){
            //console.log('st1', type, stack.current,)
            const heightsEqaul = (stackHeights.current.toString() === listHeights.current.toString())
            const heightsCountEqaul = (stackHeights.current.length === allStructurParams.length)

            const widthsEqaul = (stackWidths.current.toString() === listWidths.current.toString())
            const widthsCountEqaul = (stackWidths.current.length === allStructurParams.length)

            //console.log('stacker', (type, stack, setStack, newValue, allStructurParams.length))
            //console.log('')

            if((!heightsEqaul || !widthsEqaul) && ( heightsCountEqaul && widthsCountEqaul)){
                //console.log('lh',listHeights, listHeights.length)
                //console.log('lw',listWidths, listWidths.length)
                //countDerivedValues()
                const identity = (x) => x;
                const h = stackHeights.current.map(identity)
                const w = stackWidths.current.map(identity)
                listHeights.current=h
                listWidths.current=w
                console.log('stacker1', type, listHeights.current)
                //console.log('stacker2', type, listWidths.current)
                countDerivedValues({listHeights: listHeights.current, listWidths: listWidths.current, headHeightTop: headHeightTop.value})
                console.log('stacker ok')
                stackHeights.current = new Array(allStructurParams.length)
                stackWidths.current = new Array(allStructurParams.length)
                //countDerivedValues()
            }
        }        
    }

    const topReturn = () => {
        selectParametr(0, 0, '')
    }

    //category updater
    const categoryStyle = useAnimatedStyle(()=>{
        const duration = 250
        return {
            opacity: withSequence(withTiming(0*accentCategory.value, {duration: 0}), withTiming(1, {duration: duration})),
            transform: [
                {scale: withSequence(withTiming(0.9, {duration: 0}), withTiming(1, {duration: duration})),}
            ],
        }
    })
    const categoryText = useAnimatedProps(()=>{
        //console.log(Language.StructureScreen.typesSettings[`${structure[accentCategory.value].category}`].type)
        return {
            value: Language.StructureScreen.typesSettings[`${categorysCustomizer[accentCategory.value]}`].type,
            text: Language.StructureScreen.typesSettings[`${categorysCustomizer[accentCategory.value]}`].type,
        }
        //,[Language, LanguageAppIndex]
    })

    const dynamicStyleListItems = useAnimatedStyle(()=>{
        const duration = 300
        return {
            //borderRadius: withTiming(appStyle.borderRadius.basic, {duration: duration}),
            //marginHorizontal: withTiming((appStyle.lists.fullWidth? 0 : 10), {duration: duration}),
            marginVertical: withTiming(appStyle.lists.proximity, {duration: duration}),
        }
    })

    const dynamicStyleListItemsHeaders = useAnimatedStyle(()=>{
        const duration = 300
        return {
            paddingHorizontal:  withTiming((12 * appStyle.borderRadius.basic/20), {duration: duration}),
        }
    })


    const selectorLine = useAnimatedStyle(()=>{
        const duration = 300
        const bord = toolbarVisibleHeight-selectorLineHeightFull
        return {
            zIndex: animSelectorLine.value <= bord? 1 : 0,
            /* interpolate(
                animSelectorLine.value, 
                [bord, 0],
                [0, 1],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }  
            ), */
            transform: [
               {translateY: animSelectorLine.value}
            ]
        }
    }, [toolbarVisibleHeight, animSelectorLine ])

    const maskCategoryHeight = useAnimatedStyle(()=>{
        const duration = 300
        return {
            height: interpolate(
                animSelectorLine.value, 
                [headerHeight-statusBarHeight, 0],
                [0, selectorLineHeightFull],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }   
            ),
        }
    }, [animSelectorLine])

    const maskParamsHeight = useAnimatedStyle(()=>{
        const duration = 300
        return {
            height: interpolate(
                animSelectorLine.value,
                [selectorLineHeight/2-1, 0],
                [0, selectorLineHeight],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }   
            ),
        }
    }, [animSelectorLine])

    const maskIndicatorHeight = useAnimatedStyle(()=>{
        const duration = 300
        return {
            height: interpolate(
                animSelectorLine.value,
                [4.5, 0], // height/2
                [0, 9], // height 2.5
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }   
            ),
        }
    }, [animSelectorLine]) 

    const selectorLineColorHeight = useAnimatedStyle(()=>{
        const duration = 300
        return {
            height: interpolate(
                animSelectorLine.value, 
                [headerHeight-statusBarHeight, 0],
                [selectorLineHeightFull, 0],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }   
            ),
        }
    })

    const header = useAnimatedStyle(()=>{
        const duration = 300
        return {
            height: interpolate(
                animSelectorLine.value, 
                [headerHeight-statusBarHeight, 0],
                [headerHeight+topToolBar, headerHeight+topToolBar+selectorLineHeight],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }  
            ),   
        }
    }, [animSelectorLine])

    const category = useAnimatedStyle(()=>{
        const duration = 300

        const textSize = interpolate(
            animSelectorLine.value, 
            [headerHeight-statusBarHeight, 0], 
            [20, 18],
            //extrapolation
            {
                extrapolateLeft: Extrapolation.CLAMP,
                extrapolateRight: Extrapolation.CLAMP
            }    
        )

        return {
            //backgroundColor: 'red',
            paddingLeft: interpolate(
                //animSelectorLine.value+(appStyle.functionButton.position == 'top'? 37 : 0),
                animSelectorLine.value,
                [headerHeight-statusBarHeight, 0], 
                [0, deviceWidth/2-((Language.StructureScreen.typesSettings.appearance.type).length * 0.51 * textSize)],

                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }   
            ),
            
            opacity: interpolate(
                animSelectorLine.value, 
                [0.01, 0],
                [1, 0]  
            ),
        }
    },[Language, animSelectorLine])
    
    const categorysText = useAnimatedStyle(()=>{
        const duration = 300
        return {
            fontSize: interpolate(
                animSelectorLine.value, 
                [headerHeight-statusBarHeight, 0], 
                [20, 18],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }    
            ),
            letterSpacing: interpolate(
                animSelectorLine.value, 
                [headerHeight-statusBarHeight, 0], 
                [4, 0.5],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }    
            ),
            
        }
    }, [animSelectorLine])


    const type = useAnimatedStyle(()=>{
        const duration = 300
        return {
            opacity: interpolate(
                animSelectorLine.value, 
                [0.01, 0],
                [0, 1]  
            ),
        }
    }, [animSelectorLine])

    const appStick = useAnimatedStyle(()=>{
        const duration = 300
        return {
            opacity: interpolate(
                animSelectorLine.value, 
                [(headerHeight)/2, 0],
                [1, 0]  
            ),
        }
    }, [animSelectorLine])    

    const scrollTopButton = useAnimatedStyle(()=>{
        return {
            transform: [
                {translateY: withTiming(topButtonVisible.value == 0? 0 : -(bottomBord), {duration: 400})}
            ]
        }
    })
    
    const sectionExtractor = (item, index) => item.param

    const RENDER_REDACTROS_HEADERS = ({section: {category, indexSection: index}})=>{ 
        if(index==0){return null}
        return (
            <REDACTROR_HEADER 
                key={String(category)} 
                keyID={String(category)} 

                title={Language.StructureScreen.typesSettings[`${category}`].category}
                index={index}
                type={'h1'}
            />
        )
    }
    
    const REDACTROR_HEADER = memo(({keyID = 'stick_header', title, index = 'index', type = 'h1'})=>{
        console.log('stick', type, index)
        return (
            <View
                key={keyID} 
                style={{
                    height: headerStickysHeight,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text 
                    style = {[{
                        color: type == 'h1'? Theme.texts.accents.primary : Theme.texts.neutrals.tertiary,
                        fontSize: 20,
                        fontWeight: '500',
                        letterSpacing: 4,
                        fontVariant: ['small-caps'],
                    }]}
                >
                    {title}
                </Text>
            </View> 
        )
    })

    const RENDER_REDACTORS_ITEM = useCallback(({item, index, type='c'})=>{
        let startIndexSect = 0
        for(let i = 0; i < item.indexSection; i ++){
            startIndexSect += structureCustomizer[i].data.length
        }
        const globalIndex = startIndexSect+index
        //console.log('RENDER SETTINGS ITEM', index, globalIndex, item.indexSection, type,)
        const RedactorComponent = item.paramRedactorComponent;
        const redactorName = Language.StructureScreen.params[item.param]
        const icon = (item.icon != null? item.icon : "border-none-variant");
        return (
            <View
                key={String(item.param)}
                onLayout={(event)=>{         
                    if(item.fromCustom){stacker(globalIndex, stackHeights , event.nativeEvent.layout.height, 'h')}
                }}
            >
                {item.subTitle && 
                <REDACTROR_HEADER 
                    title = {Language.StructureScreen.subCategorys[item.subCategory]}
                    type = {'h2'}
                />}
                <REDACTOR_ITEM
                    item = {item}
                    index={index}
                    globalIndex={globalIndex}
                    type={type}
                    redactorName={redactorName}
                    icon = {icon}
                >
                    {RedactorComponent != null &&
                    <RedactorComponent
                        //for themes redactor
                        goToPalleteScreen = {goToPalleteScreen}
                        goToNFC={goToNFC}

                        appStyle={appStyle}
                        appConfig={appConfig}

                        r_setAppStyle={r_setAppStyle}
                        r_setAppConfig={r_setAppConfig}

                        previewAppStyleA={previewAppStyleA}

                        ThemeColorsAppIndex={ThemeColorsAppIndex}
                        ThemeSchema={ThemeSchema}
                        LanguageAppIndex={LanguageAppIndex}
                    />}  
                </REDACTOR_ITEM>
            </View>
        )
    })

    const REDACTOR_ITEM = (props)=> {
        const {
            item, 
            index,
            globalIndex,
            redactorName,
            icon,
            type,
            children,
        } = props
        console.log('RENDER SETTINGS ITEMS', index, globalIndex, type,)
        //console.log(props)
        return (
            <Reanimated.View style={dynamicStyleListItems}>
                {true && 
                <SkiaViewDisign 
                    borderRadius = {appStyle.borderRadius.basic}
                    backgroundColor = {Theme.basics.neutrals.secondary}
                    shadowColors = {Theme.specials.shadow}
                    shadowMargin={{horizontal: appStyle.lists.fullWidth? 0 : horizontalProximity, vertical: appStyle.lists.proximity}}
                    shadowStyle = {appStyle.effects.shadows}
                    adaptiveSizeForStyle={false}
                    innerShadow={{
                        used: true,
                        borderWidth: 2
                    }}
                />}
                <View style={[ staticStyles.SLArea, {width: deviceWidth, minHeight: item.fromCustom? 200 : 70,}]}>                
                    <Reanimated.View
                        style={[ dynamicStyleListItemsHeaders, { 
                            flexDirection: 'row', 
                            width: '100%',
                            height: 26,
                            marginLeft: 8,
                            alignItems: 'center',
                        }]}
                    >
                        <MaterialCommunityIcons name={icon} size={20} color={Theme.texts.neutrals.secondary} />
                        <Text style={[staticStyles.SLParamHeaderText, {color: Theme.texts.neutrals.secondary}]}>{redactorName? redactorName : item.param}</Text>
                    </Reanimated.View>
                    {children}       
                </View>
            </Reanimated.View>
        )
    }

    const redactorEqual = (oldProps, newProps) => {
        console.log(oldProps)
        return true
    }

    const RENDER_PARAMS_ITEMS = ({item, index})=> {
        console.log('RENDER SETTINGS PARAMS', index)
        return (
        <Pressable
            key={String(item+index)}
            style={[staticStyles.frontFLArea]}
            onPress={()=>{selectParametr(item, index, "params")}}
            onLayout={(event)=>{stacker(index, stackWidths , (event.nativeEvent.layout.width+2*staticStyles.frontFLArea.marginHorizontal), 'w')}}
        >   
            <View
                style={[staticStyles.frontFLPressable,{
                    backgroundColor: 'transparent',
                    height: selectorLineHeight, 
                }]}
            >
                <Text style={[staticStyles.frontFLText, {color: 'transparent'}]}>
                    {Language.StructureScreen.params[item.param]}
                </Text>
            </View>

            <MaskedView
                androidRenderingMode = {'software'}
                style={{
                    width: '100%',
                    position: 'absolute', 
                    height: selectorLineHeight,
                    justifyContent: 'flex-start', 
                    backgroundColor: Theme.texts.accents.tertiary
                }}
                maskElement={
            <View
                style={[staticStyles.frontFLPressable,{
                    backgroundColor: 'transparent',
                    height: selectorLineHeight, 
                }]}
            >
                <Text style={[staticStyles.frontFLText]}>
                    {Language.StructureScreen.params[item.param]}
                </Text>
            </View>}>
            {/* COLOR*/}
            <Reanimated.View style={[maskParamsHeight, {width: '100%', backgroundColor: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary}]}/>  
            </MaskedView>
        </Pressable>
        )
    }



    // GENERAL RENDER
    return(<View style={{backgroundColor: Theme.basics.neutrals.primary,}}>
        {console.log('########## BASE LIST GENERAL RENDER')}
        {/*HEADER PANEL*/}
        <Reanimated.View
            style={[
                staticStyles.FlatListsArea,              
                {   
                    top: 0,
                    zIndex: 1,
                    position: 'absolute',
                    borderColor: appStyle.effects.blur? 'transparent' : `${Theme.specials.separator}25`,
                    borderBottomWidth: 0.4                    
                },
                appStyle.effects.blur? {} : {
                    backgroundColor: appStyle.lists.invertColorsHeader? Theme.basics.neutrals.secondary : Theme.basics.accents.primary,
                },
                header
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
        
        {/*HEADER SUBTITLE*/}
        <View 
            style = {[staticStyles.SLtopBord,{ 
                alignItems: 'center',
                marginTop: statusBarHeight,
                position: 'absolute',
                height: itemCategoryHeight,
                //right:  appStyle.functionButton.position =='top'? 37 : 0,
                right: 0,
                zIndex: 1,
                justifyContent: 'center',
                //backgroundColor: 'red'
                
            }]}
        >
            <Reanimated.View
                style = {[staticStyles.SLtopBord, type, {}]}
            >
                <ReanimatedTextInput     
                    editable = {false}
                    style = {[staticStyles.AnimatedHeaderText, categoryStyle, {color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary}]}
                    animatedProps={categoryText}
                />
            </Reanimated.View>
            <Reanimated.View
                style = {[staticStyles.SLtopBord, appStick, { 
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    position: 'absolute',
                    height: '100%',
                    right: 0,
                }]}
            >
                <Text style = {[staticStyles.AnimatedHeaderText, {color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary}]}>
                    {Language.app}
                </Text>
            </Reanimated.View>
        </View>

        {/*HEADER TOOLBAR*/}
        <View 
            style = {[{ 
                marginTop: statusBarHeight,
                position: 'absolute',
                height: itemCategoryHeight,
                width: deviceWidth,
                left: 0,
                zIndex: 3,
                //backgroundColor: 'red',
                paddingHorizontal: 12,
                paddingTop: 4,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }]}
        >
            <BasePressable 
                type="i"
                /* 
                text={(appStyle.functionButton.position == 'top' && appStyle.functionButton.topSignatures)? Language.toolbar.back : ''}
                textStyle={[staticStyles.AnimatedHeaderText,{
                    fontSize: 11,
                    color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary,  
                }]}
                */
                icon={{name: appStyle.navigationMenu.type == 'not'? "backburger":'chevron-left', 
                size: appStyle.navigationMenu.type == 'not'? 28 : 32, 
                color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary}}
                style={{
                    height: itemCategoryHeight,
                    width: itemCategoryHeight,
                    //paddingHorizontal: 4,
                    //paddingLeft: 6,
                    //backgroundColor: 'blue',
                    borderRadius: appStyle.borderRadius.additional
                }}
                direction='row-reverse'
                onPress={backBurgerPress}
                android_ripple={appStyle.effects.ripple == 'all'? ripple(appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary) : false}
            />

            {appStyle.functionButton.position == 'top' && 
                <BasePressable 
                    type="i"
                    /*
                    text={(appStyle.functionButton.topSignatures)? Language.toolbar.apply : ''}
                    textStyle={[staticStyles.AnimatedHeaderText,{
                        fontSize: 11,
                        color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary,  
                    }]}
                     */
                    icon={{name: "cellphone-check", size: 24, color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary}}
                    style={{
                        height: itemCategoryHeight,
                        width: itemCategoryHeight,
                        marginLeft: 2, 
                        //paddingHorizontal: 4,
                        //backgroundColor: 'blue',
                        borderRadius: appStyle.borderRadius.additional
                    }}
                    direction='row-reverse'
                    onPress={showPress}
                    onLongPress={applyPress}
                    android_ripple={appStyle.effects.ripple == 'all'? ripple(appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary) : false}
                />
            }
        </View>

        {/*HEADER TITLE*/}
        <View 
            style = {[staticStyles.SLtopBord,{ 
                marginTop: statusBarHeight,
                position: 'absolute',
                height: itemCategoryHeight,
                //left: appStyle.functionButton.position =='top'? -35 : 0,
                left: 0,
                zIndex: 2,
                justifyContent: 'center',
                alignItems: 'flex-end',
            }]}
        >
            <Text style = {[staticStyles.AnimatedHeaderText, {color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary}]}>
                {Language.HeaderTitle}
            </Text>
        </View>

        {/*HEADER FREE SELECTOR*/}
        <Reanimated.View
            style = {[selectorLine, {
                height: selectorLineHeightFull,
                width: '100%',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                position: 'absolute',
                top: statusBarHeight+topToolBar,
                //backgroundColor: 'red'
                //zIndex: 1,
            }]}
        >
            {/*HEADER CATEGORYS*/}
            <ReanimatedFlatList
                ref={flatCategorysListRef}
                onScroll={scrollHandlerFlatListCategorys}
                //decelerationRate={'fast'}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{height: itemCategoryHeight, width: deviceWidth}}
                snapToInterval={deviceWidth}
                getItemLayout={(data, index) => (
                    {length: deviceWidth, offset: deviceWidth * index, index: index}
                )}
                data={categorysCustomizer}
                keyExtractor={item => item}
                renderItem={({item, index})=> {
                    return (
                        <Pressable
                            key={String(item+index)}
                            onPress={()=>{selectParametr(item, index, 'categorys')}}
                            style={{
                                width: deviceWidth, 
                                height: itemCategoryHeight,
                            }}
                        >
                            <MaskedView
                                androidRenderingMode = {'software'}
                                style={{
                                    flex: 1,
                                    //width: deviceWidth/2, 
                                    //height: itemCategoryHeight,
                                    justifyContent: 'flex-start', 
                                    backgroundColor: Theme.texts.accents.primary
                                }}
                                maskElement={
                            <Reanimated.View
                                style={[category,{
                                    // Transparent background because mask is based off alpha channel.
                                    backgroundColor: 'transparent',
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center' 
                                }]}                   
                            >
                                <Reanimated.Text 
                                    style={[categorysText, {
                                        fontSize: 20, // 18
                                        fontWeight: '500', // '500'
                                        letterSpacing: 4, // 0.5
                                        fontVariant: ['small-caps'],
                                    }]}
                                >
                                    {Language.StructureScreen.typesSettings[item].category}
                                </Reanimated.Text>
                            </Reanimated.View>}>
                            {/* COLOR*/}
                            <Reanimated.View style={[maskCategoryHeight,{width: '100%', backgroundColor: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary}]}/>  
                            </MaskedView>
                        </Pressable>
                    )
                }}
            />
 


            {/*HEADER PARAMS*/}
            <Reanimated.View
                style={[{
                    height: selectorLineHeight,
                    zIndex: 5
                }]}
            >
                <MaskedView
                    androidRenderingMode = {'software'}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        width: deviceWidth, 
                        height: 9, //2.5,
                        justifyContent: 'flex-start', 
                        backgroundColor: 'transparent'
                    }}
                    maskElement={
                        <Reanimated.View 
                            style={[animStyleIndicatorLine, { 
                                //backgroundColor: 'black',
                                position: 'absolute',
                                height: 9,//2.5,
                                bottom: -1.85,
                            }]}  
                        >
                            <Svg                                                     
                                width="100%"                   
                                //viewBox={`0 0 ${100} 5`}
                                //animatedProps={widthSVG}
                                height="100%" 
                                fill='black'
                                
                            >
                                <ReanimatedPath
                                    animatedProps={pathSVG}
                                    stroke="black"
                                    strokeWidth={4}
                                />
                            </Svg>
                        </Reanimated.View>
                    }
                >   
                    {/* COLOR*/}
                    <Reanimated.View style={[maskIndicatorHeight,{width: '100%', backgroundColor: appStyle.lists.invertColorsHeader? Theme.basics.accents.primary : Theme.basics.accents.quaternary}]}/>  
                </MaskedView>
                
                <ReanimatedFlatList
                    ref={flatListRef}
                    initialNumToRender={15}
                    style={{height: selectorLineHeight}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    onScroll={scrollHandlerFlatListParams}
                    data={allStructurParams}
                    keyExtractor={item => item.param}
                    contentContainerStyle={{// 100//
                        paddingLeft: listPaddingLeft,
                    }}
                    animatedProps={contentContainerStylePaddingRight}
                    renderItem={RENDER_PARAMS_ITEMS}
                />
            </Reanimated.View>
        </Reanimated.View>


        {/*BODY*/}
        <ReanimatedSectionList
            ref={sectListRef}
            initialNumToRender={18}
            maxToRenderPerBatch={18}
            //updateCellsBatchingPeriod={100}
            removeClippedSubviews={false}
            //contentOffset={{x: 0, y: (headHeightTop.value)}}
            //animatedProps={contentOffset}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            onScroll={scrollSectionsList}
            sections={structureCustomizer}
            keyExtractor={sectionExtractor}
            style={{
                paddingTop: headerHeight+topToolBar,
            }}
            ListHeaderComponent={
                <View
                    style={{
                        //height: headHeight,
                        //maxHeight: headHeight,
                        width: '100%',
                        backgroundColor: 'transparent',// Theme.basics.neutrals.primary,
                        marginBottom: selectorLineHeightFull
                    }}
                    
                    onLayout={(event)=>{
                        const height = event.nativeEvent.layout.height
                        //console.log('APP_SETTING_PART_HEIGHT_'+height)
                        if(height != headHeightTop.value){
                            headHeightTop.value = height
                            console.log('opt !!!!!!!!!!!!!!!!!  settings, HeadHeightTop UPD', height)
                            //setHeadHeightTop(height)
                        }
                        
                    }}
                >   
                    {console.log('render sect system')}
                    {STRUCTURE.settingsData.map((item, index)=>{return(RENDER_REDACTORS_ITEM({item, index, type: 's'}))})}               
                </View> 
            }
            renderSectionHeader={RENDER_REDACTROS_HEADERS}
            renderItem={RENDER_REDACTORS_ITEM}
            ListFooterComponent = {
                <View 
                    style={{
                        height: deviceHeight -200 - headerStickysHeight - 2*appStyle.lists.proximity, //-headerHeight-selectorLineHeight
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                />
            } 
        />
        <Reanimated.View
            style={[scrollTopButton, {
                position: 'absolute',
                height: 44,
                width: 44,
                bottom: -44,
                left: (deviceWidth-44)/2,
                //backgroundColor: 'black'
            }]}
        >    
            <BasePressable 
                type={'i'}
                style={{height: 40}}
                icon={{name: 'format-align-top', size: 40, color: Theme.icons.neutrals.tertiary}}
                onPress={topReturn}
            />
        </Reanimated.View>
    </View>)


})

function areEqual(prevProps, nextProps) {
    console.log('eq base list')
    return isEqual(prevProps, nextProps);
}

const staticStyles = StyleSheet.create({
    FlatListsArea: {
        //position: 'absolute',
        //top: 60,
        width: deviceWidth,

    },
    frontFL: {
        height: 35
    },
    frontFLArea: {
        marginHorizontal: 5,
        marginTop: 1,
        borderRadius: 20,
    },
    frontFLPressable: {
        marginHorizontal: 5, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    frontFLText: {
        fontSize: 15,
        //opacity: .9,
        fontWeight: '500',
        fontVariant: ['small-caps'],
        //color:  'white'//ThemesColorsAppList[0].skyUpUpUp//
    },
    frontFLLine: {
        width: "100%",
        height: 4,
        borderRadius: 5,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0 
    },

    SLtopBord: {
        //position: 'absolute',
        //zIndex: 11,
        //height: 30,
        //top: 30.25,
        //right: 0,
        //backgroundColor: 'red',
        paddingHorizontal: 3,
        //paddingLeft: 5,
        width: deviceWidth/2
    },
    shadow: {
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4
    },
    SLArea: {
        //backgroundColor: 'white',
        minHeight: 70, 
        paddingHorizontal: 10,
        //justifyContent: 'space-around',
        //alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 15,
        //paddingBottom: 20
    },
    SLParamHeaderText: {
        marginLeft: 5,
        fontSize: 18,
        //position: 'absolute',
        fontWeight: '500',
        letterSpacing: 1.8,
        fontVariant: ['small-caps'],
    },
    SLHeaderArea:{
        justifyContent:'flex-end',
        alignItems: 'flex-start',
        flexDirection: 'row',        
        height: 46
    },
    SLHeaderHalfArea:{
        width: deviceWidth/2 + 40,
        height: 46
    },
    AnimatedHeaderText: {
        fontSize: 18,
        fontWeight: '500',
        //fontStyle: 'italic',
        //color: 'white',
        //opacity: .90,
        //textShadowRadius: 0.5,
        //textShadowColor: 'black',
        letterSpacing: 0.5,
        fontVariant: ['small-caps'],
    }

});