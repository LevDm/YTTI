import React, { useState, useRef, useEffect } from "react";
import { 
    StyleSheet, 
    Text, 
    Pressable, 
    FlatList, 
    SectionList, 
    View, 
    Dimensions, 
} from 'react-native';
import Animated, {
    useSharedValue, 
    useAnimatedStyle, 
    withTiming, 
    useAnimatedScrollHandler, 
    cancelAnimation,
    useAnimatedRef,
    useDerivedValue,
    scrollTo,
    runOnJS,
    interpolateColor,
    interpolate,
    Extrapolate,
    runOnUI, 
} from 'react-native-reanimated';
import Constants from "expo-constants";


import themesColorsAppList, {themesApp} from "../Themes";
import languagesAppList, {languagesApp} from "../Languages";

import store from "../redux_files/store";
import {connect} from 'react-redux';
import mapStateToProps from "../redux_files/stateToProps";
import mapDispatchToProps from "../redux_files/dispatchToProps";

import dataRedactor from "../async_data_manager/data_redactor";

import { 
    BasePressable,
    BaseCheckBox,
    BaseSwitch 
} from "../componets/base/BaseElements";

import ThemeRedacor from "./redactorsSettings/ThemeRedactor";
import BorderRadiusRedactor from "./redactorsSettings/BorderRadiusRedactor";
import NavigateMenuRedactor from "./redactorsSettings/NavigateMenuRedactor";
import LoadSplashRedactor  from "./redactorsSettings/LoadSplashRedactor";
import LanguageRedactor from "./redactorsSettings/LanguageRedactor";
import ListsRedactor from "./redactorsSettings/ListsRedactor";
import FunctionButtonRedactor from "./redactorsSettings/FunctionButtonRedactor";

import TextAnimate from "../componets/TextAnimate";

import Ohter from "./redactorsSettings/ohterts";
import StyleChangePreview from "./StyleChangePreview";
import BobberButton from "./SettingsBobberButton";
import { LinearGradient } from 'expo-linear-gradient';

import ColorSplash from "../componets/StyleColorSplash";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

const structure = [
    {
        indexSection: 0,
        category: "style",
        data: [
            {
                param: "theme", 
                paramRedactorComponent: ThemeRedacor
            },
            {
                param: "angle",
                paramRedactorComponent: BorderRadiusRedactor
            },
            {
                param: "navigate menu",
                paramRedactorComponent: NavigateMenuRedactor
            },
            {
                param: "load splash",
                paramRedactorComponent: LoadSplashRedactor
            },
            {
                param: "lists",
                paramRedactorComponent: ListsRedactor
            },
            {
                param: "function button",
                paramRedactorComponent: FunctionButtonRedactor
            }, 
        ]
    },
    {   
        indexSection: 1,
        category: "system",
        data: [
            {
                param: "language",
                paramRedactorComponent: LanguageRedactor
            }, 
            {
                param:"location",
                paramRedactorComponent: null
            }, 
            {
                param:"screens",
                paramRedactorComponent: null
            }, 
            {
                param:"accost",
                paramRedactorComponent: null
            },
            {
                param:"weather",
                paramRedactorComponent: null
            }, 
            {
                param:"ohter",
                paramRedactorComponent: null
            },
        ]
    }
]

const allStructurParams = [];
for (let el of structure){
    for (let item of el.data){
        allStructurParams.push({param: item.param, category: el.category, indexSection: el.indexSection});
    }
}

