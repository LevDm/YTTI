import React, {useState, useRef, useEffect, memo} from "react";

import {
    Appearance,
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
    useDerivedValue,
    useAnimatedProps,
    cancelAnimation,
    runOnJS,
    useFrameCallback,
    useAnimatedReaction,
    useAnimatedRef,
    scrollTo,
    Layout,
    FadingTransition,
    FadeIn,
    FadeOut
} from 'react-native-reanimated';

import themesColorsAppList, { themesApp } from "../../../../../../../app_values/Themes";

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

import ColorPicker, {ColorPointer} from "./PaletteMod";

import PaletteView from "./PaletteView";

import commonStaticStyles, { BoxsField, ripple } from "../../CommonElements";

const Reanimated_FlatList = Reanimated.createAnimatedComponent(FlatList);
const Reanimated_Pressable = Reanimated.createAnimatedComponent(Pressable)
const R_ActivityIndicator = Reanimated.createAnimatedComponent(ActivityIndicator)

import { schemes, statusBarStyles } from "../../../../../../../app_values/AppDefault";
import useLanguage from "../../../../../../../app_hooks/useLanguage";

const ThemeItem = (props) => {
    const {
        title,
        keyID,

        itemIndex,
        selectIndex,
        //secondaryCheck,

        onPress,
        onLongPress,

        pressDissable,

        colors, //= {{
            //gradient: [ThemeThisItem.basics.accents.primary, ThemeThisItem.basics.accents.quaternary],
            //title: ThemeThisItem.texts.neutrals.primary,
            //backgroundColor: Theme.basics.neutrals.primary\
            //selector
        //}}
        itemSize,
        outlineSize,

        appStyle,
    } = props

    const sIn = useDerivedValue(()=>selectIndex.value == itemIndex)

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

    const accentFrame = useAnimatedStyle(()=>{
        return ({
            opacity: withTiming(sIn.value? 1 : 0, {duration: 200}) 
        })
    })

    const duration = 400

    return (
        <Reanimated_Pressable
            key = {keyID}
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
                locations={[.3,.6,1]}
                style={{
                    position: 'absolute',
                    height: itemSize,
                    width: itemSize,
                    borderRadius: appStyle.borderRadius.secondary,
                    backgroundColor: colors.gradient.includes(colors.background)? 'black' : 'transparent',
                    opacity: colors.gradient.includes(colors.background)? 0.9 : 1
                }}
            />
            <Reanimated.View
                style={[{
                    height: itemSize-(2*outlineSize),//-(8)+1.5,
                    width: itemSize-(2*outlineSize),
                    position: 'absolute',
                    //alignItems: 'center',
                    borderRadius: appStyle.borderRadius.secondary -2,
                    borderWidth:  outlineSize,
                    borderColor: colors.background,
                }, accentFrame]}
            />
        </Reanimated_Pressable>
    )
}

