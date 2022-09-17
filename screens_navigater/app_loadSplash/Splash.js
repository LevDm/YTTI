import React, {useRef, useState, useEffect} from "react";
import { StyleSheet, View, Pressable, Animated } from "react-native";
import Constants from "expo-constants";

import { MotiView, motify } from "moti";

import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import IconAnimate from "./IconAnimate";


const ShadowRing = ({number, size}) => {
    //const size = 200;
    const ringScale = 5;
    return (
        <MotiView
            style = {{
                position: 'absolute',
                height: number*ringScale+size,
                width: number*ringScale+size,
                borderRadius: (number*ringScale+size)/2,
                borderWidth: number*ringScale + size/10,
                borderColor: '#fff',
                opacity: number != 0?.028 : 1
            }}
            from = {{
                height: number*ringScale+size+20,
                width: number*ringScale+size+20,
                borderRadius: (number*ringScale+size+20)/2,
                borderWidth: number*ringScale + size/10,
                opacity: number != 0?.028 : 1

            }}
            animate ={{
                
                height: [number*ringScale+size, number*ringScale+size+20],
                width: [number*ringScale+size, number*ringScale+size+20],
                borderRadius: [(number*ringScale+size)/2, (number*ringScale+size+20)/2],
                borderWidth: [0, number*ringScale + size/10],
                opacity: [0, number != 0?.028 : 1]
            }}
            transition = {{
                type: "timing",
                duration: 800,
                //loop: true,
                repeat: 1
            }}
        />
    )
}



import themesColorsAppList, {themesApp} from "../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../app_values/Languages";

import { connect } from "react-redux";
import store from "../../redux_files/store"
import mapDispatchToProps from "../../redux_files/dispatchToProps";
import mapStateToProps from "../../redux_files/stateToProps";


const Splash = (props) => {
    const size = 180;
    const duration = 1000;

    //const [LanguageAppIndex, setLanguageAppIndex] = useState(languagesApp.indexOf(props.appConfig.languageApp));//ThemesColorsAppList[ThemeColorsAppIndex]
    const [ThemeColorsAppIndex, setThemeColorAppIndex] = useState(themesApp.indexOf(props.appStyle.theme));//LanguagesAppList[LanguageAppIndex]

    const [appStyle, setAppStyle] = useState(props.appStyle);
    //const [appConfig, setAppConfig] = useState(props.appConfig);

    const Thema = themesColorsAppList[ThemeColorsAppIndex]
    //const Language = languagesAppList[LanguageAppIndex]

    store.subscribe(() => {
        let jstore = store.getState();

        //if(LanguageAppIndex != languagesApp.indexOf(jstore.appConfig.languageApp)){
        //    setLanguageAppIndex(languagesApp.indexOf(jstore.appConfig.languageApp))
        //}

        if(ThemeColorsAppIndex != themesApp.indexOf(jstore.appStyle.theme)){
            setThemeColorAppIndex(themesApp.indexOf(jstore.appStyle.theme));
        }

        if (appStyle != jstore.appStyle) {
            setAppStyle(jstore.appStyle);
        }

        //if (appConfig != jstore.appConfig) {
        //    setAppConfig(jstore.appConfig);
        //}
    })

    //
    const [colorsApp, setColorsApp] = useState();
    
    const [statusAnimated, setStatusAnimated] = useState(true);
    
    const [startIconAnimate, setStartIconAnimate] = useState(false);
    
    const [ringsVisible, setRingsVisible] = useState(true);

    const [index, setIndex] = useState(1)

    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const inputRange = [0, .001, .5, .501, 1]

    
    
    
    
    
    useEffect(()=>{
        const AnimatedCircle = (toValue) => {
            Animated.timing(animatedValue, {
                toValue: toValue,
                duration: 1700,
                useNativeDriver: false
            }).start(()=>{
                setTimeout(()=>{
                    
                    //props.r_setSplash(false);
                    //props.setVisible(false);
                    props.setSplashOut(false)
                    //props.navigation.navigate('App')

                },300)
            });
        }

        //setRingsVisible(true);
        //console.log('HELLO')
        //setStatusAnimated(false);
        setTimeout(()=>{
            setStartIconAnimate(true);
        },400)
    
        setTimeout(()=>{
                //setRingsVisible(false);
            AnimatedCircle(index);
            setIndex(index === 0? 1 : 0)
        },1000) 
        
    },[])

    return (
        
            <Animated.View
                style = {[StyleSheet.absoluteFill,{
                    backgroundColor: animatedValue.interpolate({
                        inputRange: inputRange,
                        outputRange: ['black', 'black', 'black', Thema.basics.accents.primary, Thema.basics.accents.primary]
                    }), 
                    justifyContent: 'center',
                    alignItems: 'center'
                }]}
            >   
                <View
                    style = {[{  
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: Constants.statusBarHeight
                    }]}
                >
                    <ShadowRing number={0} size = {size}/>
                    <ShadowRing number={1} size = {size}/>
                    <ShadowRing number={2} size = {size}/>
                    <ShadowRing number={3} size = {size}/>
                    <ShadowRing number={4} size = {size}/>
                    <ShadowRing number={5} size = {size}/>
                    <ShadowRing number={6} size = {size}/>
                    <ShadowRing number={7} size = {size}/>
                    <ShadowRing number={8} size = {size}/>
                    <ShadowRing number={9} size = {size}/>
                    <ShadowRing number={10} size = {size}/>
                    
                    <Animated.View 
                        style = {{
                            position: 'absolute',
                            justifyContent: 'center',
                            alignItems: 'center',
                            //width: 180,
                            //height: 180,
                            //borderRadius: 90,
                            //backgroundColor: animatedUpBg,
                            transform: [
                                {
                                    perspective: 400
                                },
                                { rotateY: animatedValue.interpolate({
                                    inputRange: [0, .5, 1],
                                    outputRange: ['0deg', '-90deg', '-180deg']
                                })
                                },
                                { scale: animatedValue.interpolate({
                                    inputRange: [0, .5, 1],
                                    outputRange: [1, 8, 1]
                                })
                                },
                                { translateX: animatedValue.interpolate({
                                    inputRange: [0, .5, 1],
                                    outputRange: [0, 25, 0]
                                })
                                },
                            ] 
                        }}
                    >   
                        
                        <Animated.View 
                            style = {{
                                position: 'absolute',
                                width: 180,
                                height: 180,
                                borderRadius: 90,
                                backgroundColor: animatedValue.interpolate({
                                    inputRange: inputRange,
                                    outputRange: [Thema.basics.accents.primary, Thema.basics.accents.primary, Thema.basics.accents.primary, 'black', 'black']
                                }),
                                opacity: animatedValue.interpolate({
                                    inputRange: [0, .25, .5, .501 ,1],
                                    outputRange: [0, .75, 1, 0 ,0]
                                })
                            }}
                        />
                        


                        <Animated.View
                            style = {{
                                position: 'absolute',
                                transform: [
                                    { rotateY: animatedValue.interpolate({
                                        inputRange: [0, .5, 1],
                                        outputRange: ['0deg', '90deg', '180deg']
                                    })
                                    },
                                ] 
                            }}
                        >
                            <IconAnimate startIconAnimate={startIconAnimate} setStartIconAnimate={setStartIconAnimate}/>
                        </Animated.View>

                    </Animated.View>
                </View>
            </Animated.View>

    )
}

export default connect(mapStateToProps('SPLASH'), mapDispatchToProps('SPLASH'))(Splash);