import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import Reanimated, { withDelay, withSequence } from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    cancelAnimation,
    useDerivedValue,
    runOnJS,
    withTiming
} from 'react-native-reanimated';


import commonStaticStyles, { SwitchField, SliderField, BoxsField } from "../CommonElements";

import { menuTypes, positionNavigateMenu, valuePosition, heightNavigateMenu, drawerPositions } from "../../../../../../app_values/AppDefault";
import useLanguage from "../../../../../../app_hooks/useLanguage";

export default NavigateMenuRedactor = (props) => {
    const {
        uiStyle,
        uiTheme,

        showAllSettings,
        tagStyle,

        r_uiStyle,
        Theme
    } = props

    const Language = useLanguage().SettingsScreen.Redactors.navigationMenu

    const {
        navigationMenu: {
            height,
            type,
            pos: {
                y,
                x: horizontal,
                dx : drawerPosition,
            },
            icons: {
                highlight: accentsType, //{"coloring": true, "filling": true},
                signature
            }
        }
    } = uiStyle

    const accents = Object.keys(r_uiStyle.navigationMenu.icons.highlight) // 

    const accentsMethods = useDerivedValue(()=>{
        const toIndexs = (group) => group.map((item, index)=> item.value? index : -1).filter(item => item >= 0)
        return toIndexs(Object.values(accentsType))
    })

    const previewMenuType = useDerivedValue(()=>menuTypes.indexOf(type.value))
    const position = useDerivedValue(()=>drawerPositions.indexOf(drawerPosition.value))    
    const horPos = useDerivedValue(()=>valuePosition.indexOf(horizontal.value))

    console.log(accentsMethods.value)

    const checkBoxPress = (activeIndex) => {
        const type = menuTypes[activeIndex]
        console.log(type)
        uiStyle.navigationMenu.type.value = type
        tagStyle('navigationMenu.type')
    }

    const signatureChange = (value) =>{
        uiStyle.navigationMenu.icons.signature.value = value
        tagStyle('navigationMenu.icons.signature')
    }

    const setPrewBasicVertPos = (value) => {
        uiStyle.navigationMenu.pos.y.value = Number(value);
        tagStyle('navigationMenu.pos.y')
    }

    const setPrewBasicMenuHeight = (value) => {
        uiStyle.navigationMenu.height.value = Number(value);
        tagStyle('navigationMenu.height')
    }

    const horizontalPositionSetting = (index) => {
        uiStyle.navigationMenu.pos.x.value = valuePosition[index]
        tagStyle('navigationMenu.pos.x')
    }

    const drawerPositionSetting = (index) => {
        uiStyle.navigationMenu.pos.dx.value = drawerPositions[index] 
        tagStyle('navigationMenu.pos.dx')
    }


    const tingDuration = 300
    const up = 0.25
    const down = 0.75
    
    const blindClassical = useAnimatedStyle(()=>{
        return {
            
            opacity: withSequence(
                withTiming(0, {duration: tingDuration*down}),
                withTiming(previewMenuType.value == 0? 1 : 0, {duration: tingDuration*up}),
            ),
            transform: [{scale: withDelay(tingDuration*down, withTiming(previewMenuType.value == 0? 1 : .97, {duration: tingDuration*(up+0.1)}))}], 
            zIndex: previewMenuType.value == 0? 2 : 0, 
        }
    })

    const blindNot = useAnimatedStyle(()=>{
        return {
            opacity: withSequence(
                withTiming(0, {duration: tingDuration*down}),
                withTiming(previewMenuType.value == 1? 1 : 0, {duration: tingDuration*up}),
            ),
            transform: [{scale: withDelay(tingDuration*down, withTiming(previewMenuType.value == 1? 1 : .97, {duration: tingDuration*(up+0.1)}))}], 
            zIndex: previewMenuType.value == 1? 2 : 0, 
        }
    })

    const blindHidden = useAnimatedStyle(()=>{
        return {
            opacity: withSequence(
                withTiming(0, {duration: tingDuration*down}),
                withTiming(previewMenuType.value == 2? 1 : 0, {duration: tingDuration*up}),
            ),
            transform: [{scale: withDelay(tingDuration*down, withTiming(previewMenuType.value == 2? 1 : .97, {duration: tingDuration*(up+0.1)}))}], 
            zIndex: previewMenuType.value == 2? 2 : 0, 
        }
    })
    

    const settingAccents = (indexs) => {
        for(let i = 0; i < accents.length; i++){uiStyle.navigationMenu.icons.highlight[accents[i]].value = indexs.includes(i)}  
    }

    return (
    <View 
        style ={{
            
        }}
    >
        <BoxsField
            //  'one'>true || 'multiple'>false
            isChoiceOne={true}
            title = {Language.type}
            //  'one'>index || 'multiple'>[indexs]
            aValue = {previewMenuType} 
            groupSize = {menuTypes.length}
            groupItems = { showAllSettings? Language.types : Language.types.slice(0, 2)}         
            onPress = {checkBoxPress}          
            appStyle = {r_uiStyle}
            Theme = {Theme}
        />
        <View
            style = {[{
                height: 250,
                marginTop: 8,
                width: '100%'
            }]}
        >   
            <Reanimated.View 
                style = {[blindClassical, {position: 'absolute',height: '100%', width: '100%'}]}
            >
                <SliderField
                    title = {Language.height}
                    signaturesText = {{left: Language.slider.min, right: Language.slider.max}}     
                    minimumValue={heightNavigateMenu.min}
                    maximumValue={heightNavigateMenu.max}
                    step = {heightNavigateMenu.step}
                    aValue = {height}
                    //onSlidingComplete = {setPrewBasicMenuHeight}
                    onValueChange = {setPrewBasicMenuHeight}
                    appStyle = {r_uiStyle}
                    Theme = {Theme}
                />
                <SwitchField
                    textTitle = {Language.signature}
                    textStates = {Language.signatureState}
                    //text = {`${Language.signature} ${Language.signatureState[signature]}`}
                    aValue={signature}
                    onChange={signatureChange}
                    appStyle = {r_uiStyle}
                    Theme = {Theme}
                />    
                <BoxsField
                    //  'one'>true || 'multiple'>false
                    isChoiceOne={false}
                    title = {Language.accentsType}
                    //  'one'>index || 'multiple'>[indexs]
                    aValue = {accentsMethods}
                    groupSize = {accents.length}
                    groupItems = {Object.values(Language.accentsTypes)}        
                    onPress = {settingAccents}          
                    appStyle = {r_uiStyle}
                    Theme = {Theme}
                />
            </Reanimated.View>  

            <Reanimated.View 
                style={[blindNot, {position: 'absolute'}]}
            >
                <BoxsField
                    //  'one'>true || 'multiple'>false
                    isChoiceOne={true}
                    title = {Language.horizontalPositionDrawer}
                    //  'one'>index || 'multiple'>[indexs]
                    aValue = {position} 
                    groupSize = {drawerPositions.length}
                    groupItems = {Language.horizontalPositionsDrawer}         
                    onPress = {drawerPositionSetting}          
                    appStyle = {r_uiStyle}
                    Theme = {Theme}
                /> 
            </Reanimated.View>

            <Reanimated.View 
                style={[blindHidden, {position: 'absolute'}]}
            >
                <SliderField
                    style = {{marginTop: 10}}
                    title = {Language.verticalPosition}
                    signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
                    minimumValue={positionNavigateMenu.min}
                    maximumValue={positionNavigateMenu.max}
                    step = {positionNavigateMenu.step}
                    aValue = {y}
                    onSlidingComplete = {setPrewBasicVertPos}
                    onValueChange = {setPrewBasicVertPos}
                    appStyle = {r_uiStyle}
                    Theme = {Theme}
                />
                <BoxsField
                    //  'one'>true || 'multiple'>false
                    isChoiceOne={true}
                    title = {Language.horizontalPosition}
                    //  'one'>index || 'multiple'>[indexs]
                    aValue = {horPos} 
                    groupSize = {valuePosition.length}
                    groupItems = {Language.horizontalPositions}         
                    onPress = {horizontalPositionSetting}          
                    appStyle = {r_uiStyle}
                    Theme = {Theme}
                />
            </Reanimated.View>
        </View>
    </View>)
}

const staticStyles = StyleSheet.create({

    ...commonStaticStyles
});