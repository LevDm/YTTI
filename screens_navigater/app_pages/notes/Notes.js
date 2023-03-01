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


const Neumorphism = () => {
  
  const FULL_SIZE = 256
  const PADDING = 10;
  const SIZE = FULL_SIZE - 2*PADDING;
  const R = 16;
  //<Fill color="lightblue" />width={'100%'} height={SIZE}      
  const size = useValue({ width: FULL_SIZE, height: FULL_SIZE });
  const rct = useComputedValue(() => {
    //console.log('s?', size.current)
    return rrect(rect(PADDING, PADDING, (size.current.width - 2*PADDING), (size.current.height - 2*PADDING)), R, R);
  }, [size]);
  return (
    <Canvas
      onSize={size}
      //onLayout={(event)=>{
      //  console.log(event.nativeEvent.layout)
      //}}
      style={{height: '100%', width: '100%', position: 'absolute'}} 
    >
      <RoundedRect 
        rect={rct}
        color="lightblue"
      >
        <Shadow dx={PADDING/2.6} dy={PADDING/2.6} blur={PADDING/3.5} color="#00000020" />
        <Shadow dx={-PADDING/2.6} dy={-PADDING/2.6} blur={PADDING/3.5} color="#ffffff35" />
      </RoundedRect>
    </Canvas>
  );
};

export default Notes = () => {
  //<Neumorphism />
  return (
    <View style = {{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightblue'}}>
      
     
      <View style={{height: 100, width: 200, justifyContent: 'center', alignItems: 'center',}}>
        <Neumorphism />
        <Text>
          this my view
        </Text>
      </View>
        

      
    </View>
  );
    
}
//  
