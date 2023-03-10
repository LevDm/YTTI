import React, { useRef, useState } from 'react';
import { Animated, Button, StyleSheet, View,Text, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import themeColorsAppList from "../app_values/Themes";
const ColorsApp = themeColorsAppList[1]

const AnimatPointerText = ({action, LanguageStore}) => {

    const animate_state = {start: 0, end: 100}

    const [statusAnimated, setStatusAnimated] = useState(true)
    const value = useRef(new Animated.Value(animate_state.start)).current

    const StartAnimate = () => {
        Animated.timing(value, { toValue: animate_state.start, useNativeDriver: true, duration: 500 }).start(()=>{EndAnimate()})
        setStatusAnimated(false)
    }

    const EndAnimate = () => {  
        Animated.timing(value, { toValue: animate_state.end, useNativeDriver: true, duration: 500 }).start(()=>{StartAnimate()})    
    }

    const inputRange = [animate_state.start, animate_state.end] //
    const outputRange = [0, 6] //
    const translateX = value.interpolate({ inputRange, outputRange}) //
    const opacity = value.interpolate({ inputRange, outputRange: [1 , 0.5 ] })

    if (statusAnimated) {StartAnimate();}
    if (!action) {value.stopAnimation();}

    return (
        <>
        {action &&
        <View 
            style = {[styles.RowArea,
            {
                bottom: '8%', // if navigatemenu = 'hidden'->2, 'classical_animated'->8, 'classical'->8, 
                right: '18%',
            }
            ]}
        >
            <Text style = {styles.AnimText}>{LanguageStore.Pointer.ClickAdd}</Text>
            <Animated.View style={{ transform: [{ translateX }], opacity}}>
                <MaterialCommunityIcons name = 'chevron-right' size = {25}/>
            </Animated.View>
        </View>
        }
        </>
    )   

}
export default AnimatPointerText;

const styles = StyleSheet.create({
    RowArea: {
        flexDirection: 'row', 
        opacity: 0.5,
        bottom: '2%',
        right: '18%',
        alignItems: 'center',
        position: 'absolute',
        height: 60,
        //maxWidth: '100%'
    },
    AnimText: {
        fontSize: 14, 
        letterSpacing: 1,
        //fontStyle: 'italic',
        fontWeight: "bold",
        color: ColorsApp.symbolDark,


    },
});