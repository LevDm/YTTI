import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
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
    useAnimatedReaction
} from 'react-native-reanimated';

import { Svg, Path } from "react-native-svg";
import { BlurView } from "@react-native-community/blur";
import MaskedView from '@react-native-masked-view/masked-view';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


import SkiaViewDisign from "../../../general_components/base_components/SkiaViewDisign";

import themesColorsAppList, {themesApp} from "../../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../../app_values/Languages";


const { height: DEVICE_H, width: DEVICE_W } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Constants.statusBarHeight
//const SCREEN_PROXIMYTY_HRZ = listsHorizontalProximity['true']

const RPressable = Reanimated.createAnimatedComponent(Pressable);
const ReanimatedPath = Reanimated.createAnimatedComponent(Path);
const RMaskedView = Reanimated.createAnimatedComponent(MaskedView)


const OS_NAVIGATION_BAR_HEIGHT = Dimensions.get('screen').height - (Dimensions.get('window').height + Constants.statusBarHeight)


import values from "./common_values";
const {
    STYCKYS_HEIGHT,
    HEADER_TOOL_HEIGHT,
    SECTIONS_SELECTOR_HEIGHT,
    PRIMARY_HEADER_HEIGHT,
    SECONDARY_HEADER_HEIGHT,

    LIST_ITEM_SIZE,
    HEAD_COMPONENT_HEIGHT,

    MARGIN_BOBBER,

    TRANSPARENT_COLOR
} = values


const listHeights = [LIST_ITEM_SIZE.h * 3, LIST_ITEM_SIZE.h* 2, LIST_ITEM_SIZE.h* 2, LIST_ITEM_SIZE.h* 1, LIST_ITEM_SIZE.h]


import { structureCustomizer as tasksStructure  } from "./tools";

const blobRadius = 0 
const blobHeight = 3.5 
const liheHeight = 3

const OPEN_BLOB = 0.4
const CLOSE_BLOB = blobHeight

const BLOB_INDICATOR_HEIGHT = blobHeight+liheHeight 


const HEADER_SELECTOR_HRZ_PADDING = 12

const SELECTOR_ITEM_MARGIN_BETWEEN = 8 //5 + 5
const SELECTOR_ITEM_PADDING_HRZ = 24

const CHANGE_DURATION = 400