const allCategorys = [];
for (let el of structure){
    //for (let item of el.data){
        allCategorys.push({category: el.category, indexSection: el.indexSection});
    //}
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

//bober button heigt = 60
const bottomBord = deviceWidth*0.04+60
const positionBobberButton =(buttonSize)=>({
    center: (deviceWidth*0.5-(buttonSize/2)),
    left: (deviceWidth-5-buttonSize),
    right: (5)
})

const SettingsScreen = (props) => {
    store.subscribe(() => {
        let jstore = store.getState();

        if(LanguageAppIndex != languagesApp.indexOf(jstore.appConfig.languageApp)){
            setLanguageAppIndex(languagesApp.indexOf(jstore.appConfig.languageApp))
        }

        if(ThemeColorsAppIndex != themesApp.indexOf(jstore.appStyle.theme)){
            setThemeColorAppIndex(themesApp.indexOf(jstore.appStyle.theme));
        }

        if (appStyle != jstore.appStyle) {
            setAppStyle(jstore.appStyle);
        }

        if (appConfig != jstore.appConfig) {
            setAppConfig(jstore.appConfig);
        }
    })

    const [LanguageAppIndex, setLanguageAppIndex] = useState(languagesApp.indexOf(props.appConfig.languageApp));//ThemesColorsAppList[ThemeColorsAppIndex]
    const [ThemeColorsAppIndex, setThemeColorAppIndex] = useState(themesApp.indexOf(props.appStyle.theme));//LanguagesAppList[LanguageAppIndex]

    const Thema = themesColorsAppList[ThemeColorsAppIndex]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen

    const [appStyle, setAppStyle] = useState(props.appStyle);
    const [appConfig, setAppConfig] = useState(props.appConfig);

    const [previewAppStyle, setPreviewAppStyle] = useState(props.appStyle);

    const sectListRef = useRef();
    const flatCategorysListRef = useRef();
    const flatListRef = useAnimatedRef(); 

   
    const [accentParam, setAccentParam] = useState(0);
  

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
        (((Language.StructureScreen.params[0]).length) * (staticStyles.frontFLText.fontSize * 0.75) + 10)
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
        const duration = 170;
        return {
            width: withTiming(animValueWidthLine.value, {duration: duration-20}),
            left: withTiming(5+animValueMarginLeft.value, {duration: duration}),
            transform: [
                {translateX: animValueTranslateX.value}
            ] 
        }
    })

    

    const splashStart = (themeIndex) => {
        //if(appStyle.theme != theme){

            setSplashTheme(themeIndex);
            setSplashVisible(true);    
        //}
    }

    const splashOut = ()=>{
        let newAppStyle = previewAppStyle

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
    useEffect(()=>{countDerivedValues()},[previewFixed, appStyle])

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


        if(countAccent != accentParam){
            let width = Math.round(aListWidths[countAccent]-10);
            if(isNaN(width) || width  === undefined){
                const numberPrimelSymbols = (Language.StructureScreen.params[0]).length;
                const widthSymbol = staticStyles.frontFLText.fontSize * 0.75;
                width = numberPrimelSymbols * widthSymbol + 10;
            }
            const left = aListWidths.reduce(((countValue, currentValue, index)=>(index < countAccent? (countValue+currentValue) : countValue)), 2);

            cancelAnimation(animValueWidthLine);
            cancelAnimation(animValueMarginLeft);

            animValueWidthLine.value = width;
            animValueMarginLeft.value = left;

            runOnJS(setAccentParam)(countAccent)
            runOnJS(newCategoryOnAccent)(countAccent)
        }


        scrollTo(
            flatListRef, //ref
            accentBarXScroll, //x offset
            0, //y offset
            true //animate
        )
    })


    const selectParametr = (item, index) => {
        if(index != accentParam){
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
    }

    const stacker = (list, setList, newValue) => {
        newValue = Math.round(newValue);
        if (list.length >= allStructurParams.length){
            setList([newValue]);
        } else {
            list.push(newValue);
            setList(list); 
        }

        if(
            (((animValueListHeights.value).length != listHeights.length || animValueListHeights.value != listHeights.length) && listHeights.length == allStructurParams.length) ||
            (((animValueListWidths.value).length != listWidths.length || animValueListWidths.value != listWidths.length) && listWidths.length == allStructurParams.length)
        ){
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

    return (
    <>  
        <View
            style={[
                staticStyles.FlatListsArea,
                {
                    backgroundColor: Thema.accents.primary,
                    //height: (Constants.statusBarHeight+1)+ 30 + 35,
                    paddingTop: (Constants.statusBarHeight+1)
                }
            ]}
        >   
            <View
                style={{
                    flexDirection: 'row',
                }}
            >
                <View 
                    style = {[staticStyles.SLtopBord,{ 
                        alignItems: 'flex-end'
                    }]}
                >
                    <View
                        style = {{
                            height: 30,
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                        }}
                    >
                        <Text style = {[staticStyles.AnimatedHeaderText, {color: Thema.neutrals.primary}]}>
                            {Language.HeaderTitle}
                        </Text>
                    </View>
                </View>
                <View 
                    style = {[staticStyles.SLtopBord,{ 
                        alignItems: 'flex-start',
                    }]}
                >
                    <FlatList
                        ref={flatCategorysListRef}
                        style = {{
                            height: itemCategoryHeight
                        }}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        snapToInterval={itemCategoryHeight}
                        getItemLayout={(data, index) => (
                            {
                                length: itemCategoryHeight, 
                                offset: itemCategoryHeight * index, 
                                index: index
                            }
                        )}
                        initialScrollIndex={0}
                        data={allCategorys}
                        keyExtractor={(item, index) => {
                            return item.category + index
                        }}
                        renderItem={({item, index})=>(
                            <View
                                style = {{
                                    height: 30,
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                }}
                            >
                                <Text style = {[staticStyles.AnimatedHeaderText, {color: Thema.neutrals.primary}]}>
                                    {Language.StructureScreen.categorys[item.indexSection]}
                                </Text>
                            </View>
                        )}
                    />
                </View>
            </View>
            <View style={[staticStyles.FlatListsArea]}>
                <Animated.View 
                    style={[animStyleIndicatorLine, { 
                        backgroundColor: Thema.accents.quaternary,
                        position: 'absolute',
                        bottom: 0,
                        height: 4,
                        borderRadius: 5,
                        borderBottomRightRadius: 0,
                        borderBottomLeftRadius: 0,
                    }]}  
                />
                <AnimatedFlatList
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
                                text={Language.StructureScreen.params[index]}
                                textStyle={[staticStyles.frontFLText, {color: Thema.neutrals.primary}]}
                                rippleColor={Thema.accents.quaternary}
                                onPress={()=>{selectParametr(item, index)}}
                            />
                        </View>
                        )
                    }}
                />
            </View>
        </View>
        <AnimatedSectionList
            ref={sectListRef}
            stickySectionHeadersEnabled={previewFixed}
            showsVerticalScrollIndicator={false}
            onScroll={scrollSectionsList}
            sections={structure}
            keyExtractor={(item, index) => item.param + index}
            renderSectionHeader={({section: {category}})=>{
                return(
                    <Animated.View
                        key={String(category)} 
                        style={[
                            (previewFixed || appStyle.lists.shadow)? staticStyles.shadow : {}, 
                            {                 
                                backgroundColor: 'white',
                                marginVertical: !previewFixed? appStyle.lists.proximity  : 0, 
                                marginTop: category == 'style'? 0 : (!previewFixed? appStyle.lists.proximity : 0),
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
                            LanguageAppIndex={LanguageAppIndex}
                        />}
                        {category == 'system' && 
                            <View
                                style={{
                                    height: deviceHeight/4,
                                }}
                            >
                                <Text>
                                    Hello ...info
                                </Text>
                            </View>
                        }
                    </Animated.View>
                )
            }}
            renderItem={({item, index})=>{
                const RedactorComponent = item.paramRedactorComponent;
                const redactorName = Language.StructureScreen.params[
                    allStructurParams.findIndex((element, index)=>{
                        if(item.param == element.param){return index+1}
                    })
                ]
                return (
                    <Animated.View
                        key={String(item.param+index)}  
                        style={[
                            staticStyles.SLArea, 
                            appStyle.lists.shadow? staticStyles.shadow : {},
                            {
                                borderRadius: appStyle.borderRadius.basic,
                                paddingVertical: 5,// + 10 * appStyle.borderRadius.basic/32,
                                marginHorizontal: appStyle.lists.fullWidth? 0 : 10,
                                marginVertical: appStyle.lists.proximity,
                                justifyContent: 'flex-start'
                            }
                        ]}
                        onLayout={(event)=>{stacker(listHeights, setListHeights, event.nativeEvent.layout.height+2*appStyle.lists.proximity)}}
                    >   
                        <View
                            style={{ 
                                flexDirection: 'row', 
                                width: '100%',
                                marginBottom: 10, 
                                alignItems: 'center',
                                paddingHorizontal: 5 * appStyle.borderRadius.basic/32 
                            }}
                        >
                            <Text style={staticStyles.SLParamHeaderText}>{redactorName}</Text>
                            <Text style={[staticStyles.SLParamHeaderText, {backgroundColor: '#aaaaaa1f', borderRadius: 15, width: 24, height: 24, textAlign: 'center', marginLeft: 10, fontSize: 18}]}>?</Text>
                        </View>
                        {RedactorComponent != null && 
                        <RedactorComponent
                            appStyle={appStyle}
                            setAppStyle={setAppStyle}
                            r_setAppStyle={props.r_setAppStyle}
                            getNewAppStyleObject={getNewAppStyleObject}
                            setPreviewAppStyle={setPreviewAppStyle}

                            appConfig={appConfig}
                            r_setAppConfig={props.r_setAppConfig}
                            getNewAppConfigObject={getNewAppConfigObject}

                            ThemeColorsAppIndex={ThemeColorsAppIndex}
                            LanguageAppIndex={LanguageAppIndex}
                        />}
                        
                    </Animated.View>
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
                    </View>
                )
            }}
        />
        
        

        {/*BOBBER BUTTON*/}
        <Animated.View 
            style = {[animStyleBobberButton, {
                position: 'absolute',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                height: 5+2*appStyle.functionButton.size,
                width: appStyle.functionButton.size,
                bottom: appStyle.navigationMenu.height + 5,//'8%', // if navigatemenu = 'hidden'->2, 'classical_animated'->8, 'classical'->8, 
                right: positionBobberButton(appStyle.functionButton.size)[appStyle.functionButton.position]
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
                    <Animated.View
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
                                backgroundColor: Thema.accents.secondary,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 4,
                            }}
                            onPress={pressFunction}
                        />
                    </Animated.View>
                )
            })}
        </Animated.View>

        {/*STYLE UPDATE*/}
        <ColorSplash
            theme={splashTheme}
            splashVisible = {splashVisible} 
            setSplashVisible = {setSplashVisible} 
            splashOut = {splashOut}
        />
    </>);  
};
export default connect(mapStateToProps('SETTINGS_SCREEN'), mapDispatchToProps('SETTINGS_SCREEN'))(SettingsScreen);

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
        opacity: .9,
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
        backgroundColor: 'white',
        minHeight: 200, 
        paddingHorizontal: 10,
        justifyContent: 'space-around',
    },
    SLParamHeaderText: {
        fontSize: 20,
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
        opacity: .90,
        //textShadowRadius: 0.5,
        //textShadowColor: 'black',
        letterSpacing: 0.5,
        fontVariant: ['small-caps'],
    }

});