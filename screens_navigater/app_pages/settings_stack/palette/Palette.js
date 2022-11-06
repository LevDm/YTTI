import React, {useCallback, useState, useEffect, useRef} from "react";

import {
    Appearance,
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


import { statusBarHeight } from "../../../../app_values/AppDefault";

import ColorPicker from "./color_picker/ColorPicker";


const BACKGROUND_COLOR = 'rgba(0,0,0,0.9)';
const { width } = Dimensions.get('window');

const CIRCLE_SIZE = width * 0.3;
const PICKER_WIDTH = width * 0.9;

const Palette = (props) => {

  const [LanguageAppIndex, setLanguageAppIndex] = useState(languagesApp.indexOf(props.appConfig.languageApp));//ThemesColorsAppList[ThemeColorsAppIndex]
  const [ThemeColorsAppIndex, setThemeColorAppIndex] = useState(themesApp.indexOf(props.appStyle.palette.theme));//LanguagesAppList[LanguageAppIndex]

  const [appStyle, setAppStyle] = useState(props.appStyle);
  const [ThemeSchema, setThemeSchema] = useState(props.appStyle.palette.scheme == 'auto'? Appearance.getColorScheme() : props.appStyle.palette.scheme)
  const [appConfig, setAppConfig] = useState(props.appConfig);

  store.subscribe(() => {
    const jstore = store.getState();

    if(LanguageAppIndex != languagesApp.indexOf(jstore.appConfig.languageApp)){
      setLanguageAppIndex(languagesApp.indexOf(jstore.appConfig.languageApp))
    }

    if(ThemeColorsAppIndex != themesApp.indexOf(jstore.appStyle.palette.theme)){
      setThemeColorAppIndex(themesApp.indexOf(jstore.appStyle.palette.theme));
    }

    if(ThemeSchema != jstore.appStyle.palette.scheme){
      setThemeSchema(jstore.appStyle.palette.scheme == 'auto'? Appearance.getColorScheme() : jstore.appStyle.palette.scheme);
    }

    if (appStyle != jstore.appStyle) {
      setAppStyle(jstore.appStyle);
    }

    if (appConfig != jstore.appConfig) {
      setAppConfig(jstore.appConfig);
    }
  })

  const [listenerColorSheme, setListinerColorScheme] = useState(Appearance.getColorScheme())
  useEffect(()=>{
    if(listenerColorSheme){
      if(appStyle.palette.scheme == 'auto' && listenerColorSheme != ThemeSchema){
        //console.log('pallete accept new color sheme', listenerColorSheme, 'used shema', appStyle.palette.scheme)
        setThemeSchema(listenerColorSheme)
      }
    }
  },[listenerColorSheme])
  
  Appearance.addChangeListener(({colorScheme})=>{
    setListinerColorScheme(colorScheme)
  })

  const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
  const Language = languagesAppList[LanguageAppIndex]

  const back = () => {
    props.r_setHideMenu(false)
    props.navigation.goBack()
  }
  const open = themesApp[props.route.params.themeIndex]

  const pickedColorSecondary = useSharedValue('');

  const logg = (t)=>{
    console.log(t)
  }

  const onColorChangedSecondary = useCallback((color) => {
    'worklet';
    pickedColorSecondary.value = color;
    //runOnJS(setSelectColor)(color)
  }, []);

  const rStyleSecondary = useAnimatedStyle(() => {
    return {
      backgroundColor: pickedColorSecondary.value,
    };
  });

  

  const initialColor = '#6b8e23'//'#af5657'

  return (
    <View style = {{ flex: 1}}>
      <View
        style ={{
          width: '100%',
          height: statusBarHeight + 45,
          backgroundColor: Theme.basics.accents.primary,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: 30,
          paddingHorizontal: 20
        }}
      >
        <BasePressable
          type='i'
          icon={{name: "keyboard-backspace", size: 30, color: Theme.icons.neutrals.primary }}
          style={{
            height: 45, 
            width: 45, 
            borderRadius: appStyle.borderRadius.additional
          }}
          onPress={back}
          android_ripple={{
            color: Theme.texts.neutrals.primary,
            borderless: true,
            foreground: false
          }}
        />
        <Text
          style = {[staticStyles.headerText, {
            marginLeft: 15,
            color: Theme.texts.neutrals.primary
          }]}
        >
          creater customs themes
        </Text>
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
          {<Reanimated.View style={[staticStyles.circle, {backgroundColor: initialColor}]} >
            <Reanimated.View style={[staticStyles.circle,rStyleSecondary, {height: CIRCLE_SIZE-20, width: CIRCLE_SIZE-20, borderRadius: (CIRCLE_SIZE-20)/2}]} />
          </Reanimated.View>}
        </View>
        <View
          style ={{
            height: deviceHeight/4,
            width: deviceWidth,
            //backgroundColor: 'red'
          }}
        >
          <ColorPicker
            onColorChanged={onColorChangedSecondary}
            initialValue={initialColor}

            ThemeColorsAppIndex={ThemeColorsAppIndex}
            ThemeSchema={ThemeSchema}
            LanguageAppIndex={LanguageAppIndex}
            appStyle={appStyle}
            appConfig={appConfig}
          />
        </View> 
      </View>
    </View>
  );
    
}
export default connect(mapStateToProps('PALETTE_SCREEN'), mapDispatchToProps('PALETTE_SCREEN'))(Palette);


const staticStyles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontVariant: ['small-caps'],
  },
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