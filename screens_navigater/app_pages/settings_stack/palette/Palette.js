import React, {useCallback, useState, useEffect, useMemo, useRef} from "react";

import {
    Appearance,
    Text, 
    Pressable, 
    View,
    ScrollView,
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

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import Reanimated, {
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withDelay,
  withSequence, 
  useAnimatedScrollHandler,
  useAnimatedProps, 
  cancelAnimation,
  useAnimatedRef,
  useDerivedValue,
  scrollTo,
  runOnJS,
  interpolateColor,
  interpolate,
  Extrapolate,
  runOnUI,
  Easing,
  Extrapolation 
} from 'react-native-reanimated';

import Constants from "expo-constants";
const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');
const statusBarHeight = Constants.statusBarHeight+1

import { LinearGradient } from "expo-linear-gradient";

import dataRedactor from "../../../../app_async_data_manager/data_redactor";

import store from "../../../../app_redux_files/store";
import {connect} from 'react-redux';
import mapStateToProps from "../../../../app_redux_files/stateToProps";
import mapDispatchToProps from "../../../../app_redux_files/dispatchToProps";

import { TabActions } from "@react-navigation/native";

import { BasePressable, BaseTextInput } from "../../../../general_components/base_components/BaseElements";

import themesColorsAppList, { themesApp } from "../../../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../../../app_values/Languages";

import StyleChangePreview from "../settings/preview/StyleChangePreview";

import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetVirtualizedList,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

import ColorPicker, { hexToHSL, HSLToHex } from "./elemens_pickers/ColorPicker";

import EasePicker from "./ease_mode/EasePicker";
import FullPalettePicker from "./full_mod/FullPalettePicker";

const Reanimated_TextInput = Reanimated.createAnimatedComponent(TextInput);
const Reanimated_Pressable = Reanimated.createAnimatedComponent(Pressable);
const BACKGROUND_COLOR = 'rgba(0,0,0,0.9)';
const CIRCLE_SIZE = deviceWidth * 0.3;
const PICKER_WIDTH = deviceWidth * 0.9;

import {fullPaletteObjectUPD} from './Tools'

const ripple = (color='#ffffff') => ({
  color: `${color}20`,
  borderless: true,
  foreground: false
})

const STATUSBAR_COLOR = '#333'

const MODAL_SEPARATOR_COLOR = '#ffffff30'
const PREVIEW_COLOR = '#333'
const PREVIEW_HANDLE_COLOR = 'white'
const PREVIEW_ICON_COLOR = 'white'
const TOOLBAR_TEXT_COLOR = 'white'
const FRAMES_COLOR = 'black'

const TOOLBAR_HEIGHT = 46

const PICKER_AREA_HEIGHT = 270

const bottomSheetHeadHeight = 33
const previewToolBArHeight = 46
const previewHeight = deviceHeight/2 + 2
const bottomMargin = bottomSheetHeadHeight

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

    if(appStyle != jstore.appStyle){
      //previewAppStyleA.value = jstore.appStyle
      setAppStyle(jstore.appStyle);
    }

    if(appConfig != jstore.appConfig){
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
  const LanguagePreview = languagesAppList[LanguageAppIndex].SettingsScreen.preview
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
    //props.navigation.navigate("settingsStack", {screen: "settings", params: {newCustomPallete: true}})
  }

  const back = () => {
    //const notEqual = !(JSON.stringify(appStyle.customTheme) == JSON.stringify(currentCustomTheme))
    const notEqual = !(JSON.stringify(appStyle.customTheme) == JSON.stringify(currentPalette.value))
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
    const saveObject = saved? saved : currentPalette.value // currentCustomTheme
    const equal = (JSON.stringify(appStyle.customTheme) === JSON.stringify(saveObject))
    if(!equal){
      saveObject.title = 'custom'
      themesColorsAppList.splice(0,1,saveObject)

      const newAppStyle = JSON.parse(JSON.stringify(appStyle));
    
      newAppStyle.customTheme = saveObject;
      //newAppStyle.palette.theme = 'custom';
      //newAppStyle.presetUsed = 'YTTI-custom';
      
      props.r_setAppStyle(newAppStyle);
      dataRedactor("storedAppStyle",newAppStyle);
      ToastAndroid.show(Language.saved, ToastAndroid.LONG);
    }
  }

  //const [initialColor, setInitialValue] = useState() 
  const selectColor = useSharedValue()

  //const [stateOpenedColor, setStateOpenedColor] = useState()
  const paramsSelectColor = useSharedValue()


  const checkAlphaColor = (color, alpha)=>{
    return color+alpha
  }

  const applyNewStateColor = (changeColor) => {
    //const ret = easeUpdate(currentCustomTheme, paramsSelectColor.value.trace, checkAlphaColor(changeColor))
    //setCurrentCustomTheme(ret)
    const ret = fullPaletteObjectUPD(currentPalette.value, paramsSelectColor.value.trace, checkAlphaColor(changeColor, paramsSelectColor.value.alpha))
    currentPalette.value = ret
    previewAppFullPalette.value = ret
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

    
    if(paramsSelectColor.value? paramsSelectColor.value.trace[0] == 'light' || paramsSelectColor.value.trace[0] == 'dark' : false){
      console.log('add shema accents tracing')
      paths = paths.map((item)=>[ paramsSelectColor.value.trace[0], ...item])
    }

    const values = [
      ...Object.values(accentsRans),

      ...Object.values(accentsRans),

      ...Object.values(accentsRans),
    ]

    //console.log(values)

    
    if(copied){
      return fullPaletteObjectUPD(copied, paths, values) 
    }
    //let ret = easeUpdate(currentCustomTheme, paths, values) 
    //setCurrentCustomTheme(ret)
    const ret = fullPaletteObjectUPD(currentPalette.value, paths, values) 
    currentPalette.value = ret
    previewAppFullPalette.value = ret
  }

  const symbolsTasing = (primaryColor, copied = false) => {

    let paths = [
      ['texts','neutrals', 'primary'],

      ['icons','neutrals', 'primary'],
    ]

    if(paramsSelectColor.value? paramsSelectColor.value.trace[0] == 'light' || paramsSelectColor.value.trace[0] == 'dark' : false){
      console.log('add shema symb tracing')
      paths = paths.map((item)=>[ paramsSelectColor.value.trace[0], ...item])
    }

    const values = [
      primaryColor,

      primaryColor,
    ]

    if(copied){
      return fullPaletteObjectUPD(copied, paths, values) 
    } 
    //let ret = easeUpdate(currentCustomTheme, paths, values)
    //setCurrentCustomTheme(ret)
    const ret = fullPaletteObjectUPD(currentPalette.value, paths, values) 
    currentPalette.value = ret
    previewAppFullPalette.value = ret
  }



  const valueTacing = (color ) => {
    let paths = [[...paramsSelectColor.value.trace.slice(1)]]
    console.log('p0',paths)
    const ground = ['basics','texts','icons']
    for(let item of ground){
      if(paramsSelectColor.value.trace[1] != item){
        const newP = [item, ...paramsSelectColor.value.trace.slice(2)]
        if(newP.slice(0, 2).join('-') != ['basics', 'neutrals'].join('-')){
          paths.push(newP)
        }
      }
    } 
    

    console.log('p1',paths)
  
    if(paramsSelectColor.value? paramsSelectColor.value.trace[0] == 'light' || paramsSelectColor.value.trace[0] == 'dark' : false){
      console.log('add shema symb tracing')
      paths = paths.map((item)=>[ paramsSelectColor.value.trace[0], ...item])
    }

    let values = []
    for(let i = 0; i<paths.length;i++){values.push(color)}

    //let ret = easeUpdate(currentCustomTheme, paths, values)
    //setCurrentCustomTheme(ret)
    const ret = fullPaletteObjectUPD(currentPalette.value, paths, values) 
    currentPalette.value = ret
    previewAppFullPalette.value = ret
  }

  const valueGradient = (color, type ) => {
    const accentsRans = getAccentsTrace(color, type)

    let paths = [[...paramsSelectColor.value.trace.slice(1)]]
    console.log('gp0',paths)

    for(let item of Object.keys(accentsRans)){
      if(paramsSelectColor.value.trace[3] != item){
        paths.push([...paramsSelectColor.value.trace.slice(1, 3), item])
      }
    } 

    console.log('gp1',paths)
  
    if(paramsSelectColor.value? paramsSelectColor.value.trace[0] == 'light' || paramsSelectColor.value.trace[0] == 'dark' : false){
      console.log('add shema symb tracing')
      paths = paths.map((item)=>[ paramsSelectColor.value.trace[0], ...item])
    }

    let values = []
    for(let i = 0; i<paths.length;i++){values.push(Object.values(accentsRans)[i])}

    //let ret = easeUpdate(currentCustomTheme, paths, values)
    //setCurrentCustomTheme(ret)
    const ret = fullPaletteObjectUPD(currentPalette.value, paths, values) 
    currentPalette.value = ret
    previewAppFullPalette.value = ret
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
    //let ret = easeUpdate(currentCustomTheme, ['statusBar'], scheme)
    //setCurrentCustomTheme(ret)
  }

  const pressColor = (color, trace) => {
    const okTrace = !trace[0]? trace.slice(1) : trace
    console.log('press', color, okTrace)
    if(color[0] == '#'){
      //setInitialValue(color)
      selectColor.value = color
      const newParams = {
        value: color,
        alpha: color.length > 7? color.slice(7) : '',
        trace: trace,
      }
      //setStateOpenedColor(newParams)
      paramsSelectColor.value = newParams
      previewAppFullPalette.value = currentPalette.value
      shemePickerShow.value = -1
      colorsPickerShow.value = 0
    } 
    /* 
    else {
      if(trace.includes('statusBar')){
        setStateOpenedColor({
          value: color,
          trace: trace,
        })
        shemePickerShow.value = 0
        colorsPickerShow.value = -1
        
      }
    }*/
  }

  const buildPalette = (primaryAccent, typeAccents, primarySymbols) => {
    //const palette1 = easeUpdate(currentCustomTheme, ['statusBar'], 'auto')
    const palette1 = fullPaletteObjectUPD(currentPalette.value, ['statusBar'], 'auto')
    const palette2 = symbolsTasing(primarySymbols, palette1)
    const palette3 = gradientTracing(primaryAccent, typeAccents, palette2)
    
    //setCurrentCustomTheme(palette3)
    currentPalette.value = palette3
    previewAppFullPalette.value = palette3
    bottomSheetModalRef.current?.snapToIndex(1);
    
    saveCustomTheme(palette3)
  }

  const modes = [Language.easeMod.title, Language.fullMod.title, Language.fullMod.title]
  const themes = ['', Language.themes.light, Language.themes.dark]
  

  const subTitle = useSharedValue({mod: modes[0], theme: themes[0], section: 0})

  const scrolling = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x
    const scrollIndex = Math.abs(Math.round(scrollX/deviceWidth))
    //console.log(scrollIndex)
    subTitle.value = {mod: modes[scrollIndex], theme: themes[scrollIndex], section: scrollIndex}
    if(scrollIndex == 0){
      shemePickerShow.value = -1
      colorsPickerShow.value = -1
    }
    previewScheme.value = scrollIndex == 2? 'dark' : 'light'
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

  const leftArrow = useAnimatedStyle(()=>{
    console.log('left a',  subTitle.value.section)
    return {
      opacity: subTitle.value.section == 0? 0.5 : 1
    }
  })

  const rightArrow = useAnimatedStyle(()=>{
    console.log('right a',  subTitle.value.section)
    return {
      opacity: subTitle.value.section == 2? 0.5 : 1
    }
  })

  const scrollList = useRef()

  const toScroll = (direction) => {
    const index =  subTitle.value.section
    const offset = deviceWidth*Math.min(Math.max((direction == 'l'? index-1 : index+1), 0), 2)
    scrollList.current.scrollTo({x: offset, y: 0, animated: true})
  }

  // ===============================================================================================

  const previewAppStyleA = useSharedValue()
  /*useDerivedValue(()=>{
    console.log('open',props.route.params)
    const style = props.appStyle
    return style
  }, [props])*/

  const currentPalette = useSharedValue()

  const previewScheme = useSharedValue()


  const previewAppFullPalette = useSharedValue()
  /*
  useDerivedValue(()=>{
    if(currentPalette.value){
      previewAppFullPalette.value = currentPalette.value
    }
  }, [currentPalette]) */

  const previewAppPalette = useSharedValue()
  useDerivedValue(()=>{
    if(previewAppFullPalette.value && previewScheme.value){
      previewAppPalette.value = previewAppFullPalette.value[previewScheme.value]
    }
  })


  useEffect(()=>{
    console.log('PALETTE UE')
    const {
      styles,
      modIndex,
      fullPalette,
      openedScheme,
      //colors,
      themeIndex
    } = props.route.params
    scrollList.current.scrollTo({x: modIndex*deviceWidth, y: 0, animated: true})
    //subTitle.value = {mod: modes[scrollIndex], theme: themes[scrollIndex], section: scrollIndex}
    
    previewAppStyleA.value = styles

    previewScheme.value = openedScheme
    currentPalette.value = fullPalette

    previewAppFullPalette.value = fullPalette
    previewAppPalette.value = fullPalette[openedScheme]//easeUpdate(themesColorsAppList[themeIndex], ['theme'], 'custom')

    console.log(styles, themeIndex)

    console.log(previewAppStyleA, previewAppPalette)

  }, [props.route.params])

  const bottomSheetIndex = useSharedValue(1);

  //console.log('PALETTE PREVIEW', previewAppStyleA)


  const bottomSheetModalRef = useRef();

  const toolPress =()=>{
      console.log('pressj')
      handlePresentModalPress()
  }


  const applyPress =()=>{
      console.log('pressa')
      //applyAppStyle()
  }

  useEffect(()=>{
      bottomSheetIndex.value = 1
      bottomSheetModalRef.current?.present();
  }, [bottomSheetModalRef])

  const snapPoints = useMemo(() => {
    //return([bottomMargin, (previewHeight+bottomMargin+previewToolBArHeight),(previewHeight+bottomMargin+previewToolBArHeight + PICKER_AREA_HEIGHT)])
    return([bottomMargin, (previewHeight+bottomMargin),(previewHeight+bottomMargin+ PICKER_AREA_HEIGHT)])
  }, [bottomMargin]);


  const handlePresentModalPress = useCallback(() => {
      if(bottomSheetIndex.value >= 1){
          bottomSheetModalRef.current?.snapToIndex(0);
          bottomSheetIndex.value = 0
      } else {
          bottomSheetModalRef.current?.present();
          const newIndex = colorsPickerShow.value >= 0? 2 : 1
          bottomSheetModalRef.current?.snapToIndex(newIndex);
          bottomSheetIndex.value = newIndex
      }
  }, [bottomSheetModalRef, bottomSheetIndex]);


  const handleSheetChanges = useCallback((index) => {
      //console.log('handleSheetChanges', index, bottomSheetIndex.value);
      if(index === -1){
          console.log('menu visible', index);
      }
      bottomSheetIndex.value = index

  }, [bottomSheetIndex]);



  return (
  <>
    <View
      style ={{
        width: '100%',
        //paddingTop: statusBarHeight,
        height: statusBarHeight+50+46,
        backgroundColor: 'black',   
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderBottomWidth: 2,
        borderColor: 'white'
      }}
    >
      <View 
        style = {{height: statusBarHeight, width: '100%', backgroundColor: STATUSBAR_COLOR}}
      />
      <View
        style ={{
          width: deviceWidth,
          height: 50,
          paddingHorizontal: 8,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row', 
        }}
      >
        <View
          style = {{
            width: deviceWidth/2,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',                    
          }}
        >
          <BasePressable
            type='i'
            icon={{name: "chevron-left", size: 32, color: 'white' }}
            style={{
              height: 46, 
              width: 46,
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
        <BasePressable 
          type="i"
          icon={{name: "cellphone-cog", size: 24, color: 'white'}}
          style={{
            height: 46,
            width: 46, 
            transform: [{rotate: '180deg'}],
            borderRadius: 12
          }}
          direction='row-reverse'
          onPress={toolPress}
          android_ripple={ripple()}
        />
      </View>
      <View
        style ={{
          width: deviceWidth,
          height: 46,
          paddingHorizontal: 12,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}
      > 
        <Reanimated_Pressable
          style={[leftArrow,{}]}
          onPress={()=>toScroll('l')}
        >
          <MaterialCommunityIcons
            name="arrow-left-drop-circle-outline"
            size={28}
            color={'white'}
          />
        </Reanimated_Pressable>
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
        <Reanimated_Pressable
          style={[rightArrow,{}]}
          onPress={()=>toScroll('r')}
        >
          <MaterialCommunityIcons
            name="arrow-right-drop-circle-outline"
            size={28}
            color={'white'}
          />
        </Reanimated_Pressable>
      </View>
    </View>

    <ScrollView
      ref={scrollList}
      horizontal = {true}
      snapToInterval={deviceWidth}
      //contentOffset={{x: modIndex*deviceWidth, y: 0}}
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
        paramsSelectColor={paramsSelectColor}
        //currentCustomTheme = {currentCustomTheme}
        currentPalette = {currentPalette}
        listPaddingBottom = {previewHeight+bottomMargin+PICKER_AREA_HEIGHT}
      />
    </ScrollView>
      

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
        <Text style = {[staticStyles.headerText, {flex: 1, color: 'white', textAlign: 'center', top: 20}]}>{Language.isNew}</Text>
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
            <Text style = {[staticStyles.headerText, { color: 'white',fontSize: 12, textAlign: 'center'}]}>{Language.isNewActions.y}</Text>
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
            <Text style = {[staticStyles.headerText, { color: 'white',fontSize: 12, textAlign: 'center'}]}>{Language.isNewActions.n}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>

  {/*STYLE UPDATE*/}
  <BottomSheetModalProvider >
  <BottomSheetModal
    ref={bottomSheetModalRef}
    enableDismissOnClose={false}
    index={1}
    snapPoints={snapPoints}
    handleComponent={()=>{
      return (
        <View
            style = {{
                height: 24,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopWidth: 0.4,
                borderColor: MODAL_SEPARATOR_COLOR,
                marginHorizontal: 12
            }}
        >
            <View style={{height: 4, borderRadius: 2, backgroundColor: PREVIEW_HANDLE_COLOR, width: 50}}/>
            <Text
                style ={{
                    left: 24,
                    fontSize: 11,
                    color: PREVIEW_ICON_COLOR,
                    fontWeight: 'bold',
                    letterSpacing: 1,
                    fontVariant: ['small-caps'],
                    position: 'absolute',
                    textAlign: 'center'
                }}
            >
                {LanguagePreview.title}
            </Text>
            <MaterialCommunityIcons name="cellphone-cog" size={11} color = {PREVIEW_ICON_COLOR} style={{position: 'absolute', left: 12, transform: [{rotate: '180deg'}]}}/>
        </View>
      )
    }}
    backgroundStyle={{ backgroundColor: PREVIEW_COLOR, borderTopLeftRadius: 12, borderTopRightRadius: 12}}
    onChange={handleSheetChanges}
  > 
    {false &&        
    <View
      style = {{
        width: '100%',
        height: previewToolBArHeight,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        //backgroundColor: 'red'
      }}  
    >
      <View
        style={{
          width: 136,
          height: previewToolBArHeight,
        }}
      >
        <BasePressable
            type="t"
            text={LanguagePreview.toolbar.hide}
            textStyle={{
                fontSize: 14,
                //textAlign: 'center',
                letterSpacing: 1,
                fontVariant: ['small-caps'],
                fontWeight: '500',
                color: TOOLBAR_TEXT_COLOR
            }}
            style={{
                width: 120,
                height: previewToolBArHeight-16,
                margin: 8,
                borderRadius: 12
            }}
            android_ripple={ripple()}
            onPress = {toolPress}
        />
      </View>
      <View
          style={{
              width: 136,
              height: previewToolBArHeight,
          }}
      >
          <BasePressable
              type="t"
              text={LanguagePreview.toolbar.apply}
              textStyle={{
                  fontSize: 14,
                  letterSpacing: 1,
                  fontVariant: ['small-caps'],
                  fontWeight: '500',  
                  color: TOOLBAR_TEXT_COLOR
              }}
              style={{
                  width: 120,
                  height: previewToolBArHeight-16,
                  margin: 8,
                  borderRadius: 12
              }}
              android_ripple={ripple()}
              onPress = {applyPress}
          />
      </View>
    </View>}
    {false && 
    <StyleChangePreview
      previewAppStyleA = {previewAppStyleA}
      previewAppPalette = {previewAppPalette}
      frameColor={FRAMES_COLOR}
      appStyle={appStyle}
      ThemeColorsAppIndex={ThemeColorsAppIndex}
      ThemeSchema={ThemeSchema}
      LanguageAppIndex={LanguageAppIndex}
    />} 
  </BottomSheetModal>
  </BottomSheetModalProvider>


  <ColorPicker
    show={colorsPickerShow}

    previewFull = {previewAppFullPalette}

    selectColor = {selectColor}
    paramsSelectColor = {paramsSelectColor}

    applyNewStateColor={applyNewStateColor}
    valueGradient={valueGradient}
    valueTacing={valueTacing}

    //initialValue={initialColor}
    //opened={paramsSelectColor.value}

    LanguageAppIndex={LanguageAppIndex}
  />

  </>)
}
export default connect(mapStateToProps("PALETTE_SCREEN"), mapDispatchToProps("PALETTE_SCREEN"))(Palette);


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