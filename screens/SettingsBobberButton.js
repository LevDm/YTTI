import React, { useRef, useState, useEffect } from "react";
import { Animated, StyleSheet,View, Text, Dimensions, Pressable, Alert, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import ThemesColorsAppList from "../styles/ColorsApp";
import { BasePressable } from "../componets/base/BaseElements";

const deviceWidth = Dimensions.get('window').width;

export default BobberButton = ({
    //scrollEvent,
    visible,
    appStyle,
    ThemeColorsAppIndex
}) => {
    //const [visible, setVisible] = useState(false);
    //const [swipeValue, setSwipeValue] = useState(0);
    const [isExpand, setIsExpand] = useState(false);

    const animate_state = {start: 0, end: 100}
    const inputRange = [animate_state.start, animate_state.end]

    const upriseAnimatedValue = useRef(new Animated.Value(animate_state.start)).current;
    const expandAnimatedValue = useRef(new Animated.Value(animate_state.start)).current;

    const startUpriseAnimate = (toValue) => {
        Animated.timing(upriseAnimatedValue).stop();
        Animated.timing(upriseAnimatedValue, { toValue: toValue, useNativeDriver: true, duration: 90 }).start();
    }

    useEffect(()=>{
        if(isExpand && !visible){
            setIsExpand(false);
        } else {
            startUpriseAnimate(visible? animate_state.start : animate_state.end);
        }
    },[visible])

    const upriseTranslateY = upriseAnimatedValue.interpolate({ inputRange, outputRange: [0, deviceWidth*0.04+60]})  

    const startExpandAnimate = (toValue) => {
        Animated.timing(expandAnimatedValue).stop();
        Animated.timing(expandAnimatedValue, { toValue: toValue, useNativeDriver: true, duration: 190 }).start(()=>{
            if(!visible){startUpriseAnimate(animate_state.end)}
        });
    }

    useEffect(()=>{
        startExpandAnimate(isExpand? animate_state.end : animate_state.start);
    },[isExpand])

    const expandTranslateX = expandAnimatedValue.interpolate({ inputRange, outputRange: [0, -96]})
    const expandTranslateY = expandAnimatedValue.interpolate({ inputRange, outputRange: [0, -96]})
    const expandTranslateXY = expandAnimatedValue.interpolate({ inputRange, outputRange: [0, -68]})     
    const expandOpacity = expandAnimatedValue.interpolate({ inputRange, outputRange: [0.5 , 1 ] })

    const buttonPress =()=>{
        setIsExpand(!isExpand);
    }
    const applyPress =()=>{
        console.log('pressa')
        setIsExpand(!isExpand);
    }
    const fixedPress =()=>{
        console.log('pressf')
        setIsExpand(!isExpand);
    }
    const jumpPress =()=>{
        console.log('pressj')
        setIsExpand(!isExpand);
    }
    return (
        <Animated.View 
            style = {{
                position: 'absolute',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                height: 156,
                width: 156,
                bottom: '8%', // if navigatemenu = 'hidden'->2, 'classical_animated'->8, 'classical'->8, 
                right: '2%',
                transform: [{translateY: upriseTranslateY}],
            }}
        >   
            <Animated.View
                style = {{
                    zIndex: 2,
                    height: 60,
                    width: 60,
                    borderRadius: appStyle.borderRadius.additional,
                    backgroundColor: ThemesColorsAppList[ThemeColorsAppIndex].sky,

                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 1,

                    opacity: expandAnimatedValue.interpolate({ inputRange, outputRange: [1 , 0.5 ] })
                }}
            >
            <BasePressable
                type={"i"}
                icon={{name:`arrow-${isExpand?"collapse":"expand"}`, size: 24, color:"black"}}
                style={{
                    height: 60,
                    width: 60,
                    borderRadius: appStyle.borderRadius.additional,
                }}
                onPress={buttonPress}
            />
            </Animated.View>
            {["apply", "fixed", "jumpUp"].map((item, index)=>{
                let transform;
                let iconName;
                let pressFunction;
                switch(item){
                    case "apply": 
                        transform = [{translateX: expandTranslateX}];
                        iconName = "check-outline";
                        pressFunction = applyPress;
                        break;
                    case "fixed": 
                        transform = [{translateX: expandTranslateXY},{translateY: expandTranslateXY}];
                        iconName = "close";
                        pressFunction = fixedPress;
                        break;
                    case "jumpUp": 
                        transform = [{translateY: expandTranslateY}];
                        iconName = "arrow-collapse-up";
                        pressFunction = jumpPress;
                        break;
                }
                return (
                    <Animated.View
                        key={item+index}
                        
                        style = {{
                            zIndex: 1,
                            //height: 60,
                            //width: 60,
                            //backgroundColor: 'red',        
                            position: 'absolute',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: expandOpacity,
                            transform: transform
                        }}
                    >
                        <BasePressable
                            type={"i"}
                            icon={{name: iconName, size: 24, color:"black"}}
                            style={{
                                height: 60,
                                width: 60,
                                borderRadius: appStyle.borderRadius.additional,
                                backgroundColor: ThemesColorsAppList[ThemeColorsAppIndex].skyUp,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 1,
                            }}
                            onPress={pressFunction}
                        />
                    </Animated.View>
                )
            })}
        </Animated.View>
    )
}

const staticStyles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
             height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 1,
    }

});
