import React, {useState, useEffect, useRef, useMemo, useCallback} from "react";

import {
  Text,
  Vibration,
  Pressable, 
  View,
  Dimensions, 
  FlatList, 
  StyleSheet,
  useWindowDimensions
} from 'react-native';

import {
  GestureDetector,
  Gesture
} from 'react-native-gesture-handler';

import Reanimated, {
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
  event,
  Extrapolation,
} from 'react-native-reanimated';

import { LinearGradient } from "expo-linear-gradient";


export default function TapticalPicker(props){

    const items = ['1','2','3','4','5','6','7', '8', '9','10', '11', '12', '13', '14','15']
  
    const defaultRender = ({item, index}) => (
      <Text 
        style={{
          flex :1,
          textAlign: 'center', 
          color: textColor ,
          fontSize: fontSize,
          fontWeight: 'bold',
        }}
      >
        {item}
      </Text>
    )
  
    const {
      data = items,
      renderItem = defaultRender,
      backgroundColor = 'black',
      textColor = 'white',
      fontSize = 25,
      separatorColor = 'white',
      primaryIndex = 1,
      //pickerParams,
      setValue 
    } = props
  
    //const PICKER_WIDTH = 100
    //const SCALE = 1.1
    //const ROTATION = 90 
    //const SEPARATOR_HEIGHT = 28
    //const SEPARATOR_TOP = 5
    //const MARGIN = 0
  
    const DEFAULT_PICKER_PARAMS = {
      width:  100,
      itemWidth: 100,
  
      anim_scale_inp:  [0, 0.97, 1], 
      anim_scale_out:  [1, 1, 1.2],
      anim_rotation_inp:  [.8, .95, 0.97, 1], 
      anim_rotation_out:  [50, 40, 30, 0],
      
      itemsMargin: 0,
      opacityLimit: 0.5,
  
      separatorHeight: 28,
      separatorWidth: '50%',
      separatorMarginTop:  2,
  
      transitionBoost: 1,
  
      inDisplay: 7,
      itemHeight: 35
    }
  
    const {
      width: PICKER_WIDTH,
      itemWidth: ITEM_WIDTH,
  
      anim_scale_inp:  SCALE_INP,
      anim_scale_out:  SCALE_OUT,
      anim_rotation_inp:  ROTATION_INP,
      anim_rotation_out:  ROTATION_OUT,
  
      itemsMargin: MARGIN,
      opacityLimit: OPACITY_LIM,
  
      separatorHeight: SEPARATOR_HEIGHT,
      separatorWidth: SEPARATOR_WIDTH,
      separatorMarginTop: SEPARATOR_TOP,
  
      inDisplay: IN_DISPLAY,
      itemHeight: ITEM_HEIGHT,
  
      transitionBoost: VELOCITY
  
    } = Object.assign(DEFAULT_PICKER_PARAMS, props.pickerParams)
  
    const ITEMS_COUNT = data.length
    
    const DISPLAY_HEIGHT = IN_DISPLAY * ITEM_HEIGHT
    const CONTENT_HEIGHT = ITEM_HEIGHT * (ITEMS_COUNT)
    const ONE_PART = (2*Math.PI)/ ITEMS_COUNT
  
    //const VELOCITY = Math.max( Math.floor(ITEMS_COUNT/IN_DISPLAY - 1), 0)
  
    const ALPHA_OFFSET = useSharedValue(0);
    const LIST_TRANSITION = useSharedValue(0);
    const DYNAMIC_INDEX = useSharedValue(primaryIndex);
  
    const settingValue = (index) => {
      console.log('set', index)
      setValue? setValue({index: index, item: data[index]}) : null
    }
  
    const gesture = useMemo(() => Gesture.Pan()
      .maxPointers(1)
      .onUpdate((event)=>{
        const transitionY = VELOCITY*event.translationY
        const beta = Math.acos(1-((transitionY**2)/(2*(CONTENT_HEIGHT**2))))
        const t_sign = transitionY > 0? 1 : -1
        const currentAlpha = ALPHA_OFFSET.value + (t_sign*beta)
  
        const period = Math.abs(currentAlpha) > (2*Math.PI)? (2*Math.PI) : 0
        const sign = currentAlpha > 0? -1 : 1
        const res = currentAlpha + (sign*period)
  
        const countIndex = Math.floor( res/ONE_PART )
        const balanceIndex = countIndex>0? (ITEMS_COUNT-countIndex) : Math.abs(countIndex)
        const index = balanceIndex+1>ITEMS_COUNT? balanceIndex-ITEMS_COUNT : balanceIndex
        const endIndex = index>=primaryIndex? index-primaryIndex : index+primaryIndex
        
        if( DYNAMIC_INDEX.value != endIndex){
          //console.log('v')
          runOnJS(Vibration.vibrate)([0,1])
          DYNAMIC_INDEX.value = endIndex
        }
        LIST_TRANSITION.value = res
      })
      .onEnd((event) => {
        const transitionY = VELOCITY*event.translationY
        const beta = Math.acos(1-((transitionY**2)/(2*(CONTENT_HEIGHT**2))))
        const t_sign = transitionY > 0? 1 : -1
        const newAlphaOffset = ALPHA_OFFSET.value + (t_sign*beta)
  
        const period = Math.abs(newAlphaOffset) > (2*Math.PI)? (2*Math.PI) : 0
        const sign = newAlphaOffset > 0? -1 : 1
        const angle = newAlphaOffset + (sign*period)
  
        const add = (Math.abs(LIST_TRANSITION.value)) % ONE_PART
        const to = add >= (ONE_PART/2) ? (ONE_PART-add) : (-add)
  
        const offset_sign = angle > 0? 1 : -1
        const new_offset = (Math.abs(angle) + to)*offset_sign
        const transition_sign = LIST_TRANSITION.value > 0? 1 : -1
        const new_transition = (Math.abs(LIST_TRANSITION.value) + to)*transition_sign
  
        //console.log('end',ONE_PART, angle, to, new_offset, new_transition)
        const countIndex = Math.floor( new_offset/ONE_PART )
        const balanceIndex = countIndex>0? (ITEMS_COUNT-countIndex) : Math.abs(countIndex)
        const index = balanceIndex+1>ITEMS_COUNT? balanceIndex-ITEMS_COUNT : balanceIndex
        const endIndex = index>=primaryIndex? index-primaryIndex : index+primaryIndex
  
        //console.log(new_offset, new_transition, endIndex)
  
        ALPHA_OFFSET.value = new_offset
        LIST_TRANSITION.value = withTiming(new_transition, {duration: 300}) 
        DYNAMIC_INDEX.value = endIndex
        runOnJS(settingValue)(endIndex)
      })
    )
  
    const Item = (props) => {
      const {
        not_key,
        transition,
        children,
        indent,
      } = props
  
      const a_style = useAnimatedStyle(()=>{
        const current = transition.value + indent //+ (2*Math.PI)
        const animState = Math.cos(current)
        const translateY = ((DISPLAY_HEIGHT-ITEM_HEIGHT+MARGIN)/2) *  Math.sin(current) 
        //console.log(not_key,animState)
        return {
          transform: [
            {translateY: translateY},
            {scale: interpolate(animState, SCALE_INP, SCALE_OUT)},
            {rotateX: `${interpolate(animState, ROTATION_INP, ROTATION_OUT)}deg`},
          ],
          opacity: 1*( animState<OPACITY_LIM? 0 : animState)
        }
      })
  
      return (
        <Reanimated.View
          key={not_key}
          style={[a_style,{position: 'absolute', height: ITEM_HEIGHT, width: ITEM_WIDTH, }]}
        >
          {children}
        </Reanimated.View>
      )
    }
  
    return(
      <View style={{ height: DISPLAY_HEIGHT, width: PICKER_WIDTH, }}>
      <GestureDetector gesture={gesture} >
      <Reanimated.View
        style={{
          height: DISPLAY_HEIGHT,
          width: PICKER_WIDTH,
          backgroundColor: backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {data.map((item, index)=><Item 
          key = {item+'_'+index}
          not_key = {item+'_'+index}
          transition={LIST_TRANSITION} 
          //(2*Math.PI)/ITEMS_COUNT
          indent={ONE_PART*(index-primaryIndex)}
        >{renderItem({item: item, index: index})}</Item>)}
  
        <View
          style={{
            position: 'absolute',
            top: ((DISPLAY_HEIGHT-SEPARATOR_HEIGHT)/2)+SEPARATOR_TOP,
            height: SEPARATOR_HEIGHT,
            width: SEPARATOR_WIDTH,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: separatorColor
          }}
        />
        <LinearGradient 
          style={{
            position: 'absolute',
            height: DISPLAY_HEIGHT,
            width: PICKER_WIDTH,
          }}
          locations={[.08,.5, .92]}//
          colors={[backgroundColor, 'transparent', backgroundColor]}
        />
      </Reanimated.View>
      </GestureDetector>
      </View>
    )
  }