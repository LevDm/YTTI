import React, { useState, useEffect, useRef } from "react";
import { Keyboard, View, Pressable, Text, Dimensions, StyleSheet } from "react-native";


import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import themesColorsAppList from "../../app_values/Themes";
import languagesAppList from "../../app_values/Languages";

import { ripple, getNavigateItems } from "./tools";

function DrawerItemList(props) {

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


    const itemSize = 40
    const iconSize = 30

    return (
        <View
            style={{
                height: 5*itemSize,
                width: '100%',
            }}
        >
        {getNavigateItems({
            state: state,
            LanguageAppIndex: LanguageAppIndex,
            appConfig: appConfig
        }).map((item, index) => {
            
            const  {
                routeName,
                screenTItle,
                iconFocus,
                isFocused,
            } = item

            return (
                <View
                    key = {`${Math.random()}`}
                    style = {{
                        backgroundColor: '#00000001',
                        alignItems: 'center',
                        //borderRadius: appStyle.borderRadius.additional
                    }}
                >
                <Pressable
                    disabled = {isFocused}
                    onPress={()=>{
                        navigation.navigate(routeName)
                    }}
                    style={[{
                            paddingHorizontal: 20,
                            height: itemSize,
                            width: '100%', 
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                            //backgroundColor: 'red'
                        }
                    ]}
                    android_ripple = {appStyle.effects.ripple == 'all'? ripple(Theme.icons.accents.primary) : false}
                >
                    <MaterialCommunityIcons 
                        name={iconFocus[appStyle.navigationMenu.accentsType.filling && isFocused]} 
                        size={iconSize} 
                        color = {appStyle.navigationMenu.accentsType.coloring && isFocused? Theme.icons.accents.primary : Theme.icons.neutrals.secondary}
                    />
        
                    <Text
                        style = {[
                            {
                                fontSize: 14,
                                marginLeft: 10,
                                //width: '100%',
                                textAlign: 'center',
                                fontVariant: ['small-caps'],
                                fontWeight: '600',
                                color: appStyle.navigationMenu.accentsType.coloring && isFocused? Theme.texts.accents.primary : Theme.texts.neutrals.secondary
                            }
                        ]}
                    >
                        {screenTItle}
                    </Text>        
                </Pressable>    
                </View>
            )
            })}
        </View>
    )
}

export default DrawerItemList;