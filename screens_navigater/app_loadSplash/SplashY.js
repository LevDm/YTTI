import React, {useRef, useState, useEffect} from "react";
import { StyleSheet, View, Pressable, Dimensions, Appearance, Text } from "react-native";
import Constants from "expo-constants";

import Animated, {
    useSharedValue, 
    useAnimatedStyle, 
    withTiming,
    withDelay, 
    useAnimatedScrollHandler, 
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
    useAnimatedProps
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import IconAnimate from "./IconAnimate";

import themesColorsAppList, {themesApp} from "../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../app_values/Languages";

import { connect } from "react-redux";
import store from "../../redux_files/store"
import mapDispatchToProps from "../../redux_files/dispatchToProps";
import mapStateToProps from "../../redux_files/stateToProps";


const screen = Dimensions.get('screen')
const widthScreen = screen.width
const heightScreen = screen.height

const widthLogo = 980/screen.scale
const sizeY = 440/screen.scale
const borderWidth = 40/screen.scale


import Svg, { Circle, Rect, Ellipse  } from "react-native-svg";

const SplashY = (props) => {
    const size = 180;
    const duration = 1000;
    const [ThemeColorsAppIndex, setThemeColorAppIndex] = useState(themesApp.indexOf(props.appStyle.theme));//LanguagesAppList[LanguageAppIndex]

    const [appStyle, setAppStyle] = useState(props.appStyle);

    const [ThemeSchema, setThemeSchema] = useState(props.appStyle.colorScheme == 'auto'? Appearance.getColorScheme() : props.appStyle.colorScheme)

    const [LanguageAppIndex, setLanguageAppIndex] = useState(languagesApp.indexOf(props.appConfig.languageApp));//ThemesColorsAppList[ThemeColorsAppIndex]    
    const [appConfig, setAppConfig] = useState(props.appConfig);
    const Language = languagesAppList[LanguageAppIndex]

    store.subscribe(() => {
        let jstore = store.getState();

        if(LanguageAppIndex != languagesApp.indexOf(jstore.appConfig.languageApp)){
           setLanguageAppIndex(languagesApp.indexOf(jstore.appConfig.languageApp))
        }

        if(ThemeColorsAppIndex != themesApp.indexOf(jstore.appStyle.theme)){
            setThemeColorAppIndex(themesApp.indexOf(jstore.appStyle.theme));
        }

        if(ThemeSchema != jstore.appStyle.colorScheme){
            setThemeSchema(jstore.appStyle.colorScheme == 'auto'? Appearance.getColorScheme() : jstore.appStyle.colorScheme);
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
            if(appStyle.colorScheme == 'auto'){
                console.log('splashY accept new color sheme', listenerColorSheme, 'used shema', appStyle.colorScheme)
                setThemeSchema(listenerColorSheme)
            }
        }
    },[listenerColorSheme])
    
    Appearance.addChangeListener(({colorScheme})=>{
        setListinerColorScheme(colorScheme)
    })

    const Thema = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]

    //
    const [colorsApp, setColorsApp] = useState();
    
    const [statusAnimated, setStatusAnimated] = useState(true);
    
    const [startIconAnimate, setStartIconAnimate] = useState(false);
    
    const [ringsVisible, setRingsVisible] = useState(true);

    const [index, setIndex] = useState(1)

    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const inputRange = [0, .001, .5, .501, 1]

    
    //general anim duration
    const globalDuration = 1000 * 1
    


    useEffect(()=>{
        //setTimeout(()=>{

            //props.setSplashOut(false)

        //},globalDuration)
    },[])

    
    const circleDuration = globalDuration*0.43
    const vibeDelay = circleDuration*0.58
    const vibeDuration = globalDuration*0.37
    const blindDelay = vibeDelay+ vibeDuration*0.54
    const blindDuration = globalDuration*0.37
    const animDuration = globalDuration*0.181
    const durationTransform = (blindDuration+blindDelay)

    //console.log(durationTransform+animDuration)

    const enteringAnimation = (targetValues) => {
        'worklet';
        
        const animations = {
            opacity: withDelay(durationTransform, withTiming(0, { duration: animDuration})),
        };
        const initialValues = {
          opacity: 1
        };
        return {
          initialValues,
          animations,
        };
    };

    

    const enteringLogo= (targetValues) => {
        'worklet';
        const animations = {
            opacity: withDelay(circleDuration, withTiming(1, { duration: circleDuration/3})),
        };
        const initialValues = {
          opacity: 0
        };
        return {
          initialValues,
          animations,
        };
    };

    

    const enteringY = (targetValues) => {
        'worklet';
        const animations = {
            opacity: withDelay(circleDuration/4, withTiming(0, { duration: circleDuration/2})),
        };
        const initialValues = {
          opacity: 1
        };
        return {
          initialValues,
          animations,
        };
    };

    const enteringYLeft = (targetValues) => {
        'worklet';
        
        const animations = {
            width: withTiming(widthLogo/2, { duration: circleDuration, easing: Easing.bezier(.71,0,.32,1.5)}),
            transform: [
                {translateX: withTiming(-0.5*(widthLogo-sizeY), { duration: circleDuration, easing: Easing.bezier(.71,0,.32,1.5)})}
            ]
        };
        const initialValues = {
          width: sizeY/2,
          height: sizeY,
          transform: [
            {translateX: 0}
          ]

        };
        return {
          initialValues,
          animations,
        };
    };
    const enteringYRight = (targetValues) => {
        'worklet';
        
        const animations = {
            width: withTiming(widthLogo/2, { duration: circleDuration, easing: Easing.bezier(.71,0,.32,1.5)}),
            //transform: [
            //    {translateX: withTiming(-0.5*(widthLogo-sizeY), { duration: circleDuration, easing: Easing.bezier(.71,0,.32,1.5)})}
            //]
        };
        const initialValues = {
          width: sizeY/2,
          height: sizeY,
          //transform: [
          //  {translateX: 0}
          //]
        };
        return {
          initialValues,
          animations,
        };
    };

    

    const enteringVibeRight = (targetValues) => {
        'worklet';
        const animations = {
            //right:  withDelay(vibeDelay, withTiming(0, { duration: tingDuration })),cubic-bezier(0,1.84,.53,.51)cubic-bezier(0,.55,.45,1)
            //width: sizeY,
            opacity: withDelay(vibeDelay, withTiming(1, { duration: vibeDuration})),
            height:  withDelay(vibeDelay, withTiming(heightScreen/2, { duration: vibeDuration})),
            borderTopRightRadius :  withDelay(vibeDelay, withTiming(0, { duration: vibeDuration })),
            borderBottomRightRadius :  withDelay(vibeDelay, withTiming(0, { duration: vibeDuration })),
            borderRightWidth: withDelay(vibeDelay, withTiming(borderWidth*2, { duration: vibeDuration, easing: Easing.bezier(0.68, -0.6, 0.32, 1.6)  })),
            transform: [
                {translateX: withDelay(vibeDelay, withTiming(5, { duration: vibeDuration, easing: Easing.bezier(0.68, -0.6, 0.32, 1.6) }))},
                {translateY: withDelay(vibeDelay, withTiming(-0.5*(heightScreen/2-sizeY), { duration: vibeDuration }))}
            ]
        };
        const initialValues = {
            opacity: 0,
            width: sizeY,
            height: sizeY,
            borderTopRightRadius : 200,
            borderBottomRightRadius : 200,
            borderRightWidth: 5,
            transform: [
                {translateX:  -0.5*(widthScreen-widthLogo)},
                {translateY:  0}
            ], 
        };
        return {
          initialValues,
          animations,
        };
    };
    const enteringVibeLeft = (targetValues) => {
        'worklet';
        const animations = {
            //right:  withDelay(vibeDelay, withTiming(0, { duration: tingDuration })),cubic-bezier(0,1.84,.53,.51)cubic-bezier(0,.55,.45,1)
            //width: sizeY,
            opacity: withDelay(vibeDelay, withTiming(1, { duration: vibeDuration})),
            height:  withDelay(vibeDelay, withTiming(heightScreen/2, { duration: vibeDuration})),
            borderTopLeftRadius :  withDelay(vibeDelay, withTiming(0, { duration: vibeDuration })),
            borderBottomLeftRadius :  withDelay(vibeDelay, withTiming(0, { duration: vibeDuration })),
            borderLeftWidth: withDelay(vibeDelay, withTiming(borderWidth*2, { duration: vibeDuration, easing: Easing.bezier(0.68, -0.6, 0.32, 1.6)  })),
            transform: [
                {translateX: withDelay(vibeDelay, withTiming(-5, { duration: vibeDuration, easing: Easing.bezier(0.68, -0.6, 0.32, 1.6) }))},
                {translateY: withDelay(vibeDelay, withTiming(-0.5*(heightScreen/2-sizeY), { duration: vibeDuration }))}
            ]
        };
        const initialValues = {
            opacity: 0,
            width: sizeY,
            height: sizeY,
            borderTopLeftRadius : 200,
            borderBottomLeftRadius : 200,
            borderLeftWidth: 5,
            transform: [
                {translateX:  0.5*(widthScreen-widthLogo)},
                {translateY:  0}
            ], 
        };
        return {
          initialValues,
          animations,
        };
    };

    

    const enteringBlindRight = (targetValues) => {
        'worklet';
        const animations = {
            borderTopLeftRadius: withDelay(blindDelay, withTiming(0, { duration: blindDuration})),
            borderBottomLeftRadius: withDelay(blindDelay, withTiming(0, { duration: blindDuration})),
            transform: [
                {translateX:  withDelay(blindDelay, withTiming(0, { duration: blindDuration, easing: Easing.bezier(0.25, 1, 0.5, 1)}))}
            ],
        };
        const initialValues = {
            borderTopLeftRadius: heightScreen,
            borderBottomLeftRadius: heightScreen,
            transform: [
                {translateX:  widthScreen},
            ],
        };
        return {
          initialValues,
          animations,
        };
    };
    const enteringBlindLeft = (targetValues) => {
        'worklet';
        const animations = {
            borderTopRightRadius: withDelay(blindDelay, withTiming(0, { duration: blindDuration})),
            borderBottomRightRadius: withDelay(blindDelay, withTiming(0, { duration: blindDuration})),
            transform: [
                {translateX:  withDelay(blindDelay, withTiming(0, { duration: blindDuration, easing: Easing.bezier(0.25, 1, 0.5, 1)}))}
            ],
        };
        const initialValues = {
            borderTopRightRadius: heightScreen,
            borderBottomRightRadius: heightScreen,
            transform: [
                {translateX: -widthScreen},
            ],
        };
        return {
          initialValues,
          animations,
        };
    };
    const exiting = (targetValues) => {
        'worklet';
        const animations = {
          opacity: withTiming(0, { duration: circleDuration }),
        };
        const initialValues = {
          opacity: 1,
        };
        return {
          initialValues,
          animations,
        };
    };


    const state = useSharedValue(0)
    const body = useAnimatedStyle(()=>({
        opacity: withDelay(durationTransform, withTiming(state.value? 0 : 1, { duration: animDuration})),
    }))
    const logo = useAnimatedStyle(()=>({
        opacity: withDelay(circleDuration, withTiming(state.value? 1 : 0, { duration: circleDuration/3})),
    }))
    const iconY = useAnimatedStyle(()=>({
        opacity: withDelay(circleDuration/4, withTiming(state.value? 0 : 1, { duration: circleDuration/2})),
    }))
    const iconYLeft = useAnimatedStyle(()=>({
        width: withTiming( state.value? (widthLogo/2) : (sizeY/2), { duration: circleDuration, easing: Easing.bezier(.71,0,.32,1.5)}),
        transform: [
            {translateX: withTiming( state.value? 0: 0, { duration: circleDuration, easing: Easing.bezier(.71,0,.32,1.5)})}
        ],
        //height: sizeY,
    }))
    const iconYRight = useAnimatedStyle(()=>({
        width: withTiming(state.value? (widthLogo/2) : (sizeY/2), { duration: circleDuration, easing: Easing.bezier(.71,0,.32,1.5)}),
        //height: sizeY,
    }))
    const vibeRight = useAnimatedStyle(()=>({
        opacity: withDelay(vibeDelay, withTiming( state.value? 1 : 0, { duration: vibeDuration})),
        height:  withDelay(vibeDelay, withTiming( state.value? heightScreen/2 : sizeY, { duration: vibeDuration})),
        borderTopRightRadius :  withDelay(vibeDelay, withTiming( state.value? 0 : 200, { duration: vibeDuration })),
        borderBottomRightRadius :  withDelay(vibeDelay, withTiming(state.value? 0 : 200, { duration: vibeDuration })),
        borderRightWidth: withDelay(vibeDelay, withTiming(state.value? borderWidth*2 : 5, { duration: vibeDuration, easing: Easing.bezier(0.68, -0.6, 0.32, 1.6)  })),
        transform: [
            {translateX: withDelay(vibeDelay, withTiming(state.value? 0 : (-0.5*(widthScreen-widthLogo)), { duration: vibeDuration, easing: Easing.bezier(0.68, -0.6, 0.32, 1.6) }))},
            //{translateY: withDelay(vibeDelay, withTiming(state.value? (-0.5*(heightScreen/2-sizeY)) : 0, { duration: vibeDuration }))}
        ]
    }))
    const vibeLeft = useAnimatedStyle(()=>({
        opacity: withDelay(vibeDelay, withTiming( state.value?1 :0, { duration: vibeDuration})),
        height:  withDelay(vibeDelay, withTiming(state.value? heightScreen/2 :sizeY, { duration: vibeDuration})),
        borderTopLeftRadius :  withDelay(vibeDelay, withTiming(state.value? 0 :200, { duration: vibeDuration })),
        borderBottomLeftRadius :  withDelay(vibeDelay, withTiming(state.value? 0 :200, { duration: vibeDuration })),
        borderLeftWidth: withDelay(vibeDelay, withTiming(state.value? borderWidth*2 :5, { duration: vibeDuration, easing: Easing.bezier(0.68, -0.6, 0.32, 1.6)  })),
        transform: [
            {translateX: withDelay(vibeDelay, withTiming(state.value? 0 :(0.5*(widthScreen-widthLogo)), { duration: vibeDuration, easing: Easing.bezier(0.68, -0.6, 0.32, 1.6) }))},
            //{translateY: withDelay(vibeDelay, withTiming(state.value? (-0.5*(heightScreen/2-sizeY)) : 0, { duration: vibeDuration }))}
        ]
    }))
    const blindRight = useAnimatedStyle(()=>({
        borderTopLeftRadius: withDelay(blindDelay, withTiming(state.value? 0 : heightScreen, { duration: blindDuration})),
        borderBottomLeftRadius: withDelay(blindDelay, withTiming(state.value? 0 : heightScreen, { duration: blindDuration})),
        transform: [
            {translateX:  withDelay(blindDelay, withTiming(state.value? 0 : widthScreen, { duration: blindDuration, easing: Easing.bezier(0.25, 1, 0.5, 1)}))}
        ],
    }))
    const blindLeft = useAnimatedStyle(()=>({
        borderTopRightRadius: withDelay(blindDelay, withTiming(state.value? 0 : heightScreen, { duration: blindDuration})),
        borderBottomRightRadius: withDelay(blindDelay, withTiming(state.value? 0 : heightScreen, { duration: blindDuration})),
        transform: [
            {translateX:  withDelay(blindDelay, withTiming(state.value? 0 : -widthScreen, { duration: blindDuration, easing: Easing.bezier(0.25, 1, 0.5, 1)}))}
        ],
    }))
    useEffect(()=>{
        if(props.splashStart){
            state.value = 1
            setTimeout(()=>{
                props.splashOut()
            },globalDuration)
        }
    },[props.splashStart])

    useEffect(()=>{
        console.log('splash screen render')
    },[])

    return (
        <Animated.View
            //entering={enteringAnimation}
            style = {[StyleSheet.absoluteFill,{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black'
            },body]}
        >      
            <Animated.View
                //entering = {enteringBlindRight} 
                style = {[
                    //area, 
                    {
                    position: 'absolute',
                    right: 0,
                    width: widthScreen,
                    height: heightScreen,
                    
                    backgroundColor: Thema.basics.accents.primary
                },blindRight]}
            />
            <Animated.View
                //entering = {enteringBlindLeft} 
                style = {[
                    //area, 
                    {
                    position: 'absolute',
                    left: 0,
                    width: widthScreen,
                    height: heightScreen,
                    
                    backgroundColor: Thema.basics.accents.primary
                },blindLeft]}
            />
            <Animated.View
                //entering = {enteringVibeRight} 
                style = {[
                    //area, 
                    {
                    position: 'absolute',
                    right: 0,
                    width: sizeY,
                    height: sizeY,
                    borderColor: Thema.basics.accents.primary
                },vibeRight]}
            />
            <Animated.View
                //entering = {enteringVibeLeft} 
                style = {[
                    //area, 
                    {
                    position: 'absolute',
                    left: 0,
                    width: sizeY,
                    height: sizeY,
                    borderColor: Thema.basics.accents.primary
                },vibeLeft]}
            />


            <Animated.View
                //entering = {enteringYRight}  
                style = {[  
                    {
                    left: widthScreen/2-0,
                    position: 'absolute',
                    width: sizeY/2,
                    height: sizeY,
                    borderRadius: sizeY/2,
                    borderBottomLeftRadius: 0,
                    borderTopLeftRadius: 0,
                    borderBottomStartRadius: 0,
                    borderWidth: borderWidth,
                    borderLeftWidth: 0,
                    borderColor: 'white',
                    //opacity: 0.8
                },iconYRight]}
            />

            <Animated.View
                //entering = {enteringYLeft}  
                style = {[  
                    {
                    right: widthScreen/2-0.18180509,
                    position: 'absolute',
                    width: sizeY/2,
                    height: sizeY,
                    borderRadius: sizeY/2,
                    borderBottomRightRadius: 0,
                    borderTopRightRadius: 0,
                    borderWidth: borderWidth,
                    borderRightWidth: 0,
                    borderColor: 'white',
                    //opacity: 0.8
                },iconYLeft]}
            />
            
            

            {true &&
            <Animated.View
                //entering={enteringY}
                style = {[  
                    {
                    position: 'absolute',
                }, iconY]}
            >                
                <Svg width={290/screen.scale} height={345/screen.scale} viewBox="0 -55 290 345" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Circle cx="30" cy="30" r="30" fill="white"/>
                <Circle cx="260" cy="30" r="30" fill="white"/>
                <Circle cx="145" cy="260" r="30" fill="white"/>
                <Circle cx="145" cy="144" r="30" fill="white"/>
                <Rect x="115" y="259" width="115" height="60" transform="rotate(-90 115 259)" fill="white"/>
                <Rect x="124" y="123.502" width="161.93" height="60" transform="rotate(-45 124 123.502)" fill="white"/>
                <Rect x="51.4264" y="9" width="161.93" height="60" transform="rotate(45 51.4264 9)" fill="white"/>
                </Svg>
            </Animated.View>
            } 

            {true &&
            <Animated.View
                //entering={enteringLogo}
                style = {[  
                    {
                    position: 'absolute',
                }, logo]}
            >
            <Svg width={980/screen.scale} height={445/screen.scale} viewBox='0 -2 980 445'  fill="none" xmlns="http://www.w3.org/2000/Svg">
                <Circle cx="105" cy="135" r="30" fill="white"/>
                <Circle cx="335" cy="135" r="30" fill="white"/>
                <Circle cx="220" cy="365" r="30" fill="white"/>
                <Circle cx="220" cy="249" r="30" fill="white"/>
                <Rect x="190" y="364" width="115" height="60" transform="rotate(-90 190 364)" fill="white"/>
                <Rect x="199" y="228.502" width="161.93" height="60" transform="rotate(-45 199 228.502)" fill="white"/>
                <Rect x="126.426" y="114" width="161.93" height="60" transform="rotate(45 126.426 114)" fill="white"/>
                {false && <Rect x="20" y="20" width="940" height="400" rx="200" stroke="white" strokeWidth="40"/>}
                <Ellipse cx="535.31" cy="370.69" rx="24.3103" ry="24.3103" fill="white"/>
                <Ellipse cx="628.5" cy="184.31" rx="24.3103" ry="24.3103" fill="white"/>
                <Circle cx="721.69" cy="370.69" r="24.3103" fill="white"/>
                <Rect x="574.207" y="315.641" width="38.1414" height="108.94" transform="rotate(-90 574.207 315.641)" fill="white"/>
                <Rect width="208.38" height="48.6207" transform="matrix(-0.447291 -0.894389 -0.894389 0.447291 743.449 360.149)" fill="white"/>
                <Rect width="208.38" height="48.6207" transform="matrix(-0.447291 0.894389 0.894389 0.447291 606.638 173.776)" fill="white"/>
                <Circle cx="783.5" cy="370.69" r="24.3103" fill="white"/>
                <Ellipse cx="876.69" cy="184.31" rx="24.3103" ry="24.3103" fill="white"/>
                <Circle cx="690.31" cy="184.31" r="24.3103" fill="white"/>
                <Rect x="690.31" y="208.621" width="48.6207" height="186.755" transform="rotate(-90 690.31 208.621)" fill="white"/>
                <Rect x="759.19" y="203.759" width="48.6207" height="166.931" fill="white"/>
                <Circle cx="473.5" cy="370.69" r="24.3103" fill="white"/>
                <Ellipse cx="566.69" cy="184.31" rx="24.3103" ry="24.3103" fill="white"/>
                <Circle cx="380.31" cy="184.31" r="24.3103" fill="white"/>
                <Rect x="380.31" y="208.621" width="48.6207" height="186.755" transform="rotate(-90 380.31 208.621)" fill="white"/>
                <Rect x="449.19" y="203.759" width="48.6207" height="166.931" fill="white"/>
            </Svg>
            </Animated.View>}

            
            {appConfig.user.name &&
            <Text
                style = {{
                    position: 'absolute',
                    bottom: 200,
                    color: 'white',
                    fontSize: 30,
                }}
            >
                Hello, {appConfig.user.name}!
            </Text>} 
        </Animated.View>
    )
}

export default connect(mapStateToProps('SPLASH'), mapDispatchToProps('SPLASH'))(SplashY);