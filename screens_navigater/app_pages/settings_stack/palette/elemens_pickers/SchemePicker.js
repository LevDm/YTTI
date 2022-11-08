import React, { useCallback, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Keyboard } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

import Animated, {
  interpolateColor,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import { deviceHeight, deviceWidth } from '../../../../../app_values/AppDefault';

import themesColorsAppList, {themesApp} from '../../../../../app_values/Themes';
import languagesAppList, {languagesApp} from "../../../../../app_values/Languages";

import { BaseBox } from '../../../../../general_components/base_components/BaseElements';

const start={ x: 0, y: 0 }
const end={ x: 1, y: 0 }

const PICKER_WIDTH = deviceWidth * 0.9;

const maxWidth = PICKER_WIDTH

const sliderSize = {height: 20, width: PICKER_WIDTH,}

const interval_slider = [0, maxWidth]
const interval_h = [0, 360]
const interval_sl = [0, 100]

const statusBarValues = ['auto','inverted','light','dark']

const ShemePicker = ({
  visible,
  initialValue,
  onShemeChanged,

  ThemeColorsAppIndex,
  ThemeSchema,
  LanguageAppIndex,
  appStyle,
  appConfig,
}) => {
  const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
  const Language = languagesAppList[LanguageAppIndex]

    const logg = (t)=>{
      console.log(t)
    }
    const show = useSharedValue(-1);

    useEffect(()=>{
      if(visible && show.value == -1){show.value = 0}
      if(!visible && show.value == 0){show.value = -1}
    },[visible])

    const areaSliders = useAnimatedStyle(()=>{
      const duration = 500
      return (
        {
          transform: [
            {translateY: withTiming( interpolate(show.value, [-1, 0], [deviceHeight/4, 0]), {duration: duration}  )}
          ]
        }
      )
    })
    
    const getGroup = (type) => {
      let group = []
      for (let i of statusBarValues){
          let check = false
          if(type === i){check = true}
          group.push(check)
      }
      return group
    };

    const [checkGroup, setCheckGroup] = useState(getGroup(initialValue));

    useEffect(()=>{
      setCheckGroup(getGroup(initialValue))
    },[initialValue])

    const statusBarStyleSetting = (newStyle, index)=>{
      setCheckGroup(getGroup(newStyle));
      onShemeChanged(newStyle)
    }

    return (
    <Animated.View
        style ={[{
            position: 'absolute',
            bottom: 0,
            height: deviceHeight/4,
            width: deviceWidth,
            justifyContent: 'center',
            paddingHorizontal: CIRCLE_PICKER_SIZE/2,
            backgroundColor: 'transparent',
            borderRadius: appStyle.borderRadius.additional,
            //justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white'
        }, areaSliders]}
    >
        <View 
            style = {[{marginLeft: 20, width: '60%'}]}
        >
            {statusBarValues.map((item, index)=>{
                return(
                    <BaseBox
                        key = {item+index}
                        style = {{
                            borderRadius: appStyle.borderRadius.additional,
                            backgroundColor: 'transparent'
                        }}
                        android_ripple={{
                            color: Theme.icons.accents.primary,
                            borderless: true,
                            foreground: false
                        }}
                        Item = {<Text style = {[staticStyles.listText, {color: Theme.texts.neutrals.secondary}]}>{item}</Text>}
                        Check = {checkGroup[index]}
                        onPress = {()=>{statusBarStyleSetting(item, index)}}
                        BoxBorderRadius = {appStyle.borderRadius.additional}
                        ColorsChange = {{true: Theme.icons.accents.primary, false: Theme.icons.accents.quaternary}}
                    />
                )
            })}
        </View>
    </Animated.View>
    );
};

const CIRCLE_PICKER_SIZE = 30;
const INTERNAL_PICKER_SIZE = CIRCLE_PICKER_SIZE  ;

const staticStyles = StyleSheet.create({
  listText: {
    marginLeft: 5,
    fontSize: 14, 
    fontWeight: '400', 
    letterSpacing: 0.5
  },
  picker: {
    position: 'absolute',
    marginLeft: -CIRCLE_PICKER_SIZE/2,
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
  gradient: { height: sliderSize.height, width: sliderSize.width, borderRadius: sliderSize.height/2 },
});

export default ShemePicker;