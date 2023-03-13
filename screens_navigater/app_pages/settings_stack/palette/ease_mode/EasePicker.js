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
import Constants from "expo-constants";
const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');
const statusBarHeight = Constants.statusBarHeight+1

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

import {
    Canvas,
    RoundedRect,
    LinearGradient,
    useValue,
    useComputedValue,
    useSharedValueEffect,
    Skia,
    Shader,
    vec
} from "@shopify/react-native-skia";
   
import { MaterialCommunityIcons } from '@expo/vector-icons';

import languagesAppList from "../../../../../app_values/Languages";

const Reanimated_Pressable = Reanimated.createAnimatedComponent(Pressable);
const Reanimated_TextInput = Reanimated.createAnimatedComponent(TextInput);
const Reanimated_Text = Reanimated.createAnimatedComponent(Text);

const col = 5
const row = 9

const coli = col - 1
const rowi = row - 1

const alli = 2*(coli+rowi)

const itemSize =  (deviceWidth-2)/col
const size = {w: col*itemSize, h: row*itemSize}


//const r = R*0.163117
//const IR = R*0.612372

//const matrix
import { hexToHSL, HSLToHex } from "../elemens_pickers/ColorPicker";

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
    console.log('contrast', contr)
    return contr <= 0.9? 'white' : 'black'
  }
  

const SkiaLinearGradient = ({colorsValue, gradientSize}) => {
    //const gradientSize = 2.5*itemSize//-2
    const noneColor = ['#00000000', '#00000000'] 
    const skiaFirstColor = useValue(noneColor); 

    useSharedValueEffect(() => {
        console.log('grad',colorsValue.value)
        skiaFirstColor.current = colorsValue.value? colorsValue.value : noneColor

    }, colorsValue); // you can pass other shared values as extra parameters

    const colors = useComputedValue(() => {
        return skiaFirstColor.current
    }, [skiaFirstColor])

    return (
      <Canvas style={{ flex: 1 }}>
        <RoundedRect x={0} y={0} width={gradientSize} height={gradientSize} r={gradientSize/6+1}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(gradientSize, gradientSize)}
            positions={[.3,.6,.8,1]}
            colors={colors}
          />
        </RoundedRect>
      </Canvas>
    )
}


const GENERATOR = (size) => {
    let base = {}
    for(let i = 0; i<size; i++){
        let el = {}
        const h = 15 * i
        for(let j = 0; j<size; j++){
            const s = 100-4*j
            // {hex: HSLToHex(h, s, 50)}
            let el_2 = {}
            for(let k = 0; k<size; k++){
                const l = (50+size/2)-k
                el_2[`${l}`] = {hex: HSLToHex(h, s, l)}
            }
            el[`${s}`] = el_2
        }
        base[`${h}`] = el
    }
    return base
}

