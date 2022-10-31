import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

import Animated, {
  interpolateColor,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';

const ReanimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient) 
//interface ColorPickerProps extends LinearGradientProps {
//  maxWidth: number;
//  onColorChanged?: (color: string | number) => void;
//}

const ColorPicker = ({
  colors ,
  accent = false,
  initialValue,
  start,
  end,
  style,
  maxWidth,
  onColorChanged,
}) => {
    const translateX = useSharedValue(0);

    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);

    const adjustedTranslateX = useDerivedValue(() => {
        return Math.min(
            Math.max(translateX.value, 0),
            maxWidth - CIRCLE_PICKER_SIZE
        );
    });

    const onEnd = useCallback(() => {
        'worklet';
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
    }, []);

    const panGestureEvent = useAnimatedGestureHandler({
        onStart: (_, context) => {
            context.x = adjustedTranslateX.value;
        },
        onActive: (event, context) => {
            translateX.value = event.translationX + context.x;
        },
        onEnd,
    });

    const tapGestureEvent =useAnimatedGestureHandler({
        onStart: (event) => {
            translateY.value = withSpring(-CIRCLE_PICKER_SIZE);
            scale.value = withSpring(1.2);
            translateX.value = withTiming(event.absoluteX - CIRCLE_PICKER_SIZE);
        },
        onEnd,
    });

    const rStyle = useAnimatedStyle(() => {
        return {
        transform: [
            { translateX: adjustedTranslateX.value },
            //{ scale: scale.value },
            //{ translateY: translateY.value },
        ],
        };
    });

    const gradient = useAnimatedProps(()=>{
        'worklet';
        const color = colors.value
        console.log('gradien', color, accent)
        return {
            colors: color
        }
    },[colors.value, accent])

    useEffect(()=>{
        const color = colors.value
        //console.log('ue', color, accent, accent? true : false)
    },[accent])

    

    const rInternalPickerStyle = useAnimatedStyle(() => {
        console.log('internal',)
        const color = colors.value

       

        //if(color){
            const inputRange = (color).map(
                (_, index) => (index / (color).length) * maxWidth
            );

            const backgroundColor =  interpolateColor(
                translateX.value,
                inputRange,
                color
            )

            onColorChanged?.(backgroundColor);
            

            return {
                backgroundColor,
            };
        //}
        
    }, []);
    //console.log(colors.value)
    return (
    <TapGestureHandler onGestureEvent={tapGestureEvent}>
      <Animated.View
        style ={{height: 60}}
      >
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={{ justifyContent: 'center' }}>
            <ReanimatedLinearGradient
              
              start={start}
              end={end}
              style={style}
              animatedProps={gradient}
              colors={accent? ['white',accent,'black'] : colors.value}
              
            />
            <Animated.View style={[styles.picker, rStyle]}>
              <Animated.View
                style={[styles.internalPicker, rInternalPickerStyle]}
              />
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
    );
};

const CIRCLE_PICKER_SIZE = 30;
const INTERNAL_PICKER_SIZE = CIRCLE_PICKER_SIZE  ;

const styles = StyleSheet.create({
  picker: {
    position: 'absolute',
    //backgroundColor: '#fff',
    width: CIRCLE_PICKER_SIZE,
    height: CIRCLE_PICKER_SIZE,
    borderRadius: CIRCLE_PICKER_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  internalPicker: {
    width: INTERNAL_PICKER_SIZE,
    height: INTERNAL_PICKER_SIZE,
    borderRadius: INTERNAL_PICKER_SIZE / 2,
    borderWidth: 1.0,
    borderColor: 'rgba(0,0,0,0.2)',
  },
});

export default ColorPicker;