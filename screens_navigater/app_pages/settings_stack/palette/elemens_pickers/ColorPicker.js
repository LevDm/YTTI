import React, { useCallback, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Keyboard } from 'react-native';
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

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import { deviceHeight, deviceWidth } from '../../../../../app_values/AppDefault';

import themesColorsAppList, {themesApp} from '../../../../../app_values/Themes';
import languagesAppList, {languagesApp} from "../../../../../app_values/Languages";

import { BasePressable } from '../../../../../general_components/base_components/BaseElements';


const RAINBOW = [
  '#ff0000',
 '#ff8000',
  '#ffff00',
 '#80ff00',
  '#00ff00',
 '#00ff80',
  '#00ffff',
 '#0080ff',
  '#0000ff',
 '#8000ff',
  '#ff00ff',
 '#ff0080',
  '#ff0000',
];

const COLORS_L = [
  '#000000',
  '#ffffff'
]

export function hexToHSL(H) {
  // Convert hex to RGB firsts
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

  //h = Math.round(h * 60);
  h = h * 60;

  if (h < 0)
    h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return {h: h, s: s, l: l}//"hsl(" + h + "," + s + "%," + l + "%)";
}

export function HSLToHex(h,s,l) {
      'worklet';
      h = (h==360? 0 : h)
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
const start={ x: 0, y: 0 }
const end={ x: 1, y: 0 }

const PICKER_WIDTH = deviceWidth * 0.9;

const maxWidth = PICKER_WIDTH

const sliderSize = {height: 20, width: PICKER_WIDTH,}

const interval_slider = [0, maxWidth]
const interval_h = [0, 360]
const interval_sl = [0, 100]


const ColorPicker = ({
  visible,
  initialValue,
  opened, 
  onColorChanged,

  applyNewStateColor,
  accentsTrasing,
  trasing,

  ThemeColorsAppIndex,
  ThemeSchema,
  LanguageAppIndex,
  appStyle,
  appConfig,
}) => {

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex]

    const logg = (t)=>{
      console.log(t)
    }
    const keyboardShow = useSharedValue(-1);
    useEffect(() => {
      const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
        keyboardShow.value != -1? keyboardShow.value = 1 : null
      });
      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
        keyboardShow.value != -1? keyboardShow.value = 0 : null
      });

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);

    useEffect(()=>{
      if(visible && keyboardShow.value == -1){keyboardShow.value = 0}
      if(!visible && keyboardShow.value != -1){keyboardShow.value = -1}
    },[visible])

    const areaSliders = useAnimatedStyle(()=>{
      const duration = 500
      return (
        {
          transform: [
            {translateY: withTiming( interpolate(keyboardShow.value, [-1, 0, 1], [deviceHeight/4, 0, (deviceHeight/4)*3/5]), {duration: duration}  )}
          ]
        }
      )
    })

    
    //______________________H
    const [stateH, setStateH] = useState(0)
    const selectH = useSharedValue(0);
    const translateXH = useSharedValue(0);
    const translateYH = useSharedValue(0);
    const scaleH = useSharedValue(1);

    const adjustedTranslateXH = useDerivedValue(() => {
      return Math.min(
        Math.max(translateXH.value, 0),
        maxWidth
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
        translateXH.value = Math.min(Math.max(event.x, 0),maxWidth)  
      },
      onEnd: onEndH,
    });

    const tapGestureEventH = useAnimatedGestureHandler({
      onStart: (event) => {
        translateYH.value = withSpring(-sliderSize.height);
        scaleH.value = withSpring(0.6);
        translateXH.value = event.x
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
      const color = RAINBOW
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
        (_, index) => ((index) / ((color).length-2)) * (maxWidth-CIRCLE_PICKER_SIZE)
      );
      
      const backgroundColor = interpolateColor(
        translateXH.value,
        inputRange,
        color,
        'RGB'
      )
      
      const resColor = d2h(backgroundColor)
      selectH.value = resColor
      runOnJS(setStateH)(resColor)
        
      return {
        backgroundColor,
      };
        
    }, []);
    
    const gradientS = useAnimatedProps(()=>{
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
          Math.max(translateXS.value, 0),
          maxWidth
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
        translateXS.value =  Math.min(Math.max(event.x, 0),maxWidth)  
      },
      onEnd: onEndS,
    });

    const tapGestureEventS =useAnimatedGestureHandler({
      onStart: (event) => {
        translateYS.value = withSpring(-sliderSize.height);
        scaleS.value = withSpring(0.6);
        translateXS.value = event.x;
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
        
      return {
        backgroundColor,
      };
        
    }, []);
    
    //______________________L
    const selectL = useSharedValue(0);
    const translateXL = useSharedValue(maxWidth/2);//-CIRCLE_PICKER_SIZE/2
    const translateYL = useSharedValue(0);
    const scaleL = useSharedValue(1);

    const adjustedTranslateXL = useDerivedValue(() => {
      return Math.min(
          Math.max(translateXL.value, 0),
          maxWidth
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
          translateXL.value =  Math.min(Math.max(event.x, 0),maxWidth)  
      },
      onEnd: onEndL,
    });

    const tapGestureEventL =useAnimatedGestureHandler({
      onStart: (event) => {
        translateYL.value = withSpring(-sliderSize.height );
        scaleL.value = withSpring(0.6);
        translateXL.value = event.x
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
        
      return {
        backgroundColor,
      };
        
    }, []);
    //===================================
   

    const [ inputValue, setInputValue ] = useState()
    const currentSelectColor = useSharedValue('')

    const HS40Lcolor = useAnimatedStyle(()=>{
      const h = interpolate(
        translateXH.value,
        interval_slider,
        interval_h
      )
      const s = interpolate(
        translateXS.value,
        interval_slider,
        interval_sl
      )
      const l = interpolate(
        translateXL.value,
        interval_slider,
        interval_sl
      )
      const color = HSLToHex(h,s, Math.max(l-10, 0))

      return{
        backgroundColor: color
      }
    })

    const HS60Lcolor = useAnimatedStyle(()=>{
      const h = interpolate(
        translateXH.value,
        interval_slider,
        interval_h
      )
      const s = interpolate(
        translateXS.value,
        interval_slider,
        interval_sl
      )
      const l = interpolate(
        translateXL.value,
        interval_slider,
        interval_sl
      )
      const color = HSLToHex(h,s, Math.min(l+10, 100))

      return{
        backgroundColor: color
      }
    })
    const HS50Lcolor = useAnimatedStyle(()=>{
      const h = interpolate(
        translateXH.value,
        interval_slider,
        interval_h
      )
      const s = interpolate(
        translateXS.value,
        interval_slider,
        interval_sl
      )
      const l = interpolate(
        translateXL.value,
        interval_slider,
        interval_sl
      )
      //runOnJS(logg)(`${h} ${s} ${l}`)
      const color = HSLToHex(h,s,l)
      
      if(keyboardShow.value != 1){
        //runOnJS(logg)(`iv set undef ${color}`)
        onColorChanged?.(color);
        //inputValue != undefined? runOnJS(setInputValue)(undefined) : null
        runOnJS(setInputValue)(undefined)
        currentSelectColor.value = color
      }

      return{
        backgroundColor: color
      }
    })

    const kontur = useAnimatedStyle(()=>{
      return({
        borderColor: currentSelectColor.value,
        //color: currentSelectColor.value,
      })
    })

    const text = useAnimatedProps(()=>{
      'worklet';
      return {
        text: currentSelectColor.value,
      }
    }, [])

    const settingSlidersColor = (color)=>{
      //console.log('hsl slider set color')
      const initHSL = hexToHSL(color)
      translateXH.value = interpolate(initHSL.h, interval_h, interval_slider)
      translateXS.value = interpolate(initHSL.s, interval_sl, interval_slider)
      translateXL.value = interpolate(initHSL.l, interval_sl, interval_slider)
    }
    const getTypeTracing = ()=> {
      let type = ''
      if(opened != undefined && opened.trace != undefined){
        const current = (opened.trace).slice(0).join('-')
      
        if(current.includes("basics-accents-primary")){type = 'accents'}
        if(current.includes("basics-neutrals")){type = 'neutrals'}
        if(current.includes("basics-grounds")){type = 'grounds'}
      }
      return type
    }
    const typeTrasing = getTypeTracing()
    useEffect(()=>{
      //console.log('ue iv')
      initialValue? settingSlidersColor(initialValue) : null
      
    },[initialValue])

    const onPressInText = () =>{
      if(inputValue == undefined){
        //console.log('iv set color')
        setInputValue(currentSelectColor.value)
      }
    }

    const changeTextColor = (text)=>{
      let inputText = (text[0] == '#'? text.slice(1) : text)
      inputText = inputText.toLowerCase()
      let outputText = '#'
      const allowedSymbols = '0123456789aAbBcCdDeEfF'
      for(let s of inputText){
        if(allowedSymbols.includes(s)){
          outputText += s
        }
      }
      outputText = outputText.toLowerCase()
      setInputValue(outputText)
    }

    const changeEnd = ({nativeEvent: {text}})=>{
      //console.log('end', text)
      let outputText = text
      for(let i = 0; i< 7-outputText.length; i++){
        outputText += '0'
      }
      settingSlidersColor(outputText)
    }

    const shift = (type) => {
      const HSLcolor = hexToHSL(currentSelectColor.value)

      let newL = 0  
      if(type=='light'){
        newL = Math.min(HSLcolor.l +10, 100)
      } else {
        newL = Math.max(HSLcolor.l -10, 0)
      }
      settingSlidersColor(HSLToHex(HSLcolor.h, HSLcolor.s, newL))
    }

    const circlesSize = 30
    return (
      <Animated.View
        style ={[{
          position: 'absolute',
          bottom: 0,
          height: deviceHeight/4,
          width: deviceWidth,
          justifyContent: 'center',
          paddingHorizontal: CIRCLE_PICKER_SIZE/2,
          backgroundColor: 'transparent',
          borderRadius: appStyle.borderRadius.additional,
          //justifyContent: 'center',
          alignItems: 'center'
        }, areaSliders]}
      >
        <View
          style = {{
            position: 'absolute',
            width: deviceWidth,
            height: '100%',
            flexDirection: 'row',
            //justifyContent: 'center',
            //alignItems: 'center'
            //backgroundColor: 'grey',
          }}
        >
          <View style={{flex: 1, backgroundColor: 'white', borderTopLeftRadius: 20, borderBottomLeftRadius: 20}}/>
          <View style={{flex: 1, backgroundColor: 'black', borderTopRightRadius: 20, borderBottomRightRadius: 20}}/>
        </View>
        <View
          style ={{
            flex: 1,
            width: sliderSize.width,
            //backgroundColor: 'grey',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row'
          }}
        >
          <AnimatedTextInput
            style={[kontur, {
              width: 85,
              backgroundColor: '#00000025',
              height: circlesSize,
              borderRadius: circlesSize/2,
              paddingHorizontal: 10,
              borderWidth: 1
            }]}
            maxLength = {7}
            textAlign = {'center'}
            contextMenuHidden={true}
            defaultValue={currentSelectColor.value}
            
            
            value={inputValue}
            onPressIn={onPressInText}
            onChangeText={changeTextColor}
            //onEndEditing = {changeEnd}
            onSubmitEditing = {changeEnd}

            animatedProps={text}
          />
          <View
            style ={{
              flex: 1,
              width: sliderSize.width,
              //backgroundColor: 'grey',
              justifyContent: 'space-around',
              alignItems: 'center',
              flexDirection: 'row',
              //marginRight: 85

            }}
          >
            <Animated.View style={[ HS60Lcolor, {height: circlesSize, width: circlesSize,borderRadius: circlesSize/2}]}>
              <BasePressable
                type='t'
                text='<'
                onPress={()=>{shift('light')}}
              />
            </Animated.View>
            <Animated.View style={[ HS50Lcolor, {height: circlesSize, width: circlesSize,borderRadius: circlesSize/2}]}/>
            <Animated.View style={[ HS40Lcolor, {height: circlesSize, width: circlesSize,borderRadius: circlesSize/2}]}>
              <BasePressable
                type='t'
                text='>'
                onPress={()=>{shift('dark')}}
              />
            </Animated.View>
          </View>
          
          <BasePressable
            type = 'i'
            icon={{name: 'check-bold', size: 20, color: 'black'}}
            style = {{
              width: 85,
              backgroundColor: '#ffffff85',
              height: circlesSize,
              borderRadius: circlesSize/2,
              paddingHorizontal: 10,
            }} 
            textStyle={{
              color: 'white'
            }}
            onPress={()=>{applyNewStateColor(currentSelectColor.value)}}
          />
        </View>
        <View
            style ={{
              flex: 1,
              width: sliderSize.width,
              //backgroundColor: 'grey',
              justifyContent: 'space-around',
              alignItems: 'center',
              flexDirection: 'row',
              //marginRight: 85

            }}
          >
            {typeTrasing == 'accents' &&
            <BasePressable
              type = 't'
              text='Trasing accents light'
              textStyle={{
                fontSize: 10,
              }}
              style = {{
                flex: 1,
                marginHorizontal: 10,
                backgroundColor: '#00000025',
                height: circlesSize,
                borderRadius: circlesSize/2,
                paddingHorizontal: 10,
              }} 
              onPress={()=>{accentsTrasing(currentSelectColor.value, 'light')}}
            />}
            {typeTrasing == 'accents' &&
            <BasePressable
              type = 't'
              text='Trasing accents dark'
              textStyle={{
                fontSize: 10,
              }}
              style = {{
                flex: 1,
                marginHorizontal: 10,
                backgroundColor: '#ffffff75',
                height: circlesSize,
                borderRadius: circlesSize/2,
                paddingHorizontal: 10,
              }} 
              onPress={()=>{accentsTrasing(currentSelectColor.value, 'dark')}}
            />}
            {typeTrasing == 'neutrals' &&
            <BasePressable
              type = 't'
              text='Trasing neutrals value'
              textStyle={{
                fontSize: 10,
                color: 'white'
              }}
              style = {{
                flex: 1,
                marginHorizontal: 10,
                backgroundColor: '#80808080',
                height: circlesSize,
                borderRadius: circlesSize/2,
                paddingHorizontal: 10,
              }} 
              onPress={()=>{trasing(currentSelectColor.value, 'neutrals')}}
            />}
            {typeTrasing == 'grounds' &&
            <BasePressable
              type = 't'
              text='Trasing grounds value'
              textStyle={{
                fontSize: 10,
                color: 'white'
              }}
              style = {{
                flex: 1,
                marginHorizontal: 10,
                backgroundColor: '#80808080',
                height: circlesSize,
                borderRadius: circlesSize/2,
                paddingHorizontal: 10,
              }} 
              onPress={()=>{trasing(currentSelectColor.value, 'grounds')}}
            />}
          </View>
      {[
        {
          tapGestureEvent: tapGestureEventH,
          panGestureEvent: panGestureEventH,
          colors: RAINBOW,
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
          flex: 1,
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
              style={staticStyles.gradient}
              animatedProps={item.gradient}
              colors={item.colors}
            />
            <Animated.View
                style={[item.dynamicStyle.line, {
                  position: 'absolute',
                  marginLeft: -1,//CIRCLE_PICKER_SIZE/2
                  width: 2,
                  height: sliderSize.height,
                  backgroundColor: 'black',
                  opacity: 0.5,
                }]}
              />
            <Animated.View style={[staticStyles.picker, item.dynamicStyle.areaThumb]}>
              <Animated.View
                style={[staticStyles.internalPicker, item.dynamicStyle.thumb]}
              />
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
        </Animated.View>
        </TapGestureHandler>
      </View>
      )
      })} 
      </Animated.View>
    );
};

const CIRCLE_PICKER_SIZE = 30;
const INTERNAL_PICKER_SIZE = CIRCLE_PICKER_SIZE  ;

const staticStyles = StyleSheet.create({
  picker: {
    position: 'absolute',
    marginLeft: -CIRCLE_PICKER_SIZE/2,
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
  gradient: { height: sliderSize.height, width: sliderSize.width, borderRadius: sliderSize.height/2 },
});

export default ColorPicker;