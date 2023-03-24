import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
    Appearance, 
    StyleSheet, 
    Text,
    Button, 
    Pressable,
    TextInput, 
    FlatList, 
    SectionList,
    View, 
    Dimensions,
    ToastAndroid,
    Keyboard,
    Vibration 
} from 'react-native';
import Constants from "expo-constants";
const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');
const statusBarHeight = Constants.statusBarHeight+1

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

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
//import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetScrollView,
    BottomSheetVirtualizedList,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

import themesColorsAppList, {themesApp} from "../../../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../../../app_values/Languages";

import store from "../../../../app_redux_files/store";
import {connect} from 'react-redux';
import mapStateToProps from "../../../../app_redux_files/stateToProps";
import mapDispatchToProps from "../../../../app_redux_files/dispatchToProps";

import dataRedactor from "../../../../app_async_data_manager/data_redactor";

import { 
    BasePressable,
    BaseCheckBox,
    BaseSwitch 
} from "../../../../general_components/base_components/BaseElements";

import PresetsSelector from "./redactors_settings/interface/PresetsSelector";

import ThemeRedacor from "./redactors_settings/interface/ThemeRedactor";
import EffectsRedactor from "./redactors_settings/interface/EffectsRedactor";

import SelectorsRedactor from "./redactors_settings/interface/SelectorsRedactor";

import BorderRadiusRedactor from "./redactors_settings/interface/BorderRadiusRedactor";
import NavigateMenuRedactor from "./redactors_settings/interface/NavigateMenuRedactor";
import LanguageRedactor from "./redactors_settings/system/LanguageRedactor";
import ListsRedactor from "./redactors_settings/interface/ListsRedactor";
import FunctionButtonRedactor from "./redactors_settings/interface/FunctionButtonRedactor";
import ModalsRedactor from "./redactors_settings/interface/ModalsRedactor";

import LoadSplashRedactor  from "./redactors_settings/functions/LoadSplashRedactor";
import UserRedactor from "./redactors_settings/system/UserRedactor";
import WeatherRedactor from "./redactors_settings/functions/WeatherRedactor";
import AppFunctionsRedactor from "./redactors_settings/functions/AppFunctionsRedactor";

import StyleChangePreview from "./preview/StyleChangePreview";

const STRUCTURE = {
    settingsData: [
        {
            param: "language",
            icon:  "earth",
            paramRedactorComponent: LanguageRedactor
        },
        {
            param:"user",
            icon:  "account",
            paramRedactorComponent: UserRedactor
        },
    ],
    customizer: [
        {
            category: "appearance",            
            data: [
                
                {
                    param: "presets",
                    icon:  "storefront" ,
                    paramRedactorComponent: PresetsSelector
                },
                {
                    subCategory: "globalProperties",
                    data: [
                        {
                            param: "thema",
                            icon:  "palette",
                            paramRedactorComponent: ThemeRedacor
                        },
                        {
                            param: "borderRadius",
                            icon:  "vector-rectangle",
                            paramRedactorComponent: BorderRadiusRedactor
                        },
                        {
                            param: "effects",
                            icon:  "magic-staff",
                            paramRedactorComponent: EffectsRedactor
                        },
                    ]
                },              
                {
                    subCategory: "elements",
                    data: [                   
                        
                        {
                            param: "selectors",
                            icon:  "gesture-tap-box",
                            paramRedactorComponent: SelectorsRedactor
                        },
                        {
                            param: "bobberButton",
                            icon:  "balloon",
                            paramRedactorComponent: FunctionButtonRedactor
                        },
                        {
                            param: "lists",
                            icon:  "view-list",
                            paramRedactorComponent: ListsRedactor
                        },
                        {
                            param: "modals",
                            icon:  "window-restore",
                            paramRedactorComponent: ModalsRedactor
                        },  
                        {
                            param: "navigationMenu",
                            icon:  "menu",
                            paramRedactorComponent: NavigateMenuRedactor
                        },
                    ]
                },                  
            ]
        },
        {   
            category: "functions",
            data: [
                {
                    param:"appFunctions",
                    icon:  "store",
                    paramRedactorComponent: AppFunctionsRedactor
                },                
                {
                    subCategory: "additionalFunctions",
                    data: [
                        {
                            param: "loadAnimation",
                            icon:  "animation-play",
                            paramRedactorComponent: LoadSplashRedactor
                        },
                        {
                            param:"weather",
                            icon:  "weather-cloudy-clock",
                            paramRedactorComponent: WeatherRedactor
                        }, 
                    ]
                },                                            
            ]
        },
        {   
            indexSection: 2,
            category: "additional",
            data: [
                {
                    param:"ohters",
                    icon:  "qrcode-scan",
                    paramRedactorComponent: null
                },
            ]
        }
    ]
}

const categorysCustomizer = []
const structureCustomizer = []

for(let id = 0; id<STRUCTURE.customizer.length; id++){
    const itemCust = STRUCTURE.customizer[id]

    const category = itemCust.category
    const rawData = itemCust.data

    const subCategorys = []
    const data = []

    for(let el of rawData){
        let newEl
        if(el.subCategory){
            subCategorys.push(el.subCategory)
            newEl = el.data.map((item, index)=>{               
                return  {
                    ...item,
                    fromCustom: true,
                    indexSection: id,
                    category: category, 
                    subCategory: el.subCategory, 
                    subTitle: index === 0, 
                    
                }              
            })
        } else {
            newEl = {
                ...el,
                fromCustom: true,
                indexSection: id,
                category: category,
                
                subTitle: false, 
            }
        }
        data.push(newEl)
    }

    

    structureCustomizer.push({
        indexSection: id,
        category: category,
        subCategorys: subCategorys,
        data: data.flat()
    })

    categorysCustomizer.push(
        category,
    )
}

//<MaterialCommunityIcons name="magic-staff" size={24} color="black" />
//<MaterialCommunityIcons name="storefront" size={24} color="black" />

//<MaterialCommunityIcons name="palette" size={24} color="black" />
//<MaterialCommunityIcons name="vector-rectangle" size={24} color="black" />
//<MaterialCommunityIcons name="menu" size={24} color="black" />
//<MaterialCommunityIcons name="animation-play" size={24} color="black" />
//<MaterialCommunityIcons name="view-list" size={24} color="black" />
//<MaterialCommunityIcons name="balloon" size={24} color="black" />

//<MaterialCommunityIcons name="web" size={24} color="black" />
//<MaterialCommunityIcons name="weather-cloudy-clock" size={24} color="black" /> <MaterialCommunityIcons name="earth" size={24} color="black" />
//<MaterialCommunityIcons name="account" size={24} color="black" />
//<MaterialCommunityIcons name="store" size={24} color="black" />
//<MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />

//<MaterialCommunityIcons name="check-bold" size={24} color="black" />


//<MaterialCommunityIcons name="keyboard-backspace" size={24} color="black" />

const allStructurParams = [];
for (let el of structureCustomizer){
    /* 
    for (let item of el.data){
        allStructurParams.push({
            param: item.param, 
            icon: item.icon, 
            category: el.category, 
            indexSection: el.indexSection
        })
    }*/

    el.data.map((item, index)=>{
        newItem = {
            //param: item.param, 
            //icon: item.icon, 
            ...item,
            //category: el.category,
            //indexSection: el.indexSection,
            indexInSection: index,
        }
        delete newItem.paramRedactorComponent 
        allStructurParams.push(newItem)
    })

}

