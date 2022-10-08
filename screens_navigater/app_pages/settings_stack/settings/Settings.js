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
} from 'react-native';

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
    Easing 
} from 'react-native-reanimated';
import Constants from "expo-constants";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
    BottomSheetModal,
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

import ThemeRedacor from "./redactors_settings/ThemeRedactor";
import BorderRadiusRedactor from "./redactors_settings/BorderRadiusRedactor";
import NavigateMenuRedactor from "./redactors_settings/NavigateMenuRedactor";
import LoadSplashRedactor  from "./redactors_settings/LoadSplashRedactor";
import LanguageRedactor from "./redactors_settings/LanguageRedactor";
import ListsRedactor from "./redactors_settings/ListsRedactor";
import FunctionButtonRedactor from "./redactors_settings/FunctionButtonRedactor";

import WeatherRedactor from "./redactors_settings/WeatherRedactor";

import Ohter from "./redactors_settings/ohterts";
import StyleChangePreview from "./preview/StyleChangePreview";

import { LinearGradient } from 'expo-linear-gradient';

import ColorSplash from "../../../../componets/StyleColorSplash";

import Classical from "../../../../general_components/tab_bars/Classical";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

const structure = [
    {
        indexSection: 0,
        category: "style",
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
                param: "loadAnimation",
                icon:  "animation-play",
                paramRedactorComponent: LoadSplashRedactor
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
                paramRedactorComponent: null
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
                param:"accost",
                icon:  "account",
                paramRedactorComponent: null
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
                paramRedactorComponent: null
            }, 
             
            {
                param:"ohters",
                icon:  "qrcode-scan",
                paramRedactorComponent: null
            },
        ]
    }
]

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

//bober button heigt = 60
const bottomBord = deviceWidth*0.04+60
const positionBobberButton =(buttonSize)=>({
    center: (deviceWidth*0.5-(buttonSize/2)),
    left: (deviceWidth-5-buttonSize),
    right: (5)
})

