import React, { useCallback, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions, Pressable, ToastAndroid, } from 'react-native';
import Constants from "expo-constants";

import Reanimated, {
  interpolateColor,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  convertToRGBA,
  useAnimatedReaction
} from 'react-native-reanimated';

export default PaletteView = (props) => {
    const {
        size = 240,
        gapForms = 3,
        br = 3,
        itemsGap = 2,
        uiTheme
    } = props

    const itemSizeCheck = ((size-3*gapForms) * 0.3125 -11*itemsGap)/10

    const {
        basics: {
            neutrals: {
                primary: bg
            }
        }
    } = uiTheme

    return (
        <Reanimated.View
            style={[{
                height: size,
                width: size,
                borderRadius: br,
                gap: gapForms,
                padding: gapForms,
                flexDirection: 'row',
                backgroundColor: bg
            }]}
        >
            <View
                style={{
                    gap: gapForms,
                    
                }}
            >
                <Form1 {...props}/>
                <View flexDirection={'row'}>
                    <Form2 {...props} isWide={false} basicCategory = {'neutrals'} items={'icons'}/>
                    <Form2 {...props} isWide={false} basicCategory = {'accents'} items={'icons'}/>
                </View>
            </View>
            <View
                style={{
                    gap: gapForms,
                }}
            >
                <View>
                    <Form2 {...props} isWide={true} basicCategory = {'neutrals'} items={'texts'}/>
                    <Form2 {...props} isWide={true} basicCategory = {'accents'} items={'texts'}/>
                </View>
                <Form3 {...props}/>
            </View>
        </Reanimated.View>
    )
}


const Form1 = (props) => {
    const {
        size = 240,
        gapForms = 3,
        br = 3,
        uiTheme
    } = props

    const formSize = (size-3*gapForms) * 0.625

    const {
        basics: {
            neutrals: {
                primary: basicNP,
                secondary: basicNS,
                tertiary: basicNT,
                quaternary: basicNQ
            },
            accents: {
                primary: basicAP,
                secondary: basicAS,
                tertiary: basicAT,
                quaternary: basicAQ
            }
        }
    } = uiTheme

    return (
        <Reanimated.View
            style={[{
                height: formSize,
                width: formSize,
                overflow: 'hidden',
                borderRadius: br,
            }]}
        >
            <View flexDirection={'row'}>
                <View>
                    <Reanimated.View style={{height: formSize*0.375, width: formSize*0.375}} backgroundColor={basicAS}/>
                    <Reanimated.View style={{height: formSize*0.5, width: formSize*0.375, backgroundColor: basicAT}}/>
                </View>
                <View>
                    <Reanimated.View style={{height: formSize*0.25, width: formSize*0.625, backgroundColor: basicAP}}/>
                    <Reanimated.View style={{height: formSize*0.625, width: formSize*0.625, backgroundColor: basicNS}}/>
                </View>
            </View>
            <View flexDirection={'row'}>
                <Reanimated.View style={{height: formSize*0.125, width: formSize*0.625, backgroundColor: basicNT}}/>
                <Reanimated.View style={{height: formSize*0.125, width: formSize*0.375, backgroundColor: basicAQ}}/>
            </View>
        </Reanimated.View>
    )
}

