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
  FadeOut,
} from 'react-native-reanimated';

const RCanvas = Reanimated.createAnimatedComponent(Canvas)

function SkiaViewDisign(props) {
    const {
      aBorderRadius,
      aBGColor,
      fullShadowMargin,// = {l: 10, r: 10, t: 10, b: 10}
      aSize,

      aShadowColors,
      aShadowStyle,


      borderRadius = 16,
      backgroundColor = 'white',
      shadowMargin = {horizontal: 10, vertical: 10},
      initSize = { width: 0, height: 0 },

      shadowColors = {
        primary: '#000000',
        secondary: '#ffffff',
      },
      shadowStyle = {
          inner: {
              use: false,
              opacity: 0
          },
          countColors: 1,
          blur: 0.42,
          opacity: 0.19,
          pos: {
              x1:0,
              y1:0.33,
              x2:0, 
              y2:0
          }
      }, 
     
      
       
      adaptiveSizeForStyle = false,
      innerShadow = {
        used: false,
        borderWidth: 5,
      },
      isGeneralObject = false,
      timing = true
    } = props//useValue(props).current


    const {
      inner: {
        use: innerUse, // true, false
        opacity: innerOpacity
      },
      countColors, // 0,1,2
      opacity, //0-1
      blur, // coef
      pos: {
        x1, // coef 
        y1, // coef

        x2, // coef 
        y2, // coef
      }
    } = aShadowStyle ?? {
      inner: {
        use: useSharedValue(shadowStyle.inner.use),
        opacity: useSharedValue(shadowStyle.inner.opacity)
      },
      countColors: useSharedValue(shadowStyle.countColors), // 0,1,2
      opacity: useSharedValue(shadowStyle.opacity), //0-1
      blur: useSharedValue(shadowStyle.blur), // coef
      pos: {
        x1: useSharedValue(shadowStyle.pos.x1), // coef 
        y1: useSharedValue(shadowStyle.pos.y1), // coef

        x2: useSharedValue(shadowStyle.pos.x2), // coef 
        y2: useSharedValue(shadowStyle.pos.y2), // coef
      }
    }

    const {
      primary,
      secondary,
    } = aShadowColors ?? {
      primary: useSharedValue(shadowColors.primary),
      secondary: useSharedValue(shadowColors.secondary),
    }


    


    const margin = useDerivedValue(()=>{
      //console.log("skia margin")
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

    const hexOpacity = (value) => {
      "worklet";
      return ((value*255) | 1<<8).toString(16).slice(1)
    }
    const getColor = (hex, opacity) => {
      "worklet";
      return `${hex}${hexOpacity(opacity)}`
    }

    useDerivedValue(()=>{
      sh_x.value = minMargin.value * x1.value
      sh_y.value = minMargin.value * y1.value

      sh2_x.value = minMargin.value * x2.value
      sh2_y.value = minMargin.value * y2.value

      sh_blur.value = minMargin.value * blur.value

      const dOpacity = opacity.value
      const dInnerOpacity = innerOpacity.value

      if(!innerUse.value){
        sh2_cp.value = TRANSPARENT
        sh2_cs.value = TRANSPARENT
      }

      if(countColors.value === 0){
        sh_cp.value = TRANSPARENT
        sh_cs.value = TRANSPARENT

      } else if(countColors.value === 1){
        sh_cp.value = getColor(primary.value, dOpacity)
        sh_cs.value = TRANSPARENT

        if(innerUse.value){
          sh2_cp.value = getColor(primary.value, dInnerOpacity)
          sh2_cs.value = TRANSPARENT
        }
        
      } else if(countColors.value === 2) {
        sh_cp.value = getColor(primary.value, dOpacity)
        sh_cs.value = getColor(secondary.value, dOpacity)
        
        if(innerUse.value){
          sh2_cp.value = getColor(primary.value, dInnerOpacity)
          sh2_cs.value = getColor(secondary.value, dInnerOpacity)
        }
      }
    })
  

    /**
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
        let defaultBlur = minMargin.value /2.4
        let defaultOpacity = '30'

        if(currentStyleShadows == 'neomorphism'){
          defaultBlur = minMargin.value /3.2
          defaultOpacity = '50'
          
          sh_x.value = minMargin.value /2.6
          sh_y.value = minMargin.value /2.6

          const innerOpacity = '0c'

          sh2_x.value = -minMargin.value /2.6
          sh2_y.value = -minMargin.value /2.6

          sh_cs.value = `${(aShadows && aShadows.value)? aShadows.value.colors.secondary : shadowColors.secondary}${defaultOpacity}`
          sh2_cp.value = `${(aShadows && aShadows.value)? aShadows.value.colors.primary : shadowColors.primary}${innerOpacity}`
          sh2_cs.value = `${(aShadows && aShadows.value)? aShadows.value.colors.secondary : shadowColors.secondary}${innerOpacity}`

        } else {
          sh2_x.value = 0
          sh2_y.value = 0

          sh_cs.value = TRANSPARENT
          sh2_cp.value = TRANSPARENT
          sh2_cs.value = TRANSPARENT

          if(currentStyleShadows == 'material' || (isGeneralObject && shadowStyle == 'materialSome')){
            sh_x.value = 0
            sh_y.value = minMargin.value /3

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

    */
    const sizeCanvas = (aSize && aSize.value != undefined)? aSize : useDerivedValue(()=>initSize) 

    const canvasStyle=useAnimatedStyle(()=>{
      //console.log('canva')
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
    const rg_r = (aBorderRadius && aBorderRadius?.value != undefined)? aBorderRadius : useDerivedValue(()=>borderRadius) //
    const rg_color = (aBGColor && aBGColor.value)? aBGColor : useDerivedValue(()=>backgroundColor) //convertToRGBA()

    

    const add_rg_x = useDerivedValue(()=>innerShadow.borderWidth+margin.value.l )
    const add_rg_y = useDerivedValue(()=>innerShadow.borderWidth+margin.value.t )
    const add_rg_h = useDerivedValue(()=>rg_height.value - 2*innerShadow.borderWidth)
    const add_rg_w = useDerivedValue(()=>rg_width.value - 2*innerShadow.borderWidth)
    const add_rg_r = useDerivedValue(()=> ((aBorderRadius && aBorderRadius.value != undefined  ) ? aBorderRadius.value : borderRadius) -innerShadow.borderWidth) //
    
    return (
      <RCanvas
        //onSize={size}
        //mode={'continuous'}
        style={[canvasStyle, {
          position: 'absolute', 
          //backgroundColor: 'red',
        }]}
        {...timing? {layout: Layout} : {}}
        //layout={Layout}
        /*
        
        */
       //exiting={FadeOut}
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
            <Shadow dx={sh_x}  dy={sh_y}  blur={sh_blur} color={sh2_cp}  inner />
            <Shadow dx={sh2_x} dy={sh2_y} blur={sh_blur} color={sh2_cs} inner />
          </RoundedRect>}
        </Group>
      </RCanvas>
    )
}



export default SkiaViewDisign