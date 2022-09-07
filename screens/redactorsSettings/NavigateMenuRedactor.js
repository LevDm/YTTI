import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

import LanguagesAppList, {languagesApp} from "../../language/language";
import ThemesColorsAppList, {themesApp} from "../../styles/ColorsApp";
import dataRedactor from "../../async_data_manager/data_redactor";
import ColorSplash from "../../componets/StyleColorSplash";

import Slider from '@react-native-community/slider';
import { BlurView } from "expo-blur";
//import BasePressable from "../../componets/base/BasePressable";
//import BaseCheckBox from "../../componets/base/BaseCheckBox";
import { 
    BasePressable,
    BaseCheckBox,
    BaseSwitch 
} from "../../componets/base/BaseElements";

const menuTypes = ['classical','classical_animated','hidden'];

const positionNavigateMenu = {min: 20, max: 80, step: 5}
const valuePosition = ['left','center','right']

const heightNavigateMenu = {min: 35, max: 65, step: 5}


export default NavigateMenuRedactor = ({
    appStyle,
    setAppStyle,
    r_setAppStyle,

    setPreviewAppStyle,
    getNewAppStyleObject,

    ThemeColorsAppIndex,
    LanguageAppIndex  
}) => {
    

    const navigationMenuTypeSetting = (newType)=>{
        if(newType !== appStyle.navigationMenu.type){
            let newAppStyle = getNewAppStyleObject();
            newAppStyle.navigationMenu.type = newType

            setAppStyle(newAppStyle)
            dataRedactor("storedAppStyle",newAppStyle);
            r_setAppStyle(newAppStyle); 
        }
           
    }

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

    const [checkGroup, setCheckGroup] = useState(getGroup(appStyle.navigationMenu.type));
    const checkBoxPress = (type) => {
        const newGroup = getGroup(type)
        console.log(' type /ch g / new ch g',type, checkGroup, newGroup)
        //if(type != appStyle.navigationMenu.type){
            
            //navigationMenuTypeSetting(type);
            let newAppStyle = getNewAppStyleObject();
            if(type == "hidden"){
                newAppStyle.navigationMenu.height = 0
            }
            newAppStyle.navigationMenu.type = type
            console.log('newAppStyle',newAppStyle)
            setPreviewAppStyle(newAppStyle);
            setCheckGroup(newGroup);
        //}
    };

    const [signature, setSignature] = useState(appStyle.navigationMenu.signatureIcons);
    const signatureChange = () =>{
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.navigationMenu.signatureIcons = !signature;
        setPreviewAppStyle(newAppStyle);
        setSignature(!signature)
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

    return (<>
    <Text
        style = {{
            //marginTop: 10,
        }}
    >
        Type
    </Text>
    <View 
        style = {[{
                
        }]}
    >
        {menuTypes.map((item, index)=>{
            return(
                <BaseCheckBox
                    key = {item+index}
                    style = {{
                        borderRadius: appStyle.borderRadius.additional,
                        marginVertical: 5
                    }}
                    //rippleColor = {ThemesColorsAppList[ThemeColorsAppIndex].shadowWhite0}
                    Item = {<Text>{item}</Text>}
                    Check = {checkGroup[index]}
                    onPress = {()=>{checkBoxPress(item)}}
                    BoxBorderRadius = {appStyle.borderRadius.additional}
                    ColorsChange = {{true: ThemesColorsAppList[ThemeColorsAppIndex].sky, false: ThemesColorsAppList[ThemeColorsAppIndex].skyUpUpUp}}
                />
            )
        })}
    </View>
    
    <Text
        style = {{
            marginTop: 10,
        }}
    >
        additional settings navigate menu
    </Text>

    <View
        style = {[
            {
                marginTop: 10,
                height: 160
            }, 
            !checkGroup[2]? {              
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            } : {

            }
        ]}
    >   
        {checkGroup[2] && <>
        <Text
        
        >
            {`position vertical: ${appStyle.navigationMenu.position.vertical}`}
        </Text>
        <View
            style = {{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: "100%",
                height: 80,
                
            }}
        >
            <Text
                style = {{
                    position: 'absolute',
                    left: 0,
                    color: ThemesColorsAppList[ThemeColorsAppIndex].symbolNeutral

                }}
            >
                Up
            </Text>
            <Slider
                style = {{
                    flex: 1
                    //width: "70%"
                }}
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
                minimumTrackTintColor = {ThemesColorsAppList[ThemeColorsAppIndex].skyUpUp}
                maximumTrackTintColor = {ThemesColorsAppList[ThemeColorsAppIndex].skyUpUpUp}
                thumbTintColor = {ThemesColorsAppList[ThemeColorsAppIndex].sky}
            />
            <Text
                style = {{
                    position: 'absolute',
                    right: 0,
                    color: ThemesColorsAppList[ThemeColorsAppIndex].symbolNeutral

                }}
            >
                Down
            </Text>
        </View>
        
        <Text
        
        >
            {`position horizontal: ${appStyle.navigationMenu.position.horizontal}`}
        </Text>
        <View
            style = {{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                //height: 60,
                //backgroundColor: 'red'
            }}
        >
            {valuePosition.map((item, index)=>{
                return(
                    <BaseCheckBox
                        key = {item+index}
                        style = {{
                            borderRadius: appStyle.borderRadius.additional,
                            //marginVertical: 5
                        }}
                        //rippleColor = {ThemesColorsAppList[ThemeColorsAppIndex].shadowWhite0}
                        Item = {<Text>{item}</Text>}
                        Check = {checkGroupHorPos[index]}
                        onPress = {()=>{horizontalPositionSetting(item, index)}}
                        BoxBorderRadius = {appStyle.borderRadius.additional}
                        ColorsChange = {{true: ThemesColorsAppList[ThemeColorsAppIndex].sky, false: ThemesColorsAppList[ThemeColorsAppIndex].skyUpUpUp}}
                    />
                )
            })}
        </View>

        </>}
        {!checkGroup[2] && 
        <View
            style={{
                width: '100%'
            }}
        >
            <Text
            
            >
                {`height: ${String(appStyle.navigationMenu.height)}`}
            </Text>
            <View
                style = {{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: "100%",
                    height: 80,
                    
                }}
            >
                <Text
                    style = {{
                        position: 'absolute',
                        left: 0,
                        color: ThemesColorsAppList[ThemeColorsAppIndex].symbolNeutral

                    }}
                >
                    Up
                </Text>
                <Slider
                    style = {{
                        flex: 1
                        //width: "70%"
                    }}
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
                    minimumTrackTintColor = {ThemesColorsAppList[ThemeColorsAppIndex].skyUpUp}
                    maximumTrackTintColor = {ThemesColorsAppList[ThemeColorsAppIndex].skyUpUpUp}
                    thumbTintColor = {ThemesColorsAppList[ThemeColorsAppIndex].sky}
                />
                <Text
                    style = {{
                        position: 'absolute',
                        right: 0,
                        color: ThemesColorsAppList[ThemeColorsAppIndex].symbolNeutral

                    }}
                >
                    Down
                </Text>
            </View>
            
            
            <View
                style ={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: 60
                }}
            >
            <Text>
                {`signature: ${String(appStyle.navigationMenu.signatureIcons)}`}
            </Text>
            <BaseSwitch
                size={24}
                style = {{
                    right: 20
                }}
                trackStyle={{
                    borderRadius: appStyle.borderRadius.additional,
                }}
                thumbStyle = {{
                    borderRadius: appStyle.borderRadius.additional,
                    borderWidth: 3,
                    borderColor: signature? ThemesColorsAppList[ThemeColorsAppIndex].sky : ThemesColorsAppList[ThemeColorsAppIndex].skyUpUpUp,
                }}
                colors={{
                    track: { 
                        false: ThemesColorsAppList[ThemeColorsAppIndex].skyUpUpUp, 
                        true: ThemesColorsAppList[ThemeColorsAppIndex].sky  
                    },
                    thumb: { 
                        false: ThemesColorsAppList[ThemeColorsAppIndex].symbolLight, 
                        true: ThemesColorsAppList[ThemeColorsAppIndex].symbolLight  
                    }
                }}
                primeValue={signature}
                onChange={signatureChange}
            />
            </View>
        </View>
        }
    </View>
    </>)
}

const staticStyles = StyleSheet.create({
    
});