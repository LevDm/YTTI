import React, { useState, useEffect, useRef } from "react";
import { View, Pressable, Text, Animated, Dimensions, FlatList, StyleSheet } from "react-native";

import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import Svg, {Path} from "react-native-svg";

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width

const TabBar = ({ 
    state, 
    descriptors, 
    navigation, 

    appStyle,
    appConfig,

    ThemeColorsAppIndex,
    LanguageAppIndex,

    type, 
    ColorsApp, 
    LanguageStore
}) => {
    const [tabBarVisible, setTabBarVisible] = useState(false);

    const [statusAnimated, setStatusAnimated] = useState(true)
    const [val, setVal] = useState(true)
    const animate_state = {min: 1, start: 1.1, max: 2}

    const value = useRef(new Animated.Value(animate_state.min)).current
 
    const value2 = useRef(new Animated.Value(animate_state.max)).current

    const startAnimate = () => {
        
        setStatusAnimated(false);
        Animated.timing(value, { toValue: animate_state.max, useNativeDriver: true, duration: 150 }).start(() => {
            setTabBarVisible(true);

            setTimeout(() => {
                setVal(false);
                setTabBarVisible(false);  
                Animated.timing(value, { toValue: animate_state.min, useNativeDriver: true, duration: 1 }).start()

                
                Animated.timing(value2, { toValue: animate_state.min, useNativeDriver: true, duration: 150 }).start(() => {
                    setVal(true);
                    Animated.timing(value2, { toValue: animate_state.max, useNativeDriver: true, duration: 1 }).start() 
                    setStatusAnimated(true);
                });
            },700);
        });
    }

    const listRef = useRef()
    const [listIndex, setListIndex] = useState(2)

    const data = [
        {
            id: 1,
            params: 'white'
        },
        {
            id: 2,
            params: 'white'
        },
        {
            id: 3,
            params: 'blue'
        },
        {
            id: 4,
            params: 'white'
        },
        {
            id: 5,
            params: 'white'
        },
    ];

    const path = "M 89.375 16 C 89.375 1 102 1 102 1 V 16 V 23.5 V 31 V 38.5 V 46 V 53.5 V 61 H 89.375 H 83.0625 H 76.75 H 70.4375 H 64.125 H 51.5 H 38.875 H 32.5625 H 26.25 H 19.9375 H 13.625 H 1 V 53.5 V 46 V 38.5 V 31 V 16 V 1 C 1 1 13.625 1 13.625 16 C 13.625 38.5 33.5 53.5 51.5 53.5 C 69.5 53.5 89.375 38.5 89.375 16 Z"
    const types = ["classical","classical_animated","hidden"]
    return (
        <Animated.View
            style = {[
                type === "classical"? {
                    height: appStyle.navigationMenu.height,
                    width: '100%',
                    position: 'absolute',
                    bottom: 0, 
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    borderTopWidth: 1,
                    borderColor: '#00000015'
                } : {},
                type === "classical_animated"? {
                    height: 60,
                    width: '100%',
                    position: 'absolute', 
                    flexDirection: 'row',
                    bottom: 0
                } : {},

                (type === "hidden" && tabBarVisible)? {          
                    height: "22%",
                    width: "12%",
                    bottom: '30%',
                    backgroundColor: ColorsApp.navigatorField 
                } : {},
                (type === "hidden" && !tabBarVisible)? {
                    height: '11%',
                    width: '3.7%',
                    bottom: '35%',
                    backgroundColor: ColorsApp.navigatorFieldIcon,
                    transform: [{scale: val? value: value2}]
                } : {},
                type === "hidden"? styles.tabBar : {},
            ]}
        >
            {type === "classical" && <></>}

            {type === "hidden" && <></>}

            {type === "classical_animated" && 
            <FlatList
                ref={listRef}
                style = {{
                    position: 'absolute', 
                    flexDirection: 'row',
                    width: deviceWidth,              
                }}
                showsHorizontalScrollIndicator = {false}
                horizontal = {true}
                scrollEnabled = {false}
                initialScrollIndex={listIndex}
                data = {data}
                keyExtractor={item => item.id}
                renderItem = {({ item,index })=>{

                    if(item.id === Math.round(data.length/2)){
                        return (
                            <View
                                nativeID = {String(index)}
                                style = {{
                                    height: 60,
                                    width: (deviceWidth)/3,
                                    flexDirection: 'row'
                                }}
                            >
                                <View
                                    style = {{
                                        flex: 1,
                                        height: 60,
                                        //width: 10,
                                        backgroundColor: ColorsApp.skyUp
                                    }}
                                />
                                <Svg height = {60} width = {101} viewBox = {[0,-1.5, 103, 62]} >
                                    <Path   
                                        d={path} 
                                        fill= {ColorsApp.skyUp}
                                        stroke= {ColorsApp.skyUp}
                                        strokeWidth="5"
                                    />
                                </Svg>
                                <View
                                    style = {{
                                        flex: 1,
                                        height: 60,
                                        //width: 10,
                                        backgroundColor: ColorsApp.skyUp
                                    }}
                                />
                            </View>
                        )
                    } else {
                        return (
                            <View
                                nativeID = {String(index)}
                                style = {{
                                    height: 60,
                                    width: (deviceWidth)/3,
                                    backgroundColor: ColorsApp.skyUp
                                }}
                            />
                        )
                    }
                }}
            />}
                
       
            {state.routes.map((route, index) => {

                const isFocused = state.index === index;

                //if type === "classical_animated"
                let scrollIndex = null
                if (route.name == "screen_1"){scrollIndex = 3;}
                if (route.name == "screen_2"){scrollIndex = 1;} 
                if (route.name == "screen_3"){scrollIndex = 0;}

                const ups = useRef(new Animated.Value(0)).current 
                if(!isFocused){
                    Animated.timing(ups, { toValue: 0, useNativeDriver: true, duration: 250 }).start()
                } else {
                    if(scrollIndex != listIndex){setListIndex(scrollIndex);}
                    Animated.timing(ups, { toValue: 1, useNativeDriver: true, duration: 250 }).start()
                }
                //

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        if(type === "hidden"){         
                        } else if (type === "classical"){                                       
                        } else if (type === "classical_animated"){
                            listRef.current.scrollToIndex({ 
                            animated: true, 
                            index: scrollIndex
                            })                
                        }
                    
                        navigation.navigate({ name: route.name, merge: true });
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                    });
                };
                       
                let iconName;
                let size = 19;
                let color = ColorsApp.symbolDark;

                if(type === "hidden"){
                    size = 25;
                } else if (type === "classical"){
                    size = (appStyle.navigationMenu.height-5-15)//(appStyle.navigationMenu.signatureIcons? 15 : 0)
                    size = (size > 32? 32 : size)
                } else if (type === "classical_animated"){
                    size = 27;
                }

                if (isFocused) { 
                    //size = size + 10;
                    size = (type === "hidden"? size+10 : size)
                    if (route.name == "screen_1"){iconName = 'home-edit';}
                    if (route.name == "screen_2"){iconName = 'circle-slice-1';}
                    if (route.name == "screen_3"){iconName = 'cog';}  
                } else {
                    if (route.name == "screen_1"){iconName = 'home-edit-outline';}
                    if (route.name == "screen_2"){iconName = 'circle-outline';} 
                    if (route.name == "screen_3"){iconName = 'cog-outline';}
                }
                

                let tabBarName = '';
                if(type === "hidden"){
                    
                } else if (type === "classical"){
                    if (route.name == "screen_1"){tabBarName = LanguageStore.TasksScreen.HeaderTitle;}
                    if (route.name == "screen_2"){tabBarName = LanguageStore.AnalyticsScreen.HeaderTitle;} 
                    if (route.name == "screen_3"){tabBarName = LanguageStore.SettingsScreen.HeaderTitle;}
                    
                } else if (type === "classical_animated"){
                    if (route.name == "screen_1"){tabBarName = LanguageStore.TasksScreen.HeaderTitle;}
                    if (route.name == "screen_2"){tabBarName = LanguageStore.AnalyticsScreen.HeaderTitle;} 
                    if (route.name == "screen_3"){tabBarName = LanguageStore.SettingsScreen.HeaderTitle;}

                }

                if (type != "hidden" || tabBarVisible) {
                return (
                    <Animated.View 
                        key = {route.key}
                        style = {[
                            type === "classical"? {
                                //borderRadius: 12,
                                //borderTopWidth: 1,
                                //borderLeftWidth: 1,
                                //borderRightWidth: 1,
                                //borderColor: isFocused? ColorsApp.navigatorFieldIcon: '#00000000',
                                //margin: 2,
                                //alignItems: 'flex-start',
                                flex: 1
                            } : {},
                            type === "classical_animated"? {
                                margin: 2,
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: ups.interpolate({
                                    inputRange: [ 0, 0.5, 1 ],
                                    outputRange: [ 1, 0.75, 1 ]
                                }),
                                transform: [
                                    {translateY: ups.interpolate({
                                        inputRange: [ 0, 1 ],
                                        outputRange: [ 0, -13.5 ]
                                    })
                                    
                                    }, 
                                    {scale: ups.interpolate({
                                        inputRange: [ 0, 1 ],
                                        outputRange: [ 1, 1.12 ]
                                    })},
                                ]
                            } : {},
                            type === "hidden"? {
                                borderRadius: 12,
                                borderTopWidth: 1,
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderColor: isFocused? ColorsApp.navigatorFieldIcon: '#00000000',
                                margin: 2,
                                flex: 1
                            } : {},
                        ]}
                    >
                        <View
                            style={[
                                type === "classical"? {
                                    flex: 1,
                                    //justifyContent: 'flex-start',
                                    //backgroundColor: 'red',
                                    //marginBottom: 5
                                } : {},
                                type === "hidden"? {
                                    flex: 1,
                                    //marginBottom: 5
                                } : {},
                                type === "classical_animated"? {
                                    borderRadius: 28,
                                    width: 55,
                                    height: 55,
                                    backgroundColor: ColorsApp.skyUpUp
                                } : {},
                            ]}
                        >
                            <Pressable
                                key = {route.key}
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                style={[
                                    type === "classical_animated"? {
                                        flex: 1, 
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        paddingTop: 3
                                        
                                    } : {},
                                    type === "classical"? {
                                        flex: 1, 
                                        alignItems: 'center',
                                        paddingTop: appStyle.navigationMenu.height > 55? 8 : 3,
                                        justifyContent: 'flex-start'
                                    } : {},
                                    type === "hidden"? {
                                        flex: 1, 
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    } : {},
                                ]}
                                android_ripple = {{color: ColorsApp.navigatorFieldIcon,borderless: true}}
                            >
                                <MaterialCommunityIcons name={iconName} size={size} color = {color}/>
                                
                                {type != 'hidden' && appStyle.navigationMenu.signatureIcons &&
                                <Text
                                    style = {[
                                        type === "classical_animated"? {
                                            fontSize: 8.5,
                                            //letterSpacing: -0.5
                                        } : {},
                                        type === "classical"? {
                                            fontSize: 10,
                                        } : {},
                                        {}
                                    ]}
                                >
                                    {tabBarName}
                                </Text>
                                }
                                
                            </Pressable>    
                        </View> 
                    </Animated.View>
                );
                } else {
                    return (
                        <Pressable
                            key = {route.key}
                            style={{
                                flex: 1,
                                //backgroundColor: 'red'
                            }}
                            onPress = {()=>{
                                statusAnimated? startAnimate(): 0
                            }}         
                        />
                    );
                }
            })}
        </Animated.View>
    );
}

export default TabBar;


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