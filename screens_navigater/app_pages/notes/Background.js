import { Fill, Group, Paint, rect, LinearGradient, vec } from "@shopify/react-native-skia";
import React from "react";
import { useWindowDimensions } from "react-native";

//import { BilinearGradient } from "../../Aurora/components/BilinearGradient";

import { SkRect, Color } from "@shopify/react-native-skia";
import { Shader, Skia } from "@shopify/react-native-skia";

export const Background = () => {
  const { width, height } = useWindowDimensions();
  return (
    

        <LinearGradient
          start={vec(0, 0)}
          end={vec(width, height)}//rect={rect(0, 0, width, height)}
          colors={["#FAC6C0", "#EBBFF6", "#F5DFE6", "#F2DCF6"]}
        />


    
  );
};