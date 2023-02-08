import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
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
    Keyboard 
} from 'react-native';

import Svg, { Circle, Rect, Ellipse, Line } from "react-native-svg";

//import {default as Reanimated} from 'react-native-reanimated';
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
import Constants from "expo-constants";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetScrollView,
    BottomSheetVirtualizedList,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

import themesColorsAppList, {themesApp} from "../../../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../../../app_values/Languages";

import store from "../../../../redux_files/store";
import {connect} from 'react-redux';
import mapStateToProps from "../../../../redux_files/stateToProps";
import mapDispatchToProps from "../../../../redux_files/dispatchToProps";

import dataRedactor from "../../../../async_data_manager/data_redactor";

import { 
    BasePressable,
    BaseCheckBox,
    BaseSwitch 
} from "../../../../general_components/base_components/BaseElements";

import ThemeRedacor from "./redactors_settings/interface/ThemeRedactor";
import BorderRadiusRedactor from "./redactors_settings/interface/BorderRadiusRedactor";
import NavigateMenuRedactor from "./redactors_settings/interface/NavigateMenuRedactor";
import LoadSplashRedactor  from "./redactors_settings/system/LoadSplashRedactor";
import LanguageRedactor from "./redactors_settings/system/LanguageRedactor";
import ListsRedactor from "./redactors_settings/interface/ListsRedactor";
import FunctionButtonRedactor from "./redactors_settings/interface/FunctionButtonRedactor";
import ModalsRedactor from "./redactors_settings/interface/ModalsRedactor";
import UserRedactor from "./redactors_settings/system/UserRedactor";
import WeatherRedactor from "./redactors_settings/system/WeatherRedactor";
import AppFunctionsRedactor from "./redactors_settings/system/AppFunctionsRedactor";

import Ohter from "./redactors_settings/ohterts";
import StyleChangePreview from "./preview/StyleChangePreview";
import { BlurView } from "@react-native-community/blur";
import { LinearGradient } from 'expo-linear-gradient';

import ColorSplash from "../../../../componets/StyleColorSplash";
import Classical from "../../../../general_components/tab_bars/Classical";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

const structure = [
    {
        indexSection: 0,
        category: "appearance",
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
                param: "navigationMenu",
                icon:  "menu",
                paramRedactorComponent: NavigateMenuRedactor
            },
            
            {
                param: "lists",
                icon:  "view-list",
                paramRedactorComponent: ListsRedactor
            },
            {
                param: "bobberButton",
                icon:  "balloon",
                paramRedactorComponent: FunctionButtonRedactor
            },
            {
                param: "modals",
                icon:  "window-restore",
                paramRedactorComponent: ModalsRedactor
            },  
        ]
    },
    {   
        indexSection: 1,
        category: "system",
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
            {
                param: "loadAnimation",
                icon:  "animation-play",
                paramRedactorComponent: LoadSplashRedactor
            },
            {
                param:"weather",
                icon:  "weather-cloudy-clock",
                paramRedactorComponent: WeatherRedactor
            }, 
            //{
            //    param:"location",
            //    icon:  "balloon",
            //    paramRedactorComponent: null
            //}, 
            {
                param:"appFunctions",
                icon:  "store",
                paramRedactorComponent: AppFunctionsRedactor
            }, 
             
            
        ]
    },
    {   
        indexSection: 2,
        category: "additional",
        data: [
            {
                param:"ohters",
                icon:  "qrcode-scan",
                paramRedactorComponent: null
            },
        ]
    }
]

//<MaterialCommunityIcons name="magic-staff" size={24} color="black" />
//<MaterialCommunityIcons name="storefront" size={24} color="black" />

//<MaterialCommunityIcons name="palette" size={24} color="black" />
//<MaterialCommunityIcons name="vector-rectangle" size={24} color="black" />
//<MaterialCommunityIcons name="menu" size={24} color="black" />
//<MaterialCommunityIcons name="animation-play" size={24} color="black" />
//<MaterialCommunityIcons name="view-list" size={24} color="black" />
//<MaterialCommunityIcons name="balloon" size={24} color="black" />

//<MaterialCommunityIcons name="web" size={24} color="black" />
//<MaterialCommunityIcons name="weather-cloudy-clock" size={24} color="black" /> <MaterialCommunityIcons name="earth" size={24} color="black" />
//<MaterialCommunityIcons name="account" size={24} color="black" />
//<MaterialCommunityIcons name="store" size={24} color="black" />
//<MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />

//<MaterialCommunityIcons name="check-bold" size={24} color="black" />


//<MaterialCommunityIcons name="check-bold" size={24} color="black" />


//<MaterialCommunityIcons name="keyboard-backspace" size={24} color="black" />

const allStructurParams = [];
for (let el of structure){
    for (let item of el.data){
        allStructurParams.push({
            param: item.param, 
            icon: item.icon, 
            category: el.category, 
            indexSection: el.indexSection
        });
    }
}

const allCategorys = [];
for (let el of structure){
    //for (let item of el.data){
        allCategorys.push({category: el.category, indexSection: el.indexSection});
    //}
}

const ReanimatedFlatList = Reanimated.createAnimatedComponent(FlatList);
const ReanimatedSectionList = Reanimated.createAnimatedComponent(SectionList);
const ReanimatedTextInput = Reanimated.createAnimatedComponent(TextInput);

