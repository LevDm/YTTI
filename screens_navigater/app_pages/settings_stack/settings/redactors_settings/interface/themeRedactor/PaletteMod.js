import React, { useCallback, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions, Pressable, ToastAndroid, } from 'react-native';
import Constants from "expo-constants";

import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

import Reanimated, {
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
  convertToRGBA,
  useAnimatedReaction,
  createAnimatedPropAdapter
} from 'react-native-reanimated';

import { LinearGradient } from 'expo-linear-gradient';

const Reanimated_LinearGradient = Reanimated.createAnimatedComponent(LinearGradient)
const AnimatedTextInput = Reanimated.createAnimatedComponent(TextInput);
const TextInputAdapter = createAnimatedPropAdapter(
  (props) => {
    'worklet';
    const keys = Object.keys(props);
    if (keys.includes('value')) {
      props.text = props.value;
      //props.value = props.value
      delete props.value;
    }
  },
  ['text']
);
const Reanimated_Presable = Reanimated.createAnimatedComponent(Pressable);

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

import { MaterialCommunityIcons } from '@expo/vector-icons';


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


export function hexToHSL(H) {
  'worklet'
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

export const getContrast = (hcolor) => {
  'worklet';
  let r = 0, g = 0, b = 0;
  if (hcolor.length == 4) {
    r = "0x" + hcolor[1] + hcolor[1];
    g = "0x" + hcolor[2] + hcolor[2];
    b = "0x" + hcolor[3] + hcolor[3];
  } else if (hcolor.length == 7) {
    r = "0x" + hcolor[1] + hcolor[2];
    g = "0x" + hcolor[3] + hcolor[4];
    b = "0x" + hcolor[5] + hcolor[6];
  } else if (hcolor.length > 7) {
    let alfa = "0x"+hcolor.slice(7)
    alfa /= 255
    return alfa > 0.5? "white" : 'black'
  }
  r /= 255;
  g /= 255;
  b /= 255;

  const count = (coef) => ((coef+0.055)/1.055)**2.4 
  
  let contr = count(r)+count(g)+count(b)

  return contr <= 0.5? 'white' : 'black'
}


const CATEGORY = {
  b: 'basics',
  t: 'texts',
  i: 'icons',
  s: 'specials',
}

const TYPE = {
  a: 'accents',
  n: 'neutrals'
}

const SPECIALS_TYPE = {
  di: "dimout",
  se: "separator",
  sh: "shadow",
  //fi: "fire",
  sr: 'selector'
}

const ORDER = {
  p: "primary",
  s: "secondary",
  t: "tertiary",
  q: "quaternary",
}

const OS_NAVIGATION_BAR_HEIGHT = Dimensions.get('screen').height - (Dimensions.get('window').height + Constants.statusBarHeight)

const REDACTORS_ITEM_SIZE = {
  h: (deviceHeight/2)-OS_NAVIGATION_BAR_HEIGHT,
  w: deviceWidth-60-(2*8)
}

const ITEM_ROW_SIZE = 33
const ITEM_ROW_MARGIN = 0


const LEFT_TOOLS = {
  w: (ITEM_ROW_SIZE+2*ITEM_ROW_MARGIN)*2,
  hi: 33,
  pi: 3,
}

const HORIZONTAL_PADDING = 8
const THUMBLE_SIZE = 22
const THUMBLE_SCALE = 0.6
//deviceWidth -HORIZONTAL_PADDING -THUMBLE_SIZE -60 - 70
const BOARD_SIZE =  {h:  deviceHeight*0.275 -THUMBLE_SIZE - 42, w: REDACTORS_ITEM_SIZE.w-LEFT_TOOLS.w-THUMBLE_SIZE, fh: deviceHeight*0.275}
const SLIDER_SIZE = {h: 18, w: BOARD_SIZE.w, fh: 12+2*THUMBLE_SIZE}

const INPUT_HL = [0, BOARD_SIZE.w]
const OUTPUT_H = [0, 360]
const INPUT_S = [0, BOARD_SIZE.h]
const OUTPUT_S = [100, 0]
const OUTPUT_L = [0, 100]



const CENTER_TOOLS = {
  h: (ITEM_ROW_SIZE+2*ITEM_ROW_MARGIN)*2,
  w: REDACTORS_ITEM_SIZE.w,
  m: 2,
  fw: (ITEM_ROW_SIZE+2*ITEM_ROW_MARGIN)*4 + 4,
  th: 16,
  fh: (ITEM_ROW_SIZE+2*ITEM_ROW_MARGIN)*2 + 16,
}

const RIGHT_TOOLS = {
  w: 80,
  p: 4,
  hi: 25,
  pi: 10,
}


const ColorPicker = (props) => {
  const {
    uiTheme,
    uiScheme,
    aPalette,
    uiStyle,
    appStyle,
    Theme
  } = props
  //console.log('color picker',)

  const aSchema = useSharedValue(uiScheme.value)

  useAnimatedReaction(()=>uiScheme.value, (newValue, oldValue)=>{
    aSchema.value = newValue
  })


  const aStateColors = useSharedValue({
    id: 'basics-accents-primary',
    color: aPalette.value[aSchema.value].basics.accents.primary,
    path: ['basics', 'accents' , 'primary'],
    schema: aSchema.value,
    themeTitle: aPalette.value.title,
  })

  const setAStateColors = (newValue) => {
    aStateColors.value = newValue
  }

  useDerivedValue(()=>{
    //console.log('useDerivedValue', aStateColors.value.themeTitle , aPalette.value.title)
    if(aStateColors.value.themeTitle != aPalette.value.title){
      //console.log('ust')

      if(aPalette.value.title == 'custom'){
        aStateColors.value = {
          ...aStateColors.value,
          themeTitle: aPalette.value.title
        }
      } else {
        aStateColors.value = {
          id: 'basics-accents-primary',
          color: aPalette.value[aSchema.value].basics.accents.primary,
          path: ['basics', 'accents' , 'primary'],
          schema: aSchema.value,
          themeTitle: aPalette.value.title
        }
      }
    }
  }, [aSchema, aPalette])


  const apply = useSharedValue(false)

  const pointerWakeUp = () => {
    'worklet'
    //console.log('pointerWakeUp')
    if(!(apply.value)){apply.value = true}
  }

  const inputColor = useSharedValue('')

  const pointer = (color) => {
    "worklet";
    if(aStateColors.value && apply.value){
      const {
        path,
        schema
      } = aStateColors.value

      //console.log('pointer ', color, aPalette.value.scheme)
      const newPalette = JSON.parse(JSON.stringify(aPalette.value));

      if(path.length > 2){
        newPalette[schema][path[0]][path[1]][path[2]] = color
      } else {
        newPalette[schema][path[0]][path[1]] = color
      } 
      newPalette.title = 'custom'
      uiStyle.palette.value = 'custom'
      aPalette.value = newPalette

      inputColor.value = color


      if(uiScheme.value == schema){
        //console.log(path)
        if(path.length > 2){
          uiTheme[path[0]][path[1]][path[2]].value = color
        } else {
          uiTheme[path[0]][path[1]].value = color
        } 
      }
    }
  } 
  
  const setColor = useDerivedValue(()=>{
    //console.log('||||||||||||||||', aStateColors.value)
    if(aStateColors.value){return aStateColors.value.color}
    //console.log('|||||||||||| ret')
    return ''
  })

  const aRowIndex = useSharedValue(0)

  const setRowIndex = (index) => {
    aRowIndex.value = index
  }

  return (
    <View
      style={{
        
        width: REDACTORS_ITEM_SIZE.w,
        //backgroundColor: 'blue'
        //paddingBottom: 10,
      }}
    >
      <View style={{flexDirection: 'row', paddingLeft: 8}}>
        <HexInput
          color = {inputColor}
          aStateColors = {aStateColors}

          itemColors = {{
            text: Theme.texts.neutrals.secondary
          }}

        />
        <PaletteCategorys 
          aRowIndex={aRowIndex}
          setRowIndex={setRowIndex}

          itemColors = {{
            text: Theme.texts.neutrals.secondary
          }}

        /> 
      </View>  
       
      <View 
        style={{
          flexDirection: 'row',
          backgroundColor: `${Theme.specials.separator}18`,
          borderRadius: 5,
        }}
      >
        <ColorPointer
          pointer={pointer} 
          pointerWakeUp = {pointerWakeUp}
          setAColor = {setColor}
        />    
        <View
          style={{
            width: LEFT_TOOLS.w,
            //backgroundColor: 'blue'
            //alignContent: 'center',
            //justifyContent: 'center',
          }}
        >
          <ShemaSwitch 
            aSchema={aSchema}
          />
          <PaletteColors
            aStateColors = {aStateColors}
            setAStateColors = {setAStateColors}
            aSchema = {aSchema}
            aPalette = {aPalette}
            aRowIndex={aRowIndex}

            pointerWakeUp = {pointerWakeUp}
          />
          <ColorPath 
            aStateColors = {aStateColors}
          />
        </View>
      </View>
      {false &&
      <Pressable 
        style={[StyleSheet.absoluteFill, {
          backgroundColor: Theme.basics.neutrals.secondary,
          opacity: 0.6,
          justifyContent: 'center',
          alignItems: 'center',
        }]}
        onPress={pointerWakeUp}
      >
        <MaterialCommunityIcons 
          size={32}
          name="play"
          color={Theme.icons.neutrals.secondary}
        />
      </Pressable>}
    </View>
  )
}
export default ColorPicker;


const ShemaSwitch = (props) => {
  const {
    aSchema,
  } = props

  const text = useAnimatedProps(()=>{
    return {
      value: aSchema.value ,
    }
  }, [], TextInputAdapter)

  const press = () =>{ 
    aSchema.value = (aSchema.value == 'light'? 'dark' : 'light')
  }

  const bgc = useAnimatedStyle(()=>({backgroundColor: aSchema.value == 'light'? 'white' : 'black'}))

  const textColor = useAnimatedStyle(()=>({color: aSchema.value == 'light'? 'black' : 'white'}))

  return (
    <Reanimated_Presable
      onPress={press}
      style={[bgc,{
        width: LEFT_TOOLS.w-8,
        height: LEFT_TOOLS.hi-8,
        borderRadius: LEFT_TOOLS.hi/2,
        margin: 4
      }]} 
    >
      <AnimatedTextInput
        style={[textColor, {
          flex: 1,
          textAlign: 'center',
          fontSize: 14,
          fontWeight: '500',
          letterSpacing: 1,
          fontVariant: ['small-caps'],
          //color: 'black'
        }]} 
        caretHidden
        editable={false}
        animatedProps={text}
      />
    </Reanimated_Presable>
    
  )
}

const HexInput = (props) => {
  const {
    color: currentSelectColor,

    aStateColors,

    itemColors
  } = props

  const inputColor = useSharedValue()
  const inputEnabled = useSharedValue(false)

  const hex = useAnimatedProps(()=>{
    return {
      value: inputEnabled.value? inputColor.value : currentSelectColor.value
    }
  }, [], TextInputAdapter)

  const onPressInText = () =>{
    //console.log('onPressInText')
    inputEnabled.value = true
    inputColor.value = currentSelectColor.value
  }

  const [t, setT] = useState(undefined)

  const changeTextColor = (text)=>{
    //console.log('changeTextColor', text)
    let inputText = (text[0] == '#'? text.slice(1) : text)
    inputText = inputText.toLowerCase()
    let outputText = '#'
    const allowedSymbols = '0123456789aAbBcCdDeEfF'

    for(let s of inputText){
      if(allowedSymbols.includes(s)){
        outputText += s
      } else {
      }
    }

    outputText = outputText.toLowerCase()
    //console.log('outputTextr', outputText)
    inputColor.value = outputText

    setT(outputText)
  }

  const changeEnd = ({nativeEvent: {text}})=>{
    //console.log('end', text)
    setT(undefined)
    let outputText = text
    for(let i = 0; i< 7-outputText.length; i++){
      outputText += '0'
    }
    const upd = JSON.parse(JSON.stringify(aStateColors.value));
    upd.color = outputText
    aStateColors.value = upd
    inputEnabled.value = false
  }

  

  return (
    <AnimatedTextInput
      style={[{
        width: 70,
        height: LEFT_TOOLS.hi,
        paddingHorizontal: LEFT_TOOLS.pi,
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 1,
        color: itemColors.text
      }]}
      maxLength = {7}
      textAlign = {'left'}
      contextMenuHidden={true}
      defaultValue={currentSelectColor.value}
      placeholder={'#'}
      value={t}
      onPressIn={onPressInText}
      onChangeText={changeTextColor}
      onEndEditing = {changeEnd}
      {...t? {} : {animatedProps: hex}}
      //animatedProps={hex}
      cursorColor={itemColors.text}
    />
  )
}





const ColorPath = (props) => {
  const {
    aStateColors,
  } = props

  const text = useAnimatedProps(()=>{
    return {
      value: (aStateColors.value?.id).replaceAll('-', `\n`),
    }
  }, [], TextInputAdapter)

  return (
    <AnimatedTextInput
      style={{
        width: LEFT_TOOLS.w,
        //height: CENTER_TOOLS.th,
        color: 'grey',
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '500',
        //letterSpacing: 1,
        //backgroundColor: 'blue',
        fontVariant: ['small-caps'],
      }} 
      multiline
      caretHidden
      editable={false}
      placeholder={'wait'}
      animatedProps={text}
    />
  )
}

const PaletteColors = (props) => {
  const {
    aStateColors,
    setAStateColors,
    aSchema,
    aPalette,

    aRowIndex,

    pointerWakeUp,
  } = props

  return (
    <View
      style={{
        //backgroundColor: 'red',
        height: (ITEM_ROW_SIZE+2*ITEM_ROW_MARGIN)*4,
        width: (ITEM_ROW_SIZE+2*ITEM_ROW_MARGIN)*2,
      }}
    >
      <PaletteRow
        showIndex = {aRowIndex}
        rowIndex = {0}
        category={'b'} 
        aStateColors = {aStateColors}
        setAStateColors = {setAStateColors}
        aSchema = {aSchema}
        aPalette = {aPalette}
        pointerWakeUp={pointerWakeUp}
      />
      <PaletteRow
        showIndex = {aRowIndex}
        rowIndex = {1}
        category={'t'} 
        aStateColors = {aStateColors}
        setAStateColors = {setAStateColors}
        aSchema = {aSchema}
        aPalette = {aPalette}
        pointerWakeUp={pointerWakeUp}
      />
      <PaletteRow
        showIndex = {aRowIndex}
        rowIndex = {2}
        category={'i'} 
        aStateColors = {aStateColors}
        setAStateColors = {setAStateColors}
        aSchema = {aSchema}
        aPalette = {aPalette}
        pointerWakeUp={pointerWakeUp}
      />
      <PaletteRow
        showIndex = {aRowIndex}
        rowIndex = {3}
        category={'s'} 
        aStateColors = {aStateColors}
        setAStateColors = {setAStateColors}
        aSchema = {aSchema}
        aPalette = {aPalette}
        pointerWakeUp={pointerWakeUp}
      />
    </View>
  )
}


const PaletteCategorys = (props) => {
  const {
    aRowIndex,
    setRowIndex,
    itemColors
  } = props

  const setRow = (index) => {
    //rowIndex.value = index
    setRowIndex(index)
  }

  return (
    <View
      style={{
        //paddingHorizontal: RIGHT_TOOLS.p,
        //height: CENTER_TOOLS.,
        //width: RIGHT_TOOLS.w,
        flexDirection: 'row',
        marginLeft: 8
        //backgroundColor: 'red'
      }}
    >
      {Object.values(CATEGORY).map((item, index)=>(
        <CategoryItem 
          key = {item+index}
          keyID = {item+index}
          index = {index}
          checkIndex = {aRowIndex}
          title = {item}
          onPress = {setRow}
          itemColors={itemColors}
        />
      ))}
    </View>
  )
}
const CategoryItem = (props) => {
  const {
    keyID,
    index,
    checkIndex,
    title,
    onPress,
    itemColors,
  } = props

  const showStyle = useAnimatedStyle(()=>{
    return {
      borderColor: withTiming(index == checkIndex.value? itemColors.text : 'transparent', {duration: 180})
    }
  })

  const press = () => {
    onPress(index)
  }

  return (
    <Reanimated_Presable
      onPress={press}
      style={[showStyle, {
        //width: RIGHT_TOOLS.w,
        borderRadius: LEFT_TOOLS.hi/3,
        height: LEFT_TOOLS.hi-4,
        margin: 2,
        borderWidth: 1,
        paddingHorizontal: 4,
        justifyContent: 'center',
        alignItems: 'center'

      }]}
    >
      <Text style={[ {
          fontSize: 13,
          fontWeight: '500',
          letterSpacing: 1,
          fontVariant: ['small-caps'],
          color: itemColors.text,
          textAlign: 'center'
        }]}
      >
        {title}
      </Text>
    </Reanimated_Presable>
  )
}






export const PaletteRow = (props) => {
  const {
    //rowData = [{}]
    showIndex,
    rowIndex,
    category,

    aStateColors,
    setAStateColors,
    aSchema,
    aPalette,
    pointerWakeUp,
  } = props

  const showStyle = useAnimatedStyle(()=>{
    if(showIndex && Number.isInteger(rowIndex)){
      return {
        opacity: rowIndex == showIndex.value? 1 : 0,
        zIndex: rowIndex == showIndex.value? 5 : 1
      }
    }
    return {
      opacity: 1,
      zIndex: 1
    }
  })

  const diPath = [CATEGORY.s, SPECIALS_TYPE.di]
  const sePath = [CATEGORY.s, SPECIALS_TYPE.se]

  const shPath_1 = [CATEGORY.s, SPECIALS_TYPE.sh, ORDER.p]
  const shPath_2 = [CATEGORY.s, SPECIALS_TYPE.sh, ORDER.s]

  const srPath_1 = [CATEGORY.s, SPECIALS_TYPE.sr, ORDER.p]
  const srPath_2 = [CATEGORY.s, SPECIALS_TYPE.sr, ORDER.s]
  const srPath_3 = [CATEGORY.s, SPECIALS_TYPE.sr, ORDER.t]
  const srPath_4 = [CATEGORY.s, SPECIALS_TYPE.sr, ORDER.q]

  return (
    <Reanimated.View
      style={[showStyle, {
        position: 'absolute',
        height: (ITEM_ROW_SIZE+2*ITEM_ROW_MARGIN)*4,
        width: (ITEM_ROW_SIZE+2*ITEM_ROW_MARGIN)*2 ,
      }]}
    >
      {category != 's' && 
      <View
        style={{
          //flexDirection: 'row',
        }}
      >
      {['p','s','t','q'].map((item, index)=>{
        const nPath = [CATEGORY[category], TYPE.n, ORDER[item]]
        const aPath = [CATEGORY[category], TYPE.a, ORDER[item]]
        return (
          <View
            key={'column_'+category+item}
            style={{
              flexDirection: 'row',
            }}
          >
            <PaletteItem
              aStateColors = {aStateColors}
              setAStateColors = {setAStateColors}
              aSchema = {aSchema}
              aPalette = {aPalette}
              keyID={nPath.join('-')}
              path = {nPath}

              pointerWakeUp={pointerWakeUp}
            />
            <PaletteItem 
              keyID={aPath.join('-')}
              aStateColors = {aStateColors}
              setAStateColors = {setAStateColors}
              aSchema = {aSchema}
              aPalette = {aPalette}
              path = {aPath}

              pointerWakeUp={pointerWakeUp}
            />
          </View>
        )
      })}
      </View>}

      {category == 's' && 
      <View
        style={{
          alignItems: 'center'
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >   
        <PaletteItem
          aStateColors = {aStateColors}
          setAStateColors = {setAStateColors}
          aSchema = {aSchema}
          aPalette = {aPalette}
          keyID={diPath.join('-')}
          path = {diPath}

          pointerWakeUp={pointerWakeUp}
        />
        <PaletteItem
          aStateColors = {aStateColors}
          setAStateColors = {setAStateColors}
          aSchema = {aSchema}
          aPalette = {aPalette}
          keyID={sePath.join('-')}
          path = {sePath}

          pointerWakeUp={pointerWakeUp}
        />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >         
          <PaletteItem
            aStateColors = {aStateColors}
            setAStateColors = {setAStateColors}
            aSchema = {aSchema}
            aPalette = {aPalette}
            keyID={shPath_1.join('-')}
            path = {shPath_1}

            pointerWakeUp={pointerWakeUp}
          />
          <PaletteItem 
            aStateColors = {aStateColors}
            setAStateColors = {setAStateColors}
            aSchema = {aSchema}
            aPalette = {aPalette}
            keyID={shPath_2.join('-')}
            path = {shPath_2}

            pointerWakeUp={pointerWakeUp}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >         
          <PaletteItem
            aStateColors = {aStateColors}
            setAStateColors = {setAStateColors}
            aSchema = {aSchema}
            aPalette = {aPalette}
            keyID={srPath_1.join('-')}
            path = {srPath_1}

            pointerWakeUp={pointerWakeUp}
          />
          <PaletteItem 
            aStateColors = {aStateColors}
            setAStateColors = {setAStateColors}
            aSchema = {aSchema}
            aPalette = {aPalette}
            keyID={srPath_2.join('-')}
            path = {srPath_2}

            pointerWakeUp={pointerWakeUp}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >         
          <PaletteItem
            aStateColors = {aStateColors}
            setAStateColors = {setAStateColors}
            aSchema = {aSchema}
            aPalette = {aPalette}
            keyID={srPath_3.join('-')}
            path = {srPath_3}

            pointerWakeUp={pointerWakeUp}
          />
          <PaletteItem 
            aStateColors = {aStateColors}
            setAStateColors = {setAStateColors}
            aSchema = {aSchema}
            aPalette = {aPalette}
            keyID={srPath_4.join('-')}
            path = {srPath_4}

            pointerWakeUp={pointerWakeUp}
          />
        </View>
      </View>}
    </Reanimated.View>
  )
}

const PaletteItem = (props) => {
  const {
    keyID = 'palette_item_',
    aStateColors,
    setAStateColors,
    aSchema,
    aPalette,
    path,

    pointerWakeUp,
  } = props

  //-schema

  //aStateColors
  //-color
  //-schema
  //-ID

  //palette
  //-light ...
  //-dark ...

  const itemColor = useDerivedValue(()=>{
    const thisColor = path.length > 2? aPalette.value[aSchema.value][path[0]][path[1]][path[2]] : aPalette.value[aSchema.value][path[0]][path[1]]
    return thisColor
  }, [aPalette])

  const bg = useAnimatedStyle(()=>{
    //console.log('COLOR_PICKER bg', itemColor.value)
    return {
      backgroundColor: itemColor.value,
      
    }
  }, [itemColor])

  const select = useAnimatedStyle(()=>{
    const selectItem = (aStateColors.value?.id == keyID && aSchema.value == aStateColors.value?.schema)
    //console.log('COLOR_PICKER select', selectItem)
    return {
      opacity: selectItem? 1 : 0,
      borderColor: itemColor.value,
    }
  })

  const press = () => {
    if(!(aStateColors.value?.id == keyID && aSchema.value == aStateColors.value?.schema)){
      //console.log('COLOR_PICKER_SET', keyID, itemColor.value)

      pointerWakeUp()

      setAStateColors({
        themeTitle: aPalette.value.title,
        color: itemColor.value,
        schema: aSchema.value,
        path: path,
        id: keyID
      })
    }
  }

  return (
    <Reanimated_Presable
      key={keyID} 
      style={[{
        margin: ITEM_ROW_MARGIN,
        height: ITEM_ROW_SIZE,
        width: ITEM_ROW_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
      }]}
      onPress={press}
    >
      <Reanimated.View 
        style= {[select, {
          position: 'absolute',
          height: ITEM_ROW_SIZE-6,
          width: ITEM_ROW_SIZE-6,
          borderRadius: (ITEM_ROW_SIZE-6)/2,
          borderWidth: 3,
          backgroundColor: 'transparent'
          //borderColor: 'white'
        }]}
      />

      <Reanimated.View 
        style= {[bg, {
          position: 'absolute',
          height: ITEM_ROW_SIZE-16,
          width: ITEM_ROW_SIZE-16,
          borderRadius: (ITEM_ROW_SIZE-16)/2,
          //borderWidth: 3,
        }]}
      />

    </Reanimated_Presable>
  )
}


export const ColorPointer = (props) => {
    const {
      pointer,
      //aColor: selectColor = undefined,
      pointerWakeUp,
      setAColor,
    } = props

    const translateXH = useSharedValue(0);
    const translateYS = useSharedValue(0);
    const translateXL = useSharedValue(SLIDER_SIZE.w/2);

    const adjustedTranslateXH = useDerivedValue(() => Math.min(Math.max(translateXH.value, 0), BOARD_SIZE.w))
    const adjustedTranslateYS = useDerivedValue(() => Math.min(Math.max(translateYS.value, 0), BOARD_SIZE.h))
    const adjustedTranslateXL = useDerivedValue(() => Math.min(Math.max(translateXL.value, 0), SLIDER_SIZE.w))

    const climbThumbL = useSharedValue(-(THUMBLE_SIZE-SLIDER_SIZE.h)/2);
    const scaleThumbL = useSharedValue(1);

    const H_part = useDerivedValue(()=>interpolate(translateXH.value, INPUT_HL, OUTPUT_H))
    const S_part = useDerivedValue(()=>interpolate(translateYS.value, INPUT_S,  OUTPUT_S))
    const L_part = useDerivedValue(()=>interpolate(translateXL.value, INPUT_HL, OUTPUT_L))

    const no_L_Color = useDerivedValue(()=>{
      const color = HSLToHex(H_part.value, S_part.value, 50)
      return color
    })

    const HSL_Color = useDerivedValue(()=>{
      const color = HSLToHex(H_part.value, S_part.value, L_part.value)
      if(pointer){pointer(color)}
      return color
    })


    const settingPointer = (color)=>{
      'worklet';
      const initHSL = hexToHSL(color)
      translateXH.value = interpolate(initHSL.h, OUTPUT_H, INPUT_HL)
      translateYS.value = interpolate(initHSL.s, OUTPUT_S, INPUT_S)
      translateXL.value = interpolate(initHSL.l, OUTPUT_L, INPUT_HL)

      return true
    }
    
    useDerivedValue(()=>{
      if(setAColor && setAColor.value != ''){
        if(setAColor.value != HSL_Color.value){
          //console.log('||||||||| setting')
          settingPointer(setAColor.value)
          setAColor.value = '' 
        }
      }
    }, [setAColor])

    
    //______________________HS
    
  
    const panGestureEventHS = useAnimatedGestureHandler({
        onStart: (_, context) => {
          pointerWakeUp()
          context.x = adjustedTranslateXH.value;
          context.y = adjustedTranslateYS.value;
        },
        onActive: (event, context) => {
            translateXH.value = Math.min(Math.max(event.x, 0), BOARD_SIZE.w)
            translateYS.value = Math.min(Math.max(event.y, 0), BOARD_SIZE.h)  
        },
    });
  
    const tapGestureEventHS = useAnimatedGestureHandler({
        onStart: (event) => {
          pointerWakeUp()
          translateXH.value = Math.min(Math.max(event.x, 0), BOARD_SIZE.w)
          translateYS.value = Math.min(Math.max(event.y, 0), BOARD_SIZE.h)  
        },
    })

    const NOLBackgroudColor = useAnimatedStyle(() => {
      return {
          backgroundColor: no_L_Color.value,
      }
    })


    const thumbHS = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: adjustedTranslateXH.value },
                { translateY: adjustedTranslateYS.value },
            ],
        }
    })

    //______________________L

    const panGestureEventL = useAnimatedGestureHandler({
        onStart: (_, context) => {
          pointerWakeUp()
          context.x = adjustedTranslateXL.value
        },
        onActive: (event, context) => {translateXL.value = Math.min(Math.max(event.x, 0), SLIDER_SIZE.w)},
    })

    const tapGestureEventL = useAnimatedGestureHandler({
        onStart: (event) => {
          pointerWakeUp()
          translateXL.value = translateXL.value = Math.min(Math.max(event.x, 0), SLIDER_SIZE.w)
        },
    })

    const thumbL = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: adjustedTranslateXL.value },
            ],
        }
    })

    const hslColor = useAnimatedStyle(()=>{
      return {
        backgroundColor: HSL_Color.value
      }
    })


    return (
        <View
            style={{
              //backgroundColor: '#00000010',
            }}
        >
            <TapGestureHandler onGestureEvent={tapGestureEventHS}>
            <Reanimated.View
                style={{
                    padding: THUMBLE_SIZE/2,
                    //backgroundColor: '#00000010',
                    borderTopLeftRadius: THUMBLE_SIZE/2,
                    borderTopRightRadius: THUMBLE_SIZE/2,
                }}
            >
            <PanGestureHandler onGestureEvent={panGestureEventHS}>
            <Reanimated.View style={{ }}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end  ={{ x: 1, y: 0 }}
                    style={{
                        height: BOARD_SIZE.h,
                        width: BOARD_SIZE.w,
                        borderRadius: THUMBLE_SIZE/2 -8,
                    }}
                    colors={RAINBOW}
                >
                  <LinearGradient 
                      start={{ x: 0, y: 0 }}
                      end  ={{ x: 0, y: 1 }}
                      style={{
                          height: BOARD_SIZE.h,
                          width: BOARD_SIZE.w,
                          borderRadius: THUMBLE_SIZE/2 -8,
                          //backgroundColor: 'white'
                      }}
                      colors={['transparent', '#808080']} //Lgradient
                      //animatedProps={lColors}
                  />
                </LinearGradient>
                <Reanimated.View 
                    style={[ thumbHS, NOLBackgroudColor, {
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: THUMBLE_SIZE,
                        height: THUMBLE_SIZE,
                        borderRadius: THUMBLE_SIZE/2,
                        marginLeft: -THUMBLE_SIZE/2,
                        marginTop: -THUMBLE_SIZE/2,
                        borderWidth: 1.0,
                        borderColor: 'rgba(0,0,0,0.2)',
                    }]}
                />
            </Reanimated.View>
            </PanGestureHandler>
            </Reanimated.View>
            </TapGestureHandler>


            <TapGestureHandler onGestureEvent={tapGestureEventL}>
            <Reanimated.View 
                style={{
                    paddingVertical: THUMBLE_SIZE*THUMBLE_SCALE,
                    paddingHorizontal: THUMBLE_SIZE/2,
                    //backgroundColor: '#00000010',
                    borderBottomLeftRadius: THUMBLE_SIZE/2,
                    borderBottomRightRadius: THUMBLE_SIZE/2,
                }}
            >
            <PanGestureHandler onGestureEvent={panGestureEventL}>
            <Reanimated.View style={{ }}>
                <Reanimated_LinearGradient
                    start={{ x: 0, y: 0 }}
                    end  ={{ x: 1, y: 0 }}
                    style={[NOLBackgroudColor, {
                        height: SLIDER_SIZE.h,
                        width: SLIDER_SIZE.w,
                        borderRadius: THUMBLE_SIZE/2 -8
                    }]}
                    colors={['black', 'transparent', 'white']}
                />
                <Reanimated.View 
                    style={[ thumbL, hslColor, {
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: THUMBLE_SIZE,
                        height: THUMBLE_SIZE,
                        borderRadius: THUMBLE_SIZE/2,
                        marginLeft: -THUMBLE_SIZE/2,
                        borderWidth: 1.0,
                        borderColor: 'rgba(0,0,0,0.2)',
                        top: -(THUMBLE_SIZE-SLIDER_SIZE.h)/2
                    }]}
                />
            </Reanimated.View>
            </PanGestureHandler>
            </Reanimated.View>
            </TapGestureHandler>
        </View>
    )
}

const staticStyles = StyleSheet.create({
  
});

