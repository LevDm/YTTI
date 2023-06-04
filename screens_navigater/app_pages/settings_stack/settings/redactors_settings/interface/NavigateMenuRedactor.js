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

//const menuTypes = ['classical','classical_animated','hidden', 'not'];
//const positionNavigateMenu = {min: 20, max: 80, step: 5}
//const valuePosition = ['left','center','right']
//const heightNavigateMenu = {min: 35, max: 65, step: 5}
import { menuTypes, positionNavigateMenu, valuePosition, heightNavigateMenu, drawerPositions } from "../../../../../../app_values/AppDefault";

export default NavigateMenuRedactor = ({
    appStyle,
    appConfig,
    //r_setAppStyle,

    //previewAppStyle,
    //setPreviewAppStyle,

    previewAppStyleA,

    //getNewAppStyleObject,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}) => {
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.navigationMenu

    

    const accents = Object.keys(appStyle.navigationMenu.accentsType) // 
    const accentsGroup =  Object.values(appStyle.navigationMenu.accentsType) // 
    const toIndexs = (group) => {'worklet'; return(group.map((item, index)=> item? index : -1).filter(item => item >= 0))};
    /*
    const [previewMenuType, setPreviewMenuType] = useState(menuTypes.indexOf(appStyle.navigationMenu.type))
    const [heightMenu, setHeightMenu] = useState(appStyle.navigationMenu.height)
    const [signatures, setSignatures] = useState(appStyle.navigationMenu.signatureIcons)
    const [position, setPosition] = useState(drawerPositions.indexOf(appStyle.navigationMenu.drawerPosition))
    const [accentsMethods, setAccentsMethods] = useState(toIndexs(Object.values(appStyle.navigationMenu.accentsType)))
    const [vertPos, setVertPos] = useState(appStyle.navigationMenu.position.vertical)
    const [horPos, setHorPos] = useState(valuePosition.indexOf(appStyle.navigationMenu.position.horizontal))
 */

    
    const previewMenuType = useDerivedValue(()=>menuTypes.indexOf(previewAppStyleA.value.navigationMenu.type))
    const heightMenu = useDerivedValue(()=>previewAppStyleA.value.navigationMenu.height)
    const signatures = useDerivedValue(()=>previewAppStyleA.value.navigationMenu.signatureIcons)
    const position = useDerivedValue(()=>drawerPositions.indexOf(previewAppStyleA.value.navigationMenu.drawerPosition))
    const accentsMethods = useDerivedValue(()=>toIndexs(Object.values(previewAppStyleA.value.navigationMenu.accentsType)))
    const vertPos = useDerivedValue(()=>previewAppStyleA.value.navigationMenu.position.vertical)
    const horPos = useDerivedValue(()=>valuePosition.indexOf(previewAppStyleA.value.navigationMenu.position.horizontal))
    /*
    useEffect(()=>{
        appStyle.navigationMenu.type != previewMenuType? setPreviewMenuType(appStyle.navigationMenu.type) : null
    },[appStyle])
    */
    
    /* 

    useDerivedValue(()=>{
        const usedType = 
        if(usedType != previewMenuType){
            runOnJS(setPreviewMenuType)(usedType)
        }

        const usedHeight = 
        if(usedHeight != heightMenu){
            runOnJS(setHeightMenu)(usedHeight)
        }

        const usedSignature = 
        if(usedSignature != previewMenuType){
            runOnJS(setSignatures)(usedSignature)
        }
        
        const usedAccents = 
        if(JSON.stringify(usedAccents) != JSON.stringify(accentsMethods)){
            runOnJS(setAccentsMethods)(usedAccents)
        }

        const usedPosition = 
        if(usedPosition != position){
            runOnJS(setPosition)(usedPosition)
        }

        const usedVert = 
        if(usedVert != vertPos){
            runOnJS(setVertPos)(usedVert)
        }

        const usedHor = 
        if(usedHor != horPos){
            runOnJS(setHorPos)(usedHor)
        }
    
    },[previewAppStyleA, previewMenuType, heightMenu,  signatures, accentsMethods, position])
    */

    const checkBoxPress = (activeIndex) => {
        const type = menuTypes[activeIndex]
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        if(type == "hidden" || type =="not"){
            newAppStyle.navigationMenu.height = 0
        } else {
            //console.log('new select class')
            newAppStyle.navigationMenu.height = 50
            //setSliderValueMenuHeight(50)
        }
        newAppStyle.navigationMenu.type = type
        newAppStyle.presetUsed = 'YTTI-custom';
        cancelAnimation(previewAppStyleA);
        previewAppStyleA.value = newAppStyle;

        //setPreviewMenuType(type)
    };

    const signatureChange = (value) =>{
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.navigationMenu.signatureIcons = value;//!signature;
        newAppStyle.presetUsed = 'YTTI-custom';
        cancelAnimation(previewAppStyleA);
        previewAppStyleA.value = newAppStyle;
    }

    const setPrewBasicVertPos = (value) => {
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.navigationMenu.position.vertical = Number(value);
        newAppStyle.presetUsed = 'YTTI-custom';
        cancelAnimation(previewAppStyleA);
        previewAppStyleA.value = newAppStyle;
    }

    const setPrewBasicMenuHeight = (value) => {
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.navigationMenu.height = Number(value);
        newAppStyle.presetUsed = 'YTTI-custom';
        cancelAnimation(previewAppStyleA);
        previewAppStyleA.value = newAppStyle;
    }

    const horizontalPositionSetting = (index) => {
        const positionType = valuePosition[index]
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.navigationMenu.position.horizontal = positionType
        newAppStyle.presetUsed = 'YTTI-custom';
        cancelAnimation(previewAppStyleA);
        previewAppStyleA.value = newAppStyle;
    };

    const drawerPositionSetting = (index) => {
        const drawerPosition =  drawerPositions[index]     
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.navigationMenu.drawerPosition = drawerPosition
        newAppStyle.presetUsed = 'YTTI-custom';
        cancelAnimation(previewAppStyleA);
        previewAppStyleA.value = newAppStyle;
    };

    
    const entering = (targetValues) => {
        'worklet';
        const animations = {
          opacity: withTiming(1, { duration: tingDuration }),
          transform: [
            {scale: withTiming(1, { duration: tingDuration })}
          ]
        };
        const initialValues = {
          opacity: 0,
          transform: [
            {scale: .97}
          ]
        };
        return {
          initialValues,
          animations,
        };
    };

    const tingDuration = 350
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
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        //newAppStyle.navigationMenu.accentsType = {'filling': false, 'coloring': false}
        for (let i = 0; i < accents.length; i++){newAppStyle.navigationMenu.accentsType[accents[i]] = indexs.includes(i)}            
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
    }

    return (
    <View 
        style ={{
            paddingBottom: 12
        }}
    >
    <BoxsField
        //  'one'>true || 'multiple'>false
        isChoiceOne={true}
        title = {Language.type}
        //  'one'>index || 'multiple'>[indexs]
        aValue = {previewMenuType} 
        groupSize = {menuTypes.length}
        groupItems = { appConfig.user.role == 'a'? Language.types : Language.types.slice(0, 2)}         
        onPress = {(activeIndex)=>{checkBoxPress(activeIndex)}}          
        appStyle = {appStyle}
        ThemeColorsAppIndex = {ThemeColorsAppIndex}
        ThemeSchema = {ThemeSchema}
    />
    {false && 
    <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary, marginTop: 10, paddingLeft: 10}]}>
        {Language.menuParams}
    </Text>}


    
    
    <View
        style = {[{
            height: 180,
        }]}
    >   
        <Reanimated.View 
            //exiting={exiting} {(previewMenuType == 0 || previewMenuType == 1) && 
            //entering={entering}
            //style = {{height: 80}}
            style = {[blindClassical, {position: 'absolute'}]}
        >
            <SliderField
                title = {Language.height}
                signaturesText = {{left: Language.slider.min, right: Language.slider.max}}     
                minimumValue={heightNavigateMenu.min}
                maximumValue={heightNavigateMenu.max}
                step = {heightNavigateMenu.step}
                aValue = {heightMenu}
                onSlidingComplete = {setPrewBasicMenuHeight}
                onValueChange = {setPrewBasicMenuHeight}
                appStyle = {appStyle}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />
            <SwitchField
                textTitle = {Language.signature}
                textStates = {Language.signatureState}
                //text = {`${Language.signature} ${Language.signatureState[signature]}`}
                aValue={signatures}
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
                onPress = {(activeIndexs)=>{settingAccents(activeIndexs)}}          
                appStyle = {appStyle}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />
        </Reanimated.View>  

        <Reanimated.View 
            //exiting={exiting} {previewMenuType == 2 && 
            //entering={entering}
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
            //exiting={exiting}  {previewMenuType == 2 && 
            //entering={entering}
            style={[blindHidden, {position: 'absolute'}]}
        >
            <SliderField
                style = {{marginTop: 10}}
                title = {Language.verticalPosition}
                signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
                minimumValue={positionNavigateMenu.min}
                maximumValue={positionNavigateMenu.max}
                step = {positionNavigateMenu.step}
                aValue = {vertPos}
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