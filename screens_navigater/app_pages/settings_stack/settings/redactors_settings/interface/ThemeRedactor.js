import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, Animated, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';
import { Appearance } from 'react-native';


import languagesAppList, { languagesApp } from "../../../../../../app_values/Languages";
import themesColorsAppList, { themesApp } from "../../../../../../app_values/Themes";
import nightThemesColorsAppList, {nightThemesApp} from "./../../../../../../app_values/ThemesNight";

import { LinearGradient } from 'expo-linear-gradient';
import Svg, {SvgXml, Rect, Defs, RadialGradient, Stop, Path} from "react-native-svg";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

//<MaterialCommunityIcons name="white-balance-sunny" size={24} color="black" />

//<MaterialCommunityIcons name="weather-sunny" size={24} color="black" />
//<MaterialCommunityIcons name="moon-waning-crescent" size={24} color="black" />
//<MaterialCommunityIcons name="theme-light-dark" size={24} color="black" />

import dataRedactor from "../../../../../../async_data_manager/data_redactor";

import ColorShemeSwitch from "../../../../../../general_components/ColorShemeSwitch";

import { 
    BasePressable,
    BaseBox,
    BaseSlider,
    BaseSwitch 
} from "../../../../../../general_components/base_components/BaseElements";

import commonStaticStyles from "../CommonElements";

