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
  interpolate,
  interpolateColor,
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
  '#ff7f7f',
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
  const [selectColor, setSelectColor] = useState('#')

  const logg = (t)=>{
    console.log(t)
  }

  const onColorChangedSecondary = useCallback((color) => {
    'worklet';

    pickedColorSecondary.value = color;
    runOnJS(setSelectColor)(color)

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

  const open = themesApp[props.route.params.themeIndex]

  const initialColor = '#6b8e23'//'#af5657'

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
        <View style={{flex: 1, backgroundColor: 'white'}}/>
        <View style={{flex: 1, backgroundColor: 'black'}}/>
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
          
          {false &&<Reanimated.View style={[styles.circle, rStyle]} />}
          {<Reanimated.View style={[styles.circle, {backgroundColor: initialColor}]} >
            <Reanimated.View style={[styles.circle,rStyleSecondary, {height: CIRCLE_SIZE-20, width: CIRCLE_SIZE-20, borderRadius: (CIRCLE_SIZE-20)/2}]} />
          </Reanimated.View>}

          <Text style={{color: 'grey'}}>{selectColor}</Text>
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
              accent={accent}
              colors={secondaryColor}

              style={styles.gradient}
              maxWidth={PICKER_WIDTH}
              onColorChanged={onColorChangedSecondary}

              initialValue={initialColor}
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  gradient: { height: 20, width: PICKER_WIDTH, borderRadius: 20 },
});