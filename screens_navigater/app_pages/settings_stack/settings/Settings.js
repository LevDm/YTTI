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

import useSizes from "../../../../app_hooks/useSizes";

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
    interpolate,
    Easing,
    Extrapolation,
    FadeIn,
    FadeOut,
    useAnimatedReaction,
    createAnimatedPropAdapter
} from 'react-native-reanimated';

import { Svg, Path } from "react-native-svg";

const ReanimatedPath = Reanimated.createAnimatedComponent(Path);
const ReanimatedSVG = Reanimated.createAnimatedComponent(Svg);

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import store from "../../../../app_redux_files/store";
import {connect, useSelector} from 'react-redux';
import mapStateToProps from "../../../../app_redux_files/stateToProps";
import mapDispatchToProps from "../../../../app_redux_files/dispatchToProps";

import LanguageRedactor from "./redactors_settings/system/LanguageRedactor";
import UserRedactor from "./redactors_settings/system/UserRedactor";

import PresetsSelector from "./redactors_settings/interface/PresetsSelector";
import BorderRadiusRedactor from "./redactors_settings/interface/BorderRadiusRedactor";
import ThemeRedacor from "./redactors_settings/interface/themeRedactor/ThemeRedactor";
import EffectsRedactor from "./redactors_settings/interface/EffectsRedactor";

import SelectorsRedactor from "./redactors_settings/interface/SelectorsRedactor";
import ListsRedactor from "./redactors_settings/interface/ListsRedactor";
import FunctionButtonRedactor from "./redactors_settings/interface/FunctionButtonRedactor";
import ModalsRedactor from "./redactors_settings/interface/ModalsRedactor";
import NavigateMenuRedactor from "./redactors_settings/interface/NavigateMenuRedactor";

import AppFunctionsRedactor from "./redactors_settings/functions/AppFunctionsRedactor";
import WeatherRedactor from "./redactors_settings/functions/WeatherRedactor";

import Info from "./redactors_settings/ohter/Ohter";



const ReanimatedFlatList = Reanimated.createAnimatedComponent(FlatList);
const ReanimatedSectionList = Reanimated.createAnimatedComponent(SectionList);
const ReanimatedTextInput = Reanimated.createAnimatedComponent(TextInput);
const ReanimatedIcon = Reanimated.createAnimatedComponent(MaterialCommunityIcons);

const ripple = (color) => ({
    color: `${color}20`,
    borderless: true,
    foreground: false
})


