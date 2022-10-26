import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
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

import commonStaticStyles, { SwitchField } from "../CommonElements";

//const menuTypes = ['classical','classical_animated','hidden', 'not'];
//const positionNavigateMenu = {min: 20, max: 80, step: 5}
//const valuePosition = ['left','center','right']
//const heightNavigateMenu = {min: 35, max: 65, step: 5}
import { menuTypes, positionNavigateMenu, valuePosition, heightNavigateMenu, drawerPositions } from "../../../../../../app_values/AppDefault";

export default NavigateMenuRedactor = ({
    appStyle,
    setAppStyle,
    r_setAppStyle,

    setPreviewAppStyle,
    getNewAppStyleObject,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}) => {
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.navigationMenu

    const getGroup = (type) => {
        let group = []
        for (let i of menuTypes){
            let check = false
            if(type === i){check = true}
            group.push(check)
        }
        return group
    };

    const getGroupPositions = (type) => {
        let group = []
        for (let i of valuePosition){
            let check = false
            if(type === i){check = true}
            group.push(check)
        }
        return group
    };

    const getGroupPositionsDrawer = (type) => {
        let group = []
        for (let i of drawerPositions){
            let check = false
            if(type === i){check = true}
            group.push(check)
        }
        return group
    };

    const [checkGroup, setCheckGroup] = useState(getGroup(appStyle.navigationMenu.type));
    const checkBoxPress = (type) => {
        const newGroup = getGroup(type)
        let newAppStyle = getNewAppStyleObject();
        if(type == "hidden" || type =="not"){
            newAppStyle.navigationMenu.height = 0
        } else {
            console.log('new select class')
            newAppStyle.navigationMenu.height = 50
            setSliderValueMenuHeight(50)
        }
        newAppStyle.navigationMenu.type = type
        //console.log('newAppStyle',newAppStyle)
        setPreviewAppStyle(newAppStyle);
        setCheckGroup(newGroup);
    };

    const [signature, setSignature] = useState(appStyle.navigationMenu.signatureIcons);
    const signatureChange = () =>{
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.navigationMenu.signatureIcons = !signature;
        setPreviewAppStyle(newAppStyle);
        setSignature(!signature)
    }

    const [rippleEffect, setRippleEffect] = useState(appStyle.navigationMenu.rippleEffect);
    const rippleEffectChange = () =>{
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.navigationMenu.rippleEffect = !rippleEffect;
        setPreviewAppStyle(newAppStyle);
        setRippleEffect(!rippleEffect)
    }

    const [sliderValueVert, setSliderValueVert] = useState(appStyle.navigationMenu.position.vertical);
    const setPrewBasicVertPos = (value) => {
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.navigationMenu.position.vertical = Number(value);
        setPreviewAppStyle(newAppStyle);
    }

    const [sliderValueMenuHeight, setSliderValueMenuHeight] = useState(appStyle.navigationMenu.height);
    const setPrewBasicMenuHeight = (value) => {
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.navigationMenu.height = Number(value);
        setPreviewAppStyle(newAppStyle);
    }

    const [checkGroupHorPos, setCheckGroupHorPos] = useState(getGroupPositions(appStyle.navigationMenu.position.horizontal));
    const horizontalPositionSetting = (positionType, index) => {
        setCheckGroupHorPos(getGroupPositions(positionType));

        let newAppStyle = getNewAppStyleObject();
        newAppStyle.navigationMenu.position.horizontal = positionType//valuePosition[index];
        setPreviewAppStyle(newAppStyle);
    };

    const [drawerPosition, setDrawerPosition] = useState(getGroupPositionsDrawer(appStyle.navigationMenu.drawerPosition));
    const drawerPositionSetting = (drawerPosition, index) => {
        setDrawerPosition(getGroupPositionsDrawer(drawerPosition));

        let newAppStyle = getNewAppStyleObject();
        newAppStyle.navigationMenu.drawerPosition = drawerPosition//valuePosition[index];
        setPreviewAppStyle(newAppStyle);
    };

    const tingDuration = 200
    const entering = (targetValues) => {
        'worklet';
        const animations = {
          opacity: withTiming(1, { duration: tingDuration }),
        };
        const initialValues = {
          opacity: 0,
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

    return (
    <View 
        style ={{
            //marginBottom: 30, 
        }}
    >
    <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary}]}>
        {Language.type}
    </Text>
    <View 
        style = {[{
            marginTop: 5,
            marginLeft: 20,
            width: '60%'
        }]}
    >
        {menuTypes.map((item, index)=>(
        <BaseBox
            key = {item+index}
            style = {{
                borderRadius: appStyle.borderRadius.additional,
                backgroundColor: 'transparent'
            }}
            android_ripple={{
                color: Theme.icons.accents.primary,
                borderless: true,
                foreground: false
            }}
            Item = {<Text style = {[staticStyles.listText, {color: Theme.texts.neutrals.secondary}]}>{Language.types[index]}</Text>}
            Check = {checkGroup[index]}
            onPress = {()=>{checkBoxPress(item)}}
            BoxBorderRadius = {appStyle.borderRadius.additional}
            ColorsChange = {{true: Theme.icons.accents.primary, false: Theme.icons.accents.quaternary}}
        />
        ))}
    </View>
    <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary, marginTop: 15,}]}>
        {Language.menuParams}
    </Text>
    
    

    <View
        style = {[{
            height: 210,
            justifyContent: 'space-around'
        }]}
    >   

        <SwitchField
            text = {`${Language.rippleEffect} ${Language.rippleEffectState[rippleEffect]}`}
            primeValue={rippleEffect}
            onChange={rippleEffectChange}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        

        {checkGroup[2] && 
        <Animated.View 
            exiting={exiting} 
            entering={entering}
        >
            <View
                style = {{
                    maxHeight: 120,
                }}
            >
                <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary}]}>
                    {Language.horizontalPositionDrawer}
                </Text>
                <View
                    style = {{
                        marginLeft: 20,
                        width: '60%'
                    }}
                >
                    {drawerPositions.map((item, index)=>(
                    <BaseBox
                        key = {item+index}
                        style = {{
                            //width: '100%',
                            borderRadius: appStyle.borderRadius.additional,
                            backgroundColor: 'transparent'
                        }}
                        android_ripple={{
                            color: Theme.icons.accents.primary,
                            borderless: true,
                            foreground: false
                        }}
                        Item = {<Text style = {[staticStyles.listText, {color: Theme.texts.neutrals.secondary}]} >{Language.horizontalPositionsDrawer[index]}</Text>}
                        Check = {drawerPosition[index]}
                        onPress = {()=>{drawerPositionSetting(item, index)}}
                        BoxBorderRadius = {appStyle.borderRadius.additional}
                        ColorsChange = {{true: Theme.icons.accents.primary, false: Theme.icons.accents.quaternary}}
                    />
                    ))}
                </View>
            </View>
        </Animated.View>}

        {checkGroup[1] && 
        <Animated.View 
            exiting={exiting} 
            entering={entering}
            style = {{
                maxHeight: 60,
                minHeight: 55
            }}
        >
            <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary}]}>
                {Language.verticalPosition}
            </Text>
            <BaseSlider
                signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
                signaturesStyle = {[staticStyles.signaturesText, {color: Theme.texts.neutrals.tertiary}]}
                areaStyle = {{marginHorizontal: 20}}
                minimumValue={positionNavigateMenu.min}
                maximumValue={positionNavigateMenu.max}
                step = {positionNavigateMenu.step}
                value = {sliderValueVert}
                onSlidingComplete = {(value)=>{                 
                    setSliderValueVert(value);
                    setPrewBasicVertPos(value);
                }}
                onValueChange = {(value)=>{              
                    setPrewBasicVertPos(value);
                }}
                minimumTrackTintColor = {Theme.icons.accents.tertiary}
                maximumTrackTintColor = {Theme.icons.accents.quaternary}
                thumbTintColor = {Theme.icons.accents.primary}
            />
        </Animated.View>}

        {checkGroup[1] && 
        <Animated.View 
            exiting={exiting} 
            entering={entering}
            style = {{
                maxHeight: 120,
                //marginTop: 15
            }}
        >
            <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary}]}>
                {Language.horizontalPosition}
            </Text>
            <View
                style = {{
                    marginLeft: 20,
                    width: '60%'
                }}
            >
                {valuePosition.map((item, index)=>(
                <BaseBox
                    key = {item+index}
                    style = {{
                        borderRadius: appStyle.borderRadius.additional,
                        backgroundColor: 'transparent'
                    }}
                    android_ripple={{
                        color: Theme.icons.accents.primary,
                        borderless: true,
                        foreground: false
                    }}
                    Item = {<Text style = {[staticStyles.listText, {color: Theme.texts.neutrals.secondary}]} >{Language.horizontalPositions[index]}</Text>}
                    Check = {checkGroupHorPos[index]}
                    onPress = {()=>{horizontalPositionSetting(item, index)}}
                    BoxBorderRadius = {appStyle.borderRadius.additional}
                    ColorsChange = {{true: Theme.icons.accents.primary, false: Theme.icons.accents.quaternary}}
                />
                ))}
            </View>
        </Animated.View>}

        {checkGroup[0] && 
        <Animated.View 
            exiting={exiting} 
            entering={entering}
            style = {{
                height: 60,
                //minHeight: 50
                //marginTop: 15
            }}
        >
            <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary}]}>
                {Language.height}
            </Text>
            <BaseSlider
                signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
                signaturesStyle = {[staticStyles.signaturesText, {color: Theme.texts.neutrals.tertiary}]}        
                areaStyle = {{marginHorizontal: 20}}
                minimumValue={heightNavigateMenu.min}
                maximumValue={heightNavigateMenu.max}
                step = {heightNavigateMenu.step}
                value = {sliderValueMenuHeight}
                onSlidingComplete = {(value)=>{                 
                    setSliderValueMenuHeight(value);
                    setPrewBasicMenuHeight(value);
                }}
                onValueChange = {(value)=>{              
                    setPrewBasicMenuHeight(value);
                }}
                minimumTrackTintColor = {Theme.icons.accents.tertiary}
                maximumTrackTintColor = {Theme.icons.accents.quaternary}
                thumbTintColor = {Theme.icons.accents.primary}
            />
        </Animated.View>}

        {checkGroup[0] && 
        <Animated.View 
            exiting={exiting} 
            entering={entering}
            style ={{
                //flexDirection: 'row',
                //justifyContent: 'space-between',
                //alignItems: 'center',

                maxHeight: 60
            }}
        >

            <SwitchField
                text = {`${Language.signature} ${Language.signatureState[signature]}`}
                primeValue={signature}
                onChange={signatureChange}
                appStyle = {appStyle}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />
        </Animated.View>}
    </View>
    </View>)
}

const staticStyles = StyleSheet.create({
    listText: {
        //paddingLeft: 10,
        marginLeft: 5,
        fontSize: 14, 
        //fontVariant: ['small-caps'], 
        fontWeight: '400', 
        letterSpacing: 0.5
    },
    ...commonStaticStyles
});