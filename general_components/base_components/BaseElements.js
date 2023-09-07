import React, {
    useState,  
    useEffect,
    useRef,
    useMemo,
    useCallback
} from "react";

import { 
    StyleSheet, 
    Text, 
    Pressable, 
    View,
    Modal,
    Keyboard,
    TextInput,
    Dimensions
} from 'react-native';

import Slider from "@react-native-community/slider";

import Reanimated, {
    useSharedValue, 
    useAnimatedStyle, 
    withTiming, 
    withSequence,
    withSpring,
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

import { MaterialCommunityIcons } from "@expo/vector-icons";

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

import languagesAppList, {languagesApp} from "../../app_values/Languages";
import themesColorsAppList, {themesApp} from "../../app_values/Themes";
const Theme = themesColorsAppList[1]['light']

export const BasePressable = ({
    type = "ti",
    icon = {name: "border-none-variant", size: 25, color: Theme.icons.neutrals.primary },
    text = "Text",
    textProps = null,
    textStyle = {},
    style = {},
    styleItemContainer = {},  
    onPress,
    onLongPress,
    direction = "row", //column || row ?&&(-reverse)
    rippleColor = false,
    android_ripple,
    disabled = false
    }) => {

    for (let stylesObject of [textStyle, style, styleItemContainer]) {
        if(Array.isArray(stylesObject)){
            let newStyle = {}
            for (let i of stylesObject){
                for (let j in i){
                    newStyle[j]=i[j]
                }
            }

            if( stylesObject == style ){ style = newStyle } 
            if( stylesObject == textStyle ){ textStyle = newStyle } 
            if( stylesObject == styleItemContainer ){ styleItemContainer = newStyle } 
        } 
    }
    
    let rippleRadius = 15
    if(style.width && style.height){
        if(style.width >= style.height){
            rippleRadius = style.width/2
        } else {
            rippleRadius = style.height/2
        }
    } else if(style.width){
        rippleRadius = style.width/2
    } else if(style.height){
        rippleRadius = style.height/2
    }


    const dynamicStyle = useAnimatedStyle(()=>{
        const duration = 300
        return {
            height: withTiming(style.height, {duration: duration}),
            width: withTiming(style.width, {duration: duration}),
            borderRadius: withTiming(style.borderRadius, {duration: duration}),
            backgroundColor: withTiming(style.backgroundColor, {duration: duration}),
        }
    })

    return (
        <Reanimated.View 
            style = {[
                style,
                dynamicStyle, 
                {        
                    //flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    //minHeight: 30,
                    //minWidth: 30,
                    //alignContent: 'center',
                    //borderRadius: 12,
                    //backgroundColor: 'blue',
                }
            ]}
        >
            <Pressable
                disabled={disabled}
                style = {[{
                    flex: 1,
                    //justifyContent: 'center',
                    //alignItems: 'center',
                    //alignContent: 'center', 
                    //borderRadius: 12,
                    height: '100%',
                    width: '100%',
                    //backgroundColor: 'grey',
                    }
                ]}
                android_ripple = {android_ripple? android_ripple : {}}
                unstable_pressDelay = {300}
                onLongPress = {onLongPress}
                onPress = {onPress}
                
            >   
                <View
                    style = {[                     
                        {
                            flex: 1,
                            flexDirection: direction,
                            alignItems: 'center', 
                            justifyContent: 'center',
                            padding: 0
                        },
                        styleItemContainer
                    ]}
                >
                    {(type == "t" || type == "ti") && 
                    <Text {...textProps} style = {[staticStyles.text, textStyle]}> {text} </Text>
                    }

                    {(type == "i" || type == "ti") && 
                    <MaterialCommunityIcons 
                        name = {icon.name == undefined? "border-none-variant" : icon.name} 
                        size = {icon.size == undefined? 25 : icon.size} 
                        color = {icon.color == undefined? Theme.icons.neutrals.primary : icon.color}
                    />
                    }
                </View>
            </Pressable>
        </Reanimated.View>               
    )
}

const AnimatedSlider = Reanimated.createAnimatedComponent(Slider)
export const BaseSlider = ({
    signaturesText = {left: 'left bord',right: 'right bord'},
    signaturesStyle = {},
    areaStyle = {},

    maximumTrackTintColor,
    maximumValue,
    minimumTrackTintColor,
    minimumValue,
    onSlidingComplete,
    onValueChange,
    step,
    thumbTintColor,
    value,
    }) => {

    return (
        <View      
            style = {[{
                flexDirection: 'row',
                justifyContent: 'space-between',
                //width: "100%",
                flex: 1,
                height: 40,
                paddingBottom: 15
                //backgroundColor: 'red'
            }, areaStyle]}
            //onResponderGrant={() => true}
            //onMoveShouldSetResponder={() => true}
            //onStartShouldSetResponder={()=>true}
            //onMoveShouldSetResponde={()=>true}
        >
            <Text
                style = {[signaturesStyle, {
                    position: 'absolute',
                    left: 10,
                    bottom: 5
                }]}
            >
                {signaturesText.left}
            </Text>
            <AnimatedSlider                
                style = {{
                    flex: 1,
                }}
                //onResponderGrant={() => true}
                ///onResponderTerminationRequest={()=>false}
                //onStartShouldSetResponder={()=>true}
                //onMoveShouldSetResponde={()=>true}

                maximumTrackTintColor = {maximumTrackTintColor}
                minimumTrackTintColor = {minimumTrackTintColor}
                thumbTintColor = {thumbTintColor}

                value = {value}
                maximumValue = {maximumValue}
                minimumValue = {minimumValue}
                step = {step}

                onSlidingComplete = {onSlidingComplete}
                onValueChange = {onValueChange}  
            />
            <Text
                style = {[signaturesStyle, {
                    position: 'absolute',
                    right: 10,
                    bottom: 5
                }]}
            >
                {signaturesText.right}
            </Text>
        </View>   
    )
}

import { Ionicons } from '@expo/vector-icons';
const R_Ionicons = Reanimated.createAnimatedComponent(Ionicons)

export const BaseBox = ({
    isCheckBox = false,
    //outerRing = true,
    Item = <Text>Text</Text>,
    boxBorderRadius = 12,
    designType = 'type_2',
    shadow = {
        style: 'material',
        colors: Theme.specials.shadow
    },
    colors={
        background: Theme.basics.neutrals.secondary,
        primary: Theme.icons.accents.secondary,
        secondary: Theme.icons.accents.quaternary,
        //tertiary: Theme.icons.accents.quaternary,
        //quaternary: Theme.icons.neutrals.tertiary,
    },
    style = {},
    size = 22,
    boxId = 0,
    aCheck = undefined,
    check : checkValue = false,
    onLongPress,
    onPress,
    android_ripple,    
}, props) => {

    //const designType = 'type_1'
    //const [checkValue, setCheckValue] = useState(check)

    const duration = 200

    const dynamicStylePrimaryBox = useAnimatedStyle(()=>{
        //const borderWidthValue = (isCheckBox || check)? 2 : 2
        const aCheckValue = aCheck? aCheck.value[boxId] : checkValue
        return {
            //borderWidth: withTiming(borderWidthValue, {duration: duration}), 
            borderRadius: withTiming(boxBorderRadius, {duration: duration}),
            borderColor: withTiming((aCheckValue? colors.primary : isCheckBox? colors.primary : designType == 'type_2'? colors.secondary : 'transparent' ), {duration: duration}),
        }
    }, [checkValue, boxBorderRadius, colors, aCheck])

    const dynamicStyleSecondaryBox = useAnimatedStyle(()=>{
        //const margimValue = ((isCheckBox || check)? 2 : 4) -2
        const aCheckValue = aCheck? aCheck.value[boxId] : checkValue
        return {
            borderRadius: withTiming(boxBorderRadius-(designType == 'type_2'? 0 : 4), {duration: duration}),
            backgroundColor: withTiming((aCheckValue? colors.primary : isCheckBox? 'transparent': designType == 'type_2'? 'transparent' : colors.secondary  ), {duration: duration}),

            height: withTiming(  (designType == 'type_2'&& aCheckValue? size : size - (isCheckBox? 8 : aCheckValue? 11 : 6)) , {duration: duration}),
            width:  withTiming(  (designType == 'type_2'&& aCheckValue? size : size - (isCheckBox? 8 : aCheckValue? 11 : 6)) , {duration: duration}),
        }
    }, [checkValue, boxBorderRadius, colors, aCheck])

    const tertiaryBox = useAnimatedStyle(()=>{
        const aCheckValue = aCheck? aCheck.value[boxId] : checkValue
        return {
            opacity: withTiming( (designType == 'type_2' && aCheckValue && !isCheckBox)? 1 : 0, {duration: duration}),
        }
    })

    const icon = useAnimatedStyle(()=>{
        const aCheckValue = aCheck? aCheck.value[boxId] : checkValue
        return {
            opacity: withTiming( (designType == 'type_2' && aCheckValue && isCheckBox)? 1 : 0, {duration: duration}),
        }
    })


    const boxPress = () => {
        //setCheckValue(!checkValue)
        onPress()
    }
  
    return (
        <View
            props = {props}
            style = {[
                {
                    minHeight: size,
                    minWidth: size,   
                }, 
                style
            ]}
        >
            <Pressable
                disabled = {!isCheckBox && checkValue}
                style = {{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
                android_ripple = {android_ripple? android_ripple : {}}
                //unstable_pressDelay = {0}
                onLongPress = {onLongPress}
                onPress={onPress}
            >
                <Reanimated.View
                    style = {[{
                        height: size,
                        width: size,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }]}
                >
                    <Reanimated.View
                        style = {[{
                            //flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            //height:  (designType == 'type_2'&& checkValue? size : size - (isCheckBox? 8 : checkValue? 11 : 6)),
                            //width:  (designType == 'type_2'&& checkValue? size : size - (isCheckBox? 8 : checkValue? 11 : 6)),
                        }, dynamicStyleSecondaryBox]}
                    >
                        <R_Ionicons 
                            name="checkmark" 
                            size={size-8} 
                            color={colors.background}
                            style={icon}
                        />
                        <Reanimated.View 
                            style={[{
                                position: 'absolute',
                                width: (size-1)/2,
                                height: (size-1)/2,
                                borderRadius: boxBorderRadius-6,
                                backgroundColor: colors.background
                            }, tertiaryBox]}
                        /> 
                    </Reanimated.View>
                    <Reanimated.View 
                        style = {[{
                            position: 'absolute',
                            height: size,
                            width: size,
                            borderWidth: 2
                        }, dynamicStylePrimaryBox]}
                    />
                </Reanimated.View>
                {Item}
            </Pressable>
        </View>
    )
}

import SkiaViewDisign from "./SkiaViewDisign";
const AnimatedPressable = Reanimated.createAnimatedComponent(Pressable)
export const BaseSwitch = ({
    Item = <Text>Text</Text>,
    designType = 'type_1',
    shadow = {
        style: 'material',
        colors: Theme.specials.shadow
    },
    separator,
    separatorStyle,
    borderRadius = 3,
    trackStyle = {},
    thumbStyle = {},
    style = {},
    size = 24,
    primeValue = false,
    aValue = undefined,
    colors = {
        track: {true: 'green', false: 'grey'}, thumb: {true: 'green', false: 'blue'}, 
        background: Theme.basics.neutrals.secondary,
        primary: Theme.icons.accents.secondary,
        secondary: Theme.icons.accents.tertiary,
        tertiary: Theme.icons.accents.quaternary,
        quaternary: Theme.icons.neutrals.tertiary,
        //separator:  Theme.specials.separator
    },
    onChange,
    duration = 200,
    android_ripple
}, props) => {
    //const designType = 'type_3'

    const [switchValue, setSwitchValue] = useState(primeValue);
    /*
    
    useEffect(()=>{
        primeValue != switchValue? setSwitchValue(primeValue) : null
    },[primeValue])
    const dynamicStyleTrack = useAnimatedStyle(()=>{
        return {    
            //backgroundColor: withTiming((switchValue? colors.primary: colors.tertiary), {duration: duration}),

        }
    },[switchValue, colors, borderRadius, designType])

    */


    const switchState = useDerivedValue(()=> {
        //console.log('SWITCH')
        runOnJS(setSwitchValue)(aValue? aValue.value : primeValue)
        return ( aValue? aValue.value : primeValue)
    })

    const dynamicStyleTrumb = useAnimatedStyle(()=>{

        return {
            //backgroundColor: withTiming(colors.background, {duration: duration}),
            //borderColor: withTiming((switchValue? colors.primary : colors.tertiary), {duration: duration}),

            transform: [
                {translateX: withTiming(
                    designType == 'type_3'? (size*(!switchState.value? 0.2 : 1.3)) : (size*(!switchState.value? -0.5 : 0.7)),

                    {duration: duration}
                )}
            ],

        }
    },[switchState, colors, borderRadius, designType])

    const onPress = () => {
        setSwitchValue(!switchState.value)
        switchState.value = !switchState.value
        if(onChange != undefined){onChange()};
    }

    return (
        <Pressable
            props = {props}
            style = {[{
                minHeight: size,
                minWidth: size*2,
                justifyContent: 'center',
                alignItems: 'center',
            }, style]}
            android_ripple = {android_ripple? android_ripple : {}}
            onPress = {onPress}
        >
        <View 
            style = {{
                minHeight: size,
                minWidth: size*2.2,
                justifyContent: 'center',
                alignItems: 'center',
                //backgroundColor: 'red',
            }}
        >

        
        <Reanimated.View
            style = {[{
                justifyContent: 'center',
                
                height: (designType == 'type_3'? size : (size*0.7))+4,
                width: (designType == 'type_3'? 2*size : (size*1.2))+4,
                //marginRight: designType == 'type_3'? size/4 : size/2,
            },]}
        >
            <SkiaViewDisign
                isGeneralObject = {true}
                borderRadius = {borderRadius}
                backgroundColor = {switchValue? (designType != 'type_2'? colors.primary : colors.secondary) : colors.tertiary}
                shadowColors = {shadow.colors}
                shadowMargin={{horizontal: 2, vertical: 2}}
                shadowStyle = {shadow.style}
                adaptiveSizeForStyle={false}
                innerShadow={{
                    used: true,
                    borderWidth: 1
                }}
                initSize={{
                    height: (designType == 'type_3'? size : (size*0.7))+4,
                    width: (designType == 'type_3'? 2*size : (size*1.2))+4
                }}
            />
 
            <Reanimated.View
                style = {[{
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: (designType == 'type_3'? size*0.5 : size)+4,
                    width: (designType == 'type_3'? size*0.5 : size)+4,
                    backgroundColor: 'transparent'
                    //borderWidth: size/9,
                }, dynamicStyleTrumb]}
            >
                <SkiaViewDisign
                    isGeneralObject = {true}
                    borderRadius = {borderRadius - (designType == 'type_3'? 6 : 0)}
                    backgroundColor = {designType == 'type_3'? colors.background: switchValue? colors.primary : colors.quaternary} //(designType == 'type_1'? colors.tertiary: colors.quaternary)}
                    shadowColors = {shadow.colors}
                    shadowMargin={{horizontal: 2, vertical: 2}}
                    shadowStyle = {shadow.style}
                    adaptiveSizeForStyle={false}
                    innerShadow={{
                        used: true,
                        borderWidth: 0
                    }}
                    initSize={{
                        height: (designType == 'type_3'? size*0.5 : size)+4,
                        width: (designType == 'type_3'? size*0.5 : size)+4,
                    }}
                />
                <Reanimated.View
                    style = {[{
                        position: 'absolute',
                        borderRadius: borderRadius-2,
                        height: size*(0.78),
                        width: size*(0.78),
                        backgroundColor: designType == 'type_1'? colors.background : 'transparent'
                    }]}
                />
            </Reanimated.View>
        </Reanimated.View>
        </View>
        {separator && <View style={separatorStyle}/>}
        {Item}
        </Pressable>
    );
};


import BottomSheet, {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetScrollView
  } from '@gorhom/bottom-sheet';
  
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "@react-native-community/blur";

export const BaseModal = ({
    animationType,
    visible,
    transparent,
    onShow,

    outPress,

    style,
    modalStyle,
    thumbStyle,
    snapHeights,
    dimOut, //color
    gradient,
    blur = false,
    children
}) => {
    // ref
    const bottomSheetModalRef = useRef();
    // variables
    const snapPoints = useMemo(() => snapHeights? snapHeights : [100, 100], []);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleDismissModalPress = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);

    useEffect(()=>{
        //console.log(visible)
        visible? handlePresentModalPress() : handleDismissModalPress()
    },[visible])

    //const [sheetState, setSheetState] = useState(0)

    const handleSheetChanges = useCallback((index) => {
        //console.log('handleSheetChanges', index);
        //setSheetState(index)
        index === -1? outPress() : null
    }, []);
    
    
    const outsidePress = () => {
        handleDismissModalPress()
        //outPress()
    }

    return (     
        <Modal
            visible={visible}
            animationType = {animationType}
            transparent= {true}
            statusBarTranslucent = {true}
            onShow={onShow}
        >   
            <Pressable
                flex = {1}
                style={{
                    backgroundColor: dimOut? dimOut : 'transparent'
                }}
                onPress={outsidePress}
            />
            {/**/}
            <View
                style = {[{
                    minHeight: 100,
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                }, modalStyle]}
            >   
                <GestureHandlerRootView style={{flex:1}}>
                <BottomSheetModalProvider>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                    enablePanDownToClose={true}
                    overDragResistanceFactor={0}
                    style={{
                        //backgroundColor: '#00ff0030',
                    }}
                    backgroundStyle={[{
                        //backgroundColor: '#ff000030'
                    }, style]}
                    handleStyle={{
                        //backgroundColor: '#0000ff30'
                    }}
                    handleIndicatorStyle={[{
                        //backgroundColor: '#ffff00a0'
                    }, thumbStyle]}

                    handleHeight = {25}
                    backgroundComponent = {({
                        style,
                        animatedIndex,
                    })=>{
                        //console.log(style)
                        return (
                        <View         
                            style={style}
                            backgroundColor={blur? 'transparent' : style.backgroundColor}
                        >
                            {blur && 
                            <View 
                                style = {[StyleSheet.absoluteFillObject, {
                                    top: 0,
                                    height: '100%',
                                    width: '100%',
                                    borderTopLeftRadius: style.borderTopLeftRadius - (gradient? 1 : 0),
                                    borderTopRightRadius: style.borderTopRightRadius - (gradient? 1 : 0),
                                    //specialty blur for android
                                    overflow: 'hidden',
                                    

                                }]}
                            >
                            <BlurView
                                style = {{
                                    flex: 1, 
                                }}
                                blurType = {'light'}
                                blurAmount = {10}
                                
                                //ANDROID_PROPS
                                overlayColor={`${style.backgroundColor}90`}
                                //overlayColor={'transparent'}
                                //blurRadius	= {10}
                                //downsampleFactor = {10}
                            />
                            </View>}

                            <LinearGradient
                                colors={[gradient? gradient : 'transparent', 'transparent']}
                                style={{
                                    position: 'absolute',
                                    //top: -25,
                                    top: 0,
                                    opacity: .25,
                                    height: 100,
                                    width: '100%',
                                    borderTopLeftRadius: style.borderTopLeftRadius - (gradient? 1 : 0),
                                    borderTopRightRadius: style.borderTopRightRadius - (gradient? 1 : 0),
                                }}
                            />  
                        </View>
                        )
                    }}
                >   
                    
                    <BottomSheetScrollView style={{flex: 1,}}>                  
                        {children}
                    </BottomSheetScrollView>
                </BottomSheetModal>
                </BottomSheetModalProvider>
                </GestureHandlerRootView>
            </View>
        </Modal>
    )
}


export const BaseWindow = ({
    animationType = 'fade',
    visible = false,
    transparent,
    onShow,

    outPress,

    style,
    modalStyle,
    thumbStyle,
    snapHeights,
    dimOut, //color
    gradient = false,
    blur = false,
    children
    }) => {

    const slide = useAnimatedStyle(()=>{
        return {
            transform: [
                {translateY: withTiming(interpolate(
                    visible,
                    [true, false],
                    [0, deviceHeight]
                ), {duration: 300})}
            ]
        }
    }, [visible])

    return(
        <Modal
            visible={visible}
            animationType = {animationType}
            transparent= {true}
            statusBarTranslucent = {true}
            onShow={onShow}
        >   
            <Pressable
                flex = {1}
                style={{
                    backgroundColor: dimOut? dimOut : 'transparent'
                }}
                onPress={outPress}
            />
            {false && <></>}
            
            <Reanimated.View
                style = {[{
                    minHeight: 100,
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                }, modalStyle, slide]}
            >   
            <View         
                style={style}
                backgroundColor={blur? 'transparent' : style.backgroundColor}
            >
                {blur && 
                <View 
                    style = {[StyleSheet.absoluteFillObject, {
                        top: 0,
                        height: '100%',
                        width: '100%',
                        borderTopLeftRadius: (style.borderTopLeftRadius>1 && gradient)? style.borderTopLeftRadius-1 : style.borderTopLeftRadius,
                        borderTopRightRadius: (style.borderTopLeftRadius>1 && gradient)? style.borderTopLeftRadius-1 : style.borderTopLeftRadius,
                        //specialty blur for android
                        overflow: 'hidden',
                    }]}
                >
                <BlurView
                    style = {{
                        flex: 1, 
                    }}
                    blurType = {'light'}
                    blurAmount = {10}
                    
                    //ANDROID_PROPS
                    overlayColor={`${style.backgroundColor}90`}
                    //overlayColor={'transparent'}
                    //blurRadius	= {10}
                    //downsampleFactor = {10}
                />
                </View>}
                <LinearGradient
                    colors={[gradient? gradient : 'transparent', 'transparent']}
                    style={{
                        position: 'absolute',
                        //top: -25,
                        top: 0,
                        opacity: .25,
                        height: 100,
                        width: '100%',
                        borderTopLeftRadius: (style.borderTopLeftRadius>1 && gradient)? style.borderTopLeftRadius-1 : style.borderTopLeftRadius,
                        borderTopRightRadius: (style.borderTopLeftRadius>1 && gradient)? style.borderTopLeftRadius-1 : style.borderTopLeftRadius,
                    }}
                /> 
                {children}
            </View>
            </Reanimated.View>
        </Modal>
    )
}


const staticStyles = StyleSheet.create({
    area: {
        //flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 30,
        minWidth: 30,
        //alignContent: 'center',
        //borderRadius: 12,
        //backgroundColor: 'blue',
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //alignContent: 'center', 
        //borderRadius: 12,
        height: '100%',
        width: '100%',
        //backgroundColor: 'grey',
    },
    text: {
        fontSize: 20,
    }
});


export const BaseTextInput = ({
    //generals
    textValue,
    setTextValue,

    exit,
    enter,
    focus,

    //panele
    paneleStyle,
    //text input
    textInputProps,
    //pressable
    basePressableProps,
}) => {
    const [localText, setLocalText] = useState(textValue? textValue : textInputProps.placeholder)
    const [openState, setOpenState] = useState(false)

    const texInputref = useRef()

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {setKeyboardVisible(true);});
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useEffect(()=>{
        if(openState){
            setTimeout(()=>{
                console.log('ti focus')
                texInputref.current.focus()
            }, 100) 
        }
    },[openState])

    useEffect(()=>{
        if(!keyboardVisible){
            console.log('exit <', !keyboardVisible, openState)
            openState ? onExit() : null
        }
    },[keyboardVisible])

    const onFocus = () => {
        console.log('onfocus')
        focus? focus() : null
        setOpenState(true)
    }
    
    const onEnter =()=> {
        console.log('onEnter')
        enter? enter() : null
    }

    const onExit =()=> {
        console.log('onExit')
        setTextValue(localText)
        exit? exit(localText) : null
        
        setOpenState(false)
    }

    const setText = (text) => {
        setLocalText(text)
    }

    return (
        <>
        <Modal
            visible={openState}
            transparent = {true}
        >
            <Pressable
                style={{
                    flex: 1
                }}
                onPress={onExit}
            >        
            <View
                style={[{
                    position: 'absolute',
                    height: 50,
                    width: '100%',
                    bottom: 0,
                    borderTopWidth: 1,
                    borderColor: 'grey',
                    backgroundColor: 'white',
                    paddingHorizontal: 20
                }, paneleStyle]}
            >
                <TextInput
                    ref={texInputref}

                    //all props
                    {...textInputProps}

                    style={[{
                        flex: 1,
                        color: 'black',
                        fontSize: 16
                    }, textInputProps.style]}

                    onSubmitEditing={onEnter}
                    onEndEditing={onExit}
                    placeholder={textInputProps.placeholder}
                    placeholderTextColor = {textInputProps.placeholderTextColor}
                    maxLength={textInputProps.maxLength}
                    defaultValue={textValue}
                    selectTextOnFocus={true}//(text)=>{setTextValue(text)}
                    onChangeText={setText}
                    
                    selectionColor = {textInputProps.selectionColor}
                    
                    //android
                    autoComplete={textInputProps.autoComplete}
                    cursorColor={textInputProps.cursorColor}            
                />
            </View>
            </Pressable>
        </Modal>
        <BasePressable
            type="t"

            //all props
            {...basePressableProps}

            text={localText}
            onPress={onFocus}
        />
        </>
    )
}