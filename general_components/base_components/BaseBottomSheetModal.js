import React, {
    useState,  
    useEffect,
    useRef,
    useMemo,
    useCallback
} from "react";

import { 
    StyleSheet, 
} from 'react-native';

import Reanimated, {
    useSharedValue, 
    useAnimatedStyle, 
    withTiming, 
    useDerivedValue,
    runOnJS,
    interpolate,
    useAnimatedProps,
    useAnimatedReaction,
    Extrapolation,
    createAnimatedPropAdapter
} from 'react-native-reanimated';

import BottomSheet, {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetScrollView
} from '@gorhom/bottom-sheet';

const RBottomSheetScrollView = Reanimated.createAnimatedComponent(BottomSheetScrollView)

import { LinearGradient } from "expo-linear-gradient";
const RLinearGradient = Reanimated.createAnimatedComponent(LinearGradient)
import { BlurView } from "@react-native-community/blur";


const gradientAdapter = createAnimatedPropAdapter(
    (props) => {
      'worklet';
      const keys = Object.keys(props);
      if (keys.includes('colors')) {
        props.colors = props.colors;
        //delete props.value;
      }
    },
    ['colors']
  );

export default (props) => {
    const {
        outPress: onClose,

        modalStyle = {
            borderRadius: 30,
            marginHorizontal: 12
        },

        contentStyle,

        modalRef,

        snapHeights = [100, 200],

        blur: sBlur = true,
        aBlur,

        colors = {
            bg: 'white',
            handle: 'grey',
            accent: 'blue',
            dimout: 'black'
        },
        aColors,

        highlight = {
            dimOutDark: true,
            gradient: true,
            outline: true,
        },
        aHighlight,
        sheetProps,
        children
    } = props

    const blur = aBlur?? useDerivedValue(()=>sBlur)

    const {
        dimOutDark,
        gradient,
        outline 
    } = aHighlight?? {
        dimOutDark: useDerivedValue(()=>highlight.dimOutDark),
        gradient: useDerivedValue(()=>highlight.gradient),
        outline: useDerivedValue(()=>highlight.outline),
    }

    const {
        bg,
        accent,
        handle,
        dimout
    } = aColors?? {
        bg: useDerivedValue(()=>colors.bg),
        handle: useDerivedValue(()=>colors.handle),
        accent: useDerivedValue(()=>colors.accent),
        dimout: useDerivedValue(()=>colors.dimout)
    } 

    const HANDLE_HEIGHT = 30

    const bottomSheetModalRef = useRef();

    const snapPoints = useMemo(() => snapHeights, [snapHeights]);


    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleDismissModalPress = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);

    useEffect(()=>{
        modalRef.current = {
            present: handlePresentModalPress,
            dismiss: handleDismissModalPress,
        }
    }, [])

    const dismiss = () => {
        onClose? onClose() : null
    }

    const currentSheetindex = useSharedValue(-1)

    const handleSheetChanges = useCallback((index) => {
        currentSheetindex.value = index
    }, []);
    
    
    const BackgroundComponent = ({style}) => {
        const BlurFill = () => {  
            const [blurState, setBlurState] = useState(blur.value)
            useAnimatedReaction(
                ()=>blur.value, 
                (newValue, oldValue)=>{
                    if(newValue != blurState){
                        runOnJS(setBlurState)(newValue)
                    }
                }
            )
            
            if(!blurState){return null}
            return (
                <Reanimated.View 
                    style = {[StyleSheet.absoluteFillObject, {
                        overflow: 'hidden',
                    }]}
                >
                <BlurView
                    style = {{flex: 1, }}
                    blurType = {'light'}
                    blurAmount = {10}
                />
                </Reanimated.View>
            )
        }

        const gradientStyle = useAnimatedStyle(()=>({
            opacity: gradient.value? (blur.value? 0.1 : .25) : 0
        }))

        const areaStyle = useAnimatedStyle(()=>({
            borderWidth: outline.value? 1 : 0, 
            borderColor: accent.value,
        })) 

        const fillStyle = useAnimatedStyle(()=>({
            backgroundColor: bg.value, 
            opacity: blur.value? 0.41 : 1,
        }))

        const gradientColor = useAnimatedProps(()=>({
            colors: [ accent.value, 'transparent']
        }), [], gradientAdapter)

        return (
            <Reanimated.View         
                style={[style, modalStyle, staticStylesBottomSheet.modal, areaStyle, {
                    borderBottomWidth: 0, 
                }]}
            >
                <BlurFill/>
                <Reanimated.View style={[StyleSheet.absoluteFill, fillStyle, {}]}/> 
                <RLinearGradient
                    //colors={[ accent, 'transparent']}
                    style={[{
                        position: 'absolute',
                        top: 0,
                        height: 100,
                        width: '100%',

                    }, gradientStyle]}
                    animatedProps={gradientColor}
                />  
            </Reanimated.View>
        )
    }

    const thumbColor = useAnimatedStyle(()=>({
        backgroundColor: handle.value
    }))

    const HandleComponent = () => {
        return (
            <Reanimated.View 
                style={[{
                    width: '100%',
                    height: HANDLE_HEIGHT,
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center'
                }]}
            >
                <Reanimated.View
                    style={[thumbColor, {
                        //opacity: 0.84,
                        height: 4,
                        width: 36,
                        borderRadius: 2
                    }]}
                />
            </Reanimated.View>
        )
    }

    const dimOutStyle = useAnimatedStyle(()=>({
        backgroundColor: dimOutDark.value? dimout.value : 'transparent',
        opacity: withTiming(interpolate(
            currentSheetindex.value,
            [-1, 0, 1],
            [0, 0, 0.14],
            {extrapolateRight: Extrapolation.CLAMP}
        ))
    }))

    return (
        <>
        <Reanimated.View 
            style={[StyleSheet.absoluteFill, dimOutStyle]}
            pointerEvents="none"
        />  
        <BottomSheetModalProvider>
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            overDragResistanceFactor={0}
            onDismiss={dismiss}
            style={{
                //backgroundColor: '#00ff0030',
            }}
            backgroundStyle={{
                //backgroundColor: '#ff000030',
                //top: HANDLE_HEIGHT
            }}
            handleComponent={HandleComponent}
            backgroundComponent = {BackgroundComponent}

            //keyboardBehavior="fillParent"
            {...sheetProps}
        >   
            <RBottomSheetScrollView 
                style={[modalStyle, staticStylesBottomSheet.modal]} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[contentStyle, {
                }]}
            >                  
                {children}
            </RBottomSheetScrollView>
        </BottomSheetModal>
        </BottomSheetModalProvider>
        </>
    )
}

const staticStylesBottomSheet = StyleSheet.create({
    modal: {
        flex: 1, 
        overflow: 'hidden',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    }
});
