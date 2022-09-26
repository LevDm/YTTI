import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, Animated, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';
import { Appearance } from 'react-native';

import themesColorsAppList, {themesApp} from "../../../../../app_values/Themes";
import nightThemesColorsAppList, {nightThemesApp} from "../../../../../app_values/ThemesNight";

import { LinearGradient } from 'expo-linear-gradient';
import Svg, {SvgXml, Rect, Defs, RadialGradient, Stop, Path} from "react-native-svg";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

//<MaterialCommunityIcons name="white-balance-sunny" size={24} color="black" />

//<MaterialCommunityIcons name="weather-sunny" size={24} color="black" />
//<MaterialCommunityIcons name="moon-waning-crescent" size={24} color="black" />
//<MaterialCommunityIcons name="theme-light-dark" size={24} color="black" />

import ColorShemeSwitch from "../../../../../general_components/ColorShemeSwitch";

export default ThemeRedacor = ({
    appStyle,
    previewAppStyle,
    setPreviewAppStyle,
    getNewAppStyleObject,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}) => {
    
    const [schema, setSchema] = useState(appStyle.colorScheme == 'auto'? Appearance.getColorScheme() : appStyle.colorScheme)

    Appearance.addChangeListener(({colorScheme})=>{
        if(appStyle.colorScheme == 'auto'){
            setSchema(colorScheme)
        }
    })

    const Thema = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]

    const flatListRef = useRef()
    const scrollX = React.useRef(new Animated.Value(0)).current;
    const [chosenThemeIndex, setChosenThemeIndex] = useState(themesApp.indexOf(appStyle.theme))

    const itemSize = 120

    const pressItem = (index) => {
        //console.log(index)
        flatListRef.current.scrollToIndex({index: index})
        changeThema(index)
    }

    const renderItem = ({ item,index }) => {

        const inputRange = [
            (index-2) *itemSize,
            (index-1) *itemSize,
            (index)*itemSize,
            (index+1)*itemSize,
            (index+2)*itemSize,
        ]

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 0.84, 1, 0.84, 0.8]
        })

        const schem = 'light'

        return (
            <Pressable
                key = {String(item+index)} 
                style={{
                    height: itemSize,
                    width: itemSize,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                onPress={()=>{pressItem(index)}}
            >   
                <Animated.View
                    style={{
                        height: itemSize,
                        width: itemSize,
                        position: 'absolute',
                        borderRadius: appStyle.borderRadius.additional,
                        borderWidth: index === themesApp.indexOf(appStyle.theme)? 3 : 0,
                        borderColor: themesColorsAppList[themesApp.indexOf(appStyle.theme)][schem].basics.accents.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        transform: [
                            {scale: scale},
                        ]
                    }}
                >   
                    <LinearGradient
                        colors={[themesColorsAppList[index][schem].basics.accents.primary, themesColorsAppList[index][schem].basics.accents.quaternary]}
                        style={{
                            position: 'absolute',
                            height: itemSize-10,
                            width: itemSize-10,
                            borderRadius: appStyle.borderRadius.additional -4,
                        }}
                    />
                    <Text style={staticStyles.themeName}>{item}</Text>
                </Animated.View>
            </Pressable>
        );
    };

    const changeThema = (themeIndex)=>{
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.theme = themesApp[themeIndex]
        setPreviewAppStyle(newAppStyle)
    }

    const [ lscheme, setLScheme ] = useState(appStyle.colorSheme)

    const switching = ()=>{
        const schemes = ['light', 'auto', 'dark'] 
        let index = schemes.indexOf(lscheme)
        index = (index+1) == schemes.length? 0 : index+1
        setLScheme(schemes[index])
        setSchema(schemes[index])
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.colorScheme = schemes[index]
        setPreviewAppStyle(newAppStyle)
    }

    return (<>
        <Text>{schema} {Thema.theme}</Text>
        <ColorShemeSwitch
            scheme = {lscheme}
            sizeIcon = {30}
            switching = {switching}
        />
        <Animated.FlatList
            ref = {flatListRef}
            
            style={{ width: 3*itemSize }}
            horizontal = {true}
            showsHorizontalScrollIndicator = {false}
            decelerationRate = {'fast'}

            onScroll = {Animated.event(
                [{nativeEvent: {contentOffset: {x: scrollX}}}],
                {useNativeDriver: true},
            )}
            onMomentumScrollEnd = {(event)=>{
                const thisIndex = Math.floor(event.nativeEvent.contentOffset.x/itemSize)
                //console.log(event.nativeEvent.contentOffset.x/itemSize)
                if(thisIndex != themesApp.indexOf(previewAppStyle.theme)){
                    
                    changeThema(thisIndex)
                }
            }}

            contentContainerStyle = {{
                paddingHorizontal: itemSize,
            }}
            snapToInterval={itemSize}
            getItemLayout={(data, index) => (
                {length: itemSize, offset: itemSize * index, index: index}
            )}

            initialScrollIndex = {themesApp.indexOf(appStyle.theme)}
            
            data = {themesApp}         
            keyExtractor={(item, index) => {
                return item + index
            }}
            renderItem={renderItem}
        />
    </>)
}

const staticStyles = StyleSheet.create({
    themeName: {
        fontSize: 14,
        fontWeight: 'bold',
        fontVariant: ['small-caps']
    },
});