export default HeaderCategorys = (props) => {
    const {

        animValueScrollY,
        openItem,

        showSection,

        appStyle,
        appConfig,
        LanguageAppIndex,
        ThemeColorsAppIndex,
        ThemeSchema,

        uiStyle,
        uiTheme,
    } = props

    const {
        lists: {
            invertColorsHeader
        }
    } = uiStyle

    const {
        basics: {
            accents: {
                primary: basicAP,
                quaternary: basicAQ
            },
        },
        texts: {
            accents: {
                primary: textAP,
            },
            neutrals: {
                primary: textNP,
                secondary: textNS,
            }
        }
    } = uiTheme

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].TasksScreen

    const animSelectorLine = useDerivedValue(()=> (Math.max((SECTIONS_SELECTOR_HEIGHT+HEAD_COMPONENT_HEIGHT-(STYCKYS_HEIGHT+12.5)+ animValueScrollY.value ), 0)))

    const animValueTranslateX = useSharedValue(0);

    const flatListRef = useAnimatedRef(); 
    const animValueWidthLine = useSharedValue(0)
    const animValueMarginLeft = useSharedValue(0);

    const lastCountAccent = useSharedValue({n: 0, o: -1})

    
    const svgWidth = useSharedValue(0)
    const svgUP = useSharedValue(CLOSE_BLOB)
    
    const listWidths = useRef([]);
    const stackWidths = useRef(new Array(tasksStructure.length));

    const logg = (info) =>{
        'worklet';
        console.log('lg_'+info)
    }


    //const listHeights = useRef([]);
    //const stackHeights = useRef(new Array(allStructurParams.length));

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

        const intervals = []//[{left: 0, right: 100}, ...]
        for(let i = 0; i < tasksStructure.length; i++){
            let right = -1
            let left = -1
            
            right += (SECTIONS_SELECTOR_HEIGHT+top) -HEADER_TOOL_HEIGHT//-horizontalProximity //-headerStickysHeight //-headerStickysFullHeight//+-selectorLineHeight -6
            
            if(tasksStructure[i].indexSection != 0){               
                right += tasksStructure[i].indexSection*(STYCKYS_HEIGHT)
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
        for(let param = 0; param <= tasksStructure.length; param++){
            const maxAccepIndex = widths.length-1;
            let centrallFront = 0;
            //left shift 
            const shift = widths.reduce(((countValue, currentValue, index)=>(index < param? (countValue+currentValue) : countValue)), 0)
            //shifts for position in center
            if(1 <= param && param <= maxAccepIndex-1){ 
                centrallFront = -((DEVICE_W-widths[param])/2) //-Math.round((deviceWidth-listWidths[param])/2) 
            }
            let resOffset = centrallFront+shift
            if(resOffset < 0){resOffset = 0}
            shifts.push(resOffset)
        } 

        const lessCooef = 0.2
        const moreCooef = 1 - 0.4 //default 1-lessCooef
     
        const limList = []//[{less: 30, more: 70}, ...]
        for(let param = 0; param < tasksStructure.length; param++){
            const interval = heights.reduce(((countValue, currentValue, index)=>(index < param? (countValue+currentValue) : countValue)), 0)
            limList.push({
                less: lessCooef*heights[param]+interval, 
                more: moreCooef*heights[param]+interval
            })
        }

        const indexs = []
        for(let i=0; i<tasksStructure.length; i++){
            indexs[i] = 0 + i>0? (indexs[i-1]+tasksStructure[i-1].data.length) : 0
        }
        const categoryIntervals = []
        for(let i = 0; i<indexs.length ; i++){
            let value = (widths).reduce(((countValue, currentValue, index)=>(index < indexs[i]? (countValue+currentValue) : countValue)), 0)
            let center = DEVICE_W/2 - (widths)[indexs[i]]/2
            center = (center >  value? 0 : center)
            categoryIntervals.push(value-center)      
        }

        //return 

        const res = {
            listWidths: widths,
            shifts: shifts,
            categorys: categoryIntervals,

            listHeights: heights,
            intervals: intervals,
            limits: limList,
            
        }
        derivedValues.value = res
        
        return res
    }

    const stacker = (index, stack, newValue, type = '?') => {
        stack.current[index] = newValue

        if(!stackWidths.current.includes(undefined)){
            const widthsEqaul = (stackWidths.current.toString() === listWidths.current.toString())
            const widthsCountEqaul = (stackWidths.current.length === tasksStructure.length)

            if( !widthsEqaul &&  widthsCountEqaul){
                const identity = (x) => x;
                const w = stackWidths.current.map(identity)
                listWidths.current=w

                countDerivedValues({listHeights: listHeights, listWidths: listWidths.current, headHeightTop: HEAD_COMPONENT_HEIGHT})
                console.log('stacker ok')
                stackWidths.current = new Array(tasksStructure.length)
            }
        }        
    }

    useDerivedValue(() => {
        const {
            listHeights: aListHeights, //
            listWidths: aListWidths,
            intervals,
            shifts,
            limits : limList
        } = derivedValues.value

        if(
            aListHeights.length == 0 ||
            aListWidths.length == 0 ||
            intervals.length == 0 ||
            shifts.length == 0 ||
            limList.length == 0  
        ){return}

        const yScroll = Math.abs(animValueScrollY.value)

        const countAccent = intervals.findIndex((el, index)=>{
            const addForOpenedItem = openItem.value != null? openItem.value.categoryIndex <= index? ((openItem.value.itemsCount % 2 == 1 && openItem.value.itemIndex % 2 == 0? 1 : 2)*LIST_ITEM_SIZE.h) : 0 : 0

            const leftBord = el.left 
            const rightBord = el.right + addForOpenedItem
            return (
                (leftBord<=yScroll && yScroll<=rightBord)  
                || (index == 0 && yScroll < leftBord)  
                || (index == intervals.length-1 && yScroll > rightBord) 
            )
        })
        //console.log('drawer',countAccent,  openItem.value)

        if(countAccent == -1){return}


        let accentBarXScroll = Math.max((yScroll- HEAD_COMPONENT_HEIGHT), 0)

        const addForOpenedItem = openItem.value != null? openItem.value.categoryIndex <= countAccent? ((openItem.value.itemsCount % 2 == 1 && openItem.value.itemIndex % 2 == 0? 1 : 2)*LIST_ITEM_SIZE.h) : 0 : 0


        let compens = 0
        const over =addForOpenedItem +  aListHeights.reduce(((countValue, currentValue, index)=>(index <= (countAccent-1)? (countValue+currentValue) : countValue)), 0)
        //

        if(tasksStructure[countAccent].indexSection != 0){
            if(over < accentBarXScroll){
                compens =  accentBarXScroll-over
                let ignoreHeight = STYCKYS_HEIGHT//-horizontalProximity//-headerStickysFullHeight//+2*appStyle.lists.proximity

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
            alignmentAction = (scrollX-(limList[paramIndex].more + addForOpenedItem*0.6) )*alignmentCoeff
            if(alignmentAction > l_newDistance){alignmentAction = l_newDistance}

            return alignmentAction
        }

        
        const past = shifts[countAccent-1]
        const current = shifts[countAccent]
        const next = shifts[countAccent+1]
        const newDistance = next-current
        const oldDistance = current-past
        let action = 0

        if(accentBarXScroll >= (limList[countAccent].more + addForOpenedItem*0.6)){       
            action = getAction(accentBarXScroll, countAccent)

        } else if(accentBarXScroll <= limList[countAccent].less){      
            action = oldDistance - getAction(accentBarXScroll, (countAccent>=1? countAccent-1 : 0))
            action *= (-1)
        }
        accentBarXScroll = current + action

        let width = aListWidths[countAccent]-SELECTOR_ITEM_MARGIN_BETWEEN-SELECTOR_ITEM_PADDING_HRZ//Math.round(aListWidths[countAccent]-10);
        if(isNaN(width) || width  === undefined){
            const numberPrimelSymbols = (Language.categorys[tasksStructure[0].category]).length;
            const widthSymbol = staticStyles.frontFLText.fontSize * 0.75;
            width = numberPrimelSymbols * widthSymbol + SELECTOR_ITEM_MARGIN_BETWEEN;
        }
        const left = aListWidths.reduce(((countValue, currentValue, index)=>(index < countAccent? (countValue+currentValue) : countValue)), 0);

        cancelAnimation(animValueWidthLine);
        animValueWidthLine.value = width;

        cancelAnimation(animValueMarginLeft);
        animValueMarginLeft.value = left;

        if(countAccent != lastCountAccent.value.o){
            cancelAnimation(lastCountAccent);
            lastCountAccent.value = {n: countAccent, o: countAccent}
            cancelAnimation(svgWidth);
            svgWidth.value = withTiming(Math.round(animValueWidthLine.value), {duration: CHANGE_DURATION})
            cancelAnimation(svgUP);
            svgUP.value = withSequence(withTiming(CLOSE_BLOB, {duration: CHANGE_DURATION*0.4}), withDelay(CHANGE_DURATION*0.2, withTiming(OPEN_BLOB, {duration: CHANGE_DURATION*0.4})))
        }

        scrollTo(
            flatListRef, //ref
            accentBarXScroll, //x offset
            0, //y offset
            true //animate
        )
    })


    const scrollHandlerFlatListParams = useAnimatedScrollHandler({
        onScroll: (e, ctx) => {
            animValueTranslateX.value = -(e.contentOffset.x)            
        }
    })


    const animStyleIndicatorLine = useAnimatedStyle(() => {
        return {
            width: withTiming(animValueWidthLine.value, {duration: CHANGE_DURATION*0.9}),
            left: withTiming((SELECTOR_ITEM_PADDING_HRZ+SELECTOR_ITEM_MARGIN_BETWEEN)/2+animValueMarginLeft.value, {duration: CHANGE_DURATION, easing: Easing.bezier(0.45, 0, 0.55, 1)}),
            transform: [
                {translateX: animValueTranslateX.value}
            ] 
        }
    })

    const pathSVG = useAnimatedProps(()=>{
        const fullW = svgWidth.value // 100
        const isOpen = svgUP.value // true? 0 : 5

        const blobPath = `
            M ${fullW/2} ${isOpen}
            C ${(fullW/2)+blobRadius} ${isOpen} ${fullW-liheHeight} ${blobHeight} ${fullW-liheHeight} ${blobHeight}
            C ${fullW-liheHeight} ${blobHeight} ${fullW} ${blobHeight} ${fullW} ${liheHeight+blobHeight}
            H 0
            C 0 ${blobHeight} ${liheHeight} ${blobHeight} ${liheHeight} ${blobHeight}
            C ${liheHeight} ${blobHeight} ${(fullW/2)-blobRadius} ${isOpen} ${fullW/2} ${isOpen}
            Z
        `
        return ({d: blobPath})     
    })

    const contentContainerStylePaddingRight = useAnimatedProps(()=>{
        const widths = derivedValues.value.listWidths
        return (
            {
                contentContainerStyle: {
                    paddingRight: (DEVICE_W/2) - (
                        (widths).length == tasksStructure.length? 
                        (widths[tasksStructure.length-1])/2 
                        :
                        ((Language.categorys[tasksStructure[tasksStructure.length-1].category]).length*0.75*staticStyles.frontFLText.fontSize)/2
                    )
                }   
            }
        )
    }, [Language])
    

    const selectorLine = useAnimatedStyle(()=>{
        return {
            transform: [
               {translateY: animSelectorLine.value}
            ]
        }
    })

    const maskParamsHeight = useAnimatedStyle(()=>{
        return {
            height: interpolate(
                animSelectorLine.value,
                [SECTIONS_SELECTOR_HEIGHT/2, 0],
                [0, SECTIONS_SELECTOR_HEIGHT],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }   
            ),
        }
    })

    const maskIndicatorHeight = useAnimatedStyle(()=>{
        return {
            backgroundColor: invertColorsHeader.value? basicAP.value : basicAQ.value,
            height: interpolate(
                animSelectorLine.value,
                [BLOB_INDICATOR_HEIGHT/2, 0],
                [0, BLOB_INDICATOR_HEIGHT],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }   
            ),
        }
    }) 

    const headerMaskTextColor = useAnimatedStyle(()=>{
        return {
            backgroundColor: invertColorsHeader.value? textNS.value : textNP.value
        }
    })

    const colorInHeaderParams = useAnimatedStyle(()=>({backgroundColor: textAP.value})) 

    const rippleProps = useAnimatedProps(()=>{
        return {
            android_ripple: {
                color: `${basicAQ.value}80`,
                borderless: true,
                foreground: false
            }
            
        }
    })

    const keys = (item, index) => String(item.category+index)

    const renderItems = ({item, index})=> {
        console.log('RENDER SECTIONS SELECTOR ITEM', index)
        return (
        <View 
            key={String(item.category+index)}
            style={[{
                backgroundColor: TRANSPARENT_COLOR,
                height: SECTIONS_SELECTOR_HEIGHT, 
                borderRadius: 8,
                marginHorizontal: SELECTOR_ITEM_MARGIN_BETWEEN/2,
                paddingHorizontal: SELECTOR_ITEM_PADDING_HRZ/2,
            }]}
            onLayout={(event)=>{stacker(index, stackWidths , (event.nativeEvent.layout.width+SELECTOR_ITEM_MARGIN_BETWEEN), 'w')}}
        >
            <RPressable
                style={{height: '100%', width: '100%',}} //
                onPress={()=>{showSection(index)}} 
                animatedProps={rippleProps}
            >   
                <Text style={[staticStyles.frontFLText, {height: SECTIONS_SELECTOR_HEIGHT, textAlignVertical: 'center', color: 'transparent'}]}> 
                    {Language.categorys[item.category]}
                </Text>
                <RMaskedView
                    androidRenderingMode = {'software'}
                    style={[colorInHeaderParams, {
                        height: SECTIONS_SELECTOR_HEIGHT,
                        width: '100%',
                        position: 'absolute', 
                    }]}
                    maskElement={
                        <Text style={[staticStyles.frontFLText, {height: SECTIONS_SELECTOR_HEIGHT, textAlignVertical: 'center'}]}>                        
                            {Language.categorys[item.category]}
                        </Text>
                    }
                >
                {/* COLOR */}
                <Reanimated.View style={[maskParamsHeight, headerMaskTextColor, {width: '100%'}]}/>  
                </RMaskedView>
            </RPressable>
        </View>
        )
    }

    return (
        <Reanimated.View
            style = {[selectorLine, {
                zIndex: 1,
                height:  SECTIONS_SELECTOR_HEIGHT,
                width: '100%',
                position: 'absolute',
                top: PRIMARY_HEADER_HEIGHT,
            }]}
        >
            {/*HEADER PARAMS*/}
            <Reanimated.FlatList
                ref={flatListRef}
                //nitialNumToRender={15}
                style={{height: SECTIONS_SELECTOR_HEIGHT}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                onScroll={scrollHandlerFlatListParams}
                data={tasksStructure}
                keyExtractor={keys}
                contentContainerStyle={{
                    paddingLeft: HEADER_SELECTOR_HRZ_PADDING,
                }}
                animatedProps={contentContainerStylePaddingRight}
                renderItem={renderItems}
            />
            <MaskedView
                androidRenderingMode = {'software'}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    width: DEVICE_W, 
                    height: BLOB_INDICATOR_HEIGHT,
                    justifyContent: 'flex-start', 
                    backgroundColor: 'transparent'
                }}
                maskElement={
                    <Reanimated.View 
                        style={[animStyleIndicatorLine, { 
                            position: 'absolute',
                            height: BLOB_INDICATOR_HEIGHT,
                            bottom: 0//-1.85,
                        }]}  
                    >
                        <Svg width="100%" height="100%" fill='black'>
                            <ReanimatedPath animatedProps={pathSVG} stroke="black"/>
                        </Svg>
                    </Reanimated.View>
                }
            >   
                {/* COLOR*/}
                <Reanimated.View style={[maskIndicatorHeight,{width: '100%'}]}/>  
            </MaskedView>
        </Reanimated.View>
    )
}


const staticStyles = StyleSheet.create({
    FlatListsArea: {
        width: DEVICE_W,
    },
    frontFLArea: {
        marginHorizontal: 5,
        paddingHorizontal: 5,
        marginTop: 1,
    },

    frontFLText: {
        fontSize: 16,
        fontWeight: '500',
        //letterSpacing: 0.5,
        fontVariant: ['small-caps'],
    },

    AnimatedHeaderText: {
        fontSize: 18,
        fontWeight: '500',
        letterSpacing: 0.5,
        fontVariant: ['small-caps'],
    }

});