/* 
const allCategorys = [];
for (let el of structureCustomizer){
    //for (let item of el.data){
        allCategorys.push({category: el.category, indexSection: el.indexSection});
    //}
}*/

const Settings = (props) => {
    //console.log(props.navigation.isFocused(), store.getState().hideMenu,props.hideMenu)
    if(props.navigation.isFocused() && store.getState().hideMenu){
        //console.log('settings open', props.hideMenu)
        //props.r_setHideMenu(false)
        //bottomSheetVisible? props.r_setHideMenu(false) : null;
    }

    const [LanguageAppIndex, setLanguageAppIndex] = useState(languagesApp.indexOf(props.appConfig.languageApp));//ThemesColorsAppList[ThemeColorsAppIndex]
    const [ThemeColorsAppIndex, setThemeColorAppIndex] = useState(themesApp.indexOf(props.appStyle.palette.theme));//LanguagesAppList[LanguageAppIndex]

    const [appStyle, setAppStyle] = useState(props.appStyle);
    const [ThemeSchema, setThemeSchema] = useState(props.appStyle.palette.scheme == 'auto'? Appearance.getColorScheme() : props.appStyle.palette.scheme)
    const [appConfig, setAppConfig] = useState(props.appConfig);


    const previewAppStyleA = useSharedValue(props.appStyle)

    // position wherein bobber not visible
    const [ bottomBord, setBottomBord ] = useState(
        props.appStyle.functionButton.size 
        + 12.5 
        + props.appStyle.navigationMenu.height 
        + ((props.appStyle.navigationMenu.type == 'hidden' && props.appStyle.navigationMenu.position.horizontal == 'center' && props.appStyle.functionButton.position == 'center')? 
            20 + interpolate(props.appStyle.navigationMenu.position.vertical, [-150, 150] , [0, 30]) 
            : 0
        )
    ) 
    
    store.subscribe(() => {
        let jstore = store.getState();

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
            previewAppStyleA.value = jstore.appStyle
            setBottomBord(
                jstore.appStyle.functionButton.size 
                + 12.5 
                + jstore.appStyle.navigationMenu.height
                + ((jstore.appStyle.navigationMenu.type == 'hidden' && jstore.appStyle.navigationMenu.position.horizontal == 'center')? 
                    20 + interpolate(jstore.appStyle.navigationMenu.position.vertical, [-150, 150] , [0, 30])
                    : 0
                )
            );
        }

        if (appConfig != jstore.appConfig) {
            setAppConfig(jstore.appConfig);
        }
    })

    const [listenerColorSheme, setListinerColorScheme] = useState(Appearance.getColorScheme())
    useEffect(()=>{
        if(listenerColorSheme){
            if(appStyle.palette.scheme == 'auto' && listenerColorSheme != ThemeSchema){
                console.log('settings accept new color sheme', listenerColorSheme, 'used shema', appStyle.palette.scheme)
                setThemeSchema(listenerColorSheme)
            }
        }
    },[listenerColorSheme])
    
    Appearance.addChangeListener(({colorScheme})=>{
        setListinerColorScheme(colorScheme)
    })

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            console.log('keyboard Will Show')
            setKeyboardVisible(true);
            animValueBobberButtonVisible.value = 1//bottomBord
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen


    
    const animValueBobberButtonVisible = useSharedValue(0);//bottomBord
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const bottomSheetModalRef = useRef(BottomSheetModal);



    const applyAppStyle = ()=>{
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        const equal = (JSON.stringify(appStyle) === JSON.stringify(newAppStyle))
        if(!equal){
            Vibration.vibrate([5,12,50,12])
            const usedSubsequence = Object.values(appConfig.appFunctions).filter(item => item.used && true)
            
            if(usedSubsequence.length == 1 && newAppStyle.navigationMenu.type == 'classical'){
                console.log('apply', usedSubsequence)
                newAppStyle.navigationMenu.height = 0
            }

            setAppStyle(newAppStyle)
            dataRedactor("storedAppStyle",newAppStyle);
            props.r_setAppStyle(newAppStyle);
        }
    }


    const splashStart = () => {

        applyAppStyle()    

        bottomSheetModalRef.current?.dismiss()
    }


    const jumpPress =()=>{
        console.log('pressj')
        
        handlePresentModalPress()
    }

  
    const applyPress =()=>{
        console.log('pressa')
        //bottomSheetModalRef.current?.dismiss()
        applyAppStyle()
        //splashStart(previewAppStyle.theme, themesApp.indexOf(previewAppStyle.theme));
    }
    
    const backBurgerPress = () => {
        Vibration.vibrate([5,8])
        if(bottomSheetVisible && props.hideMenu){
            bottomSheetModalRef.current?.dismiss()
            setBottomSheetVisible(false)
            props.r_setHideMenu(false) 
        } 
        props.navigation.goBack()
        console.log('settings back', bottomSheetVisible , props.hideMenu)
    }



    const goToPalleteScreen = (index = 0, mod = 0) => {
        ToastAndroid.show(Language.stackTransition.loadPainter, ToastAndroid.SHORT);   
        bottomSheetVisible? bottomSheetModalRef.current?.dismiss(): null;    
        (!bottomSheetVisible && !props.hideMenu)? props.r_setHideMenu(true) : null
        //console.log('settings to palette', bottomSheetVisible , props.hideMenu) 
        props.navigation.navigate('palette', {themeIndex: index, modIndex: mod})
        console.log('settings to palette', bottomSheetVisible , props.hideMenu)  
    }


    
    const previewHeight = (50+deviceHeight/2)
    

    const snapPoints = useMemo(() => [previewHeight/3+30, previewHeight+23], []);

    const handlePresentModalPress = useCallback(() => {
        props.r_setHideMenu(true)
        setBottomSheetVisible(true)
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index, bottomSheetVisible);
        if(index === -1 && bottomSheetVisible){
            console.log('menu visible', index);
            setBottomSheetVisible(false)
            props.r_setHideMenu(false)
        }

    }, [bottomSheetVisible]);

    
    return (
    <>  
        <BasisList 
            reaValueBobberButtonVisible = {animValueBobberButtonVisible}
    
            r_setAppStyle = {props.r_setAppStyle}
            r_setAppConfig = {props.r_setAppConfig}
    
            previewAppStyleA = {previewAppStyleA}
    
            goToPalleteScreen = {goToPalleteScreen}
    
            backBurgerPress = {backBurgerPress}

            bottomBord={bottomBord}
            
            appConfig = {appConfig}
            LanguageAppIndex = {LanguageAppIndex}

            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        
        <BobberButton 
            enabled={!bottomSheetVisible}
     
            bottomBord = {bottomBord}
            reaValueBobberButtonVisible = {animValueBobberButtonVisible}

            upPress = {jumpPress}
            downPress = {applyPress}

            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />

        {/*STYLE UPDATE*/}
        {true && 
        <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          handleIndicatorStyle={{backgroundColor: Theme.icons.accents.primary, width: 50}}
          backgroundStyle={{ backgroundColor: Theme.basics.neutrals.quaternary, borderTopLeftRadius: appStyle.borderRadius.additional, borderTopRightRadius: appStyle.borderRadius.additional}}
          onChange={handleSheetChanges}
        >           
            <StyleChangePreview
                appStyle={appStyle}
                previewAppStyleA = {previewAppStyleA}

                splashStart = {splashStart}

                ThemeColorsAppIndex={ThemeColorsAppIndex}
                ThemeSchema={ThemeSchema}
                LanguageAppIndex={LanguageAppIndex}
            />
        </BottomSheetModal>
        </BottomSheetModalProvider>}
    </>);  
};
export default connect(mapStateToProps('SETTINGS_SCREEN'), mapDispatchToProps('SETTINGS_SCREEN'))(Settings);