//bober button heigt = 60 const bottomBord = buttonSize + 12 + menuHeight 
const bottomBord = deviceWidth+60
const positionBobberButton =(buttonSize)=>({
    center: (deviceWidth*0.5-(buttonSize/2)),
    left: (deviceWidth-5-buttonSize),
    right: (5)
})

const Settings = (props) => {
    //console.log(props.navigation.isFocused(), store.getState().hideMenu,props.hideMenu)
    if(props.navigation.isFocused() && store.getState().hideMenu){
        //console.log('settings open', props.hideMenu)
        //props.r_setHideMenu(false)
        //bottomSheetVisible? props.r_setHideMenu(false) : null;
    }

    const [LanguageAppIndex, setLanguageAppIndex] = useState(languagesApp.indexOf(props.appConfig.languageApp));//ThemesColorsAppList[ThemeColorsAppIndex]
    const [ThemeColorsAppIndex, setThemeColorAppIndex] = useState(themesApp.indexOf(props.appStyle.palette.theme));//LanguagesAppList[LanguageAppIndex]

    const [appStyle, setAppStyle] = useState(props.appStyle);
    const [ThemeSchema, setThemeSchema] = useState(props.appStyle.palette.scheme == 'auto'? Appearance.getColorScheme() : props.appStyle.palette.scheme)
    const [appConfig, setAppConfig] = useState(props.appConfig);

    const [previewAppStyle, setPreviewAppStyle] = useState(props.appStyle);

    const previewAppStyleA = useSharedValue(props.appStyle)

    // position wherein bobber not visible
    const [ bottomBord, setBottomBord ] = useState(
        props.appStyle.functionButton.size 
        + 12.5 
        + props.appStyle.navigationMenu.height 
        + ((props.appStyle.navigationMenu.type == 'hidden' && props.appStyle.navigationMenu.position.horizontal == 'center' && props.appStyle.functionButton.position == 'center')? 
            20 + interpolate(props.appStyle.navigationMenu.position.vertical, [-150, 150] , [0, 30]) 
            : 0
        )
    ) 
    
    store.subscribe(() => {
        let jstore = store.getState();

        if(LanguageAppIndex != languagesApp.indexOf(jstore.appConfig.languageApp)){
            setLanguageAppIndex(languagesApp.indexOf(jstore.appConfig.languageApp))
        }

        if(ThemeColorsAppIndex != themesApp.indexOf(jstore.appStyle.palette.theme)){
            setThemeColorAppIndex(themesApp.indexOf(jstore.appStyle.palette.theme));
        }

        if(ThemeSchema != jstore.appStyle.palette.scheme){
            setThemeSchema(jstore.appStyle.palette.scheme == 'auto'? Appearance.getColorScheme() : jstore.appStyle.palette.scheme);
        }

        if (appStyle != jstore.appStyle) {
            setAppStyle(jstore.appStyle);
            setPreviewAppStyle(jstore.appStyle)
            previewAppStyleA.value = jstore.appStyle
            setBottomBord(
                jstore.appStyle.functionButton.size 
                + 12.5 
                + jstore.appStyle.navigationMenu.height
                + ((jstore.appStyle.navigationMenu.type == 'hidden' && jstore.appStyle.navigationMenu.position.horizontal == 'center')? 
                    20 + interpolate(jstore.appStyle.navigationMenu.position.vertical, [-150, 150] , [0, 30])
                    : 0
                )
            );
        }

        if (appConfig != jstore.appConfig) {
            setAppConfig(jstore.appConfig);
        }
    })

    const [listenerColorSheme, setListinerColorScheme] = useState(Appearance.getColorScheme())
    useEffect(()=>{
        if(listenerColorSheme){
            if(appStyle.palette.scheme == 'auto' && listenerColorSheme != ThemeSchema){
                console.log('settings accept new color sheme', listenerColorSheme, 'used shema', appStyle.palette.scheme)
                setThemeSchema(listenerColorSheme)
            }
        }
    },[listenerColorSheme])
    
    Appearance.addChangeListener(({colorScheme})=>{
        setListinerColorScheme(colorScheme)
    })

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            console.log('keyboard Will Show')
            setKeyboardVisible(true);
            animValueBobberButtonVisible.value = bottomBord
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const sectListRef = useRef();
    const flatCategorysListRef = useAnimatedRef(); 
    const flatListRef = useAnimatedRef(); 

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen

    const accentCategory = useSharedValue(0);

    const [listWidths, setListWidths] = useState([]);
    const [listHeights, setListHeights] = useState([]);

    const derivedValues = useSharedValue({
        listHeights: [],
        listWidths: [],
        shifts: [],
        intervals: [],
        limits: [],
        categorys: []
    })
    
    const animValueWidthLine = useSharedValue(
        ((Language.StructureScreen.params[allStructurParams[0].param]).length) * (staticStyles.frontFLText.fontSize * 0.75) + 10
    )
    
    const animValueMarginLeft = useSharedValue(0);
    const animValueTranslateX = useSharedValue(0);
    const animValueScrollXCategorys = useSharedValue(0);
    const animValueCategorysScrolling = useSharedValue(false);
    
    const animValueBobberButtonVisible = useSharedValue(bottomBord);

    const animValueScrollY = useSharedValue(0)

    const logg = (info) =>{
        console.log(info)
    }

    const scrollHandlerFlatListParams = useAnimatedScrollHandler({
        onScroll: (e, ctx) => {
            animValueTranslateX.value = -(e.contentOffset.x)            
        }
    })

    useDerivedValue(() => {
        const scroll = Math.abs(animValueTranslateX.value)
        if(!animValueCategorysScrolling.value){
            const categoryIntervals = derivedValues.value.categorys
            //runOnJS(logg)(` ${(scroll)} bords ${categoryIntervals} ${indexs}`)
            let to = 0
            for(let i = 0; i<categoryIntervals.length ; i++){   
                if(scroll >= categoryIntervals[i]){
                    to = i
                }
            }
            scrollTo(
                flatCategorysListRef, //ref
                to*(deviceWidth/2), //x offset
                0, //y offset
                true //animate
            )
        } 
    })

    const scrollHandlerFlatListCategorys = useAnimatedScrollHandler({
        onBeginDrag: (e) => {
            animValueCategorysScrolling.value = true;
        },
        onEndDrag: (e) => {
            //runOnJS(logg)(`end ${e.contentOffset.x}`)
            animValueCategorysScrolling.value = false;
        },
        onMomentumEnd: (e) => {
            //runOnJS(logg)(`momentum end ${e.contentOffset.x}`)
            animValueScrollXCategorys.value = (e.contentOffset.x)
            //animValueCategorysScrolling.value = false;
        },
        onScroll: (e, ctx) => {
            //animValueCategorysScrolling.value = true;
            animValueScrollXCategorys.value = (e.contentOffset.x)
        }
    })

    useDerivedValue(() => {
        const scroll = Math.abs(animValueScrollXCategorys.value)
        if(true){
            const categoryIntervals = derivedValues.value.categorys

            const yetIndex = Math.floor((scroll/(deviceWidth/2)))
            const yetScroll = yetIndex*(deviceWidth/2)
            const toIndex = Math.floor(( (Math.max((scroll-yetScroll),0) )/ (deviceWidth/4)))

            const fineIndex = Math.min(yetIndex+toIndex, (categoryIntervals.length-1))

            //runOnJS(logg)(` ${(deviceWidth/4)} `)
            //runOnJS(logg)(` ${(scroll)} ||| ${(toIndex)} ||| ${categoryIntervals[toIndex]} ||| ${categoryIntervals}`)
            scrollTo(
                flatListRef, //ref
                categoryIntervals[fineIndex], //x offset
                0, //y offset
                true //animate
            )
        }
        
    })
    
    const animStyleIndicatorLine = useAnimatedStyle(() => {
        const duration = 450;
        return {
            width: withTiming(animValueWidthLine.value, {duration: duration-20}),
            left: withTiming(5+animValueMarginLeft.value, {duration: duration, easing: Easing.bezier(0.45, 0, 0.55, 1)}),
            transform: [
                {translateX: animValueTranslateX.value}
            ] 
        }
    })


    const splashStart = (themeIndex) => {
        //if(appStyle.theme != theme){

            //setSplashTheme(themeIndex);
            //setSplashVisible(true);
            applyAppStyle()    
        //}
    }

    const applyAppStyle = ()=>{
        //let newAppStyle = previewAppStyle
        //console.log('fine ',newAppStyle)
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));

        setAppStyle(newAppStyle)
        dataRedactor("storedAppStyle",newAppStyle);
        props.r_setAppStyle(newAppStyle);
    }

     const previewHeight = (50+deviceHeight/2)+(appStyle.lists.proximity)
    //const settingsInfoHeight = (deviceHeight/4)+2*(!previewFixed? appStyle.lists.proximity : 0)

    const headerStickysHeight = 40
    const itemCategoryHeight = 45
    const selectorLineHeight = 35
    
    const packHeight = 300

    const headerHeight = (Constants.statusBarHeight+1)+itemCategoryHeight//+selectorLineHeight

    const headerStickysFullHeight = headerStickysHeight +(2*appStyle.lists.proximity)
    const selectorLineHeightFull = itemCategoryHeight + selectorLineHeight
    const headHeight = packHeight-itemCategoryHeight
    const headFullHeight = headHeight + selectorLineHeightFull //((3*deviceHeight)/4)
    
    const animSelectorLine = useSharedValue(headFullHeight-selectorLineHeight)


    const scrollSectionsList = useAnimatedScrollHandler({
        onScroll: (event, ctx) => {
        
            let isUpScroll = false;
            let isEnd = false;
            let isStart = false;

            if(Math.abs(event.velocity.y).toFixed(4) != 0){
                isUpScroll = (event.velocity.y).toFixed(4) < 0.0001;
            }

            isEnd = (event.layoutMeasurement.height + event.contentOffset.y) >= (event.contentSize.height - 5);
            isStart = event.contentOffset.y > (headFullHeight); //scroll>preview
            const visibleBobber = ((isUpScroll || isEnd) && isStart)

            cancelAnimation(animValueBobberButtonVisible);
            animValueBobberButtonVisible.value = visibleBobber? 0 : bottomBord

            const useScroll = -Math.max(event.contentOffset.y, 0) 
            //useScroll = -(useScroll < 0? 0 : useScroll)
            cancelAnimation(animValueScrollY);
            animValueScrollY.value = useScroll

            const selectLine = Math.max((headFullHeight + useScroll -selectorLineHeight), 0)
            //runOnJS(logg)(`${selectLine}`)
            //selectLine = selectLine < 0? 0 : selectLine
            cancelAnimation(animSelectorLine);
            animSelectorLine.value = selectLine
            
        },
    })
    

    const countDerivedValues = () =>{
        //console.log('reculc')
        const intervals = []//[{left: 0, right: 100}, ...]
        for(let i = 0; i < allStructurParams.length; i++){
            let right = -1;
            let left = -1;

            right += headFullHeight -selectorLineHeight//+headerStickysFullHeight
            
            if(allStructurParams[i].indexSection != 0){               
                right += allStructurParams[i].indexSection*(headerStickysFullHeight)
            }

            left += listHeights.reduce(((countValue, currentValue, index)=>(index <= (i>=1?i-1:0)? (countValue+currentValue) : countValue)), 0)
            right += listHeights.reduce(((countValue, currentValue, index)=>(index <= i? (countValue+currentValue) : countValue)), 0)
            intervals.push({
                left: left,
                right: right
            })
        }

    
        const shifts = []
        for(let param = 0; param <= allStructurParams.length; param++){
            const maxAccepIndex = listWidths.length-1;
            let centrallFront = 0;
            //left shift 
            const shift = listWidths.reduce(((countValue, currentValue, index)=>(index < param? (countValue+currentValue) : countValue)), 0)
            //shifts for position in center
            if(1 <= param && param <= maxAccepIndex-1){ 
                centrallFront = -((deviceWidth-listWidths[param])/2) //-Math.round((deviceWidth-listWidths[param])/2) 
            }
            let resOffset = centrallFront+shift
            if(resOffset < 0){resOffset = 0}
            shifts.push(resOffset)
        } 

        const lessCooef = 0.2
        const moreCooef = 1 - 0.4 //default 1-lessCooef
     
        const limList = []//[{less: 30, more: 70}, ...]
        for(let param = 0; param < allStructurParams.length; param++){
            const interval = listHeights.reduce(((countValue, currentValue, index)=>(index < param? (countValue+currentValue) : countValue)), 0)
            limList.push({
                less: lessCooef*listHeights[param]+interval, 
                more: moreCooef*listHeights[param]+interval
            })
        }

        const indexs = []
        for(let i=0; i<structure.length; i++){
            indexs[i] = 0 + i>0? (indexs[i-1]+structure[i-1].data.length) : 0
        }
        const categoryIntervals = []
        for(let i = 0; i<indexs.length ; i++){
            let value = (listWidths).reduce(((countValue, currentValue, index)=>(index < indexs[i]? (countValue+currentValue) : countValue)), 0)
            let center = deviceWidth/2 - (listWidths)[indexs[i]]/2
            center = (center >  value? 0 : center)
            categoryIntervals.push(value-center)      
        }

        derivedValues.value = {
            listHeights: listHeights,
            listWidths: listWidths,
            shifts: shifts,
            intervals: intervals,
            limits: limList,
            categorys: categoryIntervals
        }
    }
    useEffect(()=>{countDerivedValues()},[appStyle])//appStyle.lists.proximity//Language, LanguageAppIndex, 



    
    
    useDerivedValue(() => {
        const aListHeights = derivedValues.value.listHeights
        const aListWidths = derivedValues.value.listWidths
        const intervals = derivedValues.value.intervals
        const shifts = derivedValues.value.shifts
        const limList = derivedValues.value.limits

        if(
            aListHeights.length == 0 ||
            aListWidths.length == 0 ||
            intervals.length == 0 ||
            shifts.length == 0 ||
            limList.length == 0  
        ){return}

        const yScroll = Math.abs(animValueScrollY.value)


        const countAccent = intervals.findIndex((el, index)=>(
            (el.left<=yScroll && yScroll<=el.right) || 
            (index == 0 && yScroll < el.left) || 
            (index == intervals.length-1 && yScroll > el.right) 
        ))


        let accentBarXScroll = Math.max((yScroll- (headFullHeight-selectorLineHeight)), 0)
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

        cancelAnimation(animValueWidthLine);
        cancelAnimation(animValueMarginLeft);
        animValueWidthLine.value = width;
        animValueMarginLeft.value = left;

        cancelAnimation(accentCategory);
        accentCategory.value = allStructurParams[countAccent].indexSection


        scrollTo(
            flatListRef, //ref
            accentBarXScroll, //x offset
            0, //y offset
            true //animate
        )
    })


    const selectParametr = (item, index, type) => {
        //console.log('selectParam', item, index)
        let itemIndex = 0;
        let sectionIndex = 0;
        if(type == 'params'){
            for(let i = 0; i<structure.length; i++){               
                for(let j = 0; j<structure[i].data.length; j++){
                    if(structure[i].category === item.category && structure[i].data[j].param === item.param){
                        itemIndex = j;
                        sectionIndex = i;
                        break;
                    }
                }
            }
        } else {
            itemIndex = 0;
            sectionIndex = index;
        }
        
        
        sectListRef.current.scrollToLocation({
            itemIndex: itemIndex+1,
            sectionIndex: sectionIndex,
            animated: false,
            viewOffset: 30+appStyle.lists.proximity
            //viewPosition: 0
        })
    }

    const stacker = (list, setList, newValue) => {
        //newValue = Math.round(newValue);
        if (list.length >= allStructurParams.length){
            setList([newValue]);
        } else {
            list.push(newValue);
            setList(list); 
        }
        //console.log('st')
        if(
            //(listHeights.length == listWidths.length && listHeights.length == allStructurParams.length) 
            //|| 
            ((derivedValues.value.listHeights != listHeights || derivedValues.value.listWidths != listWidths) 
                && (listWidths.length == allStructurParams.length && listHeights.length == allStructurParams.length)
            )
        ){
            //console.log('new full renders')
            countDerivedValues()
        }
    };

    const jumpPress =()=>{
        console.log('pressj')
        /*
        sectListRef.current.scrollToLocation({
            itemIndex: 0,
            sectionIndex: 0,
            viewPosition: 1,
            animated: false,
        })
        */
        handlePresentModalPress()
    }


    const animStyleBobber1 = useAnimatedStyle(() => {
        const duration = 200;
        return {
            transform: [
                {translateY: withTiming(animValueBobberButtonVisible.value == 0? -(5+appStyle.functionButton.size) : 0, {duration: duration})}
            ] 
        }
    })
    const animStyleBobber2 = useAnimatedStyle(() => {
        const duration = 200;
        return {
            //opacity: withTiming(animValueBobberButtonExpand.value == 1? 1 : 0.9, {duration: duration}),
        }
    })

    const copyObject = (copied)=>{
        const copy = {}
        for(let el in copied){
            if((typeof copied[el] != 'object') || (Array.isArray(copied[el]))){
                copy[el] = copied[el]
            } else {
                copy[el] = copyObject(copied[el])
            }
        }
        return copy
    }

    const getNewAppConfigObject =()=>{
        return copyObject(appConfig)
    }

    const getNewAppStyleObject =(flag = 'previewStyle')=>{

        if(flag == 'currentStyle'){
            return copyObject(appStyle)
        }
        return copyObject(previewAppStyle)
    }
  
    const applyPress =()=>{
        console.log('pressa')
        
        applyAppStyle()
        //splashStart(previewAppStyle.theme, themesApp.indexOf(previewAppStyle.theme));
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
            value: Language.StructureScreen.typesSettings[`${structure[accentCategory.value].category}`].type,
            text: Language.StructureScreen.typesSettings[`${structure[accentCategory.value].category}`].type,
        }
        //,[Language, LanguageAppIndex]
    })

    const dynamicStyleListItems = useAnimatedStyle(()=>{
        const duration = 300
        return {
            borderRadius: withTiming(appStyle.borderRadius.basic, {duration: duration}),
            marginHorizontal: withTiming((appStyle.lists.fullWidth? 0 : 10), {duration: duration}),
            marginVertical: withTiming(appStyle.lists.proximity, {duration: duration}),
        }
    })

    const dynamicStyleListItemsHeaders = useAnimatedStyle(()=>{
        const duration = 300
        return {
            paddingHorizontal:  withTiming((7 * appStyle.borderRadius.basic/32), {duration: duration}),
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
                {translateY: withTiming(animValueBobberButtonVisible.value, {duration: durationTranslate})}
            ] 
        }
    })

    const back = () => {
        console.log('settings back', bottomSheetVisible , props.hideMenu)
        (!bottomSheetVisible && props.hideMenu)? props.r_setHideMenu(false) : null
        props.navigation.goBack()
    }
    const goToPalleteScreen = (index = 0) => {
        ToastAndroid.show('LOAD', ToastAndroid.SHORT);   
        bottomSheetVisible? bottomSheetModalRef.current?.dismiss(): null;    
        (!bottomSheetVisible && !props.hideMenu)? props.r_setHideMenu(true) : null
        //console.log('settings to palette', bottomSheetVisible , props.hideMenu) 
        props.navigation.navigate('palette', {themeIndex: index})
        console.log('settings to palette', bottomSheetVisible , props.hideMenu)  
        
    }

    
    const selectorLine = useAnimatedStyle(()=>{
        const duration = 300
        return {
            transform: [
               {translateY: animSelectorLine.value-0.25}
            ]
        }
    })

    const selectorLineColorHeight = useAnimatedStyle(()=>{
        const duration = 300
        return {
            height: interpolate(
                animSelectorLine.value, 
                [headerHeight-(Constants.statusBarHeight+1), 0],
                [selectorLineHeightFull, 0],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }   
            ),
        }
    })

    const params = useAnimatedStyle(()=>{
        const duration = 300
        return {
            
            backgroundColor: interpolateColor(
                animSelectorLine.value, 
                [headerHeight/2, headerHeight/4],
                [Theme.basics.accents.primary, '#00000000']  
            ),
            
        }
    })

    const header = useAnimatedStyle(()=>{
        const duration = 300
        return {
            height: interpolate(
                animSelectorLine.value, 
                [headerHeight-(Constants.statusBarHeight+1), 0],
                [headerHeight, headerHeight+selectorLineHeight],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }  
            ),   
        }
    })

    const category = useAnimatedStyle(()=>{
        const duration = 300
        return {
            width: interpolate(
                animSelectorLine.value, 
                [headFullHeight, 0],
                [deviceWidth, deviceWidth/2]  
            ),
            paddingLeft: interpolate(
                animSelectorLine.value,
                [headFullHeight, 0], 
                [deviceWidth/2-((Language.StructureScreen.typesSettings.appearance.type).length * 0.375 * staticStyles.AnimatedHeaderText.fontSize), 0]
            ),
            opacity: interpolate(
                animSelectorLine.value, 
                [0.01, 0],
                [1, 0]  
            ),
        }
    })

    const type = useAnimatedStyle(()=>{
        const duration = 300
        return {
            opacity: interpolate(
                animSelectorLine.value, 
                [0.01, 0],
                [0, 1]  
            ),
        }
    })

    const appStick = useAnimatedStyle(()=>{
        const duration = 300
        return {
            opacity: interpolate(
                animSelectorLine.value, 
                [headerHeight/2, 0],
                [1, 0]  
            ),
        }
    })

    // ref
    const bottomSheetModalRef = useRef(BottomSheetModal);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    // variables
    const snapPoints = useMemo(() => [previewHeight/3+30, previewHeight+30], []);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        props.r_setHideMenu(true)
        setBottomSheetVisible(true)
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
        if(index === -1 && bottomSheetVisible){
            setBottomSheetVisible(false)
            props.r_setHideMenu(false)
        }

    }, []);

    const BLUR = false
    return (
    <>  
        <Reanimated.View
            style={[
                staticStyles.FlatListsArea,              
                {   
                    top: 0,
                    zIndex: 1,
                    position: 'absolute',                    
                },
                BLUR? {} : {
                    backgroundColor: Theme.basics.accents.primary,
                },
                header
            ]}
        >
            {BLUR && 
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
                overlayColor={`${Theme.basics.accents.primary}90`}
                //overlayColor={'transparent'}
                //blurRadius	= {10}
                //downsampleFactor = {10}
            />
            </View>}   
        </Reanimated.View>

        <Reanimated.View 
            style = {[staticStyles.SLtopBord,{ 
                alignItems: 'center',
                marginTop: (Constants.statusBarHeight+1),
                position: 'absolute',
                height: itemCategoryHeight,
                right: 0,
                zIndex: 2,
                justifyContent: 'center',
                
            }]}
        >
            <Reanimated.View
                style = {[staticStyles.SLtopBord, type, {}]}
            >
                <ReanimatedTextInput     
                    editable = {false}
                    style = {[staticStyles.AnimatedHeaderText, categoryStyle, {color: Theme.texts.neutrals.primary}]}
                    animatedProps={categoryText}
                />
            </Reanimated.View>
            <Reanimated.View
                style = {[staticStyles.SLtopBord, appStick, { 
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    position: 'absolute',
                    height: '100%',
                    right: 0
                }]}
            >
                <Text style = {[staticStyles.AnimatedHeaderText, {color: Theme.texts.neutrals.primary}]}>
                    {Language.app}
                </Text>
            </Reanimated.View>
        </Reanimated.View>

        <View 
            style = {[staticStyles.SLtopBord,{ 
                marginTop: (Constants.statusBarHeight+1),
                position: 'absolute',
                height: itemCategoryHeight,
                left: 0,
                zIndex: 2         
            }]}
        >
            <View
                style = {{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',                    
                }}
            >
                {appStyle.navigationMenu.type == 'not' &&
                <BasePressable 
                    type="i"
                    icon={{name: "backburger", size: 30, color: Theme.texts.neutrals.primary}}
                    style={{
                        height: 45, 
                        width: 45, 
                        marginLeft: 15,
                        paddingTop: 3,
                        borderRadius: appStyle.borderRadius.additional
                    }}
                    onPress={back}
                    android_ripple={{
                        color: Theme.texts.neutrals.primary,
                        borderless: true,
                        foreground: false
                    }}
                />}
                {appStyle.navigationMenu.type != 'not' && <View style={{height: 45, width: 45, marginLeft: 15,}}/>}
                <Text style = {[staticStyles.AnimatedHeaderText, {color: Theme.texts.neutrals.primary}]}>
                    {Language.HeaderTitle}
                </Text>
            </View>
        </View>

        <Reanimated.View
            style = {[selectorLine, {
                height: selectorLineHeightFull,
                width: '100%',
                justifyContent: 'flex-end',
                position: 'absolute',
                top: ((Constants.statusBarHeight+1)),
                zIndex: 1,
            }]}
        >
            <Reanimated.View
                style = {[selectorLineColorHeight, {
                    backgroundColor: `${Theme.basics.accents.primary}${BLUR?'90':'ff'}`,
                    width: '100%',
                    position: 'absolute',
                    bottom: 0
                }]}
            />

            <View
                style={{
                    height: itemCategoryHeight,
                    alignItems: 'flex-end'
                }}
            >
                <Reanimated.View
                    style={[category, {
                        height: itemCategoryHeight,
                        justifyContent: 'center',
                        alignItems: 'flex-start',                    
                    }]}
                >
                    <ReanimatedFlatList
                        ref={flatCategorysListRef}
                        onScroll={scrollHandlerFlatListCategorys}
                        //decelerationRate={'fast'}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={{flex: 1 ,width: deviceWidth/2,}}
                        snapToInterval={deviceWidth/2}
                        getItemLayout={(data, index) => (
                            {length: deviceWidth/2, offset: deviceWidth/2 * index, index: index}
                        )}
                        data={structure}
                        keyExtractor={item => item.category}
                        renderItem={({item, index})=> {
                            return (
                            <BasePressable
                                key={String(item.category+index)}
                                type={'t'}
                                style={[{
                                    width: deviceWidth/2,                            
                                }]}
                                styleItemContainer = {{
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                }}
                                text={Language.StructureScreen.typesSettings[item.category].category}
                                textStyle={[staticStyles.AnimatedHeaderText, {color: Theme.texts.neutrals.primary,}]}
                                rippleColor={false}
                                onPress={()=>{selectParametr(item, index, 'categorys')}}
                            />
                            )
                        }}
                    />
                </Reanimated.View> 
            </View>
            
            <Reanimated.View
                style={[{
                    height: selectorLineHeight,
                }]}
            >
                <Reanimated.View 
                    style={[animStyleIndicatorLine, { 
                        backgroundColor: Theme.icons.accents.quaternary,
                        position: 'absolute',
                        bottom: -0.1,
                        height: 4,
                        borderRadius: 5,
                        borderBottomRightRadius: 0,
                        borderBottomLeftRadius: 0,
                    }]}  
                />
                <ReanimatedFlatList
                    ref={flatListRef}
                    style={staticStyles.frontFL}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    onScroll={scrollHandlerFlatListParams}
                    data={allStructurParams}
                    keyExtractor={item => item.param}
                    contentContainerStyle={{// 100//
                        paddingRight: (deviceWidth/2) - (
                            (derivedValues.value.listWidths).length == allStructurParams.length? 
                                (derivedValues.value.listWidths[allStructurParams.length-1])/2 
                            :
                                ((Language.StructureScreen.params[allStructurParams[allStructurParams.length-1].param]).length*0.75*staticStyles.frontFLText.fontSize)/2
                        )
                    }}
                    renderItem={({item, index})=> {
                        return (
                        <View
                            key={String(item.param+index)}  
                            style={[staticStyles.frontFLArea]}
                            onLayout={(event)=>{stacker(listWidths, setListWidths, (event.nativeEvent.layout.width+2*staticStyles.frontFLArea.marginHorizontal))}}
                        >
                            <BasePressable
                                type={'t'}
                                style={staticStyles.frontFLPressable}
                                text={Language.StructureScreen.params[item.param]}
                                textStyle={[staticStyles.frontFLText, {color: Theme.texts.neutrals.primary}]}
                                rippleColor={false}
                                onPress={()=>{selectParametr(item, index, "params")}}
                            />
                        </View>
                        )
                    }}
                />
            </Reanimated.View>
        </Reanimated.View>

        <ReanimatedSectionList
            ref={sectListRef}
            contentOffset={{x: 0, y: (packHeight)}}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            onScroll={scrollSectionsList}
            sections={structure}
            keyExtractor={(item, index) => item.param + index}
            style={{
                paddingTop: headerHeight
            }}
            ListHeaderComponent={()=>{return(
                <View
                    style={{
                        height: headHeight,
                        maxHeight: headHeight,
                        width: '100%',
                        backgroundColor: Theme.basics.grounds.secondary,
                        marginBottom: selectorLineHeightFull
                    }}
                >
                    <Reanimated.View
                        //key={String(item.param+index)}  
                        style={[
                            staticStyles.SLArea, 
                            appStyle.lists.shadow? staticStyles.shadow : {},
                            dynamicStyleListItems,
                            {
                                backgroundColor: Theme.basics.grounds.primary,   
                            }
                        ]}
                    >  
                        <Reanimated.View
                            style={[ 
                                dynamicStyleListItemsHeaders, 
                                { 
                                flexDirection: 'row', 
                                width: '100%',
                                //marginBottom: 5, 
                                alignItems: 'center',
                                height: 25,
                                backgroundColor: 'red'
                            }]}
                        >
                            <MaterialCommunityIcons name={"border-none-variant" } size={20} color={Theme.texts.neutrals.secondary} />
                            <Text style={[staticStyles.SLParamHeaderText, {color: Theme.texts.neutrals.secondary}]}>settings</Text>
                        </Reanimated.View>
                    </Reanimated.View>
                </View> 
            )}}
            renderSectionHeader={({section: {category, indexSection: index}})=>{
                if(index==0){return null}
                return (
                <View
                    key={String(category)} 
                    style={{
                        height: headerStickysHeight,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: appStyle.lists.proximity, 
                    }}
                >
                    <Text 
                        style = {[{
                            color: Theme.texts.accents.primary,
                            fontSize: 25,
                            fontWeight: 'bold',
                            letterSpacing: 4,
                            fontVariant: ['small-caps'],
                        }]}
                    >
                        {Language.StructureScreen.typesSettings[`${category}`].category}
                    </Text>
                </View> 
                )
            }}
            renderItem={({item, index})=>{
                const RedactorComponent = item.paramRedactorComponent;
                const redactorName = Language.StructureScreen.params[item.param]
                return (
                    <Reanimated.View
                        key={String(item.param+index)}  
                        style={[
                            staticStyles.SLArea, 
                            appStyle.lists.shadow? staticStyles.shadow : {},
                            dynamicStyleListItems,
                            {
                                backgroundColor: Theme.basics.grounds.primary,   
                            }
                        ]}
                        onLayout={(event)=>{stacker(listHeights, setListHeights, event.nativeEvent.layout.height+2*appStyle.lists.proximity)}}
                    >   
                        <Reanimated.View
                            style={[ 
                                dynamicStyleListItemsHeaders, 
                                { 
                                flexDirection: 'row', 
                                width: '100%',
                                height: 25,
                                alignItems: 'center',
                            }]}
                        >
                            <MaterialCommunityIcons name={item.icon} size={20} color={Theme.texts.neutrals.secondary} />
                            <Text style={[staticStyles.SLParamHeaderText, {color: Theme.texts.neutrals.secondary}]}>{redactorName}</Text>
                        </Reanimated.View>
                        {RedactorComponent != null && 
                        <RedactorComponent
                            //for themes redactor
                            goToPalleteScreen = {goToPalleteScreen}

                            appStyle={appStyle}
                            setAppStyle={setAppStyle}
                            r_setAppStyle={props.r_setAppStyle}

                            previewAppStyle={previewAppStyle}
                            setPreviewAppStyle={setPreviewAppStyle}

                            previewAppStyleA={previewAppStyleA}

                            getNewAppStyleObject={getNewAppStyleObject}
                            

                            appConfig={appConfig}
                            r_setAppConfig={props.r_setAppConfig}
                            getNewAppConfigObject={getNewAppConfigObject}

                            ThemeColorsAppIndex={ThemeColorsAppIndex}
                            ThemeSchema={ThemeSchema}
                            LanguageAppIndex={LanguageAppIndex}
                        />}         
                    </Reanimated.View>
                )
            }}
            ListFooterComponent = {()=>{
                let lastObject = listHeights[listHeights.length-1]
                lastObject = (lastObject == NaN || lastObject == undefined)? 160 : lastObject
                return (
                    <View style={{
                            height: deviceHeight,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text>till all</Text>
                    </View>
                )
            }}
        />
        
        

        {/*BOBBER BUTTON*/}
        {!bottomSheetVisible && 
        <Reanimated.View 
            style = {[dynamicStyleBobberButton, {
                position: 'absolute',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
            }]}
        >   
            {["apply", "jumpUp"].map((item, index)=>{
                let animStyle;
                let iconName;
                let pressFunction;
                switch(item){
                    case "jumpUp": 
                        animStyle = animStyleBobber1;
                        iconName = "arrow-collapse-up";
                        pressFunction = jumpPress;
                        break;
                    case "apply": 
                        animStyle = animStyleBobber2;
                        iconName = "check-outline";
                        pressFunction = applyPress;
                        break;
                }
                return (
                    <Reanimated.View
                        key={item+index}
                        
                        style = {[animStyle,{
                            zIndex: 1,       
                            position: 'absolute',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }]}
                    >
                        <BasePressable
                            type={"i"}
                            icon={{name: iconName, size: 24, color: Theme.icons.neutrals.primary}}
                            style={{
                                height: appStyle.functionButton.size,
                                width: appStyle.functionButton.size,
                                borderRadius: appStyle.borderRadius.additional,
                                backgroundColor: Theme.basics.accents.secondary,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 4,
                            }}
                            android_ripple={{
                                color: Theme.icons.accents.quaternary,
                                borderless: true,
                                foreground: false
                            }}
                            onPress={pressFunction}
                        />
                    </Reanimated.View>
                )
            })}
        </Reanimated.View>}

        {/*STYLE UPDATE*/}
        <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >           
            <StyleChangePreview
                appStyle={appStyle}
                setAppStyle={setAppStyle}
                r_setAppStyle={props.r_setAppStyle}
                previewAppStyle={previewAppStyle}
                previewAppStyleA = {previewAppStyleA}
                splashStart = {splashStart}

                ThemeColorsAppIndex={ThemeColorsAppIndex}
                ThemeSchema={ThemeSchema}
                LanguageAppIndex={LanguageAppIndex}
            />
        </BottomSheetModal>
        </BottomSheetModalProvider>
    </>);  
};
export default connect(mapStateToProps('SETTINGS_SCREEN'), mapDispatchToProps('SETTINGS_SCREEN'))(Settings);


const BasisList = () =>{
    return(<>
        
    </>)
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
        fontSize: 16,
        //opacity: .9,
        fontWeight: 'bold',
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
        minHeight: 200, 
        paddingHorizontal: 10,
        //justifyContent: 'space-around',
        justifyContent: 'flex-start',
        paddingVertical: 5,
        paddingBottom: 20
    },
    SLParamHeaderText: {
        marginLeft: 5,
        fontSize: 18,
        //position: 'absolute',
        fontWeight: 'bold',
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
        fontSize: 20,
        fontWeight: 'bold',
        //fontStyle: 'italic',
        //color: 'white',
        //opacity: .90,
        //textShadowRadius: 0.5,
        //textShadowColor: 'black',
        letterSpacing: 0.5,
        fontVariant: ['small-caps'],
    }

});