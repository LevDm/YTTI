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
    cancelAnimation,
    useDerivedValue
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

import dataRedactor from "../../../../../../app_async_data_manager/data_redactor";
import { 
    BasePressable,
    BaseBox,
    BaseSlider,
    BaseSwitch 
} from "../../../../../../general_components/base_components/BaseElements";

import commonStaticStyles, { BoxsField, SwitchField } from "../CommonElements";

const Reanimated_Pressable = Reanimated.createAnimatedComponent(Pressable)

const schemes = ['auto', 'light', 'dark'] 

import presets, {presetsNames} from "../../../../../../app_values/AppDesigns";

const PresetItem = memo(function PresetItem ({
    preset,

    //primaryCheck,
    boxIndex, 
    currentIndex,

    onPress,
    onLongPress,

    itemSize,
    outlineSize,
    backgroundColor = 'white',

    borderRadius
},props) {
    //console.log('--RENDER PRESET', boxIndex)
    const {
        name,
        imageSource,
        imageLowScale,
        coloring,
        options,
    } = preset

    const accentState = useDerivedValue(()=>boxIndex == currentIndex.value);

    const accentFrame = useAnimatedStyle(()=>{
        return ({
            opacity: withTiming(accentState.value? 1 : 0, {duration: 200}) 
        })
    })

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
            //disabled = {primaryCheck} 
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
                    borderRadius: borderRadius,
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
                    borderRadius: borderRadius,
                }}
                {...coloring? {tintColor: coloring} : null}
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

            <Reanimated.View
                style={[{
                    height: itemSize-(2*outlineSize+1),//-(8)+1.5,
                    width: itemSize-(2*outlineSize+1),
                    position: 'absolute',
                    alignItems: 'center',
                    borderRadius: borderRadius -2,
                    borderWidth:  outlineSize,
                    borderColor: colors.background,
                }, accentFrame]}
            />
        </Reanimated_Pressable>
    )
})


export default PresetsSelector = (props) => {
    const {
        uiStyle,
        uiTheme,
        updateFullStyle,
        updateFullTheme,

        showAllSettings,

        tagStyle,

        aStyle,
        aTheme, 
        aPalette, 
        aScheme,

        appStyle,
        appConfig,
        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex
    } = props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.presets

    //const [_, set_] = useState()
    /* 
    const [previewIndex, setPreviewIndex] = useState(presetsNames.indexOf(appStyle.presetUsed))
    useEffect(()=>{
        console.log('ue',appStyle.presetUsed)
        const newIndex = presetsNames.indexOf(appStyle.presetUsed)
        newIndex != previewIndex? setPreviewIndex(newIndex) : null
    }, [appStyle])
    */

    const previewPresetIndex = useDerivedValue(()=>presetsNames.indexOf(uiStyle.presetUsed.value))

    //console.log('PRESET:', previewIndex)

    const flatListRef = useRef()

    const itemSize = 80
    const outlineSize = 2

    const pressItem = (index) => {

        Vibration.vibrate([1,1])
        console.log('preset PressItem', index, presetsNames[index])

        /* 
        if(index == 0 || presets[index].options){
            const newAppStyle = (index == 0? appStyle : presets[index].options)
            newAppStyle.customTheme = appStyle.customTheme
            newAppStyle.palette.scheme = appStyle.palette.scheme
            newAppStyle.presetUsed = presetsNames[index]
            
            if(appConfig.screenSubsequence.length == 1 && newAppStyle.navigationMenu.type == 'classical'){
                newAppStyle.navigationMenu.height = 0
            }
        }
        */

        uiStyle.presetUsed.value = presetsNames[index]
        updateFullStyle(index)
    }

    const longPressItem = (index) => {
        //if(index != previewPresetIndex.value){
            Vibration.vibrate([5,10, 20, 10, 20, 10])
            console.log('preset longPressItem', index)
            /* 
            if(index == 0 || presets[index].options){
                const newAppStyle = (index == 0? appStyle : presets[index].options)
                newAppStyle.customTheme = appStyle.customTheme
                newAppStyle.presetUsed = presetsNames[index]
                newAppStyle.palette.scheme = appStyle.palette.scheme

                if(appConfig.screenSubsequence.length == 1 && newAppStyle.navigationMenu.type == 'classical'){
                    newAppStyle.navigationMenu.height = 0
                }

                r_setAppStyle(newAppStyle)
                dataRedactor("storedAppStyle",newAppStyle);
            }*/
        //}
    }

    const RENDER_ITEMS = ({item, index})=>{
    
        return (
        <PresetItem
            key = {String(`theme_selector_${item.name+index}`)} 

            preset={index == 0? {
                name: item.name,
                imageSource: item.imageSource,
                imageLowScale: item.imageLowScale,
                //coloring: item.coloring,
                options: appStyle 
            }: item}

            onPress = {()=>{pressItem(index)}}
            onLongPress = {()=>{longPressItem(index)}}
            
            boxIndex = {index}
            currentIndex = {previewPresetIndex}
            //primaryCheck = {index == previewIndex}//{(JSON.stringify(index == 0? appStyle : item.options) === JSON.stringify(previewAppStyleA.value))}

            backgroundColor = {Theme.basics.neutrals.secondary}
           
            borderRadius = {appStyle.borderRadius.additional}   
                
            itemSize={itemSize}
            outlineSize={outlineSize}
        />
        )
    }

    const fabSave = useSharedValue(false);
    const fabChange = (value) => {
        fabSave.value = value
    }
    const nmSave = useSharedValue(false);
    const nmChange = (value) => {
        nmSave.value = value
    }

    console.log('----> RENDER r presets')
    return (
    <View
        style={{
            //paddingBottom: 12
            
        }}
    >   
        <SwitchField
            textTitle = {Language.saveFAB}
            textStates = {Language.stateSave}
            aValue={fabSave}
            onChange={fabChange}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />

        <SwitchField
            textTitle = {Language.saveNavigation}
            textStates = {Language.stateSave}
            aValue={nmSave}
            onChange={nmChange}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        
        <Text
            style = {[staticStyles.text, {
                color: Theme.texts.neutrals.secondary,
                paddingLeft: 8,
                marginTop: 4,
            }]}
        >
            {Language.appAs}
        </Text> 

        <View
            style={{
                alignItems: 'center'
            }}
        >
        <FlatList
            ref = {flatListRef}
            initialNumToRender={16}
            maxToRenderPerBatch={16}
            style={{
                marginTop: 6,        
                width: 4*itemSize,
                //height: 2*itemSize,
                //backgroundColor: 'blue',
            }}
            //horizontal = {true}
            numColumns={4}
            //showsHorizontalScrollIndicator = {false}
            decelerationRate = {'fast'}
            contentContainerStyle = {{
                //paddingRight: itemSize,
                
            }}
            snapToInterval={itemSize}
            getItemLayout={(data, index) => (
                {length: itemSize, offset: itemSize * index, index: index}
            )}
            //initialScrollIndex = {presetsNames.indexOf(appStyle.presetUsed)}//{Math.min(presets.length-1, previewIndex+1)}
            data = {presets}         
            keyExtractor={(item, index) => {
                return item + index
            }}
            /*
            NFC SHARED SCREEN TESTING 
            USED NFC LIBERTY DONT WORKING :C 
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
            */
            renderItem={RENDER_ITEMS}
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