//====================================================================================================================================
//====================================================================================================================================
const ripple = (color) => ({
    color: `${color}20`,
    borderless: true,
    foreground: false
})
//====================================================================================================================================

const BobberButton = (props) => {
    const {
        reaValueBobberButtonVisible,
        bottomBord,
        enabled,

        upPress,
        downPress,

        appConfig,
        LanguageAppIndex,

        appStyle,
        ThemeColorsAppIndex,
        ThemeSchema
    } = props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    
    const dynamicStyleBobberUp = useAnimatedStyle(() => {
        const duration = 200;
        return {
            transform: [
                {translateY: withTiming((reaValueBobberButtonVisible.value == 0 && enabled)? -(5+appStyle.functionButton.size) : 0, {duration: duration})}
            ] 
        }
    })
    const dynamicStyleBobberDown = useAnimatedStyle(() => {
        const duration = 200;
        return {
            //opacity: withTiming(animValueBobberButtonExpand.value == 1? 1 : 0.9, {duration: duration}),
        }
    })

    const dynamicStyleBobberButton = useAnimatedStyle(()=>{
        const duration = 300
        const durationTranslate = 400;
        const position =(buttonSize)=>({
            center: (deviceWidth*0.5-(buttonSize/2)),
            left: ((deviceWidth-12)-buttonSize),
            right: (12)
        })
        const bottom = interpolate(appStyle.navigationMenu.position.vertical, [-150, 150] , [0, 30])
        const addBottom = (appStyle.navigationMenu.type == 'hidden' && appStyle.navigationMenu.position.horizontal == 'center' && appStyle.functionButton.position == 'center')? (20+bottom) : 0
        return {
            height:  withTiming(5+2*appStyle.functionButton.size, {duration: duration}),
            width:  withTiming(appStyle.functionButton.size, {duration: duration}),
            bottom:  withTiming((appStyle.navigationMenu.height+12.5+addBottom), {duration: duration}),
            right: withTiming( (position(appStyle.functionButton.size)[appStyle.functionButton.position]), {duration: duration}),

            transform: [
                {translateY: withTiming((reaValueBobberButtonVisible.value == 0 && enabled)? 0 : bottomBord, {duration: durationTranslate})}
            ] 
        }
    })

    return(
        <Reanimated.View 
            style = {[dynamicStyleBobberButton, {
                position: 'absolute',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
            }]}
        >   
            {["down", "up"].map((item, index)=>{
                let animStyle;
                let iconName;
                let pressFunction;
                switch(item){
                    case "up": 
                        animStyle = dynamicStyleBobberUp;
                        iconName = "cellphone-cog";
                        pressFunction = upPress;
                        break;
                    case "down": 
                        animStyle = dynamicStyleBobberDown;
                        iconName = "check-bold";
                        pressFunction = downPress;
                        break;
                }
                return (
                    <Reanimated.View
                        key={item+index}
                        
                        style = {[animStyle,{
                            zIndex: 1,       
                            position: 'absolute',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: appStyle.functionButton.size ,
                            width: appStyle.functionButton.size ,
                            
                            //backgroundColor: 'red'
                            //borderRadius: appStyle.borderRadius.additional,
                        }]}
                    >        
                        <SkiaViewDisign
                            isGeneralObject={true} 
                            borderRadius = {appStyle.borderRadius.additional}
                            backgroundColor = {(appStyle.functionButton.invertColors? Theme.basics.neutrals.tertiary : Theme.basics.accents.secondary)}
                            shadowColors = {Theme.specials.shadow}
                            shadowMargin={{horizontal: 5, vertical: 5}}
                            shadowStyle = {appStyle.effects.shadows}
                            adaptiveSizeForStyle={false}
                            innerShadow={{
                                used: true,
                                borderWidth: 0.5
                            }}
                        />
                        {appStyle.effects.blur && 
                        <View 
                            style = {[StyleSheet.absoluteFillObject, {
                                left: 5,
                                top: 5,
                                height: appStyle.functionButton.size-10,
                                width: appStyle.functionButton.size-10,
                                //specialty blur for android
                                overflow: 'hidden',
                                borderRadius: appStyle.borderRadius.additional,
                            }]}
                        >
                        <BlurView
                            style = {{flex: 1, }}
                            blurType = {'light'}
                            blurAmount = {10}
                            
                            //ANDROID_PROPS
                            overlayColor={`${appStyle.functionButton.invertColors? Theme.basics.neutrals.tertiary : Theme.basics.accents.secondary}90`}
                            //overlayColor={'transparent'}
                            //blurRadius	= {10}
                            //downsampleFactor = {10}
                        />
                        </View>}  
                        <View 
                            style={{
                                position: 'absolute',
                                height: appStyle.functionButton.size -10,
                                width: appStyle.functionButton.size -10,
                                borderWidth: appStyle.functionButton.outline? 0.5 : 0,
                                borderColor: `${Theme.specials.separator}20`,
                                borderRadius: appStyle.borderRadius.additional
                            }}
                        />
                        <BasePressable
                            type={"i"}
                            icon={{name: iconName, size: 24, color: appStyle.functionButton.invertColors? Theme.icons.accents.primary : Theme.icons.neutrals.primary}}
                            style={[{
                                height: appStyle.functionButton.size-10,
                                width: appStyle.functionButton.size-10,
                                borderRadius: appStyle.borderRadius.additional,
                                //backgroundColor: appStyle.effects.blur? 'transparent' : (appStyle.functionButton.invertColors? Theme.basics.neutrals.secondary : Theme.basics.accents.secondary),
                      
                                },
                            ]}
                            android_ripple={appStyle.effects.ripple == 'all'? ripple(Theme.icons.accents.primary) : false}
                            onPress={pressFunction}
                        />
                    </Reanimated.View>
                )
            })}
        </Reanimated.View>
    )
}

//====================================================================================================================================
import { BlurView } from "@react-native-community/blur";
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { Ionicons } from '@expo/vector-icons';
import * as Application from 'expo-application';

import SkiaViewDisign from "../../../../general_components/base_components/SkiaViewDisign";

const ReanimatedFlatList = Reanimated.createAnimatedComponent(FlatList);
const ReanimatedSectionList = Reanimated.createAnimatedComponent(SectionList);
const ReanimatedTextInput = Reanimated.createAnimatedComponent(TextInput);

const headerStickysHeight = 33
const itemCategoryHeight = 45
const selectorLineHeight = 35
const headerHeight = statusBarHeight+itemCategoryHeight//+selectorLineHeight
const packHeight = 100

