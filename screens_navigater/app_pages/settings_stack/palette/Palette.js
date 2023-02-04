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

import dataRedactor from "../../../../async_data_manager/data_redactor";

import store from "../../../../redux_files/store";
import {connect} from 'react-redux';
import mapStateToProps from "../../../../redux_files/stateToProps";
import mapDispatchToProps from "../../../../redux_files/dispatchToProps";

import { BasePressable, BaseTextInput } from "../../../../general_components/base_components/BaseElements";

import themesColorsAppList, { themesApp } from "../../../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../../../app_values/Languages";
import { deviceHeight, deviceWidth } from "../../../../app_values/AppDefault";


import { statusBarHeight } from "../../../../app_values/AppDefault";

import ColorPicker, { hexToHSL, HSLToHex } from "./elemens_pickers/ColorPicker";
import ShemePicker from "./elemens_pickers/SchemePicker";
import { ScrollView } from "react-native";


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

  const getContrast = (hcolor) => {
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
  
  const copyAppStyle = (copied)=>{
    const copy = {}
    for(let el in copied){
        if(el == 'customTheme'){continue}
        if((typeof copied[el] != 'object') || (Array.isArray(copied[el]))){
            copy[el] = copied[el]
        } else {
            copy[el] = copyAppStyle(copied[el])
        }
    }
    return copy
  }

  const saveCustomTheme = () => {
    //console.log('custom theme full save', appStyle)
    let newAppStyle = copyAppStyle(appStyle)
    newAppStyle.customTheme = currentCustomTheme
    themesColorsAppList.splice(0,1,currentCustomTheme)

    //setAppStyle(newAppStyle);
    props.r_setAppStyle(newAppStyle);
    dataRedactor("storedAppStyle",newAppStyle);
  }

  const back = () => {
    saveCustomTheme()

    //props.r_setHideMenu(false)
    props.navigation.goBack()
  }

  const open = themesApp[props.route.params.themeIndex]
  console.log(open, themesColorsAppList[props.route.params.themeIndex].light.theme, '|')
  const primeStateName = 'Your custom theme name'
  const [ themeName, setThemeName ] = useState(primeStateName)
  
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

  const [initialColor, setInitialValue] = useState() //'#6b8e23'//'#af5657'
  const [colorsPickerVisible, setColorsPickerVisible] = useState(false)
  const [shemesPickerVisible, setShemesPickerVisible] = useState(false)

  const [ stateOpenedColor, setStateOpenedColor ] = useState()

  const copyObject = (copied, currentTrace, listStates )=>{
    const copy = {}
    //let newTrace
    for(let el in copied){  
      let newTrace = [...currentTrace, el]
      if((typeof copied[el] != 'object') || (Array.isArray(copied[el]))){        
        let copyValue = copied[el]
        for(let colorState of listStates){
          if( typeof colorState.trace != 'string'){
            if(newTrace.join('-') == colorState.trace.join('-')){
              //console.log('find element. trace find & color',newTrace.join('-'), colorState.trace.join('-'))
              copyValue = colorState.value
              break
            } 
          } else {
            if((colorState.scheme && (newTrace[0] == colorState.scheme)) || !colorState.scheme){
              if(colorState.trace.includes(newTrace[newTrace.length-2])){
                //console.log('find element. trace find & color', el)
                let color = listStates[Object.keys(copied).indexOf(el)].value
                if(color == ''){color = copied[el]}
                copyValue = color
                break
              } 
              else if (colorState.trace.includes(newTrace[newTrace.length-1])){
                copyValue = colorState.value
                break
              }
            }
            
          }
        }
        copy[el] = copyValue
      } else {
        copy[el] = copyObject(copied[el], newTrace, listStates)
      }
    }
    return copy
  }

  const [currentCustomTheme, setCurrentCustomTheme] = useState(copyObject(themesColorsAppList[props.route.params.themeIndex], [], [{value: themesColorsAppList[props.route.params.themeIndex].light.theme, trace: 'theme'}]))

  const checkAlphaColor = (color)=>{
    return color+stateOpenedColor.alpha
  }

  const applyNewStateColor = (changeColor) => {
    const stateColor = {
      value: checkAlphaColor(changeColor) ,//+ stateOpenedColor.alpha,
      trace: stateOpenedColor.trace
    }
    let ret = copyObject(currentCustomTheme, [], [stateColor])
    //console.log(ret)

    setCurrentCustomTheme(ret)
  }

  const accentsTrasing = (accentColor, type) => {
    const HSLcolor = hexToHSL(accentColor) //to hsl

    let states = []
    for(let i=0; i< 4; i++){
      let newL = 0  
      if(type=='light'){
        newL = Math.min(HSLcolor.l +10*i, 100)
      } else {
        newL = Math.max(HSLcolor.l -10*i, 0)
      }
      states.push(
        {
          value: HSLToHex(HSLcolor.h, HSLcolor.s, newL),
          trace: 'accents thumb active outline',
          scheme: stateOpenedColor.trace[0]
        }
      )
    }
    
    let ret = copyObject(currentCustomTheme, [], states)

    //console.log('accent/thumb'.split('/'))
    //console.log(ret)
    setCurrentCustomTheme(ret)
  }

  const trasing = (accentColor, type) => {
    //type = 'neutrals', 'grounds
    const range = {
      primary: 0,
      secondary: 1,
      tertiary: 2
    }
    let states = []
    for(let i=0; i < 3; i++){
      states.push(
        {
          value: i == range[stateOpenedColor.trace[stateOpenedColor.trace.length-1]]? accentColor : '',
          trace: type,
          scheme: stateOpenedColor.trace[0]
        }
      )
    }
    let ret = copyObject(currentCustomTheme, [], states)
    //console.log(ret)
    setCurrentCustomTheme(ret)
  }

  const onShemeChangedSecondary=(scheme)=>{
    const stateColor = {
      value: scheme,
      trace: stateOpenedColor.trace
    }
    let ret = copyObject(currentCustomTheme, [], [stateColor])
    setCurrentCustomTheme(ret)
  }

  const pressColor = (color, trace) => {
    const okTrace = !trace[0]? trace.slice(1) : trace
    console.log('press', color, okTrace)
    if(color[0] == '#'){
      setInitialValue(color)
      setStateOpenedColor({
        value: color,
        alpha: color.length > 7? color.slice(7) : '',
        trace: trace,
      })
      //console.log('alpha', color.length > 7? color.slice(7) : '')=
      shemesPickerVisible? setShemesPickerVisible(false) : null
      !colorsPickerVisible? setColorsPickerVisible(true) : null
    } else {
      if(trace.includes('statusBar')){
        setStateOpenedColor({
          value: color,
          trace: trace,
        })
        !shemesPickerVisible? setShemesPickerVisible(true) : null
        colorsPickerVisible? setColorsPickerVisible(false) : null
      }
    }
  }

  const exit = (fasterText)=>{
    //console.log('exit', fasterText)
    let ret = copyObject(currentCustomTheme, [], [{value: fasterText, trace: 'theme'}])
    setCurrentCustomTheme(ret)
  }


  const focus = ()=> {
    shemesPickerVisible? setShemesPickerVisible(false) : null
    colorsPickerVisible? setColorsPickerVisible(false) : null
  }

  const renderColors = (objColors, generals = false, start = false, trace = []) => {
    //let newTrace = [...trace, item]
    //generals? newTrace.push(generals) : null

    const textColor = getContrast((trace.length>0? trace[0] : generals) == 'light'? '#fffffe' : '#000000' )

    return(
      <View
        key = {`color_general_${Math.random()}_${generals}`}
        style={{
          marginLeft: !start? 10 : 0,
        }}
      >
        {!start && <Text style={{fontSize: 14, fontWeight: 'bold', color: textColor}} >{generals}:</Text>}
        {Object.keys(objColors).map((item, index)=>{
          if(typeof objColors[item] == 'string'){
            return (
              <View
                key = {`color_${generals? generals : ''}_${item}_${index}`}
                style={{
                  height: 31,
                  marginLeft: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderColor: textColor,
                  marginBottom: 1,
                  paddingHorizontal: 5
                }}
              >
                <Text style={{fontSize: 14, color: textColor, fontWeight: ['theme', 'scheme', 'statusBar'].includes(item)? 'bold' : 'normal'}}>{item}:</Text>
                {(item != 'scheme' && item != 'theme') &&
                <BasePressable
                  type="t"
                  text={objColors[item]}
                  textStyle={{
                    fontSize: 14,
                    color: objColors[item][0] === '#'? getContrast( objColors[item]) : textColor
                  }}
                  style={{
                    height: 29,
                    width: 90,
                    backgroundColor: objColors[item][0] === '#'? objColors[item] : 'transparent',
                    borderRadius:appStyle.borderRadius.additional,
                    borderWidth: 1,
                    borderColor: objColors[item][0] === '#'? getContrast( objColors[item]) : textColor
                  }}
                  onPress={()=>{pressColor(objColors[item], [...trace, generals, item])}}
                />
                }
                {(item === 'scheme' || item === 'theme')  && 
                <Text 
                  style={{
                    height: 29,
                    width: 90,
                    fontSize: 14,
                    //backgroundColor: 'red',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    color: textColor
                  }}
                >{objColors[item]}</Text>
                }
              </View>
            )
          } else {
            
            return (
              <View
                key = {`rc_color_${generals? generals : ''}_${item}_${index}`}
              >
                {renderColors(objColors[item], item, false,[ ...trace, generals])}
              </View>
            )
          }
        })}
      </View>
    )
  }

  
  return (
    <View style = {{ flex: 1}}>
      <View
        style ={{
          width: '100%',
          height: statusBarHeight + 45 + 35,
          backgroundColor: Theme.basics.accents.primary,
    
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style ={{
            width: '100%',
            height: statusBarHeight + 45,
            //backgroundColor: Theme.basics.accents.primary,
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
        <BaseTextInput 
          textValue={themeName}
          setTextValue={setThemeName}
          exit={exit}
          focus={focus}
          paneleStyle={{
            borderColor: Theme.basics.accents.primary,
            backgroundColor: Theme.basics.grounds.primary,
          }}
          textInputProps={{
              style: {
                  color: Theme.texts.neutrals.secondary,
                  fontSize: 16,
                  //minWidth: 90,
              },
              
              placeholder: 'name theme',
              placeholderTextColor: Theme.texts.neutrals.tertiary,
              maxLength: 70,

              selectionColor: Theme.texts.accents.primary,

              //android
              cursorColor: Theme.texts.accents.primary
          }}
          basePressableProps={{
            style: {
              height: 35,
              borderRadius:appStyle.borderRadius.additional,
            },
            styleItemContainer: {
              justifyContent: 'flex-end',
              paddingRight: 15,
              flexDirection: 'row-reverse'
              //alignItems: 'center'
            },
            textStyle: {
              fontSize: 18,
              color: Theme.texts.neutrals.primary
            },
            android_ripple: {
              color: Theme.icons.accents.quaternary,
              borderless: true,
              foreground: false
            },
            type: 'ti',
            icon: {
              name: "pencil-outline", 
              size: 20, 
              color: Theme.icons.neutrals.primary
            },
          }}
        />
      </View>
      <ScrollView
        horizontal = {true}
        snapToInterval={deviceWidth}
        style={{
          
        }}
      >
        <ScrollView
          //horizontal = {true}
          //snapToInterval={deviceWidth}
          showsVerticalScrollIndicator={false}
          style={{
            width: deviceWidth*2,
            //
          }}
          contentContainerStyle={{
            
            flexDirection: 'row',
            

          }}
        >
        {Object.keys(currentCustomTheme).map((item, index)=>{

          return (
            <View
              key = {`theme_oject_${item}_${Math.random()}`}
              
              style={{
                width: deviceWidth,
                paddingTop: 10,
                paddingLeft: 10,
                paddingRight: 20,
                paddingBottom: deviceHeight/3.5,
                backgroundColor: themesColorsAppList[ThemeColorsAppIndex][item].basics.grounds.secondary
              }}
            >
              {renderColors(currentCustomTheme[item], item, true)}
            </View>
          )
        })}
        </ScrollView>
    </ScrollView>
      
      
      <ColorPicker
        visible={colorsPickerVisible}

        applyNewStateColor={applyNewStateColor}
        accentsTrasing={accentsTrasing}
        trasing={trasing}

        onColorChanged={onColorChangedSecondary}
        initialValue={initialColor}
        opened={stateOpenedColor}

        ThemeColorsAppIndex={ThemeColorsAppIndex}
        ThemeSchema={ThemeSchema}
        LanguageAppIndex={LanguageAppIndex}
        appStyle={appStyle}
        appConfig={appConfig}
      />
      <ShemePicker
        visible={shemesPickerVisible}
        onShemeChanged={onShemeChangedSecondary}
        initialValue={ stateOpenedColor != undefined? (stateOpenedColor.value != undefined? stateOpenedColor.value : 'light') : 'light'}

        ThemeColorsAppIndex={ThemeColorsAppIndex}
        ThemeSchema={ThemeSchema}
        LanguageAppIndex={LanguageAppIndex}
        appStyle={appStyle}
        appConfig={appConfig}
      />
    </View>
  );
    
}
export default connect(mapStateToProps('PALETTE_SCREEN'), mapDispatchToProps('PALETTE_SCREEN'))(Palette);

/*
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

          
      </View>
*/
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