const ColorElement = (props) => {
    const {
        coords: {hv, index},
        selected,
        onPress
    } = props

    const dynamicStyle = useAnimatedStyle(()=>{
        const lastSelectedI = selected.value.h? selected.value.s? selected.value.l? selected.value.l.index : selected.value.s.index : selected.value.h.index : index

        const selectedH = selected.value.h? selected.value.h.hv : hv
        const selectedS = selected.value.s? selected.value.s.sv : (index >= lastSelectedI? 100-4*(index-lastSelectedI) : 4+4*(lastSelectedI-index))
        

        const isActive = !(lastSelectedI === index)
    
        const delta = Math.abs(index-lastSelectedI)
        const animationStackIndex = selected.value.h? Math.abs(delta-Math.floor(delta/(alli/2+1))*alli) : index
    
        const mirror = Math.abs(lastSelectedI+(alli/2))
        const start = (mirror >= alli? mirror%alli : mirror)
        const fine = lastSelectedI
        const pass = start < fine? (start <= index && index <= fine) : (fine <= index && index <= start)

        const selectedL = selected.value.s? selected.value.l? 0 : (pass? 50-1*(animationStackIndex) : 50+1*(animationStackIndex)) : 50

        const partTime = selected.value.h? 60 : 30
        //console.log('render', start, index, lastSelectedI, animationStackIndex,'|||', selectedH, selectedS, selectedL)

        const rotateX =  (coli <  index && index < (coli+rowi) )?  1 : ((2*coli+rowi) <  index && index < alli)? -1 : false
        const rotateY =  (0 <= index && index <= coli )? -1 : ((coli+rowi) <= index && index <= (2*coli+rowi))?  1 : false

        const direction = (lastSelectedI > index? 1 : -1)
        //selected.value.h? (lastSelectedI > index? 1 : -1) : (index > alli/2? 1 : -1)  

        const directionX = `${rotateX*direction*90}deg`  
        const directionY = `${rotateY*direction*90}deg`

        const directionX2 = `${rotateX*direction*360}deg`  
        const directionY2 = `${rotateY*direction*360}deg`

        const h = selectedH//index*15
        const s = selectedS
        const l = selectedL
        //setText(`${h}_${s}_${l}`)
        const BG = HSLToHex(h, s, l)

        return {
            backgroundColor: withDelay((animationStackIndex-0) * partTime, withTiming(BG, {duration: partTime})),
            transform: [
                {scale: withDelay((animationStackIndex-0) * partTime, withSequence(
                    withTiming(.95, {duration: partTime}), 
                    withTiming(1, {duration: partTime}) ) )
                },
                {rotateX: withDelay((animationStackIndex-0) * partTime, withSequence(
                    withTiming(isActive? directionX : '0deg', {duration: 0.5 * partTime}),
                    withTiming(isActive? directionX2 : '0deg', {duration: 1.5 * partTime}),
                    withTiming('0deg', {duration: 0}) ))
                },
                {rotateY: withDelay((animationStackIndex-0) * partTime,  withSequence(
                    withTiming(isActive? directionY : '0deg', {duration: 0.5 * partTime}),
                    withTiming(isActive? directionY2 : '0deg', {duration: 1.5 * partTime}),
                    withTiming('0deg', {duration: 0}) ) )
                },
            ]
        }
    })

    const press = ()=> {
        console.log('pressed', index)
        
        if(!selected.value.h){
            onPress({hv: hv, index: index}, 'h')
        } else if(selected.value.h && !selected.value.s){
            const sv = (index >= selected.value.h.index? 100-4*(index-selected.value.h.index) : 4+4*(selected.value.h.index-index))
            onPress({sv: sv, index: index}, 's')
        } else if(selected.value.h && selected.value.s && !selected.value.l){
            const lastSelectedI = selected.value.s.index
            const delta = Math.abs(index-lastSelectedI)
            const animationStackIndex =  Math.abs(delta-Math.floor(delta/(alli/2+1))*alli) 
        
            const mirror = Math.abs(lastSelectedI+(alli/2))
            const start = (mirror >= alli? mirror%alli : mirror)
            const fine = lastSelectedI
            const pass = start < fine? (start <= index && index <= fine) : (fine <= index && index <= start)

            const lv = pass? 50-1*(animationStackIndex) : 50+1*(animationStackIndex)
            onPress({lv: lv, index: index}, 'l')
        }
        
    }

    return (
        <Reanimated_Pressable
            onPress={press}
            
            style = {[{
                position: 'absolute',
                height: itemSize-4,
                width: itemSize-4,
                margin: 2,
                borderRadius: itemSize/6
            }, dynamicStyle]}
        />
    )
}

const matrix = (w, h ) => {
    let mtx = []
    let line = []
    const maxi = 2*(w+h-2)
    for(let i = 0; i<h; i++){
        line = []
        for(let j = 0; j<w; j++){
            let item = -1
            if(i == 0){
                item = j 
            } else if (i == (h-1)){
                item = maxi/2+(w-1 - j)
            } else {
                if(j == 0){
                    item = maxi-i
                } else if (j == (w-1)){
                    item = w-1+i
                }                   
            }   
            line.push(item)           
        }
        //console.log(line)
        mtx.push(line)
    }
    return mtx
}

const ripple = (color='#ffffff') => ({
    color: `${color}20`,
    borderless: true,
    foreground: false
})

const ICONS_SIZE = 20
const hex = {white: '#ffffff', black: '#000000'}

