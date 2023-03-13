import React, {useCallback, useState, useEffect,  useRef} from "react";

import {
    Appearance,
    Text, 
    Pressable, 
    View,
    TextInput,
    Modal,
    Button, 
    Platform, 
    Image,
    Keyboard, 
    Dimensions, 
    FlatList,
    ToastAndroid, 
    BackHandler, 
    StyleSheet
} from 'react-native';

import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedProps,
  interpolate,
  interpolateColor,
  runOnJS
} from 'react-native-reanimated';

import Constants from "expo-constants";
const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');
const statusBarHeight = Constants.statusBarHeight+1

import { LinearGradient } from "expo-linear-gradient";

import dataRedactor from "../../../../async_data_manager/data_redactor";

import store from "../../../../redux_files/store";
import {connect} from 'react-redux';
import mapStateToProps from "../../../../redux_files/stateToProps";
import mapDispatchToProps from "../../../../redux_files/dispatchToProps";

import { BasePressable, BaseTextInput } from "../../../../general_components/base_components/BaseElements";

import themesColorsAppList, { themesApp } from "../../../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../../../app_values/Languages";

import ColorPicker, { hexToHSL, HSLToHex } from "./elemens_pickers/ColorPicker";
import ShemePicker from "./elemens_pickers/SchemePicker";
import { ScrollView } from "react-native";

import EasePicker from "./ease_mode/EasePicker";
import FullPalettePicker from "./full_mod/FullPalettePicker";

const Reanimated_TextInput = Reanimated.createAnimatedComponent(TextInput);

const BACKGROUND_COLOR = 'rgba(0,0,0,0.9)';
const CIRCLE_SIZE = deviceWidth * 0.3;
const PICKER_WIDTH = deviceWidth * 0.9;

const easeUpdate = (copiedObject, pathList, newValue) => {
  const shemes = ['light', 'dark']
  const newObject = JSON.parse(JSON.stringify(copiedObject));

  const multiPath = Array.isArray(pathList[0])

  for(let i = 0; i<pathList.length; i++){
    const onePathList = multiPath? pathList[i] : pathList
    const oneValue = multiPath? newValue[i] : newValue
    const allShemesUpdate = (onePathList[0] != shemes[0] && onePathList[0] != shemes[1])
    for(let primaryKey of shemes){
      const resPath = allShemesUpdate? [primaryKey, ...onePathList] : onePathList
      //console.log(resPath,'=',oneValue)
      switch(resPath.length){
        case 1: 
          newObject[resPath[0]] = oneValue;
          break;
        case 2: 
          newObject[resPath[0]][resPath[1]] = oneValue;
          break;
        case 3: 
          newObject[resPath[0]][resPath[1]][resPath[2]] = oneValue;
          break;
        case 4: 
          newObject[resPath[0]][resPath[1]][resPath[2]][resPath[3]] = oneValue;
          break;
        case 5: 
          newObject[resPath[0]][resPath[1]][resPath[2]][resPath[3]][resPath[4]] = oneValue;
          break;
        default:
          console.log('!!!>PAINTER_EASE_UPDATE_DOES_NOT_HAVE_THIS_OBJECT_LVL',onePathList.length, onePathList);
      }
      if(!allShemesUpdate){break}
    }
    if(!multiPath){break}
  }
  return newObject
}

