import React from "react";
import { Vector } from "@shopify/react-native-skia";
import {
  BlurMask,
  add,
  vec,
  Circle,
  Paint,
  LinearGradient,
  Group,
} from "@shopify/react-native-skia";

export const Ball = ({ c, r }) => {
  return (
    <Group>
 
        <LinearGradient
          start={add(c, vec(-r, 0))}
          end={add(c, vec(r, 0))}
          colors={["#FBE1FF", "#E1ABED"]}
        />
        <BlurMask blur={150} style="solid" />

      <Group transform={[{ rotate: Math.PI / 3 }]} origin={c}>
        <Circle c={c} r={r}/>
      </Group>
    </Group>
  );
};