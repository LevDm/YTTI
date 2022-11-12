import React, {useState, useEffect, useRef, useMemo} from "react";

import {
    //Text, 
    Pressable, 
    Animated, 
    View,
    Button, 
    Platform, 
    Image, 
    Dimensions, 
    FlatList, 
    SafeAreaView, 
    TouchableOpacity, 
    StyleSheet
} from 'react-native';

import {
  BackdropBlur,
  Canvas,
  rect,
  Fill,
  rrect,
  vec,
  useValue,
  useTouchHandler,
  Rect,
  LinearGradient,
  Paint,
  Text,
  useComputedValue,
  runDecay,
  useFont,
  Group,
} from "@shopify/react-native-skia";

import { useWindowDimensions } from "react-native";

import { Background } from "./Background";
import { Ball } from "./Ball";

//const titleFont = useFont(require("./SF-Mono-Semibold.otf"), 24);
//const subtitleFont = useFont(require("./SF-Mono-Semibold.otf"), 18);
//const font = useFont(require("./SF-Mono-Semibold.otf"), 12);
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
const CARD_WIDTH = width - 64;
const CARD_HEIGHT = CARD_WIDTH * 0.61;

export const Glassmorphism = () => {
  const titleFont = useFont(require("./SF-Mono-Semibold.otf"), 24);
  const subtitleFont = useFont(require("./SF-Mono-Semibold.otf"), 18);
  const font = useFont(require("./SF-Mono-Semibold.otf"), 12);
  //const { width, height } = useWindowDimensions();
  
  const clip = useMemo(
    () => rrect(rect(0, 0, CARD_WIDTH, CARD_HEIGHT), 20, 20),
    [CARD_HEIGHT, CARD_WIDTH]
  );

  const x = useValue((width - CARD_WIDTH) / 2);
  const y = useValue((height - CARD_HEIGHT) / 2);
  const offsetX = useValue(0);
  const offsetY = useValue(0);
  const onTouch = useTouchHandler({
    onStart: (pos) => {
      offsetX.current = x.current - pos.x;
      offsetY.current = y.current - pos.y;
    },
    onActive: (pos) => {
      x.current = offsetX.current + pos.x;
      y.current = offsetY.current + pos.y;
    },
    onEnd: ({ velocityX, velocityY }) => {
      runDecay(x, { velocity: velocityX });
      runDecay(y, { velocity: velocityY });
    },
  });
  const transform = useComputedValue(
    () => [{ translateY: y.current }, { translateX: x.current }],
    [x, y]
  );
  if (titleFont === null || subtitleFont === null || font === null) {
    return null;
  }
  return (
    <Canvas style={{ flex: 1 }} onTouch={onTouch} debug>
      <Fill>
      <LinearGradient
          start={vec(0, 0)}
          end={vec(0, height)}//rect={rect(0, 0, width, height)}
          colors={["#FAC6C0", "#EBBFF6", "#F5DFE6", "#F2DCF6"]}
      />
      </Fill>
      <Ball r={100} c={vec(375, 75)} />
      <Ball r={50} c={vec(width, height / 2)} />
      <Ball r={100} c={vec(150, height - 200)} />
      <Ball r={75} c={vec(300, height / 2 - 100)} />

      <BackdropBlur
        clip={clip}
        blur={12}
      
        
        transform={transform}
      >
        <Fill color="rgba(255, 255, 255, 0.1)"/>

          <LinearGradient
            start={vec(0, 0)}
            end={vec(CARD_WIDTH, 0)}
            colors={["#5DA7D2ee", "#B848D9ee"]}
          />

        <Rect x={0} y={CARD_HEIGHT - 70} width={CARD_WIDTH} height={70} />
        <Text text="SUPERBANK" x={20} y={40} font={titleFont} />
        <Text x={20} y={110} text="1234 5678 1234 5678" font={titleFont} />
        <Text text="VALID THRU" x={20} y={145} color="white" font={font} />
        <Text text="12/29" x={20} y={160} color="white" font={font} />
        <Text
          text="JOHN DOE"
          x={20}
          y={185}
          color="white"
          font={subtitleFont}
        />
      </BackdropBlur>
    </Canvas>
  );
};

export default Notes = () => {


  return (
    <View style = {{ flex: 1}}>
      <Glassmorphism />
    </View>
  );
    
}
//  
