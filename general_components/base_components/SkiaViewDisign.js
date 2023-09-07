import React, {useState, useEffect, useRef, useMemo} from "react";

import {
  Text,
  Pressable, 
  View,
  Dimensions, 
  FlatList, 
  StyleSheet,
  useWindowDimensions
} from 'react-native';

import {
  useValue,
  useComputedValue,
  Shadow,
  Canvas,
  rect, 
  rrect,
  Fill,
  Group,
  Paint,
  RoundedRect,
} from "@shopify/react-native-skia";

import Reanimated, {
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withDelay,
  withSequence, 
  useAnimatedScrollHandler,
  useAnimatedProps, 
  cancelAnimation,
  useAnimatedRef,
  useDerivedValue,
  scrollTo,
  runOnJS,
  interpolateColor,
  interpolate,
  Extrapolate,
  runOnUI,
  Easing,
  Extrapolation,
  convertToRGBA,
  Layout,
  SequencedTransition,
  CurvedTransition,
  FadingTransition,
} from 'react-native-reanimated';

const RCanvas = Reanimated.createAnimatedComponent(Canvas)

function SkiaViewDisign(props) {
    const {
      aBorderRadius,
      aBGColor,
      fullShadowMargin,// = {l: 10, r: 10, t: 10, b: 10}
      aSize,
      aShadows,

      borderRadius = 16,
      backgroundColor = 'white',
      shadowMargin = {horizontal: 10, vertical: 10},
      initSize = { width: 0, height: 0 },

      shadowColors = {
        primary: '#000000',
        secondary: '#ffffff',
      },
      shadowStyle = 'material',//'neomorphism', 
      
       
      adaptiveSizeForStyle = false,
      innerShadow = {
        show: false,
        borderWidth: 5,
      },
      isGeneralObject = false,
      timing = true
    } = props//useValue(props).current

    const margin = useDerivedValue(()=>{
      const sm = {l: shadowMargin.horizontal, r: shadowMargin.horizontal, t: shadowMargin.vertical, b: shadowMargin.vertical}
      return (fullShadowMargin && fullShadowMargin.value)? fullShadowMargin.value : sm
    })
    
    const minMargin = useDerivedValue(()=>Math.min(...Object.values(margin.value)))

    const TRANSPARENT = '#ffffff00'

    const sh_x = useSharedValue(0)
    const sh_y = useSharedValue(0)
    const sh_cp = useSharedValue(TRANSPARENT)
    const sh_cs = useSharedValue(TRANSPARENT) 
    const sh_blur = useSharedValue(0)

    const sh2_x = useSharedValue(0)
    const sh2_y = useSharedValue(0)
    const sh2_cp = useSharedValue(TRANSPARENT)
    const sh2_cs = useSharedValue(TRANSPARENT)

    useDerivedValue(()=>{
      //console.log('skia upd')
      const currentStyleShadows = (aShadows && aShadows.value)? aShadows.value.style : shadowStyle
      //'neomorphism' 'material' "square" "full" "none"
      if(currentStyleShadows == 'none'){
        sh_cp.value = TRANSPARENT
        sh_cs.value = TRANSPARENT
        sh2_cp.value = TRANSPARENT
        sh2_cs.value = TRANSPARENT

      } else {
        let defaultBlur = minMargin.value /2
        let defaultOpacity = '30'

        if(currentStyleShadows == 'neomorphism'){
          sh_x.value = minMargin.value /2.6
          sh_y.value = minMargin.value /2.6

          sh2_x.value = -minMargin.value /2.6
          sh2_y.value = -minMargin.value /2.6

          sh_cs.value = `${(aShadows && aShadows.value)? aShadows.value.colors.secondary : shadowColors.secondary}30`
          sh2_cp.value = `${(aShadows && aShadows.value)? aShadows.value.colors.primary : shadowColors.primary}10`
          sh2_cs.value = `${(aShadows && aShadows.value)? aShadows.value.colors.secondary : shadowColors.secondary}10`

        } else {
          sh2_x.value = 0
          sh2_y.value = 0

          sh_cs.value = TRANSPARENT
          sh2_cp.value = TRANSPARENT
          sh2_cs.value = TRANSPARENT

          if(currentStyleShadows == 'material' || (isGeneralObject && shadowStyle == 'materialSome')){
            sh_x.value = 0
            sh_y.value = minMargin.value /3.5

          }
          if(currentStyleShadows == "full"){
            sh_x.value = 0
            sh_y.value = 0

          }
          if(currentStyleShadows == "square"){
            sh_x.value = minMargin.value /1.4
            sh_y.value = minMargin.value /1.4
            defaultBlur = 0.75
            defaultOpacity = '8a'
          }
        }

        sh_cp.value = `${(aShadows && aShadows.value)? aShadows.value.colors.primary : shadowColors.primary}${defaultOpacity}`
        sh_blur.value = defaultBlur
      }
    })


    const sizeCanvas = useDerivedValue(()=> (aSize && aSize.value)? aSize.value : initSize) 

    const canvasStyle=useAnimatedStyle(()=>{
      //console.log('canva', sizeCanvas.value)
      return {
        ...sizeCanvas.value,
        //height: sizeCanvas.value.height*2,
        //width: sizeCanvas.value.width*2,
      }
    })

    const rg_height = useDerivedValue(()=>{
      const h = Math.max((sizeCanvas.value.height - (margin.value.t + margin.value.b)), 0)
      return timing? withTiming(h) : h
    })
    const rg_width  = useDerivedValue(()=>{
      const w = Math.max((sizeCanvas.value.width -  (margin.value.l + margin.value.r)), 0)
      return timing? withTiming(w) : w
    })
    
    const rg_x = useDerivedValue(()=>margin.value.l )
    const rg_y = useDerivedValue(()=>adaptiveSizeForStyle && shadowStyle == 'material'? 0 : margin.value.t)
    const rg_r = useDerivedValue(()=> (aBorderRadius && aBorderRadius.value != undefined ) ? aBorderRadius.value : borderRadius) //
    const rg_color = useDerivedValue(()=>convertToRGBA((aBGColor && aBGColor.value)? aBGColor.value : backgroundColor))

    

    const add_rg_x = useDerivedValue(()=>innerShadow.borderWidth+margin.value.l )
    const add_rg_y = useDerivedValue(()=>innerShadow.borderWidth+margin.value.t )
    const add_rg_h = useDerivedValue(()=>rg_height.value - 2*innerShadow.borderWidth)
    const add_rg_w = useDerivedValue(()=>rg_width.value - 2*innerShadow.borderWidth)
    const add_rg_r = useDerivedValue(()=> ((aBorderRadius && aBorderRadius.value != undefined  ) ? aBorderRadius.value : borderRadius) -innerShadow.borderWidth) //
    
    return (
      <RCanvas
        //onSize={size}
        style={[canvasStyle, {
          position: 'absolute', 
          //backgroundColor: 'red',
        }]}
        {...timing? {layout: Layout} : {}}
        //layout={Layout}
      >
        <Group>
          <RoundedRect 
            color={rg_color}
            x={rg_x}
            y={rg_y}
            width={rg_width}
            height={rg_height}
            r={rg_r}
          >
            <Shadow dx={sh_x} dy={sh_y} blur={sh_blur} color={sh_cp} />
            <Shadow dx={sh2_x} dy={sh2_y} blur={sh_blur} color={sh_cs}/>
          </RoundedRect>
          {innerShadow.used && 
          <RoundedRect 
            color={rg_color}
            x={add_rg_x}
            y={add_rg_y}
            width={add_rg_w}
            height={add_rg_h}
            r={add_rg_r}
          >
            <Shadow dx={sh2_x} dy={sh2_y} blur={sh_blur} color={sh2_cp} inner />
            <Shadow dx={sh2_x} dy={sh2_y} blur={sh_blur} color={sh2_cs} inner />
          </RoundedRect>}
        </Group>
      </RCanvas>
    )
}



export default SkiaViewDisign

/*
        <Group>
          <RoundedRect 
            color={rg_color}
            x={rg_x}
            y={40} //rg_y
            width={rg_width}
            height={rg_height}
            r={rg_r}
          >
            <Shadow dx={sh_x} dy={sh_y} blur={sh_blur} color={sh_cp} />
            <Shadow dx={sh2_x} dy={sh2_y} blur={sh_blur} color={sh_cs}/>
          </RoundedRect>
          {innerShadow.used && 
          <RoundedRect 
            color={rg_color}
            x={add_rg_x}
            y={add_rg_y}
            width={add_rg_w}
            height={add_rg_h}
            r={add_rg_r}
          >
            <Shadow dx={sh2_x} dy={sh2_y} blur={sh_blur} color={sh2_cp} inner />
            <Shadow dx={sh2_x} dy={sh2_y} blur={sh_blur} color={sh2_cs} inner />
          </RoundedRect>}
        </Group>
*/