export default ThemeRedacor = (props) => {
    const {
        uiStyle,
        uiTheme,
        uiScheme,
        updateFullStyle,
        updateFullTheme,

        showAllSettings,

        tagStyle,

        aPalette: uiPalette, 
        windowChangeExpand,

        r_uiStyle,
        Theme,
    } = props

    const Language = useLanguage().SettingsScreen.Redactors.themes

    const flatListRef = useAnimatedRef()
    
    const itemSize = 68
    const outlineSize = 2

    const selectSchema = useSharedValue(schemes.indexOf(uiPalette.value.scheme))
    useAnimatedReaction(()=>schemes.indexOf(uiPalette.value.scheme), 
        (newValue, oldValue)=>{
            if(newValue != oldValue){
                selectSchema.value = newValue
            }
        }
    )

    console.log('THEMS', uiPalette.value.scheme, selectSchema.value)
    
    const selectIndex = useDerivedValue(()=>themesApp.indexOf(uiStyle.palette.value))
    
    const pressItem = (index) => {
        console.log('THEME PressItem', index)
        if(selectIndex.value != index){
            changeThema(index)
        }
    }

    const longPressItem = (index) => {
        Vibration.vibrate([5,10])
        console.log('THEME longPressItem')
        
        if(index == 0 && themesColorsAppList[0]==null){
            console.log('not custom theme for redactors')
        } else {
        }
        
    }


    const settingTheme = (themeIndex) => {
        uiStyle.palette.value = themesApp[themeIndex]
        tagStyle('palette.theme')
        updateFullTheme(themesApp[themeIndex])

    }
    

    const changeThema = (themeIndex)=>{
        if(themeIndex != 0){
            settingTheme(themeIndex)
        } else {
            if(!themesColorsAppList[0]){
                console.log('not custom theme')
            } else {
                console.log('custom theme ok')
                settingTheme(themeIndex)
            }
        }
    }
    
    const shemaSetting = (index) => {
        console.log('shemaSetting', index)
        updateFullTheme('current', schemes[index])
    }


    const RENDER_ITEMS = ({item, index})=>{
        const schemaThisItem = 'light'
        const ThemeThisItem = themesColorsAppList[index]? themesColorsAppList[index][schemaThisItem] : Theme
        const title = themesColorsAppList[index]? themesColorsAppList[index][schemaThisItem].theme : item
        return (
            <ThemeItem
                key = {String(`theme_selector_${item+index}`)} 
                keyID = {String(`theme_selector_${item+index}`)} 
                title = {title}

                pressDissable = {themesColorsAppList[index]? false : true}
                
                onPress = {()=>{pressItem(index)}}
                onLongPress = {()=>{longPressItem(index)}}

                selectIndex = {selectIndex}
                itemIndex={index}
                //primaryCheck = {getcheck(index)}//{index === ThemeColorsAppIndex}
                //secondaryCheck = {index === previewThemeIndex}
            
                appStyle = {r_uiStyle}
                                
                colors = { //themesColorsAppList[index]? 
                    {
                    gradient: [ThemeThisItem.basics.accents.primary,ThemeThisItem.basics.accents.secondary, ThemeThisItem.basics.accents.tertiary],
                    title: ThemeThisItem.texts.neutrals.primary,
                    background: Theme.basics.neutrals.quaternary,
                    selector: Theme.texts.neutrals.secondary,
                    } 
                    /*  {
                    //not custom palette
                    gradient: ['#00000080','#00000080','#00000080','#00000080'],
                    subTitle: 'transparent', //,Theme.texts.neutrals.secondary,
                    title: 'transparent',// Theme.texts.neutrals.primary,
                    background: 'transparent',
                    selector: 'transparent',  
                }*/}
                    
                itemSize={itemSize}
                outlineSize={outlineSize}
            />
        )
    }

    const PaletteRedactor = () => {
        const [opened, setOpened] = useState(false)

        const changePaletteRedactor = () => {
            if(!opened){windowChangeExpand(!opened)} 
            setOpened(!opened)
        }

        console.log('PaletteRedactor', opened)

        return (
            <Reanimated.View
                style={{
                    width: '100%',
                }}
                //layout={FadingTransition}
            >
                <View
                    style={{
                        height: 40,
                        width: '100%',
                        backgroundColor: 'transparent',
                        borderRadius: r_uiStyle.borderRadius.secondary,
                    }}
                >
                    <Pressable
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            borderRadius: r_uiStyle.borderRadius.secondary,
                        }}
                        android_ripple={ripple(Theme.icons.neutrals.secondary)}
                        onPress={changePaletteRedactor}
                    >
                        <MaterialCommunityIcons 
                            name={'palette-advanced'}
                            size={24}
                            color = {Theme.icons.neutrals.secondary}
                        />
                        <Text
                            style = {[staticStyles.text, {
                                color: Theme.texts.neutrals.secondary,
                                paddingLeft: 8,
                                marginVertical: 4,
                            }]}
                        >
                            {Language.painter}
                        </Text> 
                        <MaterialCommunityIcons 
                            name={opened? 'close':'arrow-expand'}
                            size={24}
                            color = {Theme.icons.neutrals.secondary}
                        />
                    </Pressable>
                </View>
                
                {opened && 
                <Reanimated.View
                    entering={FadeIn}
                    //exiting={FadeOut}
                    style={{alignItems: 'center'}}
                >
                    <PaletteView uiTheme = {uiTheme} size={316} gapForms={5} br={5}/>

                    <View style={{height: 1, width: '80%', backgroundColor: Theme.specials.separator, opacity: .34, marginVertical: 8, borderRadius: 1}}/>

                    <ColorPicker
                        aPalette = {uiPalette}
                        uiTheme = {uiTheme}
                        uiScheme = {uiScheme}
                        uiStyle = {uiStyle}

                        appStyle={r_uiStyle}
                        Theme = {Theme}
                    />
                </Reanimated.View>}
            </Reanimated.View>
        )
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
            aValue = {selectSchema}
            //primaryValue = {schemes.indexOf(previewAppStyleA.value.palette.scheme)} 
            groupSize = {schemes.length}
            onPress = {shemaSetting}
            groupItems = {Object.values(Language.colorsMods)}
            appStyle = {r_uiStyle}
            Theme = {Theme}
        />
        <Text
            style = {[staticStyles.text, {
                color: Theme.texts.neutrals.secondary,
                paddingLeft: 8,
                marginTop: 4,
            }]}
        >
            {Language.palette}
        </Text> 
        <View
            style={{  
                //flex: 1, 
                alignItems: "center"
            }}
        >
            <FlatList
                ref = {flatListRef}
                initialNumToRender={15}
                style={{        
                    width: 4*itemSize,
                    //height: itemSize,
                    marginBottom: 8
                    
                }}
                numColumns={4}
                //horizontal = {true}
                showsHorizontalScrollIndicator = {false}
                decelerationRate = {'fast'}
                contentContainerStyle = {{
                    //paddingRight: itemSize,
                }}
                snapToInterval={itemSize}
                getItemLayout={(data, index) => (
                    {length: itemSize, offset: itemSize * index, index: index}
                )}
                //initialScrollIndex = {ThemeColorsAppIndex}
                data = {themesApp}         
                keyExtractor={(item, index) => {
                    return item + index
                }}
                renderItem={RENDER_ITEMS}
            />
        </View>
        
        <PaletteRedactor/>

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