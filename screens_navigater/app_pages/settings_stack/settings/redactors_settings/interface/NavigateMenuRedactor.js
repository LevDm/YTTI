import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import Reanimated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    cancelAnimation,
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
    //setAppStyle,
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

    const [previewMenuType, setPreviewMenuType] = useState(appStyle.navigationMenu.type)

    useEffect(()=>{
        appStyle.navigationMenu.type != previewMenuType? setPreviewMenuType(appStyle.navigationMenu.type) : null
    },[appStyle])

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
        newAppStyle.presetUsed = 'YTAT-custom';
        cancelAnimation(previewAppStyleA);
        previewAppStyleA.value = newAppStyle;

        setPreviewMenuType(type)
    };

    const signatureChange = (value) =>{
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.navigationMenu.signatureIcons = value;//!signature;
        newAppStyle.presetUsed = 'YTAT-custom';
        cancelAnimation(previewAppStyleA);
        previewAppStyleA.value = newAppStyle;
    }

    const setPrewBasicVertPos = (value) => {
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.navigationMenu.position.vertical = Number(value);
        newAppStyle.presetUsed = 'YTAT-custom';
        cancelAnimation(previewAppStyleA);
        previewAppStyleA.value = newAppStyle;
    }

    const setPrewBasicMenuHeight = (value) => {
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.navigationMenu.height = Number(value);
        newAppStyle.presetUsed = 'YTAT-custom';
        cancelAnimation(previewAppStyleA);
        previewAppStyleA.value = newAppStyle;
    }

    const horizontalPositionSetting = (index) => {
        const positionType = valuePosition[index]
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.navigationMenu.position.horizontal = positionType
        newAppStyle.presetUsed = 'YTAT-custom';
        cancelAnimation(previewAppStyleA);
        previewAppStyleA.value = newAppStyle;
    };

    const drawerPositionSetting = (index) => {
        const drawerPosition =  drawerPositions[index]     
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.navigationMenu.drawerPosition = drawerPosition
        newAppStyle.presetUsed = 'YTAT-custom';
        cancelAnimation(previewAppStyleA);
        previewAppStyleA.value = newAppStyle;
    };

    const tingDuration = 300
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
    const exiting = (targetValues) => {
        'worklet';
        const animations = {
          opacity: withTiming(0, { duration: tingDuration }),
        };
        const initialValues = {
          opacity: 1,
        };
        return {
          initialValues,
          animations,
        };
    };

    const accents = Object.keys(appStyle.navigationMenu.accentsType) // 
    const accentsGroup =  Object.values(appStyle.navigationMenu.accentsType) // 
    const toIndexs = (group) => group.map((item, index)=> item? index : -1).filter(item => item >= 0);

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
            
        }}
    >
    <BoxsField
        //  'one'>true || 'multiple'>false
        isChoiceOne={true}
        title = {Language.type}
        //  'one'>index || 'multiple'>[indexs]
        primaryValue = {menuTypes.indexOf(appStyle.navigationMenu.type)} 
        groupSize = {menuTypes.length}
        groupItems = {Language.types}         
        onPress = {(activeIndex)=>{checkBoxPress(activeIndex)}}          
        appStyle = {appStyle}
        ThemeColorsAppIndex = {ThemeColorsAppIndex}
        ThemeSchema = {ThemeSchema}
    />

    <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary, marginTop: 10, paddingLeft: 10}]}>
        {Language.menuParams}
    </Text>
    
    <View
        style = {[{
            height: 180,
        }]}
    >           
        {previewMenuType == menuTypes[2] && 
        <Reanimated.View 
            //exiting={exiting} 
            entering={entering}
        >
            <BoxsField
                //  'one'>true || 'multiple'>false
                isChoiceOne={true}
                title = {Language.horizontalPositionDrawer}
                //  'one'>index || 'multiple'>[indexs]
                primaryValue = {drawerPositions.indexOf(appStyle.navigationMenu.drawerPosition)} 
                groupSize = {drawerPositions.length}
                groupItems = {Language.horizontalPositionsDrawer}         
                onPress = {(activeIndex)=>{drawerPositionSetting(activeIndex)}}          
                appStyle = {appStyle}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />
        </Reanimated.View>}

        {previewMenuType == menuTypes[1] &&  
        <Reanimated.View 
            //exiting={exiting} 
            entering={entering}
        >
            <SliderField
                style = {{marginTop: 10}}
                title = {Language.verticalPosition}
                signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
                minimumValue={positionNavigateMenu.min}
                maximumValue={positionNavigateMenu.max}
                step = {positionNavigateMenu.step}
                value = {appStyle.navigationMenu.position.vertical}
                onSlidingComplete = {setPrewBasicVertPos}
                onValueChange = {setPrewBasicVertPos}
                appStyle = {appStyle}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />
        </Reanimated.View>}

        {previewMenuType == menuTypes[1] && 
        <Reanimated.View 
            //exiting={exiting} 
            entering={entering}
        >
            <BoxsField
                //  'one'>true || 'multiple'>false
                isChoiceOne={true}
                title = {Language.horizontalPosition}
                //  'one'>index || 'multiple'>[indexs]
                primaryValue = {valuePosition.indexOf(appStyle.navigationMenu.position.horizontal)} 
                groupSize = {valuePosition.length}
                groupItems = {Language.horizontalPositions}         
                onPress = {(activeIndex)=>{horizontalPositionSetting(activeIndex)}}          
                appStyle = {appStyle}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />
        </Reanimated.View>}

        {previewMenuType == menuTypes[0] && 
        <Reanimated.View 
            //exiting={exiting} 
            entering={entering}
        >
            <SliderField
                title = {Language.height}
                signaturesText = {{left: Language.slider.min, right: Language.slider.max}}     
                minimumValue={heightNavigateMenu.min}
                maximumValue={heightNavigateMenu.max}
                step = {heightNavigateMenu.step}
                value = {appStyle.navigationMenu.height}
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
                primeValue={appStyle.navigationMenu.signatureIcons}
                onChange={signatureChange}
                appStyle = {appStyle}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />

        </Reanimated.View>}

        {(previewMenuType == menuTypes[0] || previewMenuType == menuTypes[2]) &&  
        <Reanimated.View 
            //exiting={exiting} 
            entering={entering}
            //style = {{height: 80}}
        >
        <BoxsField
            //  'one'>true || 'multiple'>false
            isChoiceOne={false}
            title = {Language.accentsType}
            //  'one'>index || 'multiple'>[indexs]
            primaryValue = {toIndexs(accentsGroup)}
            groupSize = {accents.length}
            groupItems = {Object.values(Language.accentsTypes)}        
            onPress = {(activeIndexs)=>{settingAccents(activeIndexs)}}          
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        </Reanimated.View>}
    </View>
    </View>)
}

const staticStyles = StyleSheet.create({

    ...commonStaticStyles
});