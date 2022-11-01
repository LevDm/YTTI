import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
const ReanimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient) 

const COLORS_PALETTE = [
  '#ff0000',
 '#ff7f00',
  '#ffff00',
 '#7fff00',
  '#00ff00',
 '#00ff7f',
  '#00ffff',
 '#007fff',
  '#0000ff',
 '#7f00ff',
  '#ff00ff',
 '#ff007f',
  '#ff0000',
];

const COLORS_L = [
  '#000000',
  '#ffffff'
]


function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

  if (delta == 0)
    h = 0;
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  else if (cmax == g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0)
    h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return {h: h, s: s, l: l}//"hsl(" + h + "," + s + "%," + l + "%)";
}





const COLORS_PALETTE_HSL = COLORS_PALETTE.map((item, index)=>hexToHSL(item))
const start={ x: 0, y: 0 }
const end={ x: 1, y: 0 }

const ColorPicker = ({
  //colors ,
  accent = false,
  initialValue,
  //start,
  //end,
  style,
  maxWidth,
  onColorChanged,
}) => {
    const logg = (t)=>{
      console.log(t)
    }

    
    //______________________H
    const [stateH, setStateH] = useState(0)
    const selectH = useSharedValue(0);
    const translateXH = useSharedValue(0);
    const translateYH = useSharedValue(0);
    const scaleH = useSharedValue(1);

    const adjustedTranslateXH = useDerivedValue(() => {
      return Math.min(
          Math.max(translateXH.value, -CIRCLE_PICKER_SIZE/2),
          maxWidth - CIRCLE_PICKER_SIZE/2
      );
    });

    const onEndH = useCallback(() => {
      'worklet';
      translateYH.value = withSpring(0);
      scaleH.value = withSpring(1);
    }, []);

    const panGestureEventH = useAnimatedGestureHandler({
      onStart: (_, context) => {
          context.x = adjustedTranslateXH.value;
      },
      onActive: (event, context) => {
          translateXH.value = event.translationX + context.x       
          //runOnJS(logg)(`tx ${event.translationX + context.x}  ${translateX.value} ${maxWidth}`)
      },
      onEnd: onEndH,
    });

    const tapGestureEventH =useAnimatedGestureHandler({
      onStart: (event) => {
          translateYH.value = withSpring(-style.height);
          scaleH.value = withSpring(0.6);
          translateXH.value = withTiming(event.absoluteX - CIRCLE_PICKER_SIZE);
      },
      onEnd: onEndH,
    });

    const areaThumbH = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: adjustedTranslateXH.value },
          { scale: scaleH.value },
          { translateY: translateYH.value },
        ],
      };
    });

    const lineH = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: adjustedTranslateXH.value },
        ],
      };
    });

    const thumbH = useAnimatedStyle(() => {
      const color = COLORS_PALETTE
      const d2h = (d) => {
        if(d<0){
          d = 0xffffff + d+1
        }
        
        const number = d.toString(16)
        let add = '#'
        for(let i = 0; i<6-number.length; i++){
          add += '0'
        }
        return add+number
      }
      const inputRange = (color).map(
        (_, index) => ((index) / ((color).length-1)) * (maxWidth-CIRCLE_PICKER_SIZE)
      );
      
      const backgroundColor =  interpolateColor(
        translateXH.value,
        inputRange,
        color,
        'RGB'
      )
      selectH.value = d2h(backgroundColor)
      runOnJS(setStateH)(d2h(backgroundColor))
      console.log(selectH.value)
      //onColorChanged?.(backgroundColor);
        
      return {
        backgroundColor,
      };
        
    }, []);
    
    const gradientS = useAnimatedProps(()=>{
      console.log('gradientS upd', selectH.value)
      'worklet';
      return {
        colors: ['#000000', selectH.value]
      }
    },[selectH.value, stateH])

  
    //______________________S
    const selectS = useSharedValue(0);
    const translateXS = useSharedValue(maxWidth);
    const translateYS = useSharedValue(0);
    const scaleS = useSharedValue(1);

    const adjustedTranslateXS = useDerivedValue(() => {
      return Math.min(
          Math.max(translateXS.value, -CIRCLE_PICKER_SIZE/2),
          maxWidth - CIRCLE_PICKER_SIZE/2
      );
    });

    const onEndS = useCallback(() => {
      'worklet';
      translateYS.value = withSpring(0);
      scaleS.value = withSpring(1);
    }, []);

    const panGestureEventS = useAnimatedGestureHandler({
      onStart: (_, context) => {
          context.x = adjustedTranslateXS.value;
      },
      onActive: (event, context) => {
          translateXS.value = event.translationX + context.x       
          //runOnJS(logg)(`tx ${event.translationX + context.x}  ${translateX.value} ${maxWidth}`)
      },
      onEnd: onEndS,
    });

    const tapGestureEventS =useAnimatedGestureHandler({
      onStart: (event) => {
          translateYS.value = withSpring(-style.height);
          scaleS.value = withSpring(0.6);
          translateXS.value = withTiming(event.absoluteX - CIRCLE_PICKER_SIZE);
      },
      onEnd: onEndS,
    });

    const areaThumbS = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: adjustedTranslateXS.value },
          { scale: scaleS.value },
          { translateY: translateYS.value },
        ],
      };
    });

    const lineS = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: adjustedTranslateXS.value },
        ],
      };
    });

    const thumbS = useAnimatedStyle(() => {
      const color = ['#000000', selectH.value]

      const inputRange = (color).map(
        (_, index) => ((index) / ((color).length-1)) * (maxWidth-CIRCLE_PICKER_SIZE)
      );
      
      const backgroundColor =  interpolateColor(
        translateXS.value,
        inputRange,
        color,
        'RGB'
      )
      selectS.value = backgroundColor
      console.log(backgroundColor)
      //onColorChanged?.(backgroundColor);
        
      return {
        backgroundColor,
      };
        
    }, []);
    
    //______________________L
    const selectL = useSharedValue(0);
    const translateXL = useSharedValue(maxWidth/2 -CIRCLE_PICKER_SIZE/2);
    const translateYL = useSharedValue(0);
    const scaleL = useSharedValue(1);

    const adjustedTranslateXL = useDerivedValue(() => {
      return Math.min(
          Math.max(translateXL.value, -CIRCLE_PICKER_SIZE/2),
          maxWidth - CIRCLE_PICKER_SIZE/2
      );
    });

    const onEndL = useCallback(() => {
      'worklet';
      translateYL.value = withSpring(0);
      scaleL.value = withSpring(1);
    }, []);

    const panGestureEventL = useAnimatedGestureHandler({
      onStart: (_, context) => {
          context.x = adjustedTranslateXL.value;
      },
      onActive: (event, context) => {
          translateXL.value = event.translationX + context.x       
          //runOnJS(logg)(`tx ${event.translationX + context.x}  ${translateX.value} ${maxWidth}`)
      },
      onEnd: onEndL,
    });

    const tapGestureEventL =useAnimatedGestureHandler({
      onStart: (event) => {
          translateYL.value = withSpring(-style.height );
          scaleL.value = withSpring(0.6);
          translateXL.value = withTiming(event.absoluteX - CIRCLE_PICKER_SIZE);
      },
      onEnd: onEndH,
    });

    const areaThumbL = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: adjustedTranslateXL.value },
          { scale: scaleL.value },
          { translateY: translateYL.value },
        ],
      };
    });

    const lineL = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: adjustedTranslateXL.value },
        ],
      };
    });

    const thumbL = useAnimatedStyle(() => {
      const color = COLORS_L

      const inputRange = (color).map(
        (_, index) => ((index) / ((color).length-1)) * (maxWidth-CIRCLE_PICKER_SIZE)
      );
      
      const backgroundColor =  interpolateColor(
        translateXL.value,
        inputRange,
        color,
        'RGB'
      )
      selectL.value = backgroundColor
      console.log(backgroundColor)
      //onColorChanged?.(backgroundColor);
        
      return {
        backgroundColor,
      };
        
    }, []);
    //===================================

    const HSLcolor = useAnimatedStyle(()=>{

      function HSLToHex(h,s,l) {
        s /= 100;
        l /= 100;
      
        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c/2,
            r = 0,
            g = 0, 
            b = 0; 
      
        if (0 <= h && h < 60) {
          r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
          r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
          r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
          r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
          r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
          r = c; g = 0; b = x;
        }
        // Having obtained RGB, convert channels to hex
        r = Math.round((r + m) * 255).toString(16);
        g = Math.round((g + m) * 255).toString(16);
        b = Math.round((b + m) * 255).toString(16);
      
        // Prepend 0s, if necessary
        if (r.length == 1)
          r = "0" + r;
        if (g.length == 1)
          g = "0" + g;
        if (b.length == 1)
          b = "0" + b;
      
        return "#" + r + g + b;
      }

      const inputRange = [0, maxWidth]
      const outputRangeAngle = [0, 360]
      const outputRangeRercent = [0, 100]
      const h = interpolate(
        translateXH.value,
        inputRange,
        outputRangeAngle
      )
      const s = interpolate(
        translateXS.value,
        inputRange,
        outputRangeRercent
      )
      const l = interpolate(
        translateXL.value,
        inputRange,
        outputRangeRercent
      )
      const color = HSLToHex(h,s,l)

      onColorChanged?.(color);

      return{
        backgroundColor: color
      }
    })

    useEffect(()=>{
      const initHSL = hexToHSL(initialValue)

      const ouputRange = [0, maxWidth]
      const inputRangeAngle = [0, 360]
      const inputRangeRercent = [0, 100]

      translateXH.value = interpolate(initHSL.h, inputRangeAngle, ouputRange)
      translateXS.value = interpolate(initHSL.s, inputRangeRercent, ouputRange)
      translateXL.value = interpolate(initHSL.l, inputRangeRercent, ouputRange)

    },[initialValue])
    
    return (
      <View
        style ={{
          //justifyContent: 'center'
        }}
      >
        <Animated.View style={[style, HSLcolor]}/>
      {[
        {
          tapGestureEvent: tapGestureEventH,
          panGestureEvent: panGestureEventH,
          colors: COLORS_PALETTE,
          gradient: {},
          dynamicStyle: {
            line: lineH,
            areaThumb: areaThumbH,
            thumb: thumbH
          } 
        },
        {
          tapGestureEvent: tapGestureEventS,
          panGestureEvent: panGestureEventS,
          colors: ['#000000', selectH.value],
          gradient: gradientS,
          dynamicStyle: {
            line: lineS,
            areaThumb: areaThumbS,
            thumb: thumbS
          }
        },
        {
          tapGestureEvent: tapGestureEventL,
          panGestureEvent: panGestureEventL,
          colors: COLORS_L,
          gradient: {},
          dynamicStyle: {
            line: lineL,
            areaThumb: areaThumbL,
            thumb: thumbL
          }
        },
      ].map((item, index)=>{

      return (
      <View
        key={`slider_hsl_${item}${index}`}
        style ={{
          height: 50,
          //backgroundColor: 'grey',
          justifyContent: 'center'
        }}
      >
        <TapGestureHandler onGestureEvent={item.tapGestureEvent}>
        <Animated.View>
        <PanGestureHandler onGestureEvent={item.panGestureEvent}>
          <Animated.View style={{ justifyContent: 'center' }}>
            <LinearGradient          
              start={start}
              end={end}
              style={style}
              //
              animatedProps={item.gradient}
              colors={item.colors}
              
             
              //colors={accent? ['white',accent,'black'] : colors.value}
              
            />
            <Animated.View
                style={[item.dynamicStyle.line, {
                  position: 'absolute',
                  marginLeft: CIRCLE_PICKER_SIZE/2-1,
                  width: 2,
                  height: style.height,
                  backgroundColor: 'black',
                  opacity: 0.5,
                }]}
              />
            <Animated.View style={[styles.picker, item.dynamicStyle.areaThumb]}>
              <Animated.View
                style={[styles.internalPicker, item.dynamicStyle.thumb]}
              />
              
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
        </Animated.View>
        </TapGestureHandler>
      </View>
      )
      })} 
      </View>
    );
};