const Settings = (props) => {
    //console.log(props)

    const [LanguageAppIndex, setLanguageAppIndex] = useState(languagesApp.indexOf(props.appConfig.languageApp));//ThemesColorsAppList[ThemeColorsAppIndex]
    const [ThemeColorsAppIndex, setThemeColorAppIndex] = useState(themesApp.indexOf(props.appStyle.theme));//LanguagesAppList[LanguageAppIndex]

    const [appStyle, setAppStyle] = useState(props.appStyle);
    const [ThemeSchema, setThemeSchema] = useState(props.appStyle.colorScheme == 'auto'? Appearance.getColorScheme() : props.appStyle.colorScheme)
    const [appConfig, setAppConfig] = useState(props.appConfig);

    const [previewAppStyle, setPreviewAppStyle] = useState(props.appStyle);
    
    store.subscribe(() => {
        let jstore = store.getState();

        if(LanguageAppIndex != languagesApp.indexOf(jstore.appConfig.languageApp)){
            setLanguageAppIndex(languagesApp.indexOf(jstore.appConfig.languageApp))
        }

        if(ThemeColorsAppIndex != themesApp.indexOf(jstore.appStyle.theme)){
            setThemeColorAppIndex(themesApp.indexOf(jstore.appStyle.theme));
        }

        if(ThemeSchema != jstore.appStyle.colorScheme){
            setThemeSchema(jstore.appStyle.colorScheme == 'auto'? Appearance.getColorScheme() : jstore.appStyle.colorScheme);
        }

        if (appStyle != jstore.appStyle) {
            setAppStyle(jstore.appStyle);
        }

        if (appConfig != jstore.appConfig) {
            setAppConfig(jstore.appConfig);
        }
    })
    
    Appearance.addChangeListener(({colorScheme})=>{
        if(appStyle.colorScheme == 'auto'){
            setThemeSchema(colorScheme)
        }
    })

    const sectListRef = useRef();
    const flatCategorysListRef = useRef();
    const flatListRef = useAnimatedRef(); 

    const Thema = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen

    const [accentParam, setAccentParam] = useState(0);
    //const [accentCategory, setAccentCategory] = useState(0);
    const accentCategory = useSharedValue(0);

    const [listWidths, setListWidths] = useState([]);
    const [listHeights, setListHeights] = useState([]);
    const animValueListWidths = useSharedValue([]);
    const animValueListHeights = useSharedValue([]);
    const derivedValues = useSharedValue({
        listHeights: [],
        listWidths: [],
        shifts: [],
        intervals: [],
        limits: []
    })
    
    const [previewFixed, setPreviewFixed] = useState(false);

    const animValueWidthLine = useSharedValue(
        (((Language.StructureScreen.params[allStructurParams[0].param]).length) * (staticStyles.frontFLText.fontSize * 0.75) + 10)
    );
    const animValueMarginLeft = useSharedValue(0);
    const animValueTranslateX = useSharedValue(0);

    

    const [splashTheme, setSplashTheme] = useState(0)
    const [splashVisible, setSplashVisible] = useState(false);
    
    const animValueBobberButtonVisible = useSharedValue(bottomBord);
    //const animValueBobberButtonExpand = useSharedValue(0);

    const animValueScrollY = useSharedValue(0)

    const itemCategoryHeight = 30

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (e, ctx) => {
            animValueTranslateX.value = -(e.contentOffset.x)
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
            splashOut()    
        //}
    }

    const splashOut = ()=>{
        let newAppStyle = previewAppStyle
        //console.log('fine ',newAppStyle)
        setAppStyle(newAppStyle)
        dataRedactor("storedAppStyle",newAppStyle);
        props.r_setAppStyle(newAppStyle);
    }

    const newCategoryOnAccent = (accent)=>{
        flatCategorysListRef.current.scrollToIndex({
            index: allStructurParams[accent].indexSection
        })
    }

    

    const scrollSectionsList = useAnimatedScrollHandler({
        onScroll: (event, ctx) => {
        
            let isUpScroll = false;
            let isEnd = false;
            let isStart = false;

            if(Math.abs(event.velocity.y).toFixed(4) != 0){
                isUpScroll = (event.velocity.y).toFixed(4) < 0.0001;
            }

            isEnd = (event.layoutMeasurement.height + event.contentOffset.y) >= (event.contentSize.height - 5);
            isStart = event.contentOffset.y > (deviceHeight/2+50); //scroll>preview
            let visibleBobber = ((isUpScroll || isEnd) && isStart) && !previewFixed

            cancelAnimation(animValueBobberButtonVisible);
            animValueBobberButtonVisible.value = visibleBobber? 0 : bottomBord

            let useScroll = event.contentOffset.y
            animValueScrollY.value = -(useScroll < 0? 0 : useScroll)
        },
    })

    const previewHeight = (50+deviceHeight/2)+(!previewFixed? appStyle.lists.proximity : 0)
    const settingsInfoHeight = (deviceHeight/4)+2*(!previewFixed? appStyle.lists.proximity : 0)

    const countDerivedValues = () =>{

        const intervals = []//[{left: 0, right: 100}, ...]
        for(let i = 0; i < allStructurParams.length; i++){
            let right = -1;
            let left = -1;
            if(!previewFixed){
                right += (previewHeight)
            }
            if(allStructurParams[i].indexSection == 1){
                if(!previewFixed){
                    right += (settingsInfoHeight)
                } else {
                    right += (previewHeight)
                }
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
                centrallFront = -Math.round((deviceWidth-listWidths[param])/2) 
            }
            let resOffset = centrallFront+shift
            if(resOffset < 0){resOffset = 0}
            shifts.push(resOffset)
        } 

     
        const limList = []//[{less: 30, more: 70}, ...]
        for(let param = 0; param < allStructurParams.length; param++){
            const interval = listHeights.reduce(((countValue, currentValue, index)=>(index < param? (countValue+currentValue) : countValue)), 0)
            limList.push({
                less: 0.3*listHeights[param]+interval, 
                more: 0.7*listHeights[param]+interval
            })
        }

        derivedValues.value = {
            listHeights: listHeights,
            listWidths: listWidths,
            shifts: shifts,
            intervals: intervals,
            limits: limList
        }
    }
    useEffect(()=>{countDerivedValues()},[previewFixed, LanguageAppIndex])//appStyle.lists.proximity



    const logg = (info) =>{
        console.log(info)
    }
    
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

        let yScroll = Math.abs(animValueScrollY.value)


        const countAccent = intervals.findIndex((el, index)=>(
            (el.left<=yScroll && yScroll<=el.right) || 
            (index == 0 && yScroll < el.left) || 
            (index == intervals.length-1 && yScroll > el.right) 
        ))


        let accentBarXScroll = (yScroll- (!previewFixed? previewHeight : 0) )
        if(accentBarXScroll<0){accentBarXScroll = 0}

        let compens = 0
        const over = aListHeights.reduce(((countValue, currentValue, index)=>(index <= (countAccent-1)? (countValue+currentValue) : countValue)), 0)
        if(allStructurParams[countAccent].indexSection == 1){
            if(over < accentBarXScroll){
                compens =  accentBarXScroll-over
                let ignoreHeight = settingsInfoHeight
                if(previewFixed){
                    ignoreHeight = previewHeight
                } 
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

        accentBarXScroll = current + action


            let width = Math.round(aListWidths[countAccent]-10);
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

            accentCategory.value = allStructurParams[countAccent].indexSection


        scrollTo(
            flatListRef, //ref
            accentBarXScroll, //x offset
            0, //y offset
            true //animate
        )
    })


    const selectParametr = (item, index) => {
        let itemIndex = 0;
        let sectionIndex = 0;
        for(let i = 0; i<structure.length; i++){               
            for(let j = 0; j<structure[i].data.length; j++){
                if(structure[i].category === item.category && structure[i].data[j].param === item.param){
                    itemIndex = j;
                    sectionIndex = i;
                    break;
                }
            }
        }
        
        sectListRef.current.scrollToLocation({
            itemIndex: itemIndex+1,
            sectionIndex: sectionIndex,
            animated: false
        })
    }

    const stacker = (list, setList, newValue) => {
        newValue = Math.round(newValue);
        if (list.length >= allStructurParams.length){
            setList([newValue]);
        } else {
            list.push(newValue);
            setList(list); 
        }
        //console.log('r')
        if(
            (listHeights.length == listWidths.length && listHeights.length == allStructurParams.length) 
            || (derivedValues.value.listHeights != listHeights || derivedValues.value.listWidths != listWidths)
        ){
            //console.log('new full renders')
            countDerivedValues()
        }
    };

    const jumpPress =()=>{
        console.log('pressj')

        sectListRef.current.scrollToLocation({
            itemIndex: 0,
            sectionIndex: 0,
            viewPosition: 1,
            animated: false,
        })
    }

   

    const animStyleBobberButton = useAnimatedStyle(() => {
        const duration = 400;
        return {
            //opacity: withTiming(animValueBobberButtonVisible.value == 0? 1 : 0, {duration: duration}),
            transform: [
                {translateY: withTiming(animValueBobberButtonVisible.value, {duration: duration})}
            ] 
        }
    })
    const animStyleBobber1 = useAnimatedStyle(() => {
        const duration = 200;
        return {
            //opacity: withTiming(animValueBobberButtonExpand.value == 1? 1 : 0.9, {duration: duration}),
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

    const getNewAppStyleObject =()=>{
        return copyObject(previewAppStyle)
    }
  
    const applyPress =()=>{
        console.log('pressa')
        
        splashOut()
        //splashStart(previewAppStyle.theme, themesApp.indexOf(previewAppStyle.theme));
    }  
    
    //category updater
    const categoryStyle = useAnimatedStyle(()=>{
        const duration = 250
        return {
            opacity: withSequence(withTiming(0*accentCategory.value, {duration: 0}), withTiming(1, {duration: duration}))
        }
    })
    const categoryText = useAnimatedProps(()=>{
        return {
            text: Language.StructureScreen.categorys[accentCategory.value],
        }
    },[Language])

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
            paddingHorizontal:  withTiming((5 * appStyle.borderRadius.basic/32), {duration: duration}),
        }
    })

    const dynamicStyleBobberButton = useAnimatedStyle(()=>{
        const duration = 300
        const position =(buttonSize)=>({
            center: (deviceWidth*0.5-(buttonSize/2)),
            left: (deviceWidth-5-buttonSize),
            right: (5)
        })
        return {
            height:  withTiming(5+2*appStyle.functionButton.size, {duration: duration}),
            width:  withTiming(appStyle.functionButton.size, {duration: duration}),
            bottom:  withTiming((appStyle.navigationMenu.height + 5), {duration: duration}),
            right: withTiming( (position(appStyle.functionButton.size)[appStyle.functionButton.position]), {duration: duration}),
        }
    })

    const back = () => {
        props.navigation.goBack()
    }


    // ref
    const bottomSheetModalRef = useRef(BottomSheetModal);

    // variables
    const snapPoints = useMemo(() => ['25%', '50%'], []);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
        props.r_setPreviewOpen(true)
    }, []);
    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
        if(index === -1){
            props.r_setPreviewOpen(false)
        }
    }, []);

    return (
    <>  
        <View
            style={[
                staticStyles.FlatListsArea,
                {
                    backgroundColor: Thema.basics.accents.primary,
                    //height: (Constants.statusBarHeight+1)+ 30 + 35,
                    paddingTop: (Constants.statusBarHeight+1)
                }
            ]}
        >   
            <View
                style={{
                    flexDirection: 'row',
                    height: itemCategoryHeight
                }}
            >
                <View 
                    style = {[staticStyles.SLtopBord,{ 
                        //alignItems: 'flex-end',
                        //backgroundColor: 'red',
                        //zIndex: 5
                        flex: 1,
                        //justifyContent: 'space-between',
                        
                    }]}
                >
                    <View
                        style = {{
                            height: 30,
                            flex: 1,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}
                    >
                        {appStyle.navigationMenu.type == 'not' &&
                        <BasePressable 
                            type="i"
                            icon={{name: "backburger", size: 25, color: Thema.texts.neutrals.primary}}
                            style={{
                                height: 30, 
                                width: 30, 
                                marginLeft: 15,
                            }}
                            onPress={back}
                            rippleColor={Thema.texts.neutrals.primary}
                        />
                        }
                        {appStyle.navigationMenu.type != 'not' && <View style={{height: 30, width: 30}}/>}
                        <Text style = {[staticStyles.AnimatedHeaderText, {color: Thema.texts.neutrals.primary}]}>
                            {Language.HeaderTitle}
                        </Text>
                    </View>
                </View>
                <Reanimated.View
                    style = {[staticStyles.SLtopBord, { 
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                    }]}
                >
                    <ReanimatedTextInput     
                        editable = {false}
                        style = {[staticStyles.AnimatedHeaderText, categoryStyle, {color: Thema.texts.neutrals.primary}]}
                        animatedProps={categoryText}
                    />
                </Reanimated.View>
            </View>
            <View style={[staticStyles.FlatListsArea]}>
                <Reanimated.View 
                    style={[animStyleIndicatorLine, { 
                        backgroundColor: Thema.icons.accents.quaternary,
                        position: 'absolute',
                        bottom: 0,
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
                    onScroll={scrollHandler}
                    data={allStructurParams}
                    keyExtractor={item => item.param}
                    renderItem={({item, index})=> {
                        return (
                        <View
                            key={String(item.param+index)}  
                            style={staticStyles.frontFLArea}
                            onLayout={(event)=>{stacker(listWidths, setListWidths, (event.nativeEvent.layout.width+2*staticStyles.frontFLArea.marginHorizontal))}}
                        >
                            <BasePressable
                                type={'t'}
                                style={staticStyles.frontFLPressable}
                                text={Language.StructureScreen.params[item.param]}
                                textStyle={[staticStyles.frontFLText, {color: Thema.texts.neutrals.primary}]}
                                rippleColor={false}
                                onPress={()=>{selectParametr(item, index)}}
                            />
                        </View>
                        )
                    }}
                />
            </View>
        </View>
        <ReanimatedSectionList
            ref={sectListRef}
            stickySectionHeadersEnabled={previewFixed}
            showsVerticalScrollIndicator={false}
            onScroll={scrollSectionsList}
            sections={structure}
            keyExtractor={(item, index) => item.param + index}
            renderSectionHeader={({section: {category}})=>{
                return(
                    <Reanimated.View
                        key={String(category)} 
                        style={[
                            (previewFixed || appStyle.lists.shadow)? staticStyles.shadow : {}, 
                            {                 
                                backgroundColor: Thema.basics.grounds.primary,
                                marginVertical: !previewFixed? appStyle.lists.proximity  : 0, 
                                marginTop: category == 'style'? 0 : (!previewFixed? appStyle.lists.proximity : 0),
                                //position: 'absolute',
                                //zIndex: 999
                            }
                        ]}
                    >
                        {category == 'style' &&                  
                        <StyleChangePreview
                            appStyle={appStyle}
                            setAppStyle={setAppStyle}
                            r_setAppStyle={props.r_setAppStyle}

                            previewAppStyle={previewAppStyle}

                            splashStart = {splashStart}

                            previewFixed={previewFixed}
                            setPreviewFixed={setPreviewFixed}

                            ThemeColorsAppIndex={ThemeColorsAppIndex}
                            ThemeSchema={ThemeSchema}
                            LanguageAppIndex={LanguageAppIndex}
                        />}
                        {category == 'system' && 
                            <View
                                style={{
                                    height: deviceHeight/4,
                                    //zIndex: 999
                                }}
                            >
                                <Text>
                                    Hello ...info
                                </Text>
                            </View>
                        }
                    </Reanimated.View>
                )
            }}
            renderItem={({item, index})=>{
                const RedactorComponent = item.paramRedactorComponent;
                const redactorName = Language.StructureScreen.params[
                    //allStructurParams.findIndex((element, index)=>{
                    //    if(item.param == element.param){return index+1}
                    //})
                    item.param
                ]
                return (
                    <Reanimated.View
                        key={String(item.param+index)}  
                        style={[
                            staticStyles.SLArea, 
                            appStyle.lists.shadow? staticStyles.shadow : {},
                            dynamicStyleListItems,
                            {
                                backgroundColor: Thema.basics.grounds.primary,   
                                justifyContent: 'flex-start',
                                paddingVertical: 5,// + 10 * appStyle.borderRadius.basic/32,

                                //borderRadius: appStyle.borderRadius.basic,
                                //marginHorizontal: appStyle.lists.fullWidth? 0 : 10,
                                //marginVertical: appStyle.lists.proximity,
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
                                marginBottom: 10, 
                                alignItems: 'center',

                                //paddingHorizontal: 5 * appStyle.borderRadius.basic/32 
                            }]}
                        >
                            <MaterialCommunityIcons name={item.icon} size={20} color={Thema.texts.neutrals.secondary} />
                            <Text style={[staticStyles.SLParamHeaderText, {color: Thema.texts.neutrals.secondary}]}>{redactorName}</Text>
                        </Reanimated.View>
                        {RedactorComponent != null && 
                        <RedactorComponent
                            appStyle={appStyle}
                            setAppStyle={setAppStyle}
                            r_setAppStyle={props.r_setAppStyle}

                            previewAppStyle={previewAppStyle}

                            getNewAppStyleObject={getNewAppStyleObject}
                            setPreviewAppStyle={setPreviewAppStyle}

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
                const statusBarHeight = 30
                const headerHeigt = 0//30 + 35
                const navigateMenuHeight = 0 // if navigatemenu = 'hidden'->80, 'classical_animated'->130, 'classical'->100,
                let lastObject = listHeights[listHeights.length-1]
                lastObject = (lastObject == NaN || lastObject == undefined)? 160 : lastObject
                return (
                    <View style={{
                            height: deviceHeight ,//- statusBarHeight - headerHeigt - lastObject - navigateMenuHeight,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text>till all</Text>
                        <Button
                        onPress={handlePresentModalPress}
                        title="Present Modal"
                        color="black"
                        />
                    </View>
                )
            }}
        />
        
        

        {/*BOBBER BUTTON*/}
        <Reanimated.View 
            style = {[animStyleBobberButton, dynamicStyleBobberButton, {
                position: 'absolute',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',

                //height: 5+2*appStyle.functionButton.size,
                //width: appStyle.functionButton.size,
                //bottom: appStyle.navigationMenu.height + 5,//'8%', // if navigatemenu = 'hidden'->2, 'classical_animated'->8, 'classical'->8, 
                //right: positionBobberButton(appStyle.functionButton.size)[appStyle.functionButton.position]
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
                            icon={{name: iconName, size: 24, color: Thema.icons.neutrals.primary}}
                            style={{
                                height: appStyle.functionButton.size,
                                width: appStyle.functionButton.size,
                                borderRadius: appStyle.borderRadius.additional,
                                backgroundColor: Thema.basics.accents.secondary,
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
                                color: Thema.icons.accents.quaternary,
                                borderless: true,
                                foreground: false
                            }}
                            onPress={pressFunction}
                        />
                    </Reanimated.View>
                )
            })}
        </Reanimated.View>

        {/*STYLE UPDATE*/}
        <ColorSplash
            theme={splashTheme}
            splashVisible = {splashVisible} 
            setSplashVisible = {setSplashVisible} 
            splashOut = {splashOut}
        />
        <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <View style={{}}>
            <Text>Awesome 🎉</Text>
          </View>
        </BottomSheetModal>
        </BottomSheetModalProvider>
    </>);  
};
export default connect(mapStateToProps('SETTINGS_SCREEN'), mapDispatchToProps('SETTINGS_SCREEN'))(Settings);

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
        justifyContent: 'space-around',
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