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


const Neumorphism = (props) => {
  const {
    borderRadius = 16,
    backgroundColor = 'lightblue',
    shadowStyle = 'neomorphism' //'material'
  } = props

  const PADDING = 10;

  const size = useValue({ width: 0, height: 0 });

  const rct = useComputedValue(() => {
    //console.log('s?', size.current)
    return rrect(rect(PADDING, PADDING, (size.current.width - 2*PADDING), (size.current.height - 2*PADDING)), borderRadius, borderRadius);
  }, [size]);

  return (
    <Canvas
      onSize={size}
      style={{height: '100%', width: '100%', position: 'absolute'}} 
    >
      <RoundedRect 
        rect={rct}
        color={backgroundColor}
      >
        {shadowStyle == 'neomorphism' && <Shadow dx={PADDING/2.6} dy={PADDING/2.6} blur={PADDING/3.5} color="#00000020" />}
        {shadowStyle == 'neomorphism' && <Shadow dx={-PADDING/2.6} dy={-PADDING/2.6} blur={PADDING/3.5} color="#ffffff35" />}
        {shadowStyle == 'material' && <Shadow dx={0} dy={PADDING/2.6} blur={PADDING/3.5} color="#00000020" />}
      </RoundedRect>
    </Canvas>
  )
}

export default Notes = () => {
  //<Neumorphism />
  return (
    <View style = {{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightblue'}}>
      
     
      <View style={{height: 100, width: 200, backgroundColor: 'red'}}>
        <Neumorphism />
        <Text>
          this my view 1
        </Text>
      </View>
        
      <View style={{height: 100, width: 200, justifyContent: 'center', alignItems: 'center',}}>
        <Neumorphism shadowStyle='material'/>
        <Text>
          this my view 2
        </Text>
      </View>

      <View style={{height: 100, width: 200, justifyContent: 'center', alignItems: 'center',}}>
        <Neumorphism shadowStyle='none'/>
        <Text>
          this my view 3
        </Text>
      </View>
      
    </View>
  );
    
}
//  
