import React, {useState, useRef, useEffect, memo} from "react";

import {
    StyleSheet, 
    Text, 
    Pressable,
    Image, 
    ScrollView,
    FlatList, 
    Animated, 
    SectionList, 
    View,
    Button, 
    Dimensions, 
    Switch, 
    Vibration,
    ActivityIndicator
} from 'react-native';

import Reanimated, {
    useSharedValue, 
    useAnimatedStyle, 
    withTiming,
    interpolate,
    useAnimatedProps,
    cancelAnimation
} from 'react-native-reanimated';

import languagesAppList, { languagesApp } from "../../../../../../app_values/Languages";
import themesColorsAppList, { themesApp } from "../../../../../../app_values/Themes";

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

//<MaterialCommunityIcons name="white-balance-sunny" size={24} color="black" />

//<MaterialCommunityIcons name="weather-sunny" size={24} color="black" />
//<MaterialCommunityIcons name="moon-waning-crescent" size={24} color="black" />
//<MaterialCommunityIcons name="theme-light-dark" size={24} color="black" />

import dataRedactor from "../../../../../../async_data_manager/data_redactor";
import { 
    BasePressable,
    BaseBox,
    BaseSlider,
    BaseSwitch 
} from "../../../../../../general_components/base_components/BaseElements";

import commonStaticStyles, { BoxsField } from "../CommonElements";

const Reanimated_Pressable = Reanimated.createAnimatedComponent(Pressable)

const schemes = ['auto', 'light', 'dark'] 

import presets, {presetsNames} from "../../../../../../app_values/AppDesigns";

