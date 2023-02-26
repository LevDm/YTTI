import React, {useState, useRef, useEffect, memo} from "react";

import {
    StyleSheet, 
    Text, 
    Pressable, 
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

import ColorShemeSwitch from "../../../../../../general_components/ColorShemeSwitch";

import { 
    BasePressable,
    BaseBox,
    BaseSlider,
    BaseSwitch 
} from "../../../../../../general_components/base_components/BaseElements";

import commonStaticStyles, { BoxsField } from "../CommonElements";

const Reanimated_Pressable = Reanimated.createAnimatedComponent(Pressable)
const R_ActivityIndicator = Reanimated.createAnimatedComponent(ActivityIndicator)

const schemes = ['auto', 'light', 'dark'] 


const ThemeItem = ({
    title,

    primaryCheck,
    secondaryCheck,

    onPress,
    onLongPress,

    pressDissable,

    colors, //= {{
        //gradient: [ThemeThisItem.basics.accents.primary, ThemeThisItem.basics.accents.quaternary],
        //title: ThemeThisItem.texts.neutrals.primary,
        //BackgroundColor: Theme.basics.neutrals.primary
    //}}
    itemSize,
    outlineSize,

    appStyle,
},props) => {

    const longPressed = useSharedValue(0)

    const scaleStyle = useAnimatedStyle(()=>{
        return ({
                transform: [
                {
                    scale: interpolate(
                        longPressed.value,
                        [0, 1],
                        [.95, .85]
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
            disabled = {pressDissable} 
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
            delayLongPress={duration}
            onLongPress={onLongPress}
        >   
            <LinearGradient
                colors={colors.gradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                locations={[.3,.6,.8,1]}
                style={{
                    height: itemSize,
                    width: itemSize,
                    borderRadius: appStyle.borderRadius.additional,
                }}
            />
            {false && 
            <Text 
                style={[staticStyles.themeName, {
                    color: colors.title,
                    position: 'absolute',
                }]}
            >
                {title}
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
            >
                <View
                    style={{
                        height: itemSize/8,
                        width: itemSize/3.1,
                        position: 'absolute',
                        top: -outlineSize,
                        borderRadius: appStyle.borderRadius.additional,                       
                        borderWidth:  secondaryCheck? outlineSize : 0,
                        borderColor: colors.background,
                        backgroundColor: secondaryCheck? 'transparent' : colors.background
                    }}
                />   
            </View>
         
            <MaterialCommunityIcons 
                name="format-color-text" 
                size={25} 
                color={colors.subTitle}
                style={{
                    position: 'absolute',
                    top: (itemSize/2-12)+3,
                    left: (itemSize/2-12)+3
                }}
            />
            <MaterialCommunityIcons 
                name="format-color-text" 
                size={25} 
                color={colors.title}
                style={{
                    position: 'absolute',
                    bottom: (itemSize/2-12)+3,
                    right: (itemSize/2-12)+3
                }}
            />
        </Reanimated_Pressable>
    )
}

export default ThemeRedacor = ({
    goToPalleteScreen,

    appStyle,
    //previewAppStyle,
    //setPreviewAppStyle,
    //getNewAppStyleObject,

    previewAppStyleA,

    //setAppStyle,
    //r_setAppStyle,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}) => {
    const [previewThemeIndex, setPreviewThemeIndex] = useState(ThemeColorsAppIndex)
    const [schema, setSchema] = useState(appStyle.palette.scheme)

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.themes

    const flatListRef = useRef()
    const scrollX = React.useRef(new Animated.Value(0)).current;
    const [chosenThemeIndex, setChosenThemeIndex] = useState(themesApp.indexOf(appStyle.palette.theme))

    const itemSize = 72
    const outlineSize = 2

    const pressItem = (index) => {
        console.log('THEME PressItem', index)
        if(previewThemeIndex != index){
            changeThema(index)
            flatListRef.current.scrollToIndex({index: index})
        }
    }

    const longPressItem = (index) => {
        Vibration.vibrate([5,10])
        console.log('THEME longPressItem')
        
        if(index == 0 && themesColorsAppList[0]==null){
            console.log('not custom theme for redactors')
        } else {
            goToPalleteScreen(index, 1)
        }
        
    }

    

    const changeThema = (themeIndex)=>{
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        if(themeIndex != 0){
            //let newAppStyle = getNewAppStyleObject();
            
            newAppStyle.palette.theme = themesApp[themeIndex]
            //setPreviewAppStyle(newAppStyle)
            cancelAnimation(previewAppStyleA)
            previewAppStyleA.value = newAppStyle

            setPreviewThemeIndex(themeIndex)
        } else {
            if(!themesColorsAppList[0]){
                console.log('not custom theme')
            } else {
                console.log('custom theme ok')
                //let newAppStyle = getNewAppStyleObject();
                newAppStyle.palette.theme = themesApp[themeIndex]
                //setPreviewAppStyle(newAppStyle)
                cancelAnimation(previewAppStyleA)
                previewAppStyleA.value = newAppStyle

                setPreviewThemeIndex(themeIndex)
            }
        }
        
    }
    

    const createCustomTheme = ()=>{
        //setWaitRender(true)
        console.log('custom theme create')
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        //let newAppStyle = getNewAppStyleObject('currentStyle')
        const newTheme = JSON.parse(JSON.stringify(themesColorsAppList[ThemeColorsAppIndex]));
        newTheme.light.theme = 'custom'
        newTheme.dark.theme = 'custom'

        newAppStyle.customTheme = newTheme
        themesColorsAppList.splice(0,1,newTheme)
        //themesColorsAppList[0] = themesColorsAppList[2]

        //setAppStyle(newAppStyle);
        //r_setAppStyle(newAppStyle);
        //dataRedactor("storedAppStyle",newAppStyle);

        goToPalleteScreen(previewThemeIndex, 0)
        
    }

    /*
    const switching = ()=>{   
        let index = schemes.indexOf(schema)
        index = (index+1) == schemes.length? 0 : index+1
        setSchema(schemes[index])
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.palette.scheme = schemes[index]
        setPreviewAppStyle(newAppStyle)
    }
    */

    const shemaSetting = (index) => {
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        //let newAppStyle = getNewAppStyleObject();
        newAppStyle.palette.scheme = schemes[index]
        //setPreviewAppStyle(newAppStyle)
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
    }
    

    return (
    <View
        style={{
        }}
    >   
        <BoxsField
            //  'one'>true || 'multiple'>false
            isChoiceOne={true}
            title = {Language.colorMode}
            //  'one'>index || 'multiple'>[indexs]
            primaryValue = {schemes.indexOf(appStyle.palette.scheme)} 
            groupSize = {schemes.length}
            onPress = {(activeIndex)=>{shemaSetting(activeIndex)}}
            groupItems = {Object.values(Language.colorsMods)}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        <Text
            style = {[staticStyles.text, {
                color: Theme.texts.neutrals.secondary,
                paddingLeft: 10,
                marginTop: 10,
            }]}
        >
            {Language.palette}
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
                width: 5*itemSize,
                height: itemSize,
            }}
            horizontal = {true}
            showsHorizontalScrollIndicator = {false}
            decelerationRate = {'fast'}
            contentContainerStyle = {{
                paddingRight: itemSize,
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
                        paddingTop: 6
                    }}
                    onPress={createCustomTheme}
                >
                    <MaterialCommunityIcons name="palette-advanced" size={35} color={Theme.texts.neutrals.secondary} />
                    <Text
                        style = {{
                            top: -5,
                            color: Theme.texts.neutrals.secondary,
                            fontSize: 10,
                            fontWeight: 'bold',
                            letterSpacing: 0,
                            fontVariant: ['small-caps'],
                        }}
                    >
                        {Language.openPainter}
                    </Text>
                </Pressable>
            }
            renderItem={({item, index})=>{
                const indexUsedTheme = themesApp.indexOf(appStyle.palette.theme)
                const schemaThisItem = 'light'
                const ThemeThisItem = themesColorsAppList[index]? themesColorsAppList[index][schemaThisItem] : Theme
                const title = themesColorsAppList[index]? themesColorsAppList[index][schemaThisItem].theme : item
                return (
                <ThemeItem
                    key = {String(`theme_selector_${item+index}`)} 
                    title = {title}

                    pressDissable = {themesColorsAppList[index]? false : true}
                    
                    onPress = {()=>{pressItem(index)}}
                    onLongPress = {()=>{longPressItem(index)}}

                    primaryCheck = {index === ThemeColorsAppIndex}
                    secondaryCheck = {index === previewThemeIndex}//themesApp.indexOf(previewAppStyle.palette.theme)
                   
                    appStyle = {appStyle}
                                    
                    colors = {
                        themesColorsAppList[index]? {
                        gradient: [ThemeThisItem.basics.accents.primary,ThemeThisItem.basics.accents.secondary, ThemeThisItem.basics.accents.tertiary, ThemeThisItem.basics.accents.quaternary],
                        title: ThemeThisItem.texts.neutrals.primary,
                        background: Theme.basics.neutrals.secondary
                        } : {
                        //not custom palette
                        gradient: ['#00000060','#00000040','#00000020','#0000000a'],
                        subTitle: 'transparent', //,Theme.texts.neutrals.secondary,
                        title: 'transparent',// Theme.texts.neutrals.primary,
                        background: 'transparent'  
                    }}
                        
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