const Form2 = (props) => {
    const {
        size = 240,
        gapForms = 3,
        itemsGap = 2,
        br = 3,
        uiTheme,

        isWide = true,
        basicCategory = 'accents',
        items = 'icons',
    } = props

    const {
        primary: basicP,
        secondary: basicS,
        tertiary: basicT,
        quaternary: basicQ
    } = uiTheme.basics[basicCategory]

    const {
        neutrals: {
            primary: itemNP,
            secondary: itemNS,
            tertiary: itemNT,
            quaternary: itemNQ
        },
        accents: {
            primary: itemAP,
            secondary: itemAS,
            tertiary: itemAT,
            quaternary: itemAQ
        }
    } = uiTheme[items]


    const partsBg = [basicP,  basicS, basicT, basicQ]
    const starts = ['l', 't', 'b', 'r']
    const params = ['p','s','t','q',]

    const long = (size-3*gapForms) * 0.375
    const short = (size-3*gapForms) * 0.3125
    
    const formSize = isWide? {
        h: short,
        w: long
    } : {
        h: long,
        w: short
    }

    const itemSize = (short -11*itemsGap)/10


    const itemStyle = items == 'icons'? {borderRadius: itemSize/2} : {}

    
    const Part = (props) => {
        const {
            start,
            bg,
            items
        } = props

        const columMaxIndex = (start == 'l' || start == 'r')? 4 : 8
        const rowMaxIndex = (start == 't' || start == 'b')? 4 : 8

        const columnStyle = {
            flexDirection: (start == 'l' || start == 'b')? 'column-reverse' : 'column'
        }
        columnStyle[(start == 'l' || start == 't')? 'top' : 'bottom'] = (2*itemsGap+itemSize)
        columnStyle[(start == 'l' || start == 'b')? 'left': 'right'] = itemsGap


        const rowStyle= {
            flexDirection: (start == 'r' || start == 'b')? 'row-reverse' : 'row'
        }
        rowStyle[(start == 'l' || start == 'b')? 'left': 'right'] = (2*itemsGap+itemSize)
        rowStyle[(start == 'l' || start == 't')? 'top' : 'bottom'] = itemsGap

        
        return (
            <Reanimated.View
                style={{
                    height: formSize.h/2,
                    width: formSize.w/2,
                    backgroundColor: bg,
                }}
            >
                <View
                    style={[columnStyle, {position: 'absolute', gap: itemsGap}]}
                >
                    {items.map((color, index)=>((columMaxIndex-4 <= index && index < columMaxIndex)? 
                        <Reanimated.View key={'item'+start+index} style={[{backgroundColor: color, height: itemSize, width: itemSize}, itemStyle]}/> 
                    : null))}
                </View>
                <View
                    style={[rowStyle, {position: 'absolute', gap: itemsGap}]}
                >
                    {items.map((color, index)=>(rowMaxIndex-4 <= index && index < rowMaxIndex? 
                        <Reanimated.View key={'item'+start+index} style={[{backgroundColor: color, height: itemSize, width: itemSize}, itemStyle]}/> 
                    : null))}
                </View>
            </Reanimated.View>
        )
    }

    return (
        <Reanimated.View
            style={[{
                height: formSize.h,
                width: formSize.w,
                overflow: 'hidden',
                borderRadius: br,
                flexWrap: 'wrap',
                flexDirection: 'row',
            }]}
        >
            {params.map((param, index)=>{
                let partsItems = []
                //console.log(basicCategory, basicCategory == 'neutrals')
                if(basicCategory == 'neutrals'){
                    partsItems = [itemNS, itemNT, itemAP, itemAS, itemAT]
                } else {
                    if(param != 'q'){
                        partsItems.push(itemNP)
                    }
                    if(param == 'p' ){
                        partsItems.push(itemAQ)
                    }
                    if(param == 's' || param == 't' ){
                        partsItems.push(itemNT)
                    }
                    if(param == 'q' ){
                        partsItems.push(itemNQ)
                    }
                }

                return (
                    <Part
                        key={'part'+starts[index]+index}
                        start = {starts[index]}
                        bg = {partsBg[index]}
                        items = {partsItems}
                    />
                )
            })}
        </Reanimated.View>
    )
}

const Form3 = (props) => {
    const {
        size = 240,
        gapForms = 3,
        br = 3,
        uiTheme
    } = props

    const formSize = (size-3*gapForms) * 0.375
    const formContentSize = formSize-6*gapForms

    const {
        basics: {
            neutrals: {
                primary: basicNP,
                secondary: basicNS,
                tertiary: basicNT,
                quaternary: basicNQ
            },
            accents: {
                primary: basicAP,
                secondary: basicAS,
                tertiary: basicAT,
                quaternary: basicAQ
            }
        }
    } = uiTheme

    return (
        <Reanimated.View
            style={[{
                height: formSize,
                width: formSize,
                borderRadius: br,
                padding: 3*gapForms,
                backgroundColor: basicNQ,
            }]}
        >
            <View 
                style={{
                    overflow: 'hidden',
                    borderRadius: br,
                    flexDirection: 'row'
                }}
            >
                <View>
                    <Reanimated.View style={{height: formContentSize*0.375, width: formContentSize*0.375, backgroundColor: basicAS}}/>
                    <Reanimated.View style={{height: formContentSize*0.625, width: formContentSize*0.375, backgroundColor: basicAT}}/>
                </View>
                <View>
                    <Reanimated.View style={{height: formContentSize*0.375, width: formContentSize*0.625, backgroundColor: basicAP}}/>
                    <Reanimated.View style={{height: formContentSize*0.625, width: formContentSize*0.625, backgroundColor: basicNS}}/>
                </View>
            </View>
        </Reanimated.View>
    )
}