import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, Animated, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import LanguagesAppList, {languagesApp} from "../../language/language";
import ThemesColorsAppList from "../../styles/ColorsApp";
import themesColorsAppList, {themesApp} from "../../app_values/Themes";
import dataRedactor from "../../async_data_manager/data_redactor";
import ColorSplash from "../../componets/StyleColorSplash";

//import BasePressable from "../../componets/base/BasePressable";

import { 
    BasePressable,
    BaseCheckBox,
    BaseSwitch 
} from "../../general_components/base_components/BaseElements";

import { LinearGradient } from 'expo-linear-gradient';
import Svg, {SvgXml, Rect, Defs, RadialGradient, Stop, Path} from "react-native-svg";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

export default ThemeRedacor = ({
    appStyle,
    setPreviewAppStyle,
    getNewAppStyleObject,

    ThemeColorsAppIndex,
    LanguageAppIndex  
}) => {
    const Thema = themesColorsAppList[ThemeColorsAppIndex]
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
                        borderColor: themesColorsAppList[themesApp.indexOf(appStyle.theme)].basics.accents.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        transform: [
                            {scale: scale},
                        ]
                    }}
                >   
                    <LinearGradient
                        colors={[themesColorsAppList[index].basics.accents.primary, themesColorsAppList[index].basics.accents.quaternary]}
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

    return (<>
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
                console.log(event.nativeEvent.contentOffset.x/itemSize)
                //if(thisIndex != chosenThemeIndex){
                    
                    changeThema(thisIndex)
                //}
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