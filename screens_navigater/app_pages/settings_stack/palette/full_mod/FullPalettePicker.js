import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
    Text,
    ScrollView,
    Pressable,
    Dimensions,
    View, 
} from 'react-native';

import Constants from "expo-constants";
const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');
const statusBarHeight = Constants.statusBarHeight+1
//const deviceWidth  = Dimensions.get('window').width;
//const deviceHeight  = Dimensions.get('window').height;
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


//import { deviceWidth, deviceHeight } from "../../../../../app_values/AppDefault";
import { BasePressable } from "../../../../../general_components/base_components/BaseElements";




const getContrast = (hcolor) => {
    let r = 0, g = 0, b = 0;
    if (hcolor.length == 4) {
      r = "0x" + hcolor[1] + hcolor[1];
      g = "0x" + hcolor[2] + hcolor[2];
      b = "0x" + hcolor[3] + hcolor[3];
    } else if (hcolor.length == 7) {
      r = "0x" + hcolor[1] + hcolor[2];
      g = "0x" + hcolor[3] + hcolor[4];
      b = "0x" + hcolor[5] + hcolor[6];
    } else if (hcolor.length > 7) {
      let alfa = "0x"+hcolor.slice(7)
      alfa /= 255
      return alfa > 0.5? "white" : 'black'
    }
    r /= 255;
    g /= 255;
    b /= 255;
  
    const count = (coef) => ((coef+0.055)/1.055)**2.4 
    
    let contr = count(r)+count(g)+count(b)
  
    return contr <= 0.5? 'white' : 'black'
}

const PICKER_AREA_HEIGHT = 270

const ColorItem = (props) => {
    const {
        generals,
        objColors,
        trace,
        item,
        textColor,
        pressColor,
        currentTrace,
    } = props

    //const check = useSharedValue(0)
    const check = useDerivedValue(()=>currentTrace.value == [...trace, generals, item].join('-'))
    //const check = 

    const onPress = () => {
        pressColor(objColors[item], [...trace, generals, item])
    }

    const checkStyle = useAnimatedStyle(()=>{
        return {
            backgroundColor: check.value? textColor : 'transparent'
        }
    })

    return (
        <View
            style={{
                height: 31,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderColor: textColor,
                marginBottom: 1,
                paddingHorizontal: 5
            }}
        >
            <Text style={{fontSize: 14, color: textColor, fontWeight: ['theme', 'scheme', 'statusBar'].includes(item)? 'bold' : 'normal'}}>{item}:</Text>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
            <Reanimated.View style={[checkStyle, {height: 14, width: 14, borderRadius: 7, marginRight: 10}]}/>
            {(item != 'scheme' && item != 'theme') &&
            <BasePressable
                type="t"
                text={objColors[item]}
                textStyle={{
                    fontSize: 14,
                    color: objColors[item][0] === '#'? getContrast( objColors[item]) : textColor
                }}
                style={{
                    height: 29,
                    width: 90,
                    backgroundColor: objColors[item][0] === '#'? objColors[item] : 'transparent',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: objColors[item][0] === '#'? getContrast( objColors[item]) : textColor
                }}
                onPress={onPress}
            />}
            {(item === 'scheme' || item === 'theme')  && 
            <Text 
                style={{
                    height: 29,
                    width: 90,
                    fontSize: 14,
                    //backgroundColor: 'red',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    color: textColor
                }}
            >{objColors[item]}</Text>}
            </View>
        </View>
    )
}

export default FullColorsPicker = (props) => {
    const {
        pressColor,
        paramsSelectColor,
        //currentCustomTheme,
        currentPalette,
        listPaddingBottom = 20,
    } = props

    const [currentCustomTheme, setCurrentCustomTheme] = useState({})

    useDerivedValue(()=>{
        runOnJS(setCurrentCustomTheme)(currentPalette.value? currentPalette.value : {})
    }, [currentPalette])

    const currentTrace = useDerivedValue(()=>{
       return paramsSelectColor.value? paramsSelectColor.value.trace.join('-') : undefined
    })

    //console.log(currentCustomTheme)

    const renderColors = (objColors, generals = false, start = false, trace = []) => {
    //let newTrace = [...trace, item]
    //generals? newTrace.push(generals) : null

        const textColor = getContrast((trace.length>0? trace[0] : generals) == 'light'? '#fffffe' : '#000000' )

        return(
        <View
            key = {`color_general_${Math.random()}_${generals}`}
            style={{
            marginLeft: !start? 10 : 0,
            }}
        >
            {!start && <Text style={{fontSize: 14, fontWeight: 'bold', color: textColor}} >{generals}:</Text>}
            {Object.keys(objColors).map((item, index)=>{
            if(typeof objColors[item] == 'string'){
                if((item === 'scheme' || item === 'theme' || item === 'statusBar')){return null}
                return (
                <View key = {`color_${generals? generals : ''}_${item}_${index}`}>
                    <ColorItem 
                        generals={generals}
                        objColors = {objColors}
                        trace = {trace}
                        item = {item}
                        textColor = {textColor}
                        pressColor={pressColor}

                        currentTrace={currentTrace}
                    />                 
                </View>
                )
            } else {
                return (
                <View
                    key = {`rc_color_${generals? generals : ''}_${item}_${index}`}
                >
                    {renderColors(objColors[item], item, false,[ ...trace, generals])}
                </View>
                )
            }
            })}
        </View>
        )
    }

    return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            width: deviceWidth*2,
          }}
          contentContainerStyle={{  
            flexDirection: 'row',
            //paddingBottom:  
          }}
        >
        {Object.keys(currentCustomTheme).map((item, index)=>{
            if(item == 'title'){return null}
            return (
                <View
                    key = {`theme_oject_${item}_${new Date().getTime()}`}         
                    style={{
                        width: deviceWidth,
                        paddingTop: 10,
                        paddingLeft: 10,
                        paddingRight: 20,
                        paddingBottom: listPaddingBottom ,
                        backgroundColor: {light: 'white', dark: 'black'}[item]// themesColorsAppList[ThemeColorsAppIndex][item].basics.grounds.secondary
                    }}
                >
                {renderColors(currentCustomTheme[item], item, true)}
                </View>
            )
        })}
        </ScrollView>
    )
}