const PresetItem = ({
    preset,

    primaryCheck,

    onPress,
    onLongPress,

    itemSize,
    outlineSize,
    backgroundColor = 'white',

    appStyle,
},props) => {

    const {
        name,
        imageSource,
        imageLowScale,
        options,
    } = preset

    const presetTheme = options? themesColorsAppList[themesApp.indexOf(options.palette.theme)].light : undefined

    const colors = {
        gradient: presetTheme? Object.values(presetTheme.basics.accents) : ['#00000060','#00000040','#00000020','#0000000a'],
        title: presetTheme? presetTheme.texts.neutrals.primary : 'white',
        background: backgroundColor 
    }

    const longPressed = useSharedValue(0)

    const scaleStyle = useAnimatedStyle(()=>{
        return ({
                transform: [
                {
                    scale: interpolate(
                        longPressed.value,
                        [0, 1],
                        [.95, .9]
                    )
                }
            ]
        }
        )
    })

    const duration = 400

    return (
        <Reanimated_Pressable
            key = {props.key}
            disabled = {primaryCheck} 
            style={[{
                height: itemSize,
                width: itemSize,
                justifyContent: 'center',
                alignItems: 'center',
            }, scaleStyle]}
            onPressIn={()=>{
                cancelAnimation(longPressed)
                longPressed.value = withTiming(1, {duration: duration})
            }}
            onPressOut={()=>{
                cancelAnimation(longPressed)
                longPressed.value = withTiming(0, {duration: duration/10})
            }}
            onPress={onPress}
            delayLongPress={duration+100}
            onLongPress={onLongPress}
        >   
            <LinearGradient
                colors={colors.gradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                locations={[.3,.6,.8,1]}
                style={{
                    position: 'absolute',
                    height: itemSize,
                    width: itemSize,
                    borderRadius: appStyle.borderRadius.additional,
                    backgroundColor: colors.gradient.includes(colors.background)? 'black' : 'transparent',
                    opacity: colors.gradient.includes(colors.background)? 0.9 : 1
                }}
            />

            <Image
                source={imageSource}
                style={{
                    position: 'absolute',
                    height: itemSize/imageLowScale,
                    width: itemSize/imageLowScale,
                    borderRadius: appStyle.borderRadius.additional,
                }}
            />

            {false && 
            <Text 
                style={[staticStyles.themeName, {
                    color: 'red',
                    position: 'absolute',
                }]}
            >
                {name}
            </Text>}

            <View
                style={{
                    height: itemSize-(2*outlineSize),//-(8)+1.5,
                    width: itemSize-(2*outlineSize),
                    position: 'absolute',
                    alignItems: 'center',
                    borderRadius: appStyle.borderRadius.additional -2,
                    borderWidth:  outlineSize,
                    borderColor: primaryCheck? colors.background: 'transparent',
                }}
            />
        </Reanimated_Pressable>
    )
}

export default PresetsSelector = ({
    goToPalleteScreen,

    appStyle,

    previewAppStyleA,

    //setAppStyle,
    r_setAppStyle,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}) => {
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.presets

    const [previewIndex, setPreviewIndex] = useState(presetsNames.indexOf(appStyle.presetUsed))

    useEffect(()=>{
        console.log('ue',appStyle.presetUsed)
        const newIndex = presetsNames.indexOf(appStyle.presetUsed)
        newIndex != previewIndex? setPreviewIndex(newIndex) : null
    }, [appStyle])

    //console.log('PRESET:', presetsNames[previewIndex])

    const flatListRef = useRef()

    const itemSize = 82
    const outlineSize = 2

    const pressItem = (index) => {
        console.log('preset PressItem', index, presetsNames[index])
        if(index == 0 || presets[index].options){
            const newAppStyle = (index == 0? appStyle : presets[index].options)
            newAppStyle.customTheme = appStyle.customTheme
            newAppStyle.palette.scheme = appStyle.palette.scheme
            newAppStyle.presetUsed = presetsNames[index]
            
            //cancelAnimation(previewAppStyleA)
            previewAppStyleA.value = newAppStyle
            
            setPreviewIndex(index)
        }
    }

    const longPressItem = (index) => {
        Vibration.vibrate([5,10, 20, 10, 20, 10])
        console.log('preset longPressItem', index)
        if(index == 0 || presets[index].options){
            const newAppStyle = (index == 0? appStyle : presets[index].options)
            newAppStyle.customTheme = appStyle.customTheme
            newAppStyle.presetUsed = presetsNames[index]
            newAppStyle.palette.scheme = appStyle.palette.scheme
            r_setAppStyle(newAppStyle)
            dataRedactor("storedAppStyle",newAppStyle);
        }

    }
    

    const dropPreset = ()=>{
        console.log('grop screen')

    }


    return (
    <View
        style={{
        }}
    >   
        <Text
            style = {[staticStyles.text, {
                color: Theme.texts.neutrals.secondary,
                paddingLeft: 2,
                //marginTop: 10,
            }]}
        >
            {Language.appAs}
        </Text> 
        <View
            style={{  
                flex: 1, 
                alignItems: "center"
            }}
        >
        <FlatList
            ref = {flatListRef}
            style={{
                marginTop: 5,        
                width: 4*itemSize,
                height: itemSize,
            }}
            horizontal = {true}
            showsHorizontalScrollIndicator = {false}
            decelerationRate = {'fast'}
            contentContainerStyle = {{
                //paddingRight: itemSize,
            }}
            snapToInterval={itemSize}
            getItemLayout={(data, index) => (
                {length: itemSize, offset: itemSize * index, index: index}
            )}
            initialScrollIndex = {Math.min(presets.length-1, previewIndex+1)}
            data = {presets}         
            keyExtractor={(item, index) => {
                return item + index
            }}
            ListHeaderComponent={
                <Pressable 
                    style = {{
                        width: itemSize,
                        height: itemSize,

                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: appStyle.borderRadius.additional,
                        borderWidth:  outlineSize,
                        borderColor: Theme.texts.neutrals.secondary,
                        transform: [{scale: .95}],
                        //paddingTop: 6
                    }}
                    onPress={dropPreset}
                >
                    <MaterialCommunityIcons name="nfc" size={35} color={Theme.texts.neutrals.secondary} />
                </Pressable>
            }
            renderItem={({item, index})=>{

                return (
                <PresetItem
                    key = {String(`theme_selector_${item.name+index}`)} 

                    preset={index == 0? {
                        name: item.name,
                        imageSource: item.imageSource,
                        imageLowScale: item.imageLowScale,
                        options: appStyle 
                    }: item}

                    onPress = {()=>{pressItem(index)}}
                    onLongPress = {()=>{longPressItem(index)}}

                    primaryCheck = {index == previewIndex}//{(JSON.stringify(index == 0? appStyle : item.options) === JSON.stringify(previewAppStyleA.value))}

                    backgroundColor = {Theme.basics.neutrals.secondary}
                   
                    appStyle = {appStyle}   
                        
                    itemSize={itemSize}
                    outlineSize={outlineSize}
                />
            )}}
        />
        </View>
    </View>)
}

const staticStyles = StyleSheet.create({
    themeName: {
        fontSize: 15,
        fontWeight: 'bold',
        fontVariant: ['small-caps'],
        //marginBottom: 10
    },
    ...commonStaticStyles
});