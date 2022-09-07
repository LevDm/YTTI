import React, { useState, useRef, useEffect } from "react";
import { View, Animated } from "react-native";

const StatusBarColor = ({
    height = 50,
    color
}) => {
    const duration = 300;

    const [downColor, setDownColor] = useState('transparent');
    const [upColor, setUpColor] = useState('transparent');

    const animationValue = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const startAnimated = (color) => {
            setUpColor(color);
            Animated.timing(animationValue, {
                toValue: 1, 
                useNativeDriver: true, 
                duration: duration 
            }).start(()=>{

                setDownColor(color);
                Animated.timing(animationValue, {
                    toValue: 0, 
                    useNativeDriver: true, 
                    duration: 10 
                }).start();
            });
        }
        
        startAnimated(color);

    }, [color]);

    const style = {
        position: 'absolute',
        width: '100%',
        height: height,
        top: 0,
    }

    return (
        <>
        <View
            style = {[style,{
                backgroundColor: downColor,
            }]}
        />
        <Animated.View
            style = {[style,{
                backgroundColor: upColor,
                opacity: animationValue.interpolate({
                    inputRange: [ 0, 0.25, 0.5, 0.75, 1 ],
                    outputRange: [ 0, 0.25, 0.5, 0.75, 1 ]
                }),

            }]}
        />
        </>
        
    );
}; 

export default StatusBarColor;