export default EasePicker = (props) => {
    const {
        getAccentsTrace,
        buildPalette,
        LanguageAppIndex
    } = props

    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.PainterScreen

    const toRad = (deg) => Number(deg)*(Math.PI/180)

    const selected = useSharedValue({h: undefined, s: undefined, l: undefined, choisesColor: undefined})
    const gradient = useSharedValue()
    const symbolsColor = useSharedValue()
    const accents = useSharedValue()

    const select = (value, type) => {
        //cancelAnimation(selected)
        const copy = JSON.parse(JSON.stringify(selected.value));
        if(type === 'hsl'){
            selected.value = value
        } else {
            
            
            //console.log('selected', copy)
            /*
            if(!value && type == 'l'){
                copy[type] = value
                copy['choisesColor'] = value
            } else {
                
            }*/
            copy[type] = value
            selected.value = copy
            //&& !copy.choisesColor
            if(copy.h && copy.s && copy.l){
                gradientsColors(HSLToHex(copy.h.hv, copy.s.sv, copy.l.lv))
            }
        }

        
    }

    const gradientsColors = (primaryColor) => {
        console.log('gradientsColors')
        const lightAccents = getAccentsTrace(primaryColor, 'light')
        const darkAccents = getAccentsTrace(primaryColor, 'dark')
        //console.log(Object.values(gradients.light))

        gradient.value = Object.values(lightAccents)
        symbolsColor.value = getContrast(lightAccents.primary)
        //setAccents()
        accents.value = {light: lightAccents, dark: darkAccents, use: 'light'}

        //onPress(primaryColor, 'choisesColor')
    }

    const changeGradient = () => {
        if(gradient.value){
            const copyAccents = JSON.parse(JSON.stringify(accents.value));
            const newUse = copyAccents.use == 'light'? 'dark' : 'light'
            console.log('change grad', newUse)
            gradient.value = Object.values(copyAccents[newUse])
            copyAccents.use = newUse
            accents.value = copyAccents
            //symbolsColor.value = getContrast(copyAccents[newUse].primary)
        }
    }

    const changeText = () => {
        if(gradient.value){
            const newUse = symbolsColor.value == 'white'? 'black' : 'white'
            console.log('change text', newUse)
            symbolsColor.value = newUse
        }
    }

    const acceptColors = () => {
        if(gradient.value){
            console.log('Accept', accents.value.light.primary, accents.value.use ,hex[symbolsColor.value])
            buildPalette(accents.value.light.primary, accents.value.use ,hex[symbolsColor.value])
        }
    }

    const backChoises = () => {
        //onPress({h: undefined, s: undefined, l: undefined, choisesColor: undefined}, 'hsl')
        console.log('back')
        //console.log(matrix(5, 9))
        if(selected.value.l){
            gradient.value = undefined
            symbolsColor.value = undefined
            accents.value = undefined
            select(undefined, 'l')
            //onPress(undefined, 'choisesColor')
            
        } else if(selected.value.s){
            select(undefined, 's')
        } else if(selected.value.h){
            select(undefined, 'h')
        }
    }

    const clearChoises = () => {
        console.log('clear')
        gradient.value = undefined
        symbolsColor.value = undefined
        accents.value = undefined
        select({h: undefined, s: undefined, l: undefined, choisesColor: undefined}, 'hsl')
    }

    const textColor = useAnimatedProps(()=>{
        const text =  Language.easeMod.stages[selected.value.h? selected.value.s? selected.value.l? 'almost' : 'lightness' : 'saturation' : 'hue']
        return {
            text: text,
            value: text
        }
    })

    const symbols = useAnimatedStyle(()=>{
        return {
            color: symbolsColor.value?  symbolsColor.value : 'transparent'
        }
    })

    const gradientChangerStyle = useAnimatedStyle(()=>{
        return {
            opacity: gradient.value? 1 : 0
        }
    })

    const gradientBorderLine = useAnimatedStyle(()=>{
        return {
            borderColor: gradient.value? 'black' : 'white'
        }
    })

    return (
        <View
            style = {{
                justifyContent: 'center',
                alignItems: 'center',
                width: size.w+2,
                height: size.h+2,
                //borderRadius: Math.round((R+r)),
                //backgroundColor: 'grey',
                padding: 1
                //transform: [
                //    {rotate: '-90deg'}
                //]
            }}
        >
            <FlatList
                style = {{
                    width: size.w,
                    height: size.h,
                }}
                data={matrix(col, row).flat()}
                //keyExtractor={`colors_${new Date().getTime()}`}
                numColumns={col} 
                renderItem={({item, index})=>{
                    return (
                        <View
                            key = {`colors_${new Date().getTime()}`} 
                            style = {{
                                height: itemSize,
                                width: itemSize,
                                backgroundColor: 'transparent',
                            }}
                        >
                            {item != -1 && <ColorElement coords={{hv: `${15*item}`, index: item}} selected={selected} onPress={select}/>}
                        </View>
                    )
                }}
            />
            <View 
                style={{
                    position: 'absolute',
                    height: size.h - 2*(itemSize +2),
                    width: size.w - 2*(itemSize +2),
                    //borderRadius: IR,
                    backgroundColor: 'black',
                    justifyContent: 'center',
                    alignItems: 'center',
                    //opacity: .5,
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: itemSize/6,
                    zIndex: 0,
                }}
            >
                <Reanimated_TextInput
                    editable = {false}
                    animatedProps={textColor}
                    style={staticStyles.process}
                />
                

                <Reanimated.View 
                    style={[{
                        height: 2.5*itemSize,
                        width: 2.5*itemSize,
                    }]}
                >                    
                    <SkiaLinearGradient colorsValue={gradient} gradientSize={2.5*itemSize}/>
                    <Reanimated.View
                        style={[gradientBorderLine, {
                            height: 2.5*itemSize,
                            width: 2.5*itemSize,
                            position: 'absolute',
                            borderRadius: (2.5*itemSize)/6,          
                            borderWidth: 1.5,
                        }]}
                    />
                    <Reanimated_Text
                        style={[symbols, staticStyles.symbols, {
                            height: 2.5*itemSize,
                            width: 2.5*itemSize,
                            position: 'absolute',
                        }]}
                    >
                        A
                    </Reanimated_Text>
                </Reanimated.View>
                
                <Reanimated.View style={[gradientChangerStyle,staticStyles.bgPressable, {flex: 1.5, flexDirection: 'row', paddingHorizontal: 5, marginTop: 10, justifyContent: 'space-between', alignItems: 'flex-start'}]}>
                    <Pressable
                        style = {[staticStyles.pressable, {justifyContent: 'flex-start'}]}
                        onPress={changeGradient}
                        android_ripple={ripple()}
                    >
                        <MaterialCommunityIcons name="vector-difference-ba"size={ICONS_SIZE} color="white"/>
                        <Text style={staticStyles.action}>{Language.easeMod.changeGradient}</Text>
                    </Pressable>
                    <View style={{width: 1, backgroundColor: 'white', height: '80%', marginTop: 5}}/>
                    <Pressable
                        style = {[staticStyles.pressable, {justifyContent: 'flex-start'}]}
                        onPress={changeText}
                        android_ripple={ripple()}
                    >   
                        <MaterialCommunityIcons name="invert-colors" size={ICONS_SIZE} color="white" />
                        <Text style={staticStyles.action}>{Language.easeMod.changerText}</Text>
                    </Pressable>          
                </Reanimated.View>

                <Reanimated.View style={[gradientChangerStyle, staticStyles.bgPressable,{flex: 3, margin: 10, padding: 5}]}>
                <Pressable
                    style = {[staticStyles.pressable, {flexDirection: 'column'}]}
                    onPress={acceptColors}
                    android_ripple={ripple()}
                >
                    <MaterialCommunityIcons name="sticker-check-outline" size={4*ICONS_SIZE} color="white" />
                    <Text style={[staticStyles.action, {fontSize: 24}]}>{Language.easeMod.accept}</Text>
                </Pressable>
                </Reanimated.View>

                <View style={[staticStyles.bgPressable, {flexDirection: 'row', paddingHorizontal: 5, justifyContent: 'space-between', alignItems: 'center'}]}>
                    <Pressable
                        style = {staticStyles.pressable}
                        onPress={backChoises}
                        android_ripple={ripple()}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={ICONS_SIZE} color="white" />
                        <Text style={staticStyles.action} width={60}>{Language.easeMod.back}</Text>
                    </Pressable>
                    <View style={{width: 1, backgroundColor: 'white', height: '70%'}}/>
                    <Pressable
                        style = {staticStyles.pressable}
                        onPress={clearChoises}
                        android_ripple={ripple()}
                    >
                        <MaterialCommunityIcons name="arrow-collapse-left" size={ICONS_SIZE} color="white" />
                        <Text style={staticStyles.action} width={60}>{Language.easeMod.clear}</Text>
                    </Pressable>
                </View>
                
            </View>
        </View>
    )
}

const staticStyles = StyleSheet.create({
    process: {
        fontSize: 16, 
        fontWeight: '400', 
        letterSpacing: 0.5,
        color: 'white'
    },
    action: {
        fontSize: 13,
        paddingLeft: 3,
        fontWeight: 'bold',
        textAlign: 'left', 
        //fontWeight: '400', 
        //letterSpacing: 0.5,
        color: 'white'
    },
    symbols: {
        fontSize: 70,
        fontWeight: 'bold',
        letterSpacing: 1,
        fontVariant: ['small-caps'],
        textAlign: 'center',
        bottom: 20,
        right: 20,
        textAlignVertical: 'center'
    },
    pressable: {
        flex: 1,
        //flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bgPressable: {
        flex: 1,
        width: '100%',
        backgroundColor: '#00000001'
    }
})