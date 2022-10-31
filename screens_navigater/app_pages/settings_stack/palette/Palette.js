import React, {useCallback, useState, useEffect, useRef} from "react";

import {
    Text, 
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

import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS
} from 'react-native-reanimated';

import { LinearGradient } from "expo-linear-gradient";

import store from "../../../../redux_files/store";
import {connect} from 'react-redux';
import mapStateToProps from "../../../../redux_files/stateToProps";
import mapDispatchToProps from "../../../../redux_files/dispatchToProps";

import { BasePressable } from "../../../../general_components/base_components/BaseElements";

import themesColorsAppList, { themesApp } from "../../../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../../../app_values/Languages";
import { deviceHeight, deviceWidth } from "../../../../app_values/AppDefault";

import ColorPicker from "./color_picker/ColorPicker";

const BACKGROUND_COLOR = 'rgba(0,0,0,0.9)';
const COLORS = [
    '#ffffff',
    '#ff8888',
    '#ff0000',
  '#ff8800',
  '#ffff00',
  '#88ff00',
    '#00ff00',
  '#00ff88',
  '#00ffff',
  '#0088ff',
    '#0000ff',
  '#8800ff',
  '#ff00ff',
  '#ff0088',
    '#ff0000',
  //'black',
  //'white',
];

const COLORS_SECONDARY = []

const { width } = Dimensions.get('window');

const CIRCLE_SIZE = width * 0.3;
const PICKER_WIDTH = width * 0.9;

const Palette = (props) => {

  const back = () => {
    props.r_setHideMenu(false)
    props.navigation.goBack()
  }

  //console.log(props.route.params.themeIndex)
  const pickedColor = useSharedValue(COLORS[0]);
  const primaryColor = useSharedValue(COLORS);
  const secondaryColor = useSharedValue(['white', COLORS[0],'black']);
  const [accent, setAccent] = useState(COLORS[0])
  const pickedColorSecondary = useSharedValue(COLORS[0]);

  const onColorChanged = useCallback((color) => {
    'worklet';
    const d2h = (d) => {return (+d).toString(16)}
    //runOnJS(console.log)(d2h(color))

    pickedColor.value = color;

    let newColor = d2h(Math.abs(256*256*256+color))
    
    //newColor = newColor.split('').reverse().join('')
    let add = ''
    for(let i = 0; i<7-newColor.length; i++){
      if(i == 0){
        add += '#'
      } else {
        add += '0'
      }
      
    }
    
    newColor = add+newColor
    secondaryColor.value = ['#ffffff', newColor,'#000000']
    runOnJS(setAccent)(newColor)
  }, []);

  const onColorChangedSecondary = useCallback((color) => {
    'worklet';
    pickedColorSecondary.value = color;

  }, []);

  const rStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: pickedColor.value,
    };
  });

  const rStyleSecondary = useAnimatedStyle(() => {
    return {
      backgroundColor: pickedColorSecondary.value,
    };
  });

  //console.log(secondaryColor.value)
  const open = themesApp[props.route.params.themeIndex]

  return (
    <View style = {{ flex: 1}}>
      <View
        style = {{
          position: 'absolute',
          width: '100%',
          height: '100%',
          flexDirection: 'row',

        }}
      >
        <View style={{flex: 1, backgroundColor: 'black'}}/>
        <View style={{flex: 1, backgroundColor: 'white'}}/>
      </View>
      <View
        style ={{
          width: '100%',
          height: 70,
          //backgroundColor: 'red',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          paddingTop: 30,
          paddingHorizontal: 20
        }}
      >
        
        <BasePressable
          type='i'
          icon={{name: "keyboard-backspace", size: 30, color: 'white'}}
          onPress={back}
        />
      </View>
      
      <View
        style ={{
          flex : 1,
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <View
          style ={{
            flex : 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {false &&<View style={[styles.circle, {backgroundColor: accent}]} />}
          {false &&<Reanimated.View style={[styles.circle, rStyle]} />}
          <Reanimated.View style={[styles.circle, rStyleSecondary]} />
        </View>
        <View
          style ={{
            height: deviceHeight/4,
            width: deviceWidth,
          }}
        >
          <View
            style={{
              height: '100%',
              width: deviceWidth,
              alignItems: 'center',
              justifyContent: 'center',
              //backgroundColor: 'grey'
            }}
          
          >
            <ColorPicker
              colors={primaryColor}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
              maxWidth={PICKER_WIDTH}
              onColorChanged={onColorChanged}
            />

            <ColorPicker
              accent={accent}
              colors={secondaryColor}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
              maxWidth={PICKER_WIDTH}
              onColorChanged={onColorChangedSecondary}
            />

          </View> 
        </View> 
      </View>
    </View>
  );
    
}
export default connect(mapStateToProps('PALETTE_SCREEN'), mapDispatchToProps('PALETTE_SCREEN'))(Palette);


const styles = StyleSheet.create({
  topContainer: {
    flex: 3,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },
  gradient: { height: 20, width: PICKER_WIDTH, borderRadius: 20 },
});