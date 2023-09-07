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

import languagesAppList, { languagesApp } from "../../../../../../app_values/Languages";
import themesColorsAppList, { themesApp } from "../../../../../../app_values/Themes";
import { 
    BasePressable,
    BaseBox,
    BaseSlider,
    BaseSwitch 
} from "../../../../../../general_components/base_components/BaseElements";

import commonStaticStyles, { SwitchField, SliderField, BoxsField } from "../CommonElements";

import { menuTypes, positionNavigateMenu, valuePosition, heightNavigateMenu, drawerPositions } from "../../../../../../app_values/AppDefault";

export default NavigateMenuRedactor = (props) => {
    const {
        uiStyle,
        uiTheme,

        showAllSettings,
        tagStyle,
        aStyle,
        aTheme, 
        aPalette, 
        aScheme,

        appStyle,
        appConfig,
        redactorsSet,
        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex
    } = props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.navigationMenu

    

    const accents = Object.keys(appStyle.navigationMenu.accentsType) // 

    const accentsMethods = useDerivedValue(()=>{
        const toIndexs = (group) => group.map((item, index)=> item.value? index : -1).filter(item => item >= 0)
        return toIndexs(Object.values(uiStyle.navigationMenu.accentsType))
    })

    const previewMenuType = useDerivedValue(()=>menuTypes.indexOf(uiStyle.navigationMenu.type.value))
    const position = useDerivedValue(()=>drawerPositions.indexOf(uiStyle.navigationMenu.drawerPosition.value))    
    const horPos = useDerivedValue(()=>valuePosition.indexOf(uiStyle.navigationMenu.position.horizontal.value))



    const checkBoxPress = (activeIndex) => {
        const type = menuTypes[activeIndex]
        if(type == "hidden" || type =="not"){
            uiStyle.navigationMenu.height.value = 0
        } else {
            uiStyle.navigationMenu.height.value = 50
        }
        uiStyle.navigationMenu.type.value = type
        tagStyle('navigationMenu.type')
    }

    const signatureChange = (value) =>{
        uiStyle.navigationMenu.signatureIcons.value = value
        tagStyle('navigationMenu.signatureIcons')
    }

    const setPrewBasicVertPos = (value) => {
        uiStyle.navigationMenu.position.vertical.value = Number(value);
        tagStyle('navigationMenu.position')
    }

    const setPrewBasicMenuHeight = (value) => {
        uiStyle.navigationMenu.height.value = Number(value);
        tagStyle('navigationMenu.height')
    }

    const horizontalPositionSetting = (index) => {
        uiStyle.navigationMenu.position.horizontal.value = valuePosition[index]
        tagStyle('navigationMenu.position.horizontal')
    }

    const drawerPositionSetting = (index) => {
        uiStyle.navigationMenu.drawerPosition.value = drawerPositions[index] 
        tagStyle('navigationMenu.drawerPosition')
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
            zIndex: previewMenuType.value == 0? 1 : 0, 
        }
    })

    const blindNot = useAnimatedStyle(()=>{
        return {
            opacity: withSequence(
                withTiming(0, {duration: tingDuration*down}),
                withTiming(previewMenuType.value == 1? 1 : 0, {duration: tingDuration*up}),
            ),
            transform: [{scale: withDelay(tingDuration*down, withTiming(previewMenuType.value == 1? 1 : .97, {duration: tingDuration*(up+0.1)}))}], 
            zIndex: previewMenuType.value == 1? 1 : 0, 
        }
    })

    const blindHidden = useAnimatedStyle(()=>{
        return {
            opacity: withSequence(
                withTiming(0, {duration: tingDuration*down}),
                withTiming(previewMenuType.value == 2? 1 : 0, {duration: tingDuration*up}),
            ),
            transform: [{scale: withDelay(tingDuration*down, withTiming(previewMenuType.value == 2? 1 : .97, {duration: tingDuration*(up+0.1)}))}], 
            zIndex: previewMenuType.value == 2? 1 : 0, 
        }
    })
    

    const settingAccents = (indexs) => {
        for(let i = 0; i < accents.length; i++){uiStyle.navigationMenu.accentsType[accents[i]].value = indexs.includes(i)}  
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
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
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
                    aValue = {uiStyle.navigationMenu.height}
                    //onSlidingComplete = {setPrewBasicMenuHeight}
                    onValueChange = {setPrewBasicMenuHeight}
                    appStyle = {appStyle}
                    ThemeColorsAppIndex = {ThemeColorsAppIndex}
                    ThemeSchema = {ThemeSchema}
                />
                <SwitchField
                    textTitle = {Language.signature}
                    textStates = {Language.signatureState}
                    //text = {`${Language.signature} ${Language.signatureState[signature]}`}
                    aValue={uiStyle.navigationMenu.signatureIcons}
                    onChange={signatureChange}
                    appStyle = {appStyle}
                    ThemeColorsAppIndex = {ThemeColorsAppIndex}
                    ThemeSchema = {ThemeSchema}
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
                    appStyle = {appStyle}
                    ThemeColorsAppIndex = {ThemeColorsAppIndex}
                    ThemeSchema = {ThemeSchema}
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
                    onPress = {(activeIndex)=>{drawerPositionSetting(activeIndex)}}          
                    appStyle = {appStyle}
                    ThemeColorsAppIndex = {ThemeColorsAppIndex}
                    ThemeSchema = {ThemeSchema}
                /> 
                <BoxsField
                    //  'one'>true || 'multiple'>false
                    isChoiceOne={false}
                    title = {Language.accentsType}
                    //  'one'>index || 'multiple'>[indexs]
                    aValue = {accentsMethods}
                    groupSize = {accents.length}
                    groupItems = {Object.values(Language.accentsTypes)}        
                    onPress = {(activeIndexs)=>{settingAccents(activeIndexs)}}          
                    appStyle = {appStyle}
                    ThemeColorsAppIndex = {ThemeColorsAppIndex}
                    ThemeSchema = {ThemeSchema}
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
                    aValue = {uiStyle.navigationMenu.position.vertical}
                    onSlidingComplete = {setPrewBasicVertPos}
                    onValueChange = {setPrewBasicVertPos}
                    appStyle = {appStyle}
                    ThemeColorsAppIndex = {ThemeColorsAppIndex}
                    ThemeSchema = {ThemeSchema}
                />
                <BoxsField
                    //  'one'>true || 'multiple'>false
                    isChoiceOne={true}
                    title = {Language.horizontalPosition}
                    //  'one'>index || 'multiple'>[indexs]
                    aValue = {horPos} 
                    groupSize = {valuePosition.length}
                    groupItems = {Language.horizontalPositions}         
                    onPress = {(activeIndex)=>{horizontalPositionSetting(activeIndex)}}          
                    appStyle = {appStyle}
                    ThemeColorsAppIndex = {ThemeColorsAppIndex}
                    ThemeSchema = {ThemeSchema}
                />
            </Reanimated.View>
        </View>
    </View>)
}

const staticStyles = StyleSheet.create({

    ...commonStaticStyles
});