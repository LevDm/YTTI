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

import themesColorsAppList, { themesApp } from "../../../../../../app_values/Themes";

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import commonStaticStyles, { BoxsField, SwitchField } from "../CommonElements";

const Reanimated_Pressable = Reanimated.createAnimatedComponent(Pressable)

const schemes = ['auto', 'light', 'dark'] 

import presets, {presetsNames} from "../../../../../../app_values/AppDesigns";
import useLanguage from "../../../../../../app_hooks/useLanguage";

const PresetItem = memo((props) => {
    const {
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
    } = props


    const {
        icon = {
            name: "border-none-variant",
            color: 'black'
        },
        fill = {
            colors: ['white', 'white'],
            locs: [0,1]
        },
        options,
    } = preset

    const accentState = useDerivedValue(()=>boxIndex == currentIndex.value);

    const accentFrame = useAnimatedStyle(()=>{
        return ({
            opacity: withTiming(accentState.value? 1 : 0, {duration: 200}) 
        })
    })

    const indexTheme = themesApp.indexOf(options.palette)
    const itemThemeIndex = indexTheme == 0? 1 : indexTheme

    const presetTheme = options? themesColorsAppList[itemThemeIndex].light : undefined

    const colors = {
        gradient: fill.colors,
        icon:  presetTheme? presetTheme.icons.neutrals.primary : 'black',
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
            key = {props.keyID}
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
                locations={presetTheme? fill.locs : [.3,.6,1]}
                style={{
                    position: 'absolute',
                    height: itemSize,
                    width: itemSize,
                    borderRadius: borderRadius,
                    backgroundColor: colors.gradient.includes(colors.background)? 'black' : 'transparent',
                    opacity: colors.gradient.includes(colors.background)? 0.9 : 1
                }}
            />

            <View
                style={{
                    position: 'absolute',
                    opacity: 0.86,
                }}
            >
                <MaterialCommunityIcons 
                    size={32}
                    color={colors.icon}
                    {...icon}
                />
            </View>

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

        r_uiStyle,
        Theme
    } = props

    const Language = useLanguage().SettingsScreen.Redactors.presets

    const previewPresetIndex = useDerivedValue(()=>presetsNames.indexOf(uiStyle.presetUsed.value))

    //console.log('PRESET:', previewIndex)
    const fabSave = useSharedValue(false);
    const fabChange = (value) => {
        fabSave.value = value
    }

    const nmSave = useSharedValue(false);
    const nmChange = (value) => {
        nmSave.value = value
    }

    const getIgnored = () => {
        const values = []
        if(fabSave.value){
            values.push('fab')
        }
        if(nmSave.value){
            values.push('navigationMenu')
        }
        return values
    }

    const flatListRef = useRef()

    const itemSize = 80
    const outlineSize = 2

    const pressItem = (index) => {
        Vibration.vibrate([1,1])
        console.log('preset PressItem', index, presetsNames[index])
        uiStyle.presetUsed.value = presetsNames[index]

        const ignored = getIgnored()

        updateFullStyle(index, ignored)
    }

    const longPressItem = (index) => {
        Vibration.vibrate([5,10, 20, 10, 20, 10])
        console.log('preset longPressItem', index)
    }

    const RENDER_ITEMS = ({item, index})=>{
    
        return (
        <PresetItem
            key = {String(`theme_selector_${item.name+index}`)} 
            keyID = {String(`theme_selector_${item.name+index}`)} 
            preset={index == 0? {
                ...item,
                options: r_uiStyle,
                fill: {
                    colors: [Theme.basics.accents.primary,Theme.basics.accents.secondary, Theme.basics.accents.tertiary],
                    locs: [0.3, 0.6, 1]
                },
                icon: {
                    ...item.icon,
                    color: Theme.icons.neutrals.primary
                }
            }: item}

            onPress = {()=>{pressItem(index)}}
            onLongPress = {()=>{longPressItem(index)}}
            
            boxIndex = {index}
            currentIndex = {previewPresetIndex}
            //primaryCheck = {index == previewIndex}//{(JSON.stringify(index == 0? appStyle : item.options) === JSON.stringify(previewAppStyleA.value))}

            backgroundColor = {Theme.basics.neutrals.quaternary}
           
            borderRadius = {r_uiStyle.borderRadius.secondary}   
                
            itemSize={itemSize}
            outlineSize={outlineSize}
        />
        )
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
            appStyle = {r_uiStyle}
            Theme = {Theme}
        />

        <SwitchField
            textTitle = {Language.saveNavigation}
            textStates = {Language.stateSave}
            aValue={nmSave}
            onChange={nmChange}
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