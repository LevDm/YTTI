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

const PICKER_AREA_HEIGHT = 270
const ShemePicker = ({
  show,
  initialValue,
  onShemeChanged,

  LanguageAppIndex,
}) => {
  const Language = languagesAppList[LanguageAppIndex].SettingsScreen.PainterScreen.fullMod

  const areaSliders = useAnimatedStyle(()=>{
    const duration = 500
    return (
      {
        transform: [
          {translateY: withTiming( interpolate(show.value, [-1, 0], [PICKER_AREA_HEIGHT, 0]), {duration: duration}  )}
        ]
      }
    )
  })

  const statusBarStyleSetting = (index)=>{
    const newStyle = statusBarValues[index]
    //setCheckGroup(getGroup(newStyle));
    onShemeChanged(newStyle)
  }

  return (
    <Animated.View
      style ={[{
          position: 'absolute',
          bottom: 0,
          height: PICKER_AREA_HEIGHT,
          width: deviceWidth,
          justifyContent: 'center',
          paddingHorizontal: CIRCLE_PICKER_SIZE/2,
          backgroundColor: 'transparent',
          borderRadius: 30,
          //justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white'
      }, areaSliders]}
    >
      <BoxsField
        //  'one'>true || 'multiple'>false
        isChoiceOne={true}
        title = {Language.statusBarStyle}
        //  'one'>index || 'multiple'>[indexs]
        primaryValue = {statusBarValues.indexOf(initialValue)} 
        groupSize = {statusBarValues.length}
        onPress = {(activeIndex)=>{statusBarStyleSetting(activeIndex)}}
        groupItems = {Object.values(Language.barStyles)}
      />
    </Animated.View>
  )
}

const BoxsField = ({
  isChoiceOne, //  'one'>true || 'multiple'>false
  title,

  primaryValue, //  'one'>index || 'multiple'>[indexs]
  groupSize,

  //groupValues,
  groupItems,
  Item: renderItem = false,
  onPress,
  
  }, props) => {


  const getGroup = (activeIndex) => {
      const newGroup = new Array(groupSize);
      for (let i = 0; i < newGroup.length; i++){newGroup[i] = (isChoiceOne? i == activeIndex : activeIndex.includes(i))}
      return newGroup
  }

  const reGroup = (activateIndex, group) => {
      const newGroup = [...group]
      newGroup[activateIndex] = !group[activateIndex]
      return newGroup
  }
  
  const toIndexs = (group) => {
      return group.map((item, index)=> item? index : -1).filter(item => item >= 0);
  }

  const [checkGroup, setCheckGroup] = useState(getGroup(primaryValue));

  const checkBoxPress = (index) => {
      const newGroup = isChoiceOne? getGroup(index) : reGroup(index, checkGroup)
      onPress(isChoiceOne? index : toIndexs(newGroup))
      setCheckGroup(newGroup);
  }

  const ripple = (color) => ({
    color: `${color}20`,
    borderless: true,
    foreground: false
  })

  const brad = 15

  return (
      <View
          props={props}

      >
          {title && <Text style = {[staticStyles.text, {color: '#000000', paddingLeft: 10}]}>
              {title}
          </Text>}
          <View 
              style = {[{
                  //marginTop: 2,
                  marginLeft: 30,
                  width: '85%'
              }]}
          >
              {groupItems.map((item, index)=>(
              <BaseBox
                  isCheckBox={!isChoiceOne}
                  key = {'boxs_field_'+Math.random()}
                  style = {{
                      marginTop: index? 2 : 0,
                      borderRadius: brad,
                      backgroundColor: 'transparent'
                  }}
                  android_ripple={ripple('#000000')}
                  Item = {!renderItem? <Text style = {[staticStyles.listText, {color: '#000000'}]}>{groupItems[index]}</Text> : renderItem(checkGroup[index], index)}
                  check = {checkGroup[index]}
                  onPress = {()=>{checkBoxPress(index)}}
                  boxBorderRadius = {brad}
                  colorsChange = {{true: '#000000', false: '#444444'}}
              />
              ))}
          </View>
      </View>
  )
}


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
  listText: {
    //paddingLeft: 10,
    marginLeft: 5,
    fontSize: 14, 
    //fontVariant: ['small-caps'], 
    fontWeight: '400', 
    letterSpacing: 0.5
  },
  text: {
    marginLeft: 10,
    fontSize: 16, 
    //fontVariant: ['small-caps'], 
    fontWeight: '400', 
    letterSpacing: 0.5
},
});

export default ShemePicker;