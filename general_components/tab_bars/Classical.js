import React, { useState, useEffect, useRef } from "react";
import { Keyboard, View, Pressable, Text, Dimensions, StyleSheet } from "react-native";

import Reanimated, {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming,
    useDerivedValue
} from 'react-native-reanimated';

import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import Svg, {Path} from "react-native-svg";

import { BlurView } from "@react-native-community/blur";

import themesColorsAppList from "../../app_values/Themes";
import languagesAppList from "../../app_values/Languages";

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

const Reanimated_Text = Reanimated.createAnimatedComponent(Text);
const Reanimated_Icon = Reanimated.createAnimatedComponent(MaterialCommunityIcons)

function Classical(props){
    const {
        state = {
            index: 0, 
            routes: [
                {name: "tasks"},
                {name: "timetable"},
                {name: "notes"},
                {name: "settingsStack"},
                {name: "analytics"},
            ]
        },  
        route,
        navigation, 
        
        appStyle,
        appConfig,

        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex,
    } = props


    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex]

    


    const ripple = (color) => ({
        color: `${color}20`,
        borderless: true,
        foreground: false
    })

    const MenuItem = (props) => {
        const {
            itemIndex,
            accentIndex,
            accentState,
            onPress,
            icons,
            iconSize,
            title
        } = props
        
        const accent = useDerivedValue(()=>accentState)
        //const accent = accentState// (accentIndex == itemIndex)
        //console.log('>>MENU_RERENDEER', itemIndex)
        const tingDuration = 300

        const accentStyle = useAnimatedStyle(()=>{
            return {
                color:appStyle.navigationMenu.accentsType.coloring && accent.value? Theme.texts.accents.primary : Theme.texts.neutrals.secondary,
            }
        })

        const accentProps = useAnimatedProps(()=>{
            return {
                name:  appStyle.navigationMenu.accentsType.filling && accent.value? icons.focus : icons.notFocus, 
                size: iconSize,
                color:  appStyle.navigationMenu.accentsType.coloring && accent.value? Theme.icons.accents.primary : Theme.icons.neutrals.secondary, 
            }
        })

        const pressItem = () => {
            if(!accent.value){
                accent.value = true
                setTimeout(onPress, 300) 
            } else {
                //accent.value = false
            }
        }

        return (
            <View
                key = {props.keyID}
                style = {{
                    flex: 1, 
                    backgroundColor: 'transparent',
                    borderRadius: appStyle.borderRadius.additional
                }}
            >
            <Pressable
                //disabled = {accent}
                onPress={onPress}
                style={[
                        {
                        flex: 1, 
                        alignItems: 'center',
                        alignContent: 'center',
                        paddingTop: appStyle.navigationMenu.height > 55? 8 : 3,
                        justifyContent: 'flex-start',
                        //backgroundColor: 'transparent' 
                    }
                ]}
                android_ripple = {appStyle.effects.ripple == 'all'? ripple(Theme.icons.accents.primary) : false}
            >
                <Reanimated.View 
                    //exiting={exiting}
                    style = {{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    //entering={entering}
                >
                    <Reanimated_Icon
                        animatedProps={accentProps}
                    />
                    {appStyle.navigationMenu.signatureIcons &&
                    <Reanimated_Text
                        style = {[
                            {
                                fontSize: 10,
                                width: '100%',
                                textAlign: 'center',
                                fontVariant: ['small-caps'],
                                fontWeight: '500',
                                
                            },
                            accentStyle
                        ]}
                    >
                        {title}
                    </Reanimated_Text>
                    }
                </Reanimated.View>        
            </Pressable>    
            </View>
        )
    }

    const tingDuration = 350
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

    //console.log("cur acc", )
    //if(state.routes[state.index].name != route.name){return null}

    return (
        <Reanimated.View
            key = {`${Math.random()}`}
            style = {
                [{
                    height: appStyle.navigationMenu.height,
                    width: deviceWidth,
                },
                appStyle.effects.blur? {} : {
                    borderTopWidth: 0.4,
                    borderColor: `${Theme.specials.separator}25`,
                    backgroundColor: Theme.basics.neutrals.tertiary,
                }]
            }
        >   
            {appStyle.effects.blur && 
            <View 
                style = {[StyleSheet.absoluteFillObject, {
                    //specialty blur for android
                    overflow: 'hidden',
                }]}
            >
            <BlurView
                style = {{flex: 1, }}
                blurType = {'light'}
                blurAmount = {10}
                
                //ANDROID_PROPS
                overlayColor={`${Theme.basics.neutrals.tertiary}90`}
                //overlayColor={'transparent'}
                //blurRadius	= {10}
                //downsampleFactor = {10}
            />
            </View>}
            
            {true && //state.routes[state.index].name == route.name ||
            <Reanimated.View
                //entering={entering}
                //exiting={exiting} 
                style = {{
                    flex: 1, 
                    flexDirection: 'row',
                }}
            >
            {state.routes.map((route, index) => {

                const routes =  {
                    tasks : {name: "tasks"},
                    timetable: {name: "timetable"},
                    notes : {name: "notes"},
                    analytics : {name: "analytics"},
                    settings : {name: "settingsStack"},
                }

                let current 
                let uses = new Array(Object.keys(appConfig.appFunctions).length)//['','','','']
                Object.keys(appConfig.appFunctions).map((litem, lindex)=>{
                    if(appConfig.appFunctions[litem].useId == index){
                        current = litem
                    } 
                    if(appConfig.appFunctions[litem].used){
                        uses[appConfig.appFunctions[litem].useId] = litem
                    } 
                })

                const croute = routes[current]
                const cpage = appConfig.appFunctions[current]

                if(!routes[current]){return null} 

                const cisFocused = state.routes[state.index].name === croute.name;

                let size = 19;
                size = (appStyle.navigationMenu.height-5-15)
                size = (size > 32? 32 : size)

                const iconsNames = {focus: '', notFocus: ''}
                let screenName = ''

                switch(croute.name){
                    case "tasks":
                        iconsNames.focus = 'sticker-check';//'home-edit';
                        iconsNames.notFocus = 'sticker-check-outline';//'home-edit-outline';
                        screenName = Language.TasksScreen.HeaderTitle;
                        break;

                    case "analytics":
                        iconsNames.focus = 'circle-slice-1';
                        iconsNames.notFocus = 'circle-outline';
                        screenName = Language.AnalyticsScreen.HeaderTitle;
                        break;

                    case "settingsStack": 
                        iconsNames.focus = 'cog'; 
                        iconsNames.notFocus = 'cog-outline';
                        screenName = Language.SettingsScreen.HeaderTitle;
                        break;
                    
                    case "notes":
                        iconsNames.focus = 'note-edit'; 
                        iconsNames.notFocus = 'note-edit-outline';
                        screenName = Language.NotesScreen.HeaderTitle;
                        break;

                    case "timetable":
                        iconsNames.focus = 'timetable'; 
                        iconsNames.notFocus = 'timetable';
                        screenName = Language.TimetableScreen.HeaderTitle;
                        break;

                    default:
                        iconsNames.focus = "border-none-variant"
                        iconsNames.notFocus = "border-none-variant"
                        screenName = 'screenName'
                }

                const navigate = () =>{
                    //console.log('PRESS', croute.name)
                    navigation.navigate(croute.name)
                }

                return (
                    <MenuItem
                        keyID = {`${screenName}_${index}`}
                        itemIndex = {index}
                        accentIndex = {state.index}
                        accentState = {state.routes[state.index].name == croute.name}
                        onPress = {navigate}
                        icons = {iconsNames}
                        iconSize = {size}
                        title = {screenName}
                    />
                )
            })}
            </Reanimated.View>}
        </Reanimated.View>
    );
}

export default Classical;


const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'column',
        position: 'absolute',
        right: 3,
        borderRadius: 12,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        elevation: 0 
    },

});