export default ThemeRedacor = ({
    goToPalleteScreen,

    appStyle,
    previewAppStyle,
    setPreviewAppStyle,
    getNewAppStyleObject,

    setAppStyle,
    r_setAppStyle,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}) => {
    
    const [schema, setSchema] = useState(appStyle.palette.scheme)

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.themes

    const flatListRef = useRef()
    const scrollX = React.useRef(new Animated.Value(0)).current;
    const [chosenThemeIndex, setChosenThemeIndex] = useState(themesApp.indexOf(appStyle.palette.theme))

    const itemSize = 120

    const pressItem = (index) => {
        //console.log(index)
        changeThema(index)
        

        setTimeout(()=>{
            flatListRef.current.scrollToIndex({index: index})
        }, 20)
        
    }

    const longPressItem = (index) => {
        //console.log('longPressItem')
        if(index == 0 && themesColorsAppList[0]==null){
            console.log('not custom theme for redactors')
        } else {
            goToPalleteScreen(index)
        }
        
    }

    const renderItem = ({ item,index }) => {

        const inputRange = [
            //(index-2) *itemSize,
            (index-1) *itemSize,
            (index)*itemSize,
            (index+1)*itemSize,
            //(index+2)*itemSize,
        ]

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.95, 1, 0.95]
        })

        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9]
        })

        if((index === 0 && item === 'custom') && themesColorsAppList[0] == null ){
            return (
                <>
                <Pressable
                    key = {String(`theme_selector_${item+index}`)} 
                    style={{
                        height: itemSize,
                        width: itemSize,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onPress={()=>{pressItem(index)}}
                    onLongPress={()=>{longPressItem(index)}}
                >   
                    <Animated.View
                        style={{
                            height: itemSize,
                            width: itemSize,
                            position: 'absolute',
                            //backgroundColor: 'red',
                            borderRadius: appStyle.borderRadius.additional,
                            borderWidth:  3,
                            borderColor: index === ThemeColorsAppIndex? 'black' : 'transparent',
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: opacity,
                            transform: [
                                {scale: scale},
                            ]
                        }}
                    >   
                        <View
                            style={{
                                position: 'absolute',
                                backgroundColor: '#afafaf',
                                height: itemSize-10,
                                width: itemSize-10,
                                borderRadius: appStyle.borderRadius.additional -4,
                            }}
                        />
                        <Text style={[staticStyles.themeName, {color: 'black'}]}>{item}</Text>
                        <BaseBox
                            isCheckBox={true}
                            outerRing={false}
                            size={18.95}
                            style = {{
                                //flex: 4,
                                position: 'absolute',
                                left: 10,
                                top: 10,
                                backgroundColor: Theme.basics.grounds.primary,
                                borderRadius: appStyle.borderRadius.additional,
                            }}
                            Item={null}
                            Check = {index === themesApp.indexOf(previewAppStyle.palette.theme)}
                            onPress = {()=>{}}
                            BoxBorderRadius = {appStyle.borderRadius.additional}
                            ColorsChange = {{
                                true: 'black', 
                                false: `#00000000`
                            }}
                        />
                    </Animated.View>
                    
                </Pressable>
                {!themesColorsAppList[0] &&
                <BasePressable
                    type="t"
                    text="create"
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        backgroundColor: Theme.icons.accents.primary,
                        width: itemSize-10,
                        marginHorizontal: 5,
                        borderRadius: appStyle.borderRadius.additional
                    }}
                    textStyle={[staticStyles.themeName, {
                        color: Theme.texts.neutrals.primary,
                        fontWeight: '400'
                    }]}
                    android_ripple={{
                        color: Theme.icons.accents.primary,
                        borderless: true,
                        foreground: false
                    }}
                    onPress={createCustomTheme}
                />
                }
                </>
            )
        } else {

        

        const indexUsedTheme = themesApp.indexOf(appStyle.palette.theme)
        const schemaThisItem = 'light'
        const ThemeThisItem = themesColorsAppList[index][schemaThisItem]
        return (
            <Pressable
                key = {String(`theme_selector_${item+index}`)} 
                style={{
                    height: itemSize,
                    width: itemSize,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                onPress={()=>{pressItem(index)}}
                onLongPress={()=>{longPressItem(index)}}
            >   
                <Animated.View
                    style={{
                        height: itemSize,
                        width: itemSize,
                        position: 'absolute',
                        //backgroundColor: 'red',
                        borderRadius: appStyle.borderRadius.additional,
                        borderWidth:  3,
                        borderColor: index === ThemeColorsAppIndex? Theme.basics.accents.primary : 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: opacity,
                        transform: [
                            {scale: scale},
                        ]
                    }}
                >   
                    <LinearGradient
                        colors={[ThemeThisItem.basics.accents.primary, ThemeThisItem.basics.accents.quaternary]}
                        style={{
                            position: 'absolute',
                            height: itemSize-10,
                            width: itemSize-10,
                            borderRadius: appStyle.borderRadius.additional -4,
                        }}
                    />
                    <Text style={[staticStyles.themeName, {color: ThemeThisItem.texts.neutrals.primary}]}>{themesColorsAppList[index]['light'].theme}</Text>
                    <BaseBox
                        isCheckBox={true}
                        outerRing={false}
                        size={18.95}
                        style = {{
                            //flex: 4,
                            position: 'absolute',
                            left: 10,
                            top: 10,
                            backgroundColor: Theme.basics.grounds.primary,
                            borderRadius: appStyle.borderRadius.additional,
                        }}
                        Item={null}
                        Check = {index === themesApp.indexOf(previewAppStyle.palette.theme)}
                        onPress = {()=>{}}
                        BoxBorderRadius = {appStyle.borderRadius.additional}
                        ColorsChange = {{
                            true: ThemeThisItem.icons.accents.primary, 
                            false: `${ThemeThisItem.icons.accents.quaternary}00`
                        }}
                    />
                </Animated.View>
                
            </Pressable>
        );}
    };

    const changeThema = (themeIndex)=>{
        if(themeIndex != 0){
            let newAppStyle = getNewAppStyleObject();
            newAppStyle.palette.theme = themesApp[themeIndex]
            setPreviewAppStyle(newAppStyle)
        } else {
            if(!themesColorsAppList[0]){
                console.log('not custom theme')
            } else {
                console.log('custom theme ok')
                let newAppStyle = getNewAppStyleObject();
                newAppStyle.palette.theme = themesApp[themeIndex]
                setPreviewAppStyle(newAppStyle)
            }
        }
        
    }

    const createCustomTheme = ()=>{
        console.log('custom theme create')
        let newAppStyle = getNewAppStyleObject('currentStyle')
        newAppStyle.customTheme = themesColorsAppList[ThemeColorsAppIndex]
        themesColorsAppList.splice(0,1,themesColorsAppList[ThemeColorsAppIndex])
        //themesColorsAppList[0] = themesColorsAppList[2]

        setAppStyle(newAppStyle);
        r_setAppStyle(newAppStyle);
        //dataRedactor("storedAppStyle",newAppStyle);

        goToPalleteScreen(0)
        
    }

    
    const switching = ()=>{
        const schemes = ['light', 'auto', 'dark'] 
        let index = schemes.indexOf(schema)
        index = (index+1) == schemes.length? 0 : index+1
        setSchema(schemes[index])
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.palette.scheme = schemes[index]
        setPreviewAppStyle(newAppStyle)
    }

    return (
    <View
        style={{
            //marginBottom: 30,
            flex: 1, 
            justifyContent: 'center',
            alignItems: "center"
        }}
    >
        <View
            style = {{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary}]}>
                {Language.colorMode}
            </Text>
            <ColorShemeSwitch
                scheme = {schema}
                sizeIcon = {25}
                colorIcon = {Theme.icons.neutrals.secondary}
                invertColorIcon = {Theme.icons.neutrals.primary}
                text = {Language.colorsMods[schema]}
                textStyle = {{
                    color: Theme.texts.neutrals.secondary,
                    fontSize: 12,
                    fontWeight: '600',
                    fontVariant: ['small-caps']
                }}
                pressableStyle = {{
                    marginRight: 20,
                    width: 125,
                    paddingHorizontal: 10,
                    borderWidth: 2,
                    borderColor: Theme.icons.accents.primary,
                    borderRadius: appStyle.borderRadius.additional
                }}
                switching = {switching}
            />
        </View>
        
        <Animated.FlatList
            ref = {flatListRef}
            style={{
                marginTop: 15,
                width: 3*itemSize,
                height: itemSize+30,
                //backgroundColor: 'red' 
            }}
            horizontal = {true}
            showsHorizontalScrollIndicator = {false}
            decelerationRate = {'fast'}
            onScroll = {Animated.event(
                [{nativeEvent: {contentOffset: {x: scrollX}}}],
                {useNativeDriver: true},
            )}
            contentContainerStyle = {{
                paddingHorizontal: itemSize,
            }}
            snapToInterval={itemSize}
            getItemLayout={(data, index) => (
                {length: itemSize, offset: itemSize * index, index: index}
            )}
            initialScrollIndex = {ThemeColorsAppIndex}
            data = {themesApp}         
            keyExtractor={(item, index) => {
                return item + index
            }}
            renderItem={renderItem}
        />
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