const CIRCLE_PICKER_SIZE = 30;
const INTERNAL_PICKER_SIZE = CIRCLE_PICKER_SIZE  ;

const styles = StyleSheet.create({
  picker: {
    position: 'absolute',
    //backgroundColor: '#fff',
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
});

export default ColorPicker;

/*const d2h = (d) => {
      if(d<0){
        d = 0xffffff + d+1
      }
      return d.toString(16)
    }

    const nearer = (color) => {
      //const COLORS = colors.value
      color = color.slice(1)
  
      const h2d = (h) => {return parseInt(h, 16)}
      const d2h = (d) => {return `${d<16? '0':''}${d.toString(16)}`}
  
      const colorRGB = {
        r: h2d(color.slice(0,2)),
        g: h2d(color.slice(2,4)),
        b: h2d(color.slice(4)),
      }
  
      const colorRGBNearer= {
        r: Math.floor(127.5 * Math.round(colorRGB.r / 103) ),
        g: Math.floor(127.5 * Math.round(colorRGB.g / 103) ),
        b: Math.floor(127.5 * Math.round(colorRGB.b / 103) )
      }
  
      const getNearer = () => d2h(colorRGBNearer.r)+d2h(colorRGBNearer.g)+d2h(colorRGBNearer.b)
  
      let colorNearer = getNearer()
  
      if(colorNearer.indexOf('ff')){
        const max = Math.max(...Object.values(colorRGB)) 
        for( let key in colorRGB){
          if(colorRGB[key] == max){
            colorRGBNearer[key] = 255
            colorNearer = getNearer()
            break
          }
        }
      }
      colorNearer = String('#'+colorNearer)
      const indexNearer = COLORS_PALETTE.indexOf(colorNearer)
  
      //console.log(color, colorRGB, colorRGBNearer ,colorNearer, indexNearer)
      
      return {color: colorNearer, index: indexNearer}
    }

    const h2d = (h) => {return parseInt(h, 16) -256**3}

    const setValue = (color)=>{
      

      

      let colorNumber = h2d(color.slice(1))
      console.log(colorNumber)
      
      const { color: nearerColor, index: nearerIndex } = nearer(color)
      console.log('nearer',nearerColor, nearerIndex)

      if(!accent){
        const COLORS = colors.value

        //const maxWidth = PICKER_WIDTH
        const outputRange = (COLORS).map(
          (_, index) => (index / (COLORS).length) * maxWidth
        );

        const inputRange = (COLORS).map(
          (item, index) => h2d(item.slice(1))
        );


        const positionSliderColor = outputRange[nearerIndex]

        const part = (3 / (COLORS_PALETTE).length) * maxWidth
        
        const add = interpolate(
          colorNumber,
          inputRange.slice(nearerIndex-1, nearerIndex+2),
          outputRange.slice(nearerIndex-1, nearerIndex+2)
        )
        
        console.log('add', add, positionSliderColor, colorNumber, inputRange.slice(nearerIndex-1, nearerIndex+2))
        translateX.value = positionSliderColor//+part*add //+CIRCLE_PICKER_SIZE/2
       
      } else {
        const COLORS = colors.value
        const inputRangeGamma = (['#ffffff','#000000']).map(
          (item, index) => h2d(item.slice(1)) 
        );
        console.log('accent', accent)
        const gammaNumber = h2d( nearerColor.slice(1))
        const outputRangeGamma = [0 ,maxWidth]
    
        const positionSliderGamma = interpolate(
            gammaNumber,
            inputRangeGamma,
            outputRangeGamma
        )
    
        console.log(inputRangeGamma, outputRangeGamma, colorNumber)
    
        console.log(positionSliderGamma)

        translateX.value = positionSliderGamma//+CIRCLE_PICKER_SIZE/2
      }
  
      
  
    }

    useEffect(()=>{
      initialValue?setValue(initialValue):null
    },[initialValue])
{[
          {
            tapGestureEvent: tapGestureEventH,
            panGestureEvent: panGestureEventH,
            colors: COLORS_PALETTE,
            dynamicStyle: {
              line: lineH,
              thumbArea: rStyleH,
              thumb: rInternalPickerStyleH
            } 
          },
          {
            tapGestureEvent: tapGestureEventS,
            panGestureEvent: panGestureEventS,
            colors: COLORS_PALETTE,
            dynamicStyle: {
              line: lineS,
              thumbArea: rStyleS,
              thumb: rInternalPickerStyleS
            } 
          },
          {
            tapGestureEvent: tapGestureEventL,
            panGestureEvent: panGestureEventL,
            colors: COLORS_PALETTE,
            dynamicStyle: {
              line: lineL,
              thumbArea: rStyleL,
              thumb: rInternalPickerStyleL
            } 
          },
        ].map((item, index)=>{

          return (

          )
        })}
*/