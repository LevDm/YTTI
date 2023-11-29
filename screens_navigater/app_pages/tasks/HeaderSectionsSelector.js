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

import {connect, useSelector} from 'react-redux';
import mapStateToProps from "../../../app_redux_files/stateToProps";
import mapDispatchToProps from "../../../app_redux_files/dispatchToProps";

const RPressable = Reanimated.createAnimatedComponent(Pressable);
const ReanimatedPath = Reanimated.createAnimatedComponent(Path);
const RMaskedView = Reanimated.createAnimatedComponent(MaskedView)

import useTasksSizes, {TRANSPARENT_COLOR} from "./common_values";

import { useGetTasks } from "./tools";
import useLanguage from "../../../app_hooks/useLanguage";

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


const HeaderCategorys = memo((props) => {
    const {
        animValueScrollY,
        //openItem,

        showSection,

        uiStyle,
        uiTheme,

        getAddOffsetOpened,

        countItemsInSections,
        categorys,
    } = props

    const {
        lists: {
      
        }
    } = uiStyle

    const {
        basics: {
            accents: {
                primary: basicAP,
                quaternary: basicAQ
            },
        },
        icons: {
            accents: {
                quaternary: iconAQ
            }
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


    const {
        SCREEN_PROXIMYTY_HRZ,

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

    const SELECTOR_WIDTH = DEVICE_W-24


    console.log("selector ")

    const heigtsSections = countItemsInSections.reduce((accumulator, currentValue) => [...accumulator, LIST_ITEM_SIZE.h*Math.round(currentValue/2)], []);
    const countSections = categorys.length

    const Language = useLanguage().TasksScreen

    const animSelectorLine = useDerivedValue(()=> (Math.max((SECTIONS_SELECTOR_HEIGHT+HEAD_COMPONENT_HEIGHT-(STYCKYS_HEIGHT+12.5)+ animValueScrollY.value ), 0)))

    const animValueTranslateX = useSharedValue(0);

    const flatListRef = useAnimatedRef(); 

    const lastCountAccent = useSharedValue({n: 0, o: -1})

    const svgWidth = useSharedValue(0)
    const svgUP = useSharedValue(CLOSE_BLOB)
    
    const listWidths = useRef([]);
    const stackWidths = useRef(new Array(countSections));

    const logg = (info) =>{
        'worklet';
        console.log('lg_'+info)
    }

    
    useEffect(()=>{
        if(listWidths.current.length == countSections){
            countDerivedValues({listHeights: heigtsSections, listWidths: listWidths.current})
        }
    })


    const derivedValues = useSharedValue({
        listHeights: [],
        listWidths: [],
        shifts: [],
        //intervals: [],
        limits: [],
        //categorys: []
    })


    const countDerivedValues = ({listHeights: heights, listWidths: widths}) =>{
        console.log('>>DERIVED_VALUES_UPD',)
        const shifts = []
        for(let param = 0; param <= countSections; param++){
            const maxAccepIndex = widths.length-1;
            let centrallFront = 0;
            //left shift 
            const shift = widths.reduce(((countValue, currentValue, index)=>(index < param? (countValue+currentValue) : countValue)), 0)
            //shifts for position in center
            if(1 <= param && param <= maxAccepIndex-1){ 
                centrallFront = -(((SELECTOR_WIDTH-widths[param])/2)-HEADER_SELECTOR_HRZ_PADDING) //-Math.round((deviceWidth-listWidths[param])/2) 
            }
            let resOffset = centrallFront+shift
            if(resOffset < 0){resOffset = 0}
            shifts.push(resOffset)
        } 
        const limList = []
        for(let param = 0; param < countSections; param++){
            //const coef = (heights[param] > 200? 0.8 : 0.6)
            const interval = heights.reduce(((countValue, currentValue, index)=>(index < param? (countValue+currentValue) : countValue)), 0)
            limList.push({
                start: 0.76 * heights[param] +param*STYCKYS_HEIGHT +interval,
                fin: heights[param]+interval +param*STYCKYS_HEIGHT
            })
        }

        const res = {
            listWidths: widths,
            shifts: shifts,

            listHeights: heights,
            limits: limList,
        }

        derivedValues.value = res
        return res
    }

    const stacker = (index, stack, newValue, type = '?') => {
        stack.current[index] = newValue
        if(!stackWidths.current.includes(undefined)){
            const widthsEqaul = (stackWidths.current.toString() === listWidths.current.toString())
            const widthsCountEqaul = (stackWidths.current.length === countSections)
            if(!widthsEqaul && widthsCountEqaul){
                const identity = (x) => x;
                const w = stackWidths.current.map(identity)
                listWidths.current=w
                countDerivedValues({listHeights: heigtsSections, listWidths: listWidths.current})
                console.log('stacker ok')
                stackWidths.current = new Array(countSections)
            }
        }        
    }

    useDerivedValue(() => {
        const {
            shifts,
            limits : limList
        } = derivedValues.value

        if(
            shifts.length == 0 
            || limList.length == 0  
            || countSections != limList.length 
        ){return}



        const inputY = [0]
        const outputX = [0]
        const outputAccent = [0]

        for(let i = 0; i < countSections; i++){
            const forwardIndex = Math.min(i+1, countSections-1)
            const addForOpenedItem = getAddOffsetOpened(i+1)*LIST_ITEM_SIZE.h
            inputY.push(limList[i].start+addForOpenedItem, limList[i].fin+addForOpenedItem)
            outputX.push(shifts[i], shifts[forwardIndex])
            outputAccent.push(i, forwardIndex)
        }

        if(
            inputY.length < 2 
            || outputX.length < 2 
            || outputAccent.length < 2
        ){return}

        const yScroll = Math.max((Math.abs(animValueScrollY.value) -HEAD_COMPONENT_HEIGHT), 0)

        const testX = interpolate(
            yScroll,
            inputY,
            outputX,
            {extrapolateLeft: Extrapolation.CLAMP, extrapolateRight: Extrapolation.CLAMP}
        )

        const testAccent = interpolate(
            yScroll,
            inputY,
            outputAccent,
            {extrapolateLeft: Extrapolation.CLAMP, extrapolateRight: Extrapolation.CLAMP}
        )

        const countAccent = Math.floor(testAccent+0.005)

        if(countAccent != lastCountAccent.value.o){
            lastCountAccent.value = {n: countAccent, o: countAccent}
        }

        scrollTo(
            flatListRef, //ref
            testX ,//accentBarXScroll, //x offset
            0, //y offset
            true //animate
        )
    })


    const scrollHandlerFlatListParams = useAnimatedScrollHandler({
        onScroll: (e, ctx) => {
            animValueTranslateX.value = -(e.contentOffset.x)            
        }
    })


    const indicatorLineLeft = useDerivedValue(()=>{
        const left = SELECTOR_ITEM_PADDING_HRZ +(SELECTOR_ITEM_MARGIN_BETWEEN)/2 
                    + derivedValues.value.listWidths.reduce(((countValue, currentValue, index)=>(index < lastCountAccent.value.n? (countValue+currentValue) : countValue)), 0);
        return left
    })


    const indicatorLineWidth = useDerivedValue(()=>{
        let width = derivedValues.value.listWidths[lastCountAccent.value.n]-SELECTOR_ITEM_MARGIN_BETWEEN-SELECTOR_ITEM_PADDING_HRZ
        if(isNaN(width) || width  === undefined){
            const numberPrimelSymbols = (Language.categorys[categorys[lastCountAccent.value.n]??'today']).length;
            const widthSymbol = staticStyles.frontFLText.fontSize * 0.75;
            width = numberPrimelSymbols * widthSymbol + SELECTOR_ITEM_MARGIN_BETWEEN;
        }
        //console.log("width", width)
        return width
    })


    useAnimatedReaction(()=>([lastCountAccent.value.n, indicatorLineWidth.value]),
        (newValue, oldValue)=>{
            cancelAnimation(svgWidth);
            svgWidth.value = withTiming(Math.round(newValue[1]), {duration: CHANGE_DURATION})
            cancelAnimation(svgUP);
            svgUP.value = withSequence(withTiming(CLOSE_BLOB, {duration: CHANGE_DURATION*0.4}), withDelay(CHANGE_DURATION*0.2, withTiming(OPEN_BLOB, {duration: CHANGE_DURATION*0.4})))
        }
    )


    const animStyleIndicatorLine = useAnimatedStyle(() => {
        return {
            width: withTiming(indicatorLineWidth.value, {duration: CHANGE_DURATION*0.9}),
            left: withTiming(indicatorLineLeft.value, {duration: CHANGE_DURATION, easing: Easing.bezier(0.45, 0, 0.55, 1)}),
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

    const selectorLine = useAnimatedStyle(()=>{
        return {
            //backgroundColor: 'red',
            transform: [
               {translateY: animSelectorLine.value},
               //{translateX: 150}
            ]
        }
    })


    const maskParamsHeight = useAnimatedStyle(()=>{
        return {
            height: interpolate(
                animSelectorLine.value,
                [SECTIONS_SELECTOR_HEIGHT/2, 0],
                [0, SECTIONS_SELECTOR_HEIGHT],
                {extrapolateLeft: Extrapolation.CLAMP, extrapolateRight: Extrapolation.CLAMP}   
            ),
        }
    })


    const maskIndicatorHeight = useAnimatedStyle(()=>{
        return {
            backgroundColor: iconAQ.value,
            height: interpolate(
                animSelectorLine.value,
                [BLOB_INDICATOR_HEIGHT/2, 0],
                [0, BLOB_INDICATOR_HEIGHT],
                {extrapolateLeft: Extrapolation.CLAMP, extrapolateRight: Extrapolation.CLAMP}   
            ),
        }
    }) 


    const headerMaskTextColor = useAnimatedStyle(()=>({backgroundColor: textNP.value}))


    const colorInHeaderParams = useAnimatedStyle(()=>({backgroundColor: textAP.value})) 


    const rippleProps = useAnimatedProps(()=>{
        return {
            android_ripple: {
                color: `${iconAQ.value}80`,
                borderless: true,
                foreground: false
            }
            
        }
    })


    const keys = (category, index) => String(category)


    const renderItems = useCallback(({item: category, index}) => {
        console.log('Callback render selector item', index)
        return <Item key={String(category)} category = {category} index = {index} />
    })


    const scroll = (indexSection) => {
        const forOpen = getAddOffsetOpened(indexSection)
        const countItems = countItemsInSections.reduce((
            (countValue, currentValue, index)=>(index < indexSection? (countValue+ Math.round(currentValue/2)) : countValue)
        ), forOpen)
        showSection(indexSection, countItems)
    }


    const Item = memo((props) => {
        const {category, index} = props
        const text = Language.categorys[category]
        return (
            <View 
                key={String(category)}
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
                    onPress={()=>{scroll(index)}} 
                    animatedProps={rippleProps}
                >   
                    <Text style={[staticStyles.frontFLText, {height: SECTIONS_SELECTOR_HEIGHT, textAlignVertical: 'center', color: 'transparent'}]}> 
                        {text}
                    </Text>
                    <RMaskedView
                        androidRenderingMode = {'software'}
                        style={[colorInHeaderParams, {
                            height: SECTIONS_SELECTOR_HEIGHT,
                            width: '100%',
                            position: 'absolute', 
                            //opacity: index == 0? 0 : 1
                        }]}
                        maskElement={
                            <Text 
                                style={[staticStyles.frontFLText, {
                                    //fontSize: 23,
                                    //letterSpacing: 1.6,
                                    height: SECTIONS_SELECTOR_HEIGHT, 
                                    textAlignVertical: 'center'
                                }]}
                            >                        
                                {text}
                            </Text>
                        }
                    >
                        {/* COLOR */}
                        <Reanimated.View style={[maskParamsHeight, headerMaskTextColor, {width: '100%'}]}/>  
                    </RMaskedView>
                </RPressable>
            </View>
        )
    })

    const getRightOffset = () => {
        const widths = derivedValues.value.listWidths
        const stackWidth = (widths[countSections-1]?? 0)/2 
        const countWidth = categorys[countSections-1]? ((Language.categorys[categorys[countSections-1]]).length*0.75*staticStyles.frontFLText.fontSize)/2 : 0
        const lastItemWidth = widths.length == countSections? stackWidth : countWidth
        const rightOffset = ((SELECTOR_WIDTH-HEADER_SELECTOR_HRZ_PADDING)/2) - lastItemWidth
        return rightOffset
    }

    return (
        <Reanimated.View
            style = {[selectorLine, {
                //zIndex: 1,
                height:  SECTIONS_SELECTOR_HEIGHT,
                width: SELECTOR_WIDTH,
                position: 'absolute',
                top: PRIMARY_HEADER_HEIGHT,
                left: 12
            }]}
        >
            <Reanimated.FlatList
                ref={flatListRef}
                style={{height: SECTIONS_SELECTOR_HEIGHT}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                onScroll={scrollHandlerFlatListParams}
                data={categorys}
                keyExtractor={keys}
                contentContainerStyle = {{
                    paddingLeft: HEADER_SELECTOR_HRZ_PADDING,
                    paddingRight: getRightOffset()
                }}
                renderItem={renderItems}

                onResponderGrant={() => true}
                onResponderTerminationRequest={()=>false}
                onStartShouldSetResponder={()=>true}
                onMoveShouldSetResponde={()=>true}
            />
            <MaskedView
                androidRenderingMode = {'software'}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    width: SELECTOR_WIDTH, 
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
}, 
    (prev, next)=>{
        const listEqual = (list_1, list_2) => list_1.join('///') == list_2.join('///')
        return listEqual(prev.categorys, next.categorys) && listEqual(prev.countItemsInSections, next.countItemsInSections)
    }
)

import { createrTaksStructure } from "./tools";

const DataHeaderCategorys = (props) => {
    const {
        tasksData,
        openItem,
    } = props

    const tasksStructure = createrTaksStructure(tasksData)

    const countItemsInSections = tasksStructure.reduce((accumulator, currentValue) => [...accumulator, currentValue?.data.length], []);
    const categorys = tasksStructure.reduce((accumulator, currentValue) => [...accumulator, currentValue.category], []);

    const openedItemPosition = useDerivedValue(()=>{
        if(!openItem.value){
            return null
        }
        const {
            category,
            keyId,
        } = openItem.value

        const categoryIndex = tasksStructure.findIndex((item)=>item.category == category)
        const itemIndex = categoryIndex != -1? tasksStructure[categoryIndex]?.data.findIndex((item)=>item.keyId == keyId) : -1
        const itemsCount = tasksStructure[categoryIndex]?.data.length
        return {
            categoryIndex: categoryIndex,
            itemIndex: itemIndex,
            itemsCount: itemsCount
        }
    })

    const getAddOffsetOpened = (currentIndex) => {
        'worklet';
        if(!openedItemPosition.value){
            return 0
        }

        const {
            categoryIndex,
            itemIndex,
            itemsCount,
        } = openedItemPosition.value

        return  categoryIndex < currentIndex? ((itemsCount % 2 == 1 && itemIndex % 2 == 0)? 1 : 2) : 0
    }

    return (
        <HeaderCategorys 
            {...props}
            countItemsInSections = {countItemsInSections}
            categorys = {categorys}
            getAddOffsetOpened={getAddOffsetOpened}
        />
    )
}

export default connect(mapStateToProps('TASKS_LIST'))(DataHeaderCategorys);


const staticStyles = StyleSheet.create({
    frontFLText: {
        fontSize: 19,
        letterSpacing: 0.6,
        fontWeight: '500',
        fontVariant: ['small-caps'],
    },
});