const BasisList = (props) => {
    const {
        reaValueBobberButtonVisible,

        r_setAppStyle,
        r_setAppConfig,

        previewAppStyleA,


        goToPalleteScreen,

        backBurgerPress,

        bottomBord,

        appStyle,
        appConfig,
        LanguageAppIndex,
        ThemeColorsAppIndex,
        ThemeSchema
    } = props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen

    const headerStickysFullHeight = headerStickysHeight //+(2*appStyle.lists.proximity)
    const selectorLineHeightFull = itemCategoryHeight + selectorLineHeight
    const headHeight = packHeight-itemCategoryHeight
    const [headHeightTop, setHeadHeightTop] = useState(headHeight);

    //const headFullHeight = headHeight + selectorLineHeightFull
    const headFullHeight = headHeightTop + selectorLineHeightFull  
    
    const animSelectorLine = useSharedValue(headFullHeight-selectorLineHeight)


    const sectListRef = useRef();
    const flatCategorysListRef = useAnimatedRef(); 
    const flatListRef = useAnimatedRef(); 

    const accentCategory = useSharedValue(0);

    const [listWidths, setListWidths] = useState([]);
    const [listHeights, setListHeights] = useState([]);

    const derivedValues = useSharedValue({
        listHeights: [],
        listWidths: [],
        shifts: [],
        intervals: [],
        limits: [],
        categorys: []
    })
    
    const animValueWidthLine = useSharedValue(0) //((Language.StructureScreen.params[allStructurParams[0].param]).length) * (staticStyles.frontFLText.fontSize * 0.75) + 10)
    
    const animValueMarginLeft = useSharedValue(0);
    const animValueTranslateX = useSharedValue(0);
    const animValueScrollXCategorys = useSharedValue(0);
    const animValueCategorysScrolling = useSharedValue(0);

    const animValueScrollY = useSharedValue(0)
    
    const topButtonVisible = useSharedValue(0)

    const logg = (info) =>{
        console.log(info)
    }

    const scrollHandlerFlatListParams = useAnimatedScrollHandler({
        onScroll: (e, ctx) => {
            animValueCategorysScrolling.value = 0;
            animValueTranslateX.value = -(e.contentOffset.x)            
        }
    })

    useDerivedValue(() => {
        const scroll = Math.abs(animValueTranslateX.value)
        if(animValueCategorysScrolling.value == 0){
            const categoryIntervals = derivedValues.value.categorys
            //runOnJS(logg)(` ${(scroll)} bords ${categoryIntervals} ${indexs}`)
            let to = 0
            for(let i = 0; i<categoryIntervals.length ; i++){   
                if(scroll >= categoryIntervals[i]){
                    to = i
                }
            }
            scrollTo(
                flatCategorysListRef, //ref
                to*(deviceWidth), //x offset
                0, //y offset
                true //animate
            )
        } 
    })

    const scrollHandlerFlatListCategorys = useAnimatedScrollHandler({
        onBeginDrag: (e) => {
            animValueCategorysScrolling.value = 1;
        },
        onEndDrag: (e) => {
            //runOnJS(logg)(`end ${e.contentOffset.x}`)
            animValueCategorysScrolling.value = 0;
        },
        onMomentumEnd: (e) => {
            //runOnJS(logg)(`momentum end ${e.contentOffset.x}`)
            animValueScrollXCategorys.value = (e.contentOffset.x)
            animValueCategorysScrolling.value = 0.5;
            
        },
        onScroll: (e, ctx) => {
            //animValueCategorysScrolling.value = true;
            animValueScrollXCategorys.value = (e.contentOffset.x)
        }
    })

    useDerivedValue(() => {
        const scroll = Math.abs(animValueScrollXCategorys.value)
        if(animValueCategorysScrolling.value >= 0.5){
            const categoryIntervals = derivedValues.value.categorys

            const yetIndex = Math.floor((scroll/(deviceWidth)))
            const yetScroll = yetIndex*(deviceWidth)
            const toIndex = Math.floor(( (Math.max((scroll-yetScroll),0) )/ (deviceWidth/2)))

            const fineIndex = Math.min(yetIndex+toIndex, (categoryIntervals.length-1))
            runOnJS(logg)(`index category ${yetIndex+toIndex}`)
            scrollTo(
                flatListRef, //ref
                categoryIntervals[fineIndex]+1, //x offset
                0, //y offset
                true //animate
            )
        }
        
    })
    
    const animStyleIndicatorLine = useAnimatedStyle(() => {
        const duration = 450;
        return {
            width: withTiming(animValueWidthLine.value, {duration: duration-20}),
            left: withTiming(5+animValueMarginLeft.value, {duration: duration, easing: Easing.bezier(0.45, 0, 0.55, 1)}),
            transform: [
                {translateX: animValueTranslateX.value}
            ] 
        }
    })


    const scrollSectionsList = useAnimatedScrollHandler({
        onScroll: (event, ctx) => {
            //runOnJS(logg)(`|scroll|| ${event.contentOffset.y}`)
            let isUpScroll = false;
            let isEnd = false;
            let isStart = false;

            if(Math.abs(event.velocity.y).toFixed(4) != 0){
                isUpScroll = (event.velocity.y).toFixed(4) < 0.0001;
            }
            isEnd = (event.layoutMeasurement.height + event.contentOffset.y) >= (event.contentSize.height - 5);
            isStart = event.contentOffset.y > (headFullHeight-selectorLineHeight-10);
            const visibleBobber = ((isUpScroll ) && isStart)

            cancelAnimation(reaValueBobberButtonVisible);
            reaValueBobberButtonVisible.value = visibleBobber? 0 : 1//bottomBord
            cancelAnimation(topButtonVisible);
            topButtonVisible.value = isEnd? 1 : 0

            const useScroll = -Math.max(event.contentOffset.y, 0)

            cancelAnimation(animValueScrollY);
            animValueScrollY.value = useScroll

            const selectLine = Math.max((headFullHeight + useScroll -selectorLineHeight), 0)

            cancelAnimation(animSelectorLine);
            animSelectorLine.value = selectLine
            //runOnJS(logg)(`anim scrl ${selectLine}`)
            
        },
    })
    

    const countDerivedValues = () =>{
        console.log('reculc')
        const intervals = []//[{left: 0, right: 100}, ...]
        for(let i = 0; i < allStructurParams.length; i++){
            let right = -1;
            let left = -1;

            right += headFullHeight -selectorLineHeight//+headerStickysFullHeight
            
            if(allStructurParams[i].indexSection != 0){               
                right += allStructurParams[i].indexSection*(headerStickysFullHeight)
            }

            left += listHeights.reduce(((countValue, currentValue, index)=>(index <= (i>=1?i-1:0)? (countValue+currentValue) : countValue)), 0)
            right += listHeights.reduce(((countValue, currentValue, index)=>(index <= i? (countValue+currentValue) : countValue)), 0)
            intervals.push({
                left: left,
                right: right
            })
        }

    
        const shifts = []
        for(let param = 0; param <= allStructurParams.length; param++){
            const maxAccepIndex = listWidths.length-1;
            let centrallFront = 0;
            //left shift 
            const shift = listWidths.reduce(((countValue, currentValue, index)=>(index < param? (countValue+currentValue) : countValue)), 0)
            //shifts for position in center
            if(1 <= param && param <= maxAccepIndex-1){ 
                centrallFront = -((deviceWidth-listWidths[param])/2) //-Math.round((deviceWidth-listWidths[param])/2) 
            }
            let resOffset = centrallFront+shift
            if(resOffset < 0){resOffset = 0}
            shifts.push(resOffset)
        } 

        const lessCooef = 0.2
        const moreCooef = 1 - 0.4 //default 1-lessCooef
     
        const limList = []//[{less: 30, more: 70}, ...]
        for(let param = 0; param < allStructurParams.length; param++){
            const interval = listHeights.reduce(((countValue, currentValue, index)=>(index < param? (countValue+currentValue) : countValue)), 0)
            limList.push({
                less: lessCooef*listHeights[param]+interval, 
                more: moreCooef*listHeights[param]+interval
            })
        }

        const indexs = []
        for(let i=0; i<structureCustomizer.length; i++){
            indexs[i] = 0 + i>0? (indexs[i-1]+structureCustomizer[i-1].data.length) : 0
        }
        const categoryIntervals = []
        for(let i = 0; i<indexs.length ; i++){
            let value = (listWidths).reduce(((countValue, currentValue, index)=>(index < indexs[i]? (countValue+currentValue) : countValue)), 0)
            let center = deviceWidth/2 - (listWidths)[indexs[i]]/2
            center = (center >  value? 0 : center)
            categoryIntervals.push(value-center)      
        }

        derivedValues.value = {
            listHeights: listHeights,
            listWidths: listWidths,
            shifts: shifts,
            intervals: intervals,
            limits: limList,
            categorys: categoryIntervals
        }
    }
    //useEffect(()=>{countDerivedValues()})//appStyle.lists.proximity//Language, LanguageAppIndex, ,[appStyle]


    useDerivedValue(() => {
        const aListHeights = derivedValues.value.listHeights
        const aListWidths = derivedValues.value.listWidths
        const intervals = derivedValues.value.intervals
        const shifts = derivedValues.value.shifts
        const limList = derivedValues.value.limits

        if(
            aListHeights.length == 0 ||
            aListWidths.length == 0 ||
            intervals.length == 0 ||
            shifts.length == 0 ||
            limList.length == 0  
        ){return}

        const yScroll = Math.abs(animValueScrollY.value)


        const countAccent = intervals.findIndex((el, index)=>(
            (el.left<=yScroll && yScroll<=el.right) || 
            (index == 0 && yScroll < el.left) || 
            (index == intervals.length-1 && yScroll > el.right) 
        ))


        let accentBarXScroll = Math.max((yScroll- (headFullHeight-selectorLineHeight)), 0)
        //if(accentBarXScroll<0){accentBarXScroll = 0}

        let compens = 0
        const over = aListHeights.reduce(((countValue, currentValue, index)=>(index <= (countAccent-1)? (countValue+currentValue) : countValue)), 0)
        if(allStructurParams[countAccent].indexSection != 0){
            if(over < accentBarXScroll){
                compens =  accentBarXScroll-over
                let ignoreHeight = headerStickysFullHeight//-headerStickysFullHeight//+2*appStyle.lists.proximity

                if(compens > ignoreHeight){compens = ignoreHeight}

                accentBarXScroll -= compens
            }
        }
        

        // 0.5 free
        const getAction = (scrollX, paramIndex) => {
            //l - local
            const l_past = shifts[paramIndex-1]
            const l_current = shifts[paramIndex]
            const l_next = shifts[paramIndex+1]
            const l_newDistance = l_next-l_current
            const l_oldDistance = l_current-l_past
            let alignmentCoeff = 1
            let alignmentAction = 0

            if(scrollX != l_current && scrollX != l_next){
                alignmentCoeff = Math.abs((scrollX - l_current) / (l_next - scrollX))
            }
            alignmentAction = (scrollX-limList[paramIndex].more)*alignmentCoeff
            if(alignmentAction > l_newDistance){alignmentAction = l_newDistance}

            return alignmentAction
        }

        
        const past = shifts[countAccent-1]
        const current = shifts[countAccent]
        const next = shifts[countAccent+1]
        const newDistance = next-current
        const oldDistance = current-past
        let action = 0

        if(accentBarXScroll >= limList[countAccent].more){       
            action = getAction(accentBarXScroll, countAccent)

        } else if(accentBarXScroll <= limList[countAccent].less){      
            action = oldDistance - getAction(accentBarXScroll, (countAccent>=1? countAccent-1 : 0))
            action *= (-1)
        }
        //runOnJS(logg)(`lim l ${limList[countAccent].less} res ${accentBarXScroll} lim r ${limList[countAccent].more}`)
        accentBarXScroll = current + action
        //runOnJS(logg)(`cur act ${current} ${action}`)
       

        let width = aListWidths[countAccent]-10//Math.round(aListWidths[countAccent]-10);
        if(isNaN(width) || width  === undefined){
            const numberPrimelSymbols = (Language.StructureScreen.params[allStructurParams[0].param]).length;
            const widthSymbol = staticStyles.frontFLText.fontSize * 0.75;
            width = numberPrimelSymbols * widthSymbol + 10;
        }
        const left = aListWidths.reduce(((countValue, currentValue, index)=>(index < countAccent? (countValue+currentValue) : countValue)), 0);

        cancelAnimation(animValueWidthLine);
        cancelAnimation(animValueMarginLeft);
        animValueWidthLine.value = width;
        animValueMarginLeft.value = left;

        cancelAnimation(accentCategory);
        accentCategory.value = allStructurParams[countAccent].indexSection


        scrollTo(
            flatListRef, //ref
            accentBarXScroll, //x offset
            0, //y offset
            true //animate
        )
    })


    const selectParametr = (item, index, type) => {
        console.log('selectParam', item, index)
        let itemIndex = 0;
        let sectionIndex = 0;
        if(type == 'params'){
            itemIndex = item.indexInSection;
            sectionIndex = item.indexSection;
        } else {
            itemIndex = 0;
            sectionIndex = index;
        }
        
        
        sectListRef.current.scrollToLocation({
            itemIndex: itemIndex+1,
            sectionIndex: sectionIndex,
            animated: false,
            viewOffset: 30+appStyle.lists.proximity
            //viewPosition: 0
        })
    }

    const stacker = (list, setList, newValue) => {
        //newValue = Math.round(newValue);
        if (list.length >= allStructurParams.length){
            setList([newValue]);
        } else {
            list.push(newValue);
            setList(list); 
        }
        //console.log('st')

        //const eqh = listHeights.map((item, index)=>item-derivedValues.value.listHeights[index])
        //const eqw = listWidths.map((item, index)=>item-derivedValues.value.listWidths[index])

        const heightsEqaul = (derivedValues.value.listHeights.toString() === listHeights.toString())
        const heightsCountEqaul = (listHeights.length === allStructurParams.length)

        const widthsEqaul = (derivedValues.value.listWidths.toString() === listWidths.toString())
        const widthsCountEqaul = (listWidths.length === allStructurParams.length)

        if((!heightsEqaul || !widthsEqaul) && ( heightsCountEqaul && widthsCountEqaul)){
            //console.log('lh',listHeights, listHeights.length)
            //console.log('lw',listWidths, listWidths.length)
            countDerivedValues()
        }
    }

    const topReturn = () => {
        selectParametr(0, 0, '')
    }

    //category updater
    const categoryStyle = useAnimatedStyle(()=>{
        const duration = 250
        return {
            opacity: withSequence(withTiming(0*accentCategory.value, {duration: 0}), withTiming(1, {duration: duration})),
            transform: [
                {scale: withSequence(withTiming(0.9, {duration: 0}), withTiming(1, {duration: duration})),}
            ],
        }
    })
    const categoryText = useAnimatedProps(()=>{
        //console.log(Language.StructureScreen.typesSettings[`${structure[accentCategory.value].category}`].type)
        return {
            value: Language.StructureScreen.typesSettings[`${categorysCustomizer[accentCategory.value]}`].type,
            text: Language.StructureScreen.typesSettings[`${categorysCustomizer[accentCategory.value]}`].type,
        }
        //,[Language, LanguageAppIndex]
    })

    const dynamicStyleListItems = useAnimatedStyle(()=>{
        const duration = 300
        return {
            //borderRadius: withTiming(appStyle.borderRadius.basic, {duration: duration}),
            //marginHorizontal: withTiming((appStyle.lists.fullWidth? 0 : 10), {duration: duration}),
            marginVertical: withTiming(appStyle.lists.proximity, {duration: duration}),
        }
    })

    const dynamicStyleListItemsHeaders = useAnimatedStyle(()=>{
        const duration = 300
        return {
            paddingHorizontal:  withTiming((12 * appStyle.borderRadius.basic/32), {duration: duration}),
        }
    })


    const selectorLine = useAnimatedStyle(()=>{
        const duration = 300
        return {
            transform: [
               {translateY: animSelectorLine.value-0.25}
            ]
        }
    })

    const maskCategoryHeight = useAnimatedStyle(()=>{
        const duration = 300
        return {
            height: interpolate(
                animSelectorLine.value, 
                [headerHeight-statusBarHeight, 0],
                [0, selectorLineHeightFull],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }   
            ),
        }
    })
    const maskParamsHeight = useAnimatedStyle(()=>{
        const duration = 300
        return {

            height: interpolate(
                animSelectorLine.value+selectorLineHeight-9, //9???
                [0, headerHeight-statusBarHeight],

                [selectorLineHeightFull, 0],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }   
            ),
        }
    })

    const maskIndicatorHeight = useAnimatedStyle(()=>{
        const duration = 300
        return {

            height: interpolate(
                animSelectorLine.value+selectorLineHeight+7.9, //9???
                [0, headerHeight-statusBarHeight],

                [selectorLineHeightFull, 0],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }   
            ),
        }
    }) 

    const selectorLineColorHeight = useAnimatedStyle(()=>{
        const duration = 300
        return {
            height: interpolate(
                animSelectorLine.value, 
                [headerHeight-statusBarHeight, 0],
                [selectorLineHeightFull, 0],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }   
            ),
        }
    })

    const header = useAnimatedStyle(()=>{
        const duration = 300
        return {
            height: interpolate(
                animSelectorLine.value, 
                [headerHeight-statusBarHeight, 0],
                [headerHeight, headerHeight+selectorLineHeight],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }  
            ),   
        }
    })

    const category = useAnimatedStyle(()=>{
        const duration = 300
        return {
            paddingLeft: interpolate(
                animSelectorLine.value,
                [headerHeight-statusBarHeight, 0], 
                [0, deviceWidth/2-((Language.StructureScreen.typesSettings.appearance.type).length * 0.375 * staticStyles.AnimatedHeaderText.fontSize)]
            ),
            
            opacity: interpolate(
                animSelectorLine.value, 
                [0.01, 0],
                [1, 0]  
            ),
        }
    })
    
    const categorysText = useAnimatedStyle(()=>{
        const duration = 300
        return {
            fontSize: interpolate(
                animSelectorLine.value, 
                [headerHeight-statusBarHeight, 0], 
                [25, 20],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }    
            ),
            letterSpacing: interpolate(
                animSelectorLine.value, 
                [headerHeight-statusBarHeight, 0], 
                [4, 0.5],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }    
            ),
            
        }
    })


    const type = useAnimatedStyle(()=>{
        const duration = 300
        return {
            opacity: interpolate(
                animSelectorLine.value, 
                [0.01, 0],
                [0, 1]  
            ),
        }
    })

    const appStick = useAnimatedStyle(()=>{
        const duration = 300
        return {
            opacity: interpolate(
                animSelectorLine.value, 
                [headerHeight/2, 0],
                [1, 0]  
            ),
        }
    })    

    const scrollTopButton = useAnimatedStyle(()=>{
        return {
            transform: [
                {translateY: withTiming(topButtonVisible.value == 0? 0 : -(bottomBord-32), {duration: 400})}
            ]
        }
    })
    
    
    const renderItem = ({item, index})=>{
        const RedactorComponent = item.paramRedactorComponent;
        const redactorName = Language.StructureScreen.params[item.param]
        const icon = (item.icon != null? item.icon : "border-none-variant");
        //console.log(item, index)
       
        return (
            <Reanimated.View
                key={String(item.param+index)}
                onLayout={(event)=>{
                    if(item.fromCustom){
                        /*
                        console.log(
                            item.param,
                            event.nativeEvent.layout.height+2*appStyle.lists.proximity
                        )
                        //+(item.subTitle? 27 : 0)
                        */
                        stacker(listHeights, setListHeights, event.nativeEvent.layout.height)
                    }
                }}
            >
            {item.subTitle &&
            <Text
                style={[{
                    height: 35,
                    textAlign: 'center',
                    //color: Theme.texts.accents.secondary,
                    color: Theme.texts.neutrals.tertiary,
                    fontSize: 22,
                    fontWeight: '500',
                    letterSpacing: 4,
                    fontVariant: ['small-caps'],
                }]}
            >
                {Language.StructureScreen.subCategorys[item.subCategory]}
            </Text>}
            <Reanimated.View style={dynamicStyleListItems}>
                <SkiaViewDisign 
                    borderRadius = {appStyle.borderRadius.basic}
                    backgroundColor = {Theme.basics.neutrals.secondary}
                    shadowColors = {Theme.specials.shadow}
                    shadowMargin={{horizontal: appStyle.lists.fullWidth? 0 : 10, vertical: appStyle.lists.proximity}}
                    shadowStyle = {appStyle.effects.shadows}
                    adaptiveSizeForStyle={false}
                    innerShadow={{
                        used: true,
                        borderWidth: 2
                    }}
                />
            <Reanimated.View          
                style={[
                    staticStyles.SLArea, 
                    //appStyle.effects.shadows? staticStyles.shadow : {},
                    ,
                    {   
                        minHeight: item.fromCustom? 200 : 70,
                        //backgroundColor: Theme.basics.neutrals.secondary, 
                    }
                ]}               
            >                
                <Reanimated.View
                    style={[ 
                        dynamicStyleListItemsHeaders, 
                        { 
                        flexDirection: 'row', 
                        width: '100%',
                        height: 25,
                        alignItems: 'center',
                        //backgroundColor: '#ff000020'
                    }]}
                >
                    <MaterialCommunityIcons name={icon} size={20} color={Theme.texts.neutrals.secondary} />
                    <Text style={[staticStyles.SLParamHeaderText, {color: Theme.texts.neutrals.secondary}]}>{redactorName? redactorName : item.param}</Text>
                </Reanimated.View>
                {RedactorComponent != null && 
                <RedactorComponent
                    //for themes redactor
                    goToPalleteScreen = {goToPalleteScreen}

                    appStyle={appStyle}
                    //setAppStyle={setAppStyle}
                    r_setAppStyle={r_setAppStyle}

                    //previewAppStyle={previewAppStyle}
                    //setPreviewAppStyle={setPreviewAppStyle}

                    previewAppStyleA={previewAppStyleA}

                    //getNewAppStyleObject={getNewAppStyleObject}
                    

                    appConfig={appConfig}
                    r_setAppConfig={r_setAppConfig}
                    //getNewAppConfigObject={getNewAppConfigObject}

                    ThemeColorsAppIndex={ThemeColorsAppIndex}
                    ThemeSchema={ThemeSchema}
                    LanguageAppIndex={LanguageAppIndex}

                    //
                />}         
            </Reanimated.View>
            </Reanimated.View>
            </Reanimated.View>
        )
    }

    return(<>
        {/*HEADER PANEL*/}
        <Reanimated.View
            style={[
                staticStyles.FlatListsArea,              
                {   
                    top: 0,
                    zIndex: 1,
                    position: 'absolute',
                    borderColor: appStyle.effects.blur? 'transparent' : `${Theme.specials.separator}25`,
                    borderBottomWidth: 0.4                    
                },
                appStyle.effects.blur? {} : {
                    backgroundColor: appStyle.lists.invertColorsHeader? Theme.basics.neutrals.secondary : Theme.basics.accents.primary,
                },
                header
            ]}
        >
            {appStyle.effects.blur && 
            <View 
                style = {[StyleSheet.absoluteFillObject, {
                    flex: 1,
                    //specialty blur for android
                    overflow: 'hidden',
                }]}
            >
            <BlurView
                style = {{flex: 1, }}
                blurType = {'light'}
                blurAmount = {10}
                
                //ANDROID_PROPS
                overlayColor={`${appStyle.lists.invertColorsHeader? Theme.basics.neutrals.secondary : Theme.basics.accents.primary}90`}
                //overlayColor={'transparent'}
                //blurRadius	= {10}
                //downsampleFactor = {10}
            />
            </View>}   
        </Reanimated.View>
        
        {/*HEADER SUBTITLE*/}
        <View 
            style = {[staticStyles.SLtopBord,{ 
                alignItems: 'center',
                marginTop: statusBarHeight,
                position: 'absolute',
                height: itemCategoryHeight,
                right: 0,
                zIndex: 2,
                justifyContent: 'center',
                
            }]}
        >
            <Reanimated.View
                style = {[staticStyles.SLtopBord, type, {}]}
            >
                <ReanimatedTextInput     
                    editable = {false}
                    style = {[staticStyles.AnimatedHeaderText, categoryStyle, {color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary}]}
                    animatedProps={categoryText}
                />
            </Reanimated.View>
            <Reanimated.View
                style = {[staticStyles.SLtopBord, appStick, { 
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    position: 'absolute',
                    height: '100%',
                    right: 0
                }]}
            >
                <Text style = {[staticStyles.AnimatedHeaderText, {color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary}]}>
                    {Language.app}
                </Text>
            </Reanimated.View>
        </View>

        {/*HEADER TITLE*/}
        <View 
            style = {[staticStyles.SLtopBord,{ 
                marginTop: statusBarHeight,
                position: 'absolute',
                height: itemCategoryHeight,
                left: 0,
                zIndex: 2         
            }]}
        >
            <View
                style = {{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',                    
                }}
            >
                <BasePressable 
                    type="i"
                    icon={{name: "backburger", size: 24, color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary}}
                    style={{
                        height: 45, 
                        width: 45, 
                        marginLeft: 15,
                        paddingTop: 4,
                        borderRadius: appStyle.borderRadius.additional
                    }}
                    onPress={backBurgerPress}
                    android_ripple={appStyle.effects.ripple == 'all'? ripple(appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary) : false}
                />
                <Text style = {[staticStyles.AnimatedHeaderText, {color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary}]}>
                    {Language.HeaderTitle}
                </Text>
            </View>
        </View>

        {/*HEADER FREE SELECTOR*/}
        <Reanimated.View
            style = {[selectorLine, {
                height: selectorLineHeightFull,
                width: '100%',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                position: 'absolute',
                top: statusBarHeight,
                zIndex: 1,
            }]}
        >
            {/*HEADER CATEGORYS*/}
            <ReanimatedFlatList
                ref={flatCategorysListRef}
                onScroll={scrollHandlerFlatListCategorys}
                //decelerationRate={'fast'}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{height: itemCategoryHeight, width: deviceWidth}}
                snapToInterval={deviceWidth}
                getItemLayout={(data, index) => (
                    {length: deviceWidth, offset: deviceWidth * index, index: index}
                )}
                data={categorysCustomizer}
                keyExtractor={item => item}
                renderItem={({item, index})=> {
                    return (
                        <Pressable
                            key={String(item+index)}
                            onPress={()=>{selectParametr(item, index, 'categorys')}}
                            style={{
                                width: deviceWidth, 
                                height: itemCategoryHeight,
                            }}
                        >
                            <MaskedView
                                androidRenderingMode = {'software'}
                                style={{
                                    flex: 1,
                                    //width: deviceWidth/2, 
                                    //height: itemCategoryHeight,
                                    justifyContent: 'flex-start', 
                                    backgroundColor: Theme.texts.accents.primary
                                }}
                                maskElement={
                            <Reanimated.View
                                style={[category,{
                                    // Transparent background because mask is based off alpha channel.
                                    backgroundColor: 'transparent',
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center' 
                                }]}                   
                            >
                                <Reanimated.Text 
                                    style={[staticStyles.AnimatedHeaderText, categorysText,]}
                                >
                                    {Language.StructureScreen.typesSettings[item].category}
                                </Reanimated.Text>
                            </Reanimated.View>}>
                            {/* COLOR*/}
                            <Reanimated.View style={[maskCategoryHeight,{width: '100%', backgroundColor: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary}]}/>  
                            </MaskedView>
                        </Pressable>
                    )
                }}
            />
 


            {/*HEADER PARAMS*/}
            <Reanimated.View
                style={[{
                    height: selectorLineHeight,
                }]}
            >
                <MaskedView
                    androidRenderingMode = {'software'}
                    style={{
                        position: 'absolute',
                        bottom: -0.4,
                        width: deviceWidth, 
                        height: 2.5,
                        justifyContent: 'flex-start', 
                        backgroundColor: 'transparent'
                    }}
                    maskElement={
                        <Reanimated.View 
                            style={[animStyleIndicatorLine, { 
                                backgroundColor: 'black',
                                position: 'absolute',
                                //bottom: -0.1,
                                height: 2.5,
                                borderRadius: 1,
                                //transform: [
                                //    {translateY: 0}
                                //]
                                //borderBottomRightRadius: 0,
                                //borderBottomLeftRadius: 0,
                            }]}  
                        />
                    }
                >   
                    {/* COLOR*/}
                    <Reanimated.View style={[maskIndicatorHeight,{width: '100%', backgroundColor: appStyle.lists.invertColorsHeader? Theme.basics.accents.primary : Theme.basics.accents.quaternary}]}/>  
                </MaskedView>
                
                <ReanimatedFlatList
                    ref={flatListRef}
                    style={staticStyles.frontFL}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    onScroll={scrollHandlerFlatListParams}
                    data={allStructurParams}
                    keyExtractor={item => item.param}
                    contentContainerStyle={{// 100//
                        paddingRight: (deviceWidth/2) - (
                            (derivedValues.value.listWidths).length == allStructurParams.length? 
                                (derivedValues.value.listWidths[allStructurParams.length-1])/2 
                            :
                                ((Language.StructureScreen.params[allStructurParams[allStructurParams.length-1].param]).length*0.75*staticStyles.frontFLText.fontSize)/2
                        )
                    }}
                    renderItem={({item, index})=> {
                        return (
                        <Pressable
                            key={String(item+index)}
                            style={[staticStyles.frontFLArea]}
                            onPress={()=>{selectParametr(item, index, "params")}}
                            onLayout={(event)=>{stacker(listWidths, setListWidths, (event.nativeEvent.layout.width+2*staticStyles.frontFLArea.marginHorizontal))}}
                        >   
                            <View
                                style={[staticStyles.frontFLPressable,{
                                    backgroundColor: 'transparent',
                                    height: selectorLineHeight, 
                                }]}
                            >
                                <Text style={[staticStyles.frontFLText, {color: 'transparent'}]}>
                                    {Language.StructureScreen.params[item.param]}
                                </Text>
                            </View>

                            <MaskedView
                                androidRenderingMode = {'software'}
                                style={{
                                    width: '100%',
                                    position: 'absolute', 
                                    height: selectorLineHeight,
                                    justifyContent: 'flex-start', 
                                    backgroundColor: Theme.texts.accents.tertiary
                                }}
                                maskElement={
                            <View
                                style={[staticStyles.frontFLPressable,{
                                    backgroundColor: 'transparent',
                                    height: selectorLineHeight, 
                                }]}
                            >
                                <Text style={[staticStyles.frontFLText]}>
                                    {Language.StructureScreen.params[item.param]}
                                </Text>
                            </View>}>
                            {/* COLOR*/}
                            <Reanimated.View style={[maskParamsHeight, {width: '100%', backgroundColor: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary}]}/>  
                            </MaskedView>
                        </Pressable>
                        )
                    }}
                />
            </Reanimated.View>
        </Reanimated.View>


        {/*BODY*/}
        <ReanimatedSectionList
            ref={sectListRef}
            contentOffset={{x: 0, y: (headHeightTop+itemCategoryHeight+1)}}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            onScroll={scrollSectionsList}
            sections={structureCustomizer}
            keyExtractor={(item, index) => item.param + index}
            style={{
                paddingTop: headerHeight
            }}
            ListHeaderComponent={
                <View
                    style={{
                        //height: headHeight,
                        //maxHeight: headHeight,
                        width: '100%',
                        backgroundColor: Theme.basics.neutrals.primary,
                        marginBottom: selectorLineHeightFull
                    }}

                    onLayout={(event)=>{
                        const height = event.nativeEvent.layout.height
                        if(height != headHeightTop){setHeadHeightTop(height)}
                        
                    }}
                >   
                    {STRUCTURE.settingsData.map((item, index)=>{return(renderItem({item, index}))})}               
                </View> 
            }
            renderSectionHeader={({section: {category, indexSection: index}})=>{
                if(index==0){return null}
                return (
                <View
                    key={String(category)} 
                    style={{
                        height: headerStickysHeight,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        //backgroundColor: 'red'
                        //marginVertical: appStyle.lists.proximity, 
                    }}
                >
                    <Text 
                        style = {[{
                            color: Theme.texts.accents.primary,
                            fontSize: 25,
                            fontWeight: '500',
                            letterSpacing: 4,
                            fontVariant: ['small-caps'],
                            //backgroundColor: 'blue'
                        }]}
                    >
                        {Language.StructureScreen.typesSettings[`${category}`].category}
                    </Text>
                </View> 
                )
            }}
            renderItem={renderItem}
            ListFooterComponent = {
                <View style={{
                        height: deviceHeight -200, //-headerHeight-selectorLineHeight
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >   
                    <Text 
                        style = {[{
                            //color: 'transparent',//,
                            fontSize: 11,
                            fontWeight: 'bold',
                            //fontStyle: 'italic',
                            bottom: 25,
                            letterSpacing: 1.2,
                            fontVariant: ['small-caps'],
                            color: 'black'
                        }]}
                    >
                        YTTI {Application.nativeApplicationVersion}
                    </Text>
                    <MaskedView
                        style={{height: 20, width: 250, flexDirection: 'row', top: -30}}
                        maskElement={
                        <View
                            style={{
                                // Transparent background because mask is based off alpha channel.
                                backgroundColor: 'transparent',
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}
                        >
                        <Ionicons name="logo-react" size={12} color="black" />
                        <Text 
                            style = {[{
                                //color: 'transparent',//,
                                fontSize: 12,
                                fontWeight: 'bold',
                                fontStyle: 'italic',
                                letterSpacing: 1,
                                fontVariant: ['small-caps'],
                                opacity: .5
                            }]}
                        >
                            F1F<Text style={{fontSize: 9, left: -10}}>.INTERFACES</Text>
                        </Text>
                        </View>}
                    >
                    {/* COLORS */}
                    <LinearGradient
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}

                        style ={{
                            flex: 1
                        }}
                        colors = {['#06bcee','#f010f0']}
                    />
                    </MaskedView>
                </View>             
            }
        />
        <Reanimated.View
            style={[scrollTopButton, {
                position: 'absolute',
                height: 40,
                width: 40,
                bottom: -40,
                left: (deviceWidth-40)/2,
                //backgroundColor: 'black'
            }]}
        >    
            <BasePressable 
                type={'i'}
                style={{height: 40}}
                icon={{name: 'format-align-top', size: 40, color: Theme.icons.neutrals.tertiary}}
                onPress={topReturn}
            />
        </Reanimated.View>
    </>)


}

const staticStyles = StyleSheet.create({
    FlatListsArea: {
        //position: 'absolute',
        //top: 60,
        width: deviceWidth,

    },
    frontFL: {
        height: 35
    },
    frontFLArea: {
        marginHorizontal: 5,
        marginTop: 1,
        borderRadius: 20,
    },
    frontFLPressable: {
        marginHorizontal: 5, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    frontFLText: {
        fontSize: 16,
        //opacity: .9,
        fontWeight: '500',
        fontVariant: ['small-caps'],
        //color:  'white'//ThemesColorsAppList[0].skyUpUpUp//
    },
    frontFLLine: {
        width: "100%",
        height: 4,
        borderRadius: 5,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0 
    },

    SLtopBord: {
        //position: 'absolute',
        //zIndex: 11,
        //height: 30,
        //top: 30.25,
        //right: 0,
        //backgroundColor: 'red',
        paddingHorizontal: 3,
        //paddingLeft: 5,
        width: deviceWidth/2
    },
    shadow: {
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4
    },
    SLArea: {
        //backgroundColor: 'white',
        minHeight: 70, 
        paddingHorizontal: 10,
        //justifyContent: 'space-around',
        //alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 15,
        //paddingBottom: 20
    },
    SLParamHeaderText: {
        marginLeft: 5,
        fontSize: 18,
        //position: 'absolute',
        fontWeight: 'bold',
        letterSpacing: 1.8,
        fontVariant: ['small-caps'],
    },
    SLHeaderArea:{
        justifyContent:'flex-end',
        alignItems: 'flex-start',
        flexDirection: 'row',        
        height: 46
    },
    SLHeaderHalfArea:{
        width: deviceWidth/2 + 40,
        height: 46
    },
    AnimatedHeaderText: {
        fontSize: 20,
        fontWeight: '500',
        //fontStyle: 'italic',
        //color: 'white',
        //opacity: .90,
        //textShadowRadius: 0.5,
        //textShadowColor: 'black',
        letterSpacing: 0.5,
        fontVariant: ['small-caps'],
    }

});