const ripple = (color='#ffffff') => ({
  color: `${color}20`,
  borderless: true,
  foreground: false
})

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

    if(JSON.stringify(appStyle) != JSON.stringify(jstore.appStyle)){
      setAppStyle(jstore.appStyle);
    }

    if(JSON.stringify(appConfig) != JSON.stringify(jstore.appConfig)){
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
  const Language = languagesAppList[LanguageAppIndex].SettingsScreen.PainterScreen

  const colorsPickerShow = useSharedValue(-1);
  const shemePickerShow = useSharedValue(-1);
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      colorsPickerShow.value != -1? colorsPickerShow.value = 1 : null
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      colorsPickerShow.value != -1? colorsPickerShow.value = 0 : null
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const backAction = () => {
      back()
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const [savedWindowShow, setSavedWindowShow] = useState(false)

  const exit = () => {
    console.log('exit')
    props.r_setHideMenu(false)
    props.navigation.goBack()
  }

  const back = () => {
    const notEqual = !(JSON.stringify(appStyle.customTheme) == JSON.stringify(currentCustomTheme))
    console.log('back', notEqual)
    if(notEqual){
      setSavedWindowShow(true)
    } else {
      exit()
    }
  }

  const saveAndExit = () => {
    saveCustomTheme()
    closeModal()
    exit()
  }

  const closeModal = () => {
    setSavedWindowShow(false)
  }

  const saveCustomTheme = (saved = false) => {
    const saveObject = saved? saved : currentCustomTheme
    const equal = (JSON.stringify(appStyle.customTheme) === JSON.stringify(saveObject))
    if(!equal){
      const newAppStyle = JSON.parse(JSON.stringify(appStyle));
      newAppStyle.customTheme = saveObject;
      newAppStyle.palette.theme = 'custom';
      newAppStyle.presetUsed = 'YTAT-custom';
      themesColorsAppList.splice(0,1,saveObject)
      props.r_setAppStyle(newAppStyle);
      dataRedactor("storedAppStyle",newAppStyle);
      ToastAndroid.show(Language.saved, ToastAndroid.LONG);
    }
  }

  const [initialColor, setInitialValue] = useState() 
  const [stateOpenedColor, setStateOpenedColor] = useState()

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

  const [modIndex, setModIndex] = useState(props.route.params.modIndex ? props.route.params.modIndex : 0 )
  const [currentCustomTheme, setCurrentCustomTheme] = useState(easeUpdate(themesColorsAppList[props.route.params.themeIndex], ['theme'], 'custom'))

  const checkAlphaColor = (color)=>{
    return color+stateOpenedColor.alpha
  }

  const applyNewStateColor = (changeColor) => {
    const ret = easeUpdate(currentCustomTheme, stateOpenedColor.trace, checkAlphaColor(changeColor))
    setCurrentCustomTheme(ret)
  }

  const gradientTracing = (accentColor, type, copied = false) => {
    const accentsRans = getAccentsTrace(accentColor, type)

    let paths = [
      ['basics','accents', 'primary'],
      ['basics','accents', 'secondary'],
      ['basics','accents', 'tertiary'],
      ['basics','accents', 'quaternary'],

      ['texts','accents', 'primary'],
      ['texts','accents', 'secondary'],
      ['texts','accents', 'tertiary'],
      ['texts','accents', 'quaternary'],

      ['icons','accents', 'primary'],
      ['icons','accents', 'secondary'],
      ['icons','accents', 'tertiary'],
      ['icons','accents', 'quaternary'],
    ]

    
    if(stateOpenedColor? stateOpenedColor.trace[0] == 'light' || stateOpenedColor.trace[0] == 'dark' : false){
      console.log('add shema accents tracing')
      paths = paths.map((item)=>[ stateOpenedColor.trace[0], ...item])
    }

    const values = [
      ...Object.values(accentsRans),

      ...Object.values(accentsRans),

      ...Object.values(accentsRans),
    ]

    //console.log(values)

    
    if(copied){
      return easeUpdate(copied, paths, values) 
    }
    let ret = easeUpdate(currentCustomTheme, paths, values) 
    setCurrentCustomTheme(ret)
  }

  const symbolsTasing = (primaryColor, copied = false) => {

    let paths = [
      ['texts','neutrals', 'primary'],

      ['icons','neutrals', 'primary'],
    ]

    if(stateOpenedColor? stateOpenedColor.trace[0] == 'light' || stateOpenedColor.trace[0] == 'dark' : false){
      console.log('add shema symb tracing')
      paths = paths.map((item)=>[ stateOpenedColor.trace[0], ...item])
    }

    const values = [
      primaryColor,

      primaryColor,
    ]

    if(copied){
      return easeUpdate(copied, paths, values) 
    } 
    let ret = easeUpdate(currentCustomTheme, paths, values)
    setCurrentCustomTheme(ret)
  }



  const valueTacing = (color ) => {
    let paths = [[...stateOpenedColor.trace.slice(1)]]
    console.log('p0',paths)
    const ground = ['basics','texts','icons']
    for(let item of ground){
      if(stateOpenedColor.trace[1] != item){
        const newP = [item, ...stateOpenedColor.trace.slice(2)]
        if(newP.slice(0, 2).join('-') != ['basics', 'neutrals'].join('-')){
          paths.push(newP)
        }
      }
    } 
    

    console.log('p1',paths)
  
    if(stateOpenedColor? stateOpenedColor.trace[0] == 'light' || stateOpenedColor.trace[0] == 'dark' : false){
      console.log('add shema symb tracing')
      paths = paths.map((item)=>[ stateOpenedColor.trace[0], ...item])
    }

    let values = []
    for(let i = 0; i<paths.length;i++){values.push(color)}

    let ret = easeUpdate(currentCustomTheme, paths, values)
    setCurrentCustomTheme(ret)
  }

  const valueGradient = (color, type ) => {
    const accentsRans = getAccentsTrace(color, type)

    let paths = [[...stateOpenedColor.trace.slice(1)]]
    console.log('gp0',paths)

    for(let item of Object.keys(accentsRans)){
      if(stateOpenedColor.trace[3] != item){
        paths.push([...stateOpenedColor.trace.slice(1, 3), item])
      }
    } 

    console.log('gp1',paths)
  
    if(stateOpenedColor? stateOpenedColor.trace[0] == 'light' || stateOpenedColor.trace[0] == 'dark' : false){
      console.log('add shema symb tracing')
      paths = paths.map((item)=>[ stateOpenedColor.trace[0], ...item])
    }

    let values = []
    for(let i = 0; i<paths.length;i++){values.push(Object.values(accentsRans)[i])}

    let ret = easeUpdate(currentCustomTheme, paths, values)
    setCurrentCustomTheme(ret)
  }

  const getAccentsTrace = (accentColor, type) => {
    const HSLcolor = hexToHSL(accentColor) //to hsl

    const accentsRans = {
      primary: '',
      secondary: '',
      tertiary: '',
      quaternary: '',
    }

    for(let i=0; i<4; i++){
      let newL = 0  
      if(type=='light'){
        newL = Math.min(HSLcolor.l +10*i, 100)
      } else {
        newL = Math.max(HSLcolor.l -10*i, 0)
      }
      accentsRans[Object.keys(accentsRans)[i]] = HSLToHex(HSLcolor.h, HSLcolor.s, newL)
    }

    return accentsRans
  }

  const onShemeChangedSecondary=(scheme)=>{
    let ret = easeUpdate(currentCustomTheme, ['statusBar'], scheme)
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
      shemePickerShow.value = -1
      colorsPickerShow.value = 0
    } else {
      if(trace.includes('statusBar')){
        setStateOpenedColor({
          value: color,
          trace: trace,
        })
        shemePickerShow.value = 0
        colorsPickerShow.value = -1
        
      }
    }
  }

  const buildPalette = (primaryAccent, typeAccents, primarySymbols) => {
    const palette1 = easeUpdate(currentCustomTheme, ['statusBar'], 'auto')
    const palette2 = symbolsTasing(primarySymbols, palette1)
    const palette3 = gradientTracing(primaryAccent, typeAccents, palette2)
    saveCustomTheme(palette3)
    setCurrentCustomTheme(palette3)
  }

  const modes = [Language.easeMod.title, Language.fullMod.title, Language.fullMod.title]
  const themes = ['', Language.themes.light, Language.themes.dark]
  
  const PICKER_AREA_HEIGHT = 270

  const subTitle = useSharedValue({mod: modes[modIndex], theme: themes[modIndex]})

  const scrolling = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x
    const scrollIndex = Math.abs(Math.round(scrollX/deviceWidth))
    //console.log(scrollIndex)
    subTitle.value = {mod: modes[scrollIndex], theme: themes[scrollIndex]}
    if(scrollIndex == 0){
      shemePickerShow.value = -1
      colorsPickerShow.value = -1
    }
  }

  const modText = useAnimatedProps(()=>{
    const text = `${subTitle.value.mod} ${Language.mod}`
    //console.log(text)
    return {
      text: text,
      value: text
    }
  })

  const themeText = useAnimatedProps(()=>{
    const text = subTitle.value.theme
    //console.log(text)
    return {
      text: text,
      value: text
    }
  })
  
  return (
    <View style = {{ flex: 1}}>
      <View
        style ={{
          width: '100%',
          paddingTop: statusBarHeight,
          height: statusBarHeight+45+35,
          backgroundColor: 'black',   
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          borderBottomWidth: 2,
          borderColor: 'white'
        }}
      >
        <View
          style ={{
            width: deviceWidth/2,
            height: 45,
            paddingHorizontal: 3
          }}
        >
          <View
            style = {{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',                    
            }}
          >
            <BasePressable
              type='i'
              icon={{name: "keyboard-backspace", size: 24, color: 'white' }}
              style={{
                height: 45, 
                width: 45,
                paddingTop: 4,
                marginLeft: 15,
                borderRadius: 22.5//appStyle.borderRadius.additional
              }}
              onPress={back}
              android_ripple={{
                color: 'white',
                borderless: true,
                foreground: false
              }}
            />
            <Text
              style = {[staticStyles.headerText, {
                left: 0,
                color: 'white'
              }]}
            >
              {Language.title}
            </Text>
          </View>
        </View>
        <View
          style ={{
            width: deviceWidth,
            height: 35,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignContent: 'center'
          }}
        >       
          <Reanimated_TextInput
            editable = {false}
            animatedProps={modText}
            style={[staticStyles.text, {flex: 1, textAlign: 'center',  color: 'white'}]}
          />
          <Reanimated_TextInput
            editable = {false}
            animatedProps={themeText}
            style={[staticStyles.text, {flex: 1, textAlign: 'center', color: 'white'}]}
          />
        </View>
      </View>
      

    <ScrollView
      horizontal = {true}
      snapToInterval={deviceWidth}
      contentOffset={{x: modIndex*deviceWidth, y: 0}}
      onScroll={scrolling}
      style={{
        backgroundColor: 'black'
      }}
      decelerationRate = {'fast'}
    >
      <View
        style={{
          width: deviceWidth,
          height: deviceHeight,
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <EasePicker getAccentsTrace={getAccentsTrace} buildPalette={buildPalette} LanguageAppIndex={LanguageAppIndex}/>
      </View>

      <FullPalettePicker
        pressColor = {pressColor}
        currentTrace={stateOpenedColor? stateOpenedColor.trace.join('-') : undefined}
        currentCustomTheme = {currentCustomTheme}
      />
    </ScrollView>
      
    <ColorPicker
      show={colorsPickerShow}

      applyNewStateColor={applyNewStateColor}
      valueGradient={valueGradient}
      valueTacing={valueTacing}

      initialValue={initialColor}
      opened={stateOpenedColor}

      LanguageAppIndex={LanguageAppIndex}
    />

    <ShemePicker
      show={shemePickerShow}

      onShemeChanged={onShemeChangedSecondary}
      initialValue={currentCustomTheme[stateOpenedColor? stateOpenedColor.trace[0] : 'light'].statusBar}

      LanguageAppIndex={LanguageAppIndex}
    />

    <Modal
      visible={savedWindowShow}
      animationType={'fade'}
      transparent={true}
    >
    <Pressable 
      style={{flex: 1, backgroundColor: '#000000a0'}}
      onPress={closeModal}
    />
    <View
        style={{
          padding: 15,
          position: 'absolute',
          top: .375*deviceHeight,
          left: .125*deviceWidth,
          height: .25*deviceHeight,
          width: .75*deviceWidth,
          borderWidth: 1,
          borderColor: 'white',
          borderRadius: 20,
          backgroundColor: 'black'
        }}
      >
        <Text style = {[staticStyles.headerText, {flex: 1, color: 'white',}]}>{Language.isNew}</Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',  
            backgroundColor: '#00000001'
          }}
        >
          <Pressable
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 5
            }}
            android_ripple={ripple()}
            onPress={saveAndExit}
          >
            <Text style = {[staticStyles.headerText, { color: 'white',fontSize: 14}]}>{Language.isNewActions.y}</Text>
          </Pressable>
          <Pressable
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 5
            }}
            android_ripple={ripple()}
            onPress={closeModal}
          >
            <Text style = {[staticStyles.headerText, { color: 'white',fontSize: 14}]}>{Language.isNewActions.n}</Text>
          </Pressable>
          <Pressable
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 5
            }}
            android_ripple={ripple()}
            onPress={exit}
          >
            <Text style = {[staticStyles.headerText, {color: 'white',fontSize: 12}]}>{Language.isNewActions.yn}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
    </View>
  );
    
}
export default connect(mapStateToProps('PALETTE_SCREEN'), mapDispatchToProps('PALETTE_SCREEN'))(Palette);


const staticStyles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: 0.5,
    fontVariant: ['small-caps'],
  },
  text: {
    fontSize: 16,
    //opacity: .9,
    fontWeight: '500',
    fontVariant: ['small-caps'],
    //color:  'white'//ThemesColorsAppList[0].skyUpUpUp//
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