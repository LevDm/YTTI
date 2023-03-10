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


function SkiaViewDisign(props) {
    const {
      borderRadius = 16,
      backgroundColor = 'white',
      shadowColors = {
        primary: '#000000',
        secondary: '#ffffff',
      },
      shadowStyle = 'material',//'neomorphism', 
      shadowMargin = {horizontal: 10, vertical: 10},
      adaptiveSizeForStyle = true,
      innerShadow = {
        show: false,
        borderWidth: 5,
      },
      isGeneralObject = false
    } = props//useValue(props).current

    const shadowBlur = Math.max(shadowMargin.horizontal, shadowMargin.vertical)/3.5
    //console.log('shadowBlur ', shadowBlur )
  
    const size = useValue({ width: 0, height: 0 });
  
    const generalRect = useComputedValue(() => {
      //console.log('s?', size.current)
      return rrect(rect(
        shadowMargin.horizontal, 
        adaptiveSizeForStyle && shadowStyle == 'material'? 0 : shadowMargin.vertical, 
        (size.current.width - 2*shadowMargin.horizontal), 
        (size.current.height - (adaptiveSizeForStyle && shadowStyle == 'material'? 1 : 2)*shadowMargin.vertical)), 
        borderRadius, 
        borderRadius
      )
    }, [size, borderRadius, backgroundColor, shadowMargin, shadowStyle]);

    const additionalRect = useComputedValue(() => {
        //console.log('s?', size.current)
        return rrect(rect(
            innerShadow.borderWidth+shadowMargin.horizontal, 
            innerShadow.borderWidth+shadowMargin.vertical, 
            (size.current.width - 2*shadowMargin.horizontal) - 2*innerShadow.borderWidth, 
            (size.current.height - 2*shadowMargin.vertical) - 2*innerShadow.borderWidth
          ), 
          borderRadius-innerShadow.borderWidth, 
          borderRadius-innerShadow.borderWidth
        )
      }, [size, borderRadius, backgroundColor, shadowMargin, shadowStyle, innerShadow]);
  
    return (
        <Canvas
          onSize={size}
          mode={'default'}
          style={{height: '100%', width: '100%', position: 'absolute', backgroundColor: 'transparent'}} 
        >
        <Group>
          <RoundedRect 
            rect={generalRect}
            color={backgroundColor}
          >
            {shadowStyle == 'neomorphism' && <Shadow dx={shadowMargin.horizontal/2.6} dy={shadowMargin.vertical/2.6} blur={shadowBlur} color={`${shadowColors.primary}30`} />}
            {shadowStyle == 'neomorphism' && <Shadow dx={-shadowMargin.horizontal/2.6} dy={-shadowMargin.vertical/2.6} blur={shadowBlur} color={`${shadowColors.secondary}30`}/>}
            {(shadowStyle == 'material' || (isGeneralObject && shadowStyle == 'materialSome')) && <Shadow dx={0} dy={shadowMargin.vertical/2.6} blur={shadowBlur} color={`${shadowColors.primary}30`}/>}
            {shadowStyle == 'full' && <Shadow dx={0} dy={0} blur={shadowBlur} color={`${shadowColors.primary}30`}/>}    
          </RoundedRect>
          {shadowStyle == 'neomorphism' && innerShadow.used && 
          <RoundedRect 
            rect={additionalRect}
            color={backgroundColor}
          >
            <Shadow dx={shadowMargin.horizontal/2.6} dy={shadowMargin.vertical/2.6} blur={shadowBlur} color={`${shadowColors.primary}10`} inner />
            <Shadow dx={-shadowMargin.horizontal/2.6} dy={-shadowMargin.vertical/2.6} blur={shadowBlur} color={`${shadowColors.secondary}10`} inner />
          </RoundedRect>}
        </Group>
        </Canvas>
    )
}

export default SkiaViewDisign