const STRUCTURE = {
    customizer: [
        {   
            //indexSection: 2,
            category: "additional",
            data: [
                {
                    param:"ohters",
                    icon:  "information",
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
                            icon:  "cloud-search",//"weather-cloudy-clock",
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


const ITEM_HEIGHT = 38

const COUNT_PARAMS = 5

const TRANSITION_DURATION = 300
    
const buttonSize = 50

import {
    PanGestureHandler,
} from 'react-native-gesture-handler';

const TextInputAdapter = createAnimatedPropAdapter(
    (props) => {
      'worklet';
      const keys = Object.keys(props);
      if (keys.includes('value')) {
        props.text = props.value;
        delete props.value;
      }
    },
    ['text']
);

import useLanguage from "../../../../app_hooks/useLanguage";
import useTheme from "../../../../app_hooks/useTheme";

const isEqual = (item_1, item_2) => JSON.stringify(item_1) == JSON.stringify(item_2)

const Settings = memo((props)=>{
    const {
        windowState,
        closeWindow,

        tagStyle,

        uiStyle, 
        uiTheme,
        uiComposition,

        uiPalette,
        uiScheme, 
   
        showAllSettings,

        updateFullStyle,
        updateFullTheme,


        r_uiStyle,
        r_uiPalette,
        r_uiComposition,
        //userData,

        r_setUiStyle,
        r_setUiComposition,
        r_setUiPalette,
        r_setAppLanguage,
        r_setUserData,
    } = props

    const Theme = useTheme(uiScheme.value)

    const initIndex = 2

    const aListsState = useSharedValue(({n: initIndex, o: initIndex-1}))

    const aScaleState = useSharedValue(0)

    const paramsRef = useAnimatedRef(); 
    const redactorsRef = useAnimatedRef();

    const svgUP = useSharedValue(1) // 
    const indicatorMargin = useSharedValue(initIndex*ITEM_HEIGHT)
    
    const [visible, setVisible] = useState(false)


    const {height: deviceHeight, width: deviceWidth, osHeights: {navigationBar}} = useSizes()
    const HEADER_PANEL_SIZE = {
        h: ITEM_HEIGHT*COUNT_PARAMS + 70 + 60,//- OS_NAVIGATION_BAR_HEIGHT, //(deviceHeight/2)+OS_NAVIGATION_BAR_HEIGHT-(2*FRAME_PREVIEW), 
        h2: 2*(ITEM_HEIGHT*COUNT_PARAMS + 70 + 60)+30,
        w: (deviceWidth/2)+8, 
        w2: 60
    }
    const HADLE_AREA_SIZE = {h: 18, w: deviceWidth}
    const REDACTORS_SIZE = {
        h: HEADER_PANEL_SIZE.h -2*HADLE_AREA_SIZE.h, 
        w: deviceWidth-HEADER_PANEL_SIZE.w2,
        ih: HEADER_PANEL_SIZE.h +navigationBar -2*HADLE_AREA_SIZE.h
    }


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

            windowState.value = {...windowState.value, page: index}
        }
    }

    const openRedactor = (index = 0) => {
        redactorsRef.current?.scrollToOffset({
            offset: REDACTORS_SIZE.w*index,
            animated: false
        }) 
        settingIndex(index)
    }


    const closeMenu = () =>{
        'worklet'; 
        if(aScaleState.value == 0){
            cancelAnimation(aScaleState)
            aScaleState.value = 1
        }
    }

    const openMenu = ()=>{
        cancelAnimation(aScaleState)
        aScaleState.value = (aScaleState.value == 0? 1 : 0)
        //test.value = test.value == 0? 1 : 0
    }


    const expand = useSharedValue(0)
    const expandStyle = useAnimatedStyle(()=>{
        const h1 = HEADER_PANEL_SIZE.h//+2*HADLE_AREA_SIZE.h
        const h2 = HEADER_PANEL_SIZE.h2//+2*HADLE_AREA_SIZE.h //- 60
        return {
            height: withTiming(interpolate(
                expand.value,
                [0, 1],
                [h1, h2]
            ))
        }
    })

    const windowChangeExpand = (isExpand) => {
        const newState = isExpand?? expand.value == 0
        closeMenu()
        cancelAnimation(expand)
        expand.value = (newState? 1 : 0)
    }

    const iconExpand = useAnimatedStyle(()=>{
        return {
            opacity: withTiming(interpolate(expand.value, [0, 1], [0, 1]), {duration: MENU_TRANSFORM_DURATION})
        }
    })

    const iconCollapse = useAnimatedStyle(()=>{
        return {
            opacity: withTiming(interpolate(expand.value, [0, 1], [1, 0]), {duration: MENU_TRANSFORM_DURATION})
        }
    })

    

    const dragParams = useSharedValue({x: 0, y: -navigationBar})

    const settingDragParams = (newValue) => {
        "worklet";
        dragParams.value = {
            x: Math.min(Math.max( (dragParams.value.x + newValue.x) ,0 ),0 ), //+(statusBarHeight)-OS_NAVIGATION_BAR_HEIGHT +(expand.value == 1? HEADER_PANEL_SIZE.h-60 : 0)
            y: Math.min(Math.max( (dragParams.value.y + newValue.y) , (HEADER_PANEL_SIZE.h +(expand.value == 1? HEADER_PANEL_SIZE.h-60 : 0) -deviceHeight)), 0), //HADLE_AREA_SIZE.h
        } 
    }

    const dragStyle = useAnimatedStyle(()=>{
        return {
            transform: [
                {translateY: dragParams.value.y}
            ]
        }
    })

    

    const openWindowSettings = (pageIndex ) => {
        'worklet';
        runOnJS(openRedactor)(pageIndex)
        runOnJS(setVisible)(true)
    }

    const closeWindowSettings = () => {
        'worklet'
        runOnJS(setVisible)(false)
    }

   
    useAnimatedReaction(
        ()=>windowState.value.visible == 1,
        (newValue, oldValue)=>{ 
            if(newValue != oldValue){
                if(newValue){
                    const openPage = windowState.value.page?? 2
                    openWindowSettings(openPage)
                } else {
                    closeWindowSettings()
                }
            }
        }
    )
    
    const closePress =()=>{
        //applyAppStyle()
        //changeHideWindow('show')
        closeWindow()
    }

    const changeHideWindow = (command) => {
        let changeVisible = (Math.abs(dragParams.value.y) >= deviceHeight? 1 : -1) 
        //  1 >> hide
        // -1 >> show
        if(command == 'show'){
            changeVisible = changeVisible > 0? 0 : -1
        }
        if(command == 'hide'){
            changeVisible =  changeVisible < 0? 0 : 1
        }
        console.log('changeHideWindow', changeVisible)
        const newYPosition = dragParams.value.y + deviceHeight*changeVisible
        dragParams.value = {...dragParams.value, y: newYPosition}
    }


    console.log("window settings")
    if(!visible){return null}
    return (
        <Reanimated.View
            entering={FadeIn} 
            exiting={FadeOut}
            style={[dragStyle, expandStyle, {
                position: 'absolute',
                overflow: 'hidden',
                backgroundColor: Theme.basics.neutrals.quaternary,//`${Theme.basics.neutrals.quaternary}80`,
                //height: HEADER_PANEL_SIZE.h+2*HADLE_AREA_SIZE.h,
                width: deviceWidth,
                borderRadius: HADLE_AREA_SIZE.h,
                bottom: navigationBar,
                borderWidth: 0.5, 
                borderColor: `${Theme.specials.separator}20`,
            }]}
        >
            <Reanimated.View
                style={[ { //textHide,
                    zIndex: 4,
                    width: 60,
                    height: 60,
                    position: 'absolute',
                    left: 0,
                    top: 0
                    //backgroundColor: 'red'
                }]}
            >
                <Pressable
                    style={{
                        width: buttonSize,
                        height: buttonSize,
                        margin: 5,
                        borderRadius: r_uiStyle.borderRadius.secondary,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    android_ripple={ripple(Theme.texts.neutrals.primary)}
                    onPress = {closePress}
                >
                    <Text style={{color: Theme.icons.neutrals.primary}}>
                        <MaterialCommunityIcons name="window-close" size={30}/>
                    </Text>
                </Pressable>
            </Reanimated.View>
            <View
                style={{
                    position: 'absolute',
                    zIndex: 1,
                    left: 0,
                    bottom: 0,
                    height: '100%',
                    width: HEADER_PANEL_SIZE.w2,
                    backgroundColor: Theme.basics.accents.secondary,
                    justifyContent: 'flex-end',
                    borderRightWidth: 0.75,
                    borderColor: `${Theme.specials.separator}20`,
                }}
            >
                <View
                    style={{ 
                        width: buttonSize,
                        height: buttonSize,
                        margin: 5,
                        borderRadius: r_uiStyle.borderRadius.secondary,
                        backgroundColor: 'transparent',
                    }}
                >
                <Pressable
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    android_ripple={ripple(Theme.texts.neutrals.primary)}
                    onPress = {()=>{windowChangeExpand()}}
                >
                    <ReanimatedIcon
                        style={[iconCollapse, {position: 'absolute'}]}
                        name={"chevron-down"}
                        size={30}
                        color={Theme.texts.neutrals.primary}
                    />
                    <ReanimatedIcon
                        style={[iconExpand, {position: 'absolute'}]}
                        name={"chevron-up"}
                        size={30}
                        color={Theme.texts.neutrals.primary}
                    />
                </Pressable>
                </View>
            </View>

            <HeaderPanel 
                listRef={paramsRef}

                aListsState={aListsState}
                svgUP={svgUP}
                indicatorMargin={indicatorMargin}
                aScaleState={aScaleState}

                closeMenu={closeMenu}
                openMenu={openMenu}
                openRedactor={openRedactor}
                //backScreen={backBurgerPress}
                applyNewStyle={closePress}

                Theme = {Theme}

                //appLanguage = {appLanguage}
                r_uiStyle={r_uiStyle}
                r_uiComposition={r_uiComposition}
                r_uiPalette={r_uiPalette}
                //userData = {userData}
            />

            <View
                style={{
                    flex: 1,
                    marginLeft: HEADER_PANEL_SIZE.w2-0.25,
                }}
            >
                <DragHandle 
                    settingDragParams={settingDragParams}
                    Theme = {Theme}
                />
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <Redactors 
                        listRef={redactorsRef}
                        initIndex = {windowState.value.page}
                        setIndex={settingIndex}
                        closeMenu={closeMenu}
                        windowChangeExpand={windowChangeExpand}
                        Theme = {Theme}
                        changeHideWindow={changeHideWindow}
                        {...props}

                        aPalette = {uiPalette}
                    />
                </View>
                <DragHandle 
                    settingDragParams={settingDragParams}
                    Theme = {Theme}
                />
            </View>
        </Reanimated.View>
    )  
},
    (prev, next)=>{ 
        const isEqual = (item_1, item_2) => JSON.stringify(item_1) == JSON.stringify(item_2)
        const isEqualProps =( 
            isEqual(prev.r_uiComposition, next.r_uiComposition) 
            && isEqual(prev.r_uiPalette, next.r_uiPalette)
            && isEqual(prev.r_uiStyle, next.r_uiStyle)
        )
        console.log('window settings memo', isEqualProps)
        return isEqualProps
    }
)
export default connect(mapStateToProps('UI_SETTINGS'), mapDispatchToProps('SETTINGS'))(Settings);



const DragHandle = (props) =>{
    const {
        settingDragParams,
        Theme
    } = props

    const panGestureEvent = useAnimatedGestureHandler({
        onActive: (event, context) => {
            settingDragParams({
                x: event.x,
                y: event.y
            })
        },
    })

    const {height: deviceHeight, width: deviceWidth, osHeights: {navigationBar}} = useSizes()
    const HADLE_AREA_SIZE = {h: 18, w: deviceWidth}

    return (
        <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Reanimated.View
            style={{
                height: HADLE_AREA_SIZE.h,
                width: '100%',//HADLE_AREA_SIZE.w,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopWidth: 0.5,
                borderBottomWidth: 0.5,
                borderColor: `${Theme.specials.separator}20`,
                //backgroundColor: 'red'
            }}
        >
            <Reanimated.View 
                style = {[{
                    height: 4,
                    width: HADLE_AREA_SIZE.w * 0.28,
                    position: 'absolute',
                    borderRadius: 4,
                    backgroundColor: `${Theme.icons.accents.primary}40`
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

        aListsState,

        svgUP,
        indicatorMargin,
        aScaleState,


        closeMenu,
        openMenu,

        openRedactor,
        applyNewStyle, 

        Theme,


        //appLanguage,
        r_uiStyle,
        r_uiComposition,
        r_uiPalette,
        //userData,
    } = props

    const {height: deviceHeight, width: deviceWidth, osHeights: {navigationBar}} = useSizes()
    const HEADER_PANEL_SIZE = {
        h: ITEM_HEIGHT*COUNT_PARAMS + 70 + 60,//- OS_NAVIGATION_BAR_HEIGHT, //(deviceHeight/2)+OS_NAVIGATION_BAR_HEIGHT-(2*FRAME_PREVIEW), 
        h2: 2*(ITEM_HEIGHT*COUNT_PARAMS + 70 + 60)+30,
        w: (deviceWidth/2)+8, 
        w2: 60
    }

    const animValueTranslateY = useSharedValue(0);
    const accentCategory = useDerivedValue(()=> allStructurParams[aListsState.value.n].indexSection) 


    const headerAStyle = useAnimatedStyle(()=>{
        return {
            width: withTiming(interpolate(
                aScaleState.value,
                [0, 1],
                [HEADER_PANEL_SIZE.w, HEADER_PANEL_SIZE.w2]
            ), {duration: MENU_TRANSFORM_DURATION}),
            borderRadius: withTiming(interpolate(
                aScaleState.value,
                [0, 1],
                [5, 0]
            ), {duration: MENU_TRANSFORM_DURATION}),

            transform: [
                {translateX: withTiming(interpolate(
                        aScaleState.value,
                        [0, 1],
                        [HEADER_PANEL_SIZE.w2-0.25, 0]
                    ), 
                    {duration: MENU_TRANSFORM_DURATION})
                }
            ]
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


    const animStyleIndicatorLine = useAnimatedStyle(() => {
        return {
            transform: [
                {translateY: indicatorMargin.value + animValueTranslateY.value}
            ] 
        }
    }, [indicatorMargin])


    const pathSVG = useAnimatedProps(()=>{
        const blobRadius = 0 
        const blobHeight = 3.5 
        const liheHeight = 3

        const OPEN_BLOB = 0.4
        const CLOSE_BLOB = blobHeight
        
        const BLOB_INDICATOR_HEIGHT = blobHeight+liheHeight 

   
        const isOpen = interpolate(svgUP.value, [0, 1], [CLOSE_BLOB, OPEN_BLOB], {extrapolateLeft: Extrapolation.CLAMP, extrapolateRight: Extrapolation.CLAMP})
        const iHeight = ITEM_HEIGHT + interpolate(svgUP.value, [0, 1], [DISTORION, 0], {extrapolateLeft: Extrapolation.CLAMP, extrapolateRight: Extrapolation.CLAMP})

        const d3 = `
            M ${isOpen} ${iHeight*0.5}
            C ${isOpen} ${iHeight*0.5-blobRadius} ${blobHeight} ${liheHeight} ${blobHeight} ${liheHeight}
            C ${blobHeight} ${liheHeight} ${blobHeight} 0 ${liheHeight+blobHeight} 0
            L ${liheHeight+blobHeight} ${iHeight}
            C ${blobHeight} ${iHeight} ${blobHeight} ${iHeight-liheHeight} ${blobHeight} ${iHeight-liheHeight}
            C ${blobHeight} ${iHeight-liheHeight} ${isOpen} ${iHeight*0.5-blobRadius} ${isOpen} ${iHeight*0.5}
            Z
        `
        return ({
            d: d3
        })
    })

    const textHide = useAnimatedStyle(()=>{
        return {
            opacity: withTiming(interpolate(aScaleState.value, [0, 1], [1, 0]), {duration: MENU_TRANSFORM_DURATION, easing: Easing.poly(5)})
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

    const Title = (props) => {
        const Language = useLanguage().SettingsScreen.StructureScreen.params
        return (
            <Reanimated.Text 
                style={[staticStyles.frontFLText, textHide, {
                    position: 'absolute',
                    //backgroundColor: 'red',
                    right: 42,
                    color: Theme.texts.neutrals.primary
                }]}
            >
                {Language[props.param]}
            </Reanimated.Text>
        )
    }

    const HeaderTitles = () => {
        const Language = useLanguage().SettingsScreen

        const categoryText = useAnimatedProps(()=>{
            return {
                value: Language.StructureScreen.typesSettings[`${categorysCustomizer[accentCategory.value]}`].type,
            }
        },[], TextInputAdapter)

        return (<>
            <Reanimated.Text 
                style = {[staticStyles.AnimatedHeaderText,  {
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    color: Theme.texts.neutrals.primary
                }]}
            >
                {Language.HeaderTitle}
            </Reanimated.Text>
            <ReanimatedTextInput     
                editable = {false}
                style = {[staticStyles.AnimatedHeaderText, categoryStyle,{
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        color: Theme.texts.neutrals.primary
                    }]}
                animatedProps={categoryText}
            />
        </>)
    }


    const renderParams = ({item, index})=> {
        console.log('--> RENDER TITLE', index)
        const icon = (item.icon != null? item.icon : "border-none-variant");
        return (
            <Pressable
                key={String(item+index)}
                style={[{
                    height: ITEM_HEIGHT,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    paddingRight: 12,
                }]}
                onPress={()=>{
                    closeMenu()
                    openRedactor(index)
                }}
                android_ripple={{
                    color: `${Theme.icons.neutrals.primary}20`,
                    borderless: false,
                    foreground: false
                }}
            >   
                <Title param = {item.param}/>
                <MaterialCommunityIcons name={icon} size={26} color={Theme.icons.neutrals.primary} />  
            </Pressable>
        )
    }

    
    return (
        <Reanimated.View
            style={[headerAStyle, {
                height:HEADER_PANEL_SIZE.h,
                position: 'absolute',
                zIndex: 2,
                backgroundColor: Theme.basics.accents.primary, 
                borderRightWidth: 0.75,
                borderColor: `${Theme.specials.separator}20`,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                left: 0,
                top: 0,
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
                    style = {[ textHide,{ //
                        position: 'absolute',
                        top: 8,
                        right: 0,
                        width: HEADER_PANEL_SIZE.w,
                    }]}
                >
                    <HeaderTitles/>
                </Reanimated.View>
            </View>

            {/*HEADER PARAMS*/}
            <Reanimated.View
                style={[{
                    height: COUNT_PARAMS*ITEM_HEIGHT,
                    overflow: 'hidden',
                    marginRight: -1
                }]}
            >
                <ReanimatedFlatList
                    ref={paramsList}
                    getItemLayout={(data, index) => ({length: ITEM_HEIGHT, offset:  ITEM_HEIGHT * index, index: index})}
                    showsVerticalScrollIndicator={false} 
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
                        width: 6.5,
                        right: 0,
                    }]}  
                >
                    <Svg                                                     
                        width="100%"                   
                        height="100%" 
                        fill= {Theme.icons.accents.quaternary} // {"none"} //
                    >
                        <ReanimatedPath animatedProps={pathSVG}/>
                    </Svg>
                </Reanimated.View>
            </Reanimated.View>
            <View
                style={{
                    position: 'absolute', right: 5, bottom: 5,
                    width: buttonSize,
                    height: buttonSize,
                    borderRadius: r_uiStyle.borderRadius.secondary,
                    backgroundColor: 'transparent',
                }}
            >
            <Pressable
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                android_ripple={ripple(Theme.texts.neutrals.primary)}
                onPress = {openMenu}
            >
                <ReanimatedIcon
                    style={[iconCollapse, {position: 'absolute'}]}
                    name={"chevron-left"}
                    size={30}
                    color={Theme.texts.neutrals.primary}
                />
                <ReanimatedIcon
                    style={[iconExpand, {position: 'absolute'}]}
                    name={"chevron-right"}
                    size={30}
                    color={Theme.texts.neutrals.primary}
                />
            </Pressable>
            </View>
        </Reanimated.View>
    )
}


const Redactors = (props) => {
    const {
        listRef: redactorsList,
        setIndex: settingIndex,

        initIndex = 2,

        closeMenu,
        Theme,
    } = props

    const {height: deviceHeight, width: deviceWidth, osHeights: {navigationBar}} = useSizes()
    const HEADER_PANEL_SIZE = {
        h: ITEM_HEIGHT*COUNT_PARAMS + 70 + 60,//- OS_NAVIGATION_BAR_HEIGHT, //(deviceHeight/2)+OS_NAVIGATION_BAR_HEIGHT-(2*FRAME_PREVIEW), 
        h2: 2*(ITEM_HEIGHT*COUNT_PARAMS + 70 + 60)+30,
        w: (deviceWidth/2)+8, 
        w2: 60
    }
    const HADLE_AREA_SIZE = {h: 18, w: deviceWidth}
    const REDACTORS_SIZE = {
        h: HEADER_PANEL_SIZE.h -2*HADLE_AREA_SIZE.h, 
        w: deviceWidth-HEADER_PANEL_SIZE.w2,
        ih: HEADER_PANEL_SIZE.h +navigationBar -2*HADLE_AREA_SIZE.h
    }
    
    const redactorsScroll = useAnimatedScrollHandler({
        onBeginDrag: (event, ctx) => {
            //console.log("onBeginDrag")
            closeMenu()
        },
        onMomentumEnd: (event, ctx) => {
            //console.log("onMomentumEnd")
            settingIndex(Math.abs(Math.round(event.contentOffset.x / REDACTORS_SIZE.w)))
        },
    })

    const keyExtractor = (item) => "redactor_"+String(item.param)

    const renderRedactors = useCallback(({item, index}) => {
        //console.log('--> RENDER R_ITEMS ', index)
        const RedactorComponent = item.paramRedactorComponent //? item.paramRedactorComponent :;
        const keys = keyExtractor(item)
        return (
            <R_Item 
                key={keys}
                keyID={keys}
                redactorName={item.param}
            >
                {RedactorComponent && <RedactorComponent {...props}/>}
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

        const Title = (props) => {
            const Language = useLanguage().SettingsScreen.StructureScreen.params
            return (
                <Text 
                    style = {[{
                        color: Theme.texts.accents.primary,// : Theme.texts.neutrals.tertiary,
                        fontSize: 19,
                        fontWeight: '500',
                        letterSpacing: 1.6,
                        fontVariant: ['small-caps'],
                        marginBottom: 8,
                        textAlign: 'left',
                        paddingHorizontal: 8
                    }]}
                >
                    {Language[props.redactorName]}
                </Text>
            )
        }

        return (
            <Reanimated.ScrollView
                key={keyID}
                style={{
                    height: '100%',// REDACTORS_SIZE.h,
                    width:  REDACTORS_SIZE.w,
                    //backgroundColor: Theme.basics.neutrals.secondary 
                }}
                contentContainerStyle = {{
                    //paddingBottom: OS_NAVIGATION_BAR_HEIGHT
                }}

                showsVerticalScrollIndicator={false}

                onStartShouldSetResponder={()=>true}
                onMoveShouldSetResponde={()=>true}
                onResponderTerminationRequest={()=>true}

                entering={FadeIn}
            >
                <View
                    style={{
                        minHeight: REDACTORS_SIZE.h,
                        width:  REDACTORS_SIZE.w-16, 
                        marginHorizontal: 8,
                        paddingTop: 2,
                        //backgroundColor: 'blue',
                        justifyContent: 'flex-start',
                        //alignItems: 'center'
                    }}
                >
                    <Title redactorName={redactorName}/>
                    <View 
                        style={{
                            justifyContent: 'flex-start',
                            width: '100%'
                        }}
                    >
                        {children}
                    </View>
                </View>
            </Reanimated.ScrollView>
        )
    }, ()=>true)


    

    console.log('-> REDACTORS RENDER')
    return (
        <Reanimated.FlatList
            ref={redactorsList}
            horizontal
            //nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate={'fast'}
            snapToInterval={REDACTORS_SIZE.w}
            getItemLayout={(data, index) => ({length: REDACTORS_SIZE.w, offset: REDACTORS_SIZE.w * index, index: index})} 

            style={{
                height: '100%',// REDACTORS_SIZE.h,
                width:  REDACTORS_SIZE.w,      
                //backgroundColor: Theme.basics.neutrals.primary,
                backgroundColor: Theme.basics.neutrals.quaternary
                //paddingBottom: OS_NAVIGATION_BAR_HEIGHT
            }}
            
            //extraData={}
            data={allStructurParams}
            keyExtractor={keyExtractor}
            renderItem={renderRedactors}
            contentOffset={{x: initIndex*REDACTORS_SIZE.w, y: 0}}//initialScrollIndex={initIndex}
            
            onScroll={redactorsScroll}

            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5} //14 + 1 + 14
            removeClippedSubviews={false}        
            //disableVirtualization = {true}
            onResponderTerminationRequest={()=>true}
            onStartShouldSetResponder={()=>false}
            onMoveShouldSetResponde={()=>false}
            
        />
    )
}


const staticStyles = StyleSheet.create({
    frontFLText: {
        fontSize: 16,
        letterSpacing: 0.6,
        fontWeight: '500',
        fontVariant: ['small-caps'],
    },
    AnimatedHeaderText: {
        fontSize: 19,
        fontWeight: '500',
        letterSpacing: 0.6,
        fontVariant: ['small-caps'],
    }

});