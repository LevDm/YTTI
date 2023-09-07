import React, { useRef, useState } from "react";
import { 
    StyleSheet,
    View,
    Dimensions
} from "react-native";

import Reanimated, { 
    useSharedValue,
    useDerivedValue,
    useAnimatedStyle, 
    useAnimatedGestureHandler,
    useAnimatedProps,
    interpolate,
    Extrapolation,
    withSpring,
    withTiming,
    useAnimatedReaction,
    runOnJS
} from "react-native-reanimated";

import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
    TapGestureHandler,
    TapGestureHandlerGestureEvent,
  } from 'react-native-gesture-handler';

const RPanGestureHandler = Reanimated.createAnimatedComponent(PanGestureHandler)
const RTapGestureHandler = Reanimated.createAnimatedComponent(TapGestureHandler)

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('screen');

const options = {
    velocity: 0,
    speed: 12
}

const State = {
    UNDETERMINED: 0,
    FAILED: 1,
    BEGAN: 2,
    CANCELLED: 3,
    ACTIVE: 4,
    END: 5,
}

const IDLE = 'Idle';
const DRAGGING = 'Dragging';
const SETTLING = 'Settling';

//DrawerState = 'Idle' | 'Dragging' | 'Settling';

const DRAG_TOSS = 0.05;


export default CustomDrawer = (props) => {
    const { 
        stateVisible,
        drawerLockMode = 'unlocked', 
        edgeWidth = 20, 
        minSwipeDistance = 3,

        useNativeAnimations = true,

        drawerPosition = 'left', 
        overlayColor =  'rgba(0, 0, 0, 0.7)',
        drawerBackgroundColor = "#fff",

        aDrawerPosition,
        aOverlayColor,
        aDrawerBackgroundColor,
        aEnabledDrawer,

        drawerWidth = 200,
        drawerType= 'front',
        drawerContainerStyle,
        contentContainerStyle,
    } = props

    const position = useDerivedValue(()=>(aDrawerPosition && aDrawerPosition.value)? aDrawerPosition.value : drawerPosition)//
    const overlay = useDerivedValue(()=>(aOverlayColor && aOverlayColor.value)? aOverlayColor.value : overlayColor)
    const background = useDerivedValue(()=>(aDrawerBackgroundColor && aDrawerBackgroundColor.value)? aDrawerBackgroundColor.value : drawerBackgroundColor)

    const enabled = useDerivedValue(()=>(aEnabledDrawer && aEnabledDrawer.value != undefined)? aEnabledDrawer.value : true)

    const drawerShown = useSharedValue(false); 
    const drawerState = useSharedValue(IDLE)

    const dragX = useSharedValue(0)
    const touchX = useSharedValue(0)
    const drawerTranslation = useSharedValue(0)

    const containerWidth = useSharedValue(0)
    const drawerOpened = useSharedValue(false)

    const panGestureHandler = useRef()

    const setGestureHandlerEnabled = (value) => {
        panGestureHandler.current?.setNativeProps({
            enabled: value
        })
    }

   
    const pointerEventsView = useRef()
    const accessibilityIsModalView = useRef()

    const openValue = useDerivedValue(()=>{

        let eDragX = dragX.value;
        let eTouchX = touchX.value;
    
        if (position.value !== 'left') {
            eDragX = (-1) * dragX.value
            eTouchX = containerWidth.value + (-1)*touchX.value,
            touchX.value = containerWidth.value
        } else {
            touchX.value = 0
        }
    
        let translationX = eDragX;
        if (drawerType === 'front') {
            const startPositionX = eTouchX + (-1)*eDragX
            const dragOffsetFromOnStartPosition = interpolate(
                startPositionX,
                [drawerWidth - 1, drawerWidth, drawerWidth + 1],
                [0, 0, 1],
            )
            translationX = eDragX + dragOffsetFromOnStartPosition
        }

        //console.log(translationX + drawerTranslation.value)
        return interpolate(
            (translationX + drawerTranslation.value),
            [0, drawerWidth],
            [0, 1],
            {
                extrapolateLeft: Extrapolation.CLAMP,
                extrapolateRight: Extrapolation.CLAMP
            }
        )
    })


    const updateShowing = (showing) => {
        
        drawerShown.value = showing;
        /**/
        accessibilityIsModalView.current?.setNativeProps({
          accessibilityViewIsModal: showing,
        })
        pointerEventsView.current?.setNativeProps({
          pointerEvents: showing ? 'auto' : 'none',
        })
 
        const fromLeft = (position.value === 'left');

        const gestureOrientation = (fromLeft ? 1 : -1) * (showing ? -1 : 1);

        const hitSlop = fromLeft
          ? { left: 0, width: showing ? drawerWidth : edgeWidth }
          : { right: 0, width: showing ? drawerWidth : edgeWidth };
        // @ts-ignore internal API, maybe could be fixed in handler types
        panGestureHandler.current?.setNativeProps({
          hitSlop,
          activeOffsetX: gestureOrientation * minSwipeDistance,
        })    

        //console.log('drawerShow', showing, '|| fromLeft', fromLeft, hitSlop)
    }


    const animateDrawer = (
            fromValue, //: number | null | undefined,
            toValue, //: number,
            velocity, //: number,
            speed, //?: number
        ) => {
        "worklet";
        dragX.value = 0
        touchX.value = (position.value === 'left' ? 0 : containerWidth.value)

        //console.log('touchX.value', touchX.value, (position.value === 'left' ? 0 : containerWidth.value))
        
        if (fromValue != null) {
            let nextFramePosition = fromValue;
            if (useNativeAnimations) {
                // When using native driver, we predict the next position of the
                // animation because it takes one frame of a roundtrip to pass RELEASE
                // event from native driver to JS before we can start animating. Without
                // it, it is more noticable that the frame is dropped.
                if (fromValue < toValue && velocity > 0) {
                    nextFramePosition = Math.min(fromValue + velocity / 60.0, toValue);
                } else if (fromValue > toValue && velocity < 0) {
                    nextFramePosition = Math.max(fromValue + velocity / 60.0, toValue);
                }
            }
            drawerTranslation.value = nextFramePosition
            //console.log("ANIM", fromValue, toValue, nextFramePosition)
        }
        
    
        const willShow = toValue !== 0
        runOnJS(updateShowing)(willShow)
        //emitStateChanged(State.SETTLING, willShow)
        drawerState.value = SETTLING
        /* 
        if (this.props.hideStatusBar) {
            StatusBar.setHidden(willShow, this.props.statusBarAnimation || 'slide');
        }
        */
        //console.log(drawerTranslation.value, fromValue, toValue)

        drawerTranslation.value = withSpring(
            toValue,
            {
                velocity: velocity,
                //duration: 300,
                damping: 600,
                stiffness: 700,
            },
            (finished)=>{
                if (finished) {
                    //emitStateChanged(State.IDLE, willShow);
                    //console.log('finished')
                    drawerOpened.value = willShow
                    stateVisible.value = willShow? 'open' : 'close'
                    if (drawerState.value !== DRAGGING) {
                        drawerState.value = IDLE
                    }
                    if (willShow) {
                        //this.props.onDrawerOpen?.();
                    } else {
                        //this.props.onDrawerClose?.();
                    }
                }
            }
        )

    }

    
    const openDrawer = () => {
        "worklet";
        //console.log('open drawer')
        animateDrawer(
            undefined,
            drawerWidth,
            options.velocity ? options.velocity : 0,
            options.speed
        )
    }
    
    const closeDrawer = () => {
        "worklet";
        //console.log('close drawer')
        animateDrawer(
            undefined,
            0,
            options.velocity ? options.velocity : 0,
            options.speed
        )
    }


    useAnimatedReaction(()=>enabled.value, (newValue, oldValue)=>{
        if(!newValue && drawerOpened.value){
            closeDrawer()
        }
        runOnJS(setGestureHandlerEnabled)(newValue)
    })


    useAnimatedReaction(()=>stateVisible.value, (newValue, oldValue)=>{
        //console.log('reaction',newValue, oldValue)
        if(newValue == 'open' && !drawerShown.value && !drawerOpened.value){
            //runOnJS(openDrawer) 
            openDrawer()
        } 
        if(newValue == 'close' && drawerShown.value && drawerOpened.value){
            //runOnJS(closeDrawer)
            closeDrawer()
        } 
    })

    useAnimatedReaction(()=>position.value, (newValue, oldValue)=>{
        //console.log('draver position', newValue, oldValue)
        if(newValue != oldValue){
            runOnJS(updateShowing)(drawerShown.value)
        }
        
    })

    

    const onTapHandlerStateChange = ({nativeEvent}) => {
        //console.log('TAP')
        if(
            drawerShown.value 
            && nativeEvent.oldState === State.ACTIVE 
            //&& this.props.drawerLockMode !== 'locked-open'
        ){
            closeDrawer();
        }
    }
    

    const renderOverlay = () => {
        const dynamicOverlayStyle = useAnimatedStyle(()=>{
            let overlayOpacity;
            //console.log('OVERLAY', drawerState.value , IDLE, openValue.value)
            if (drawerState.value !== IDLE) {
                overlayOpacity = openValue.value;
            } else {
                overlayOpacity = drawerOpened.value ? 1 : 0;
            }
        
            return ({
                opacity: overlayOpacity,
                backgroundColor: overlay.value,
            })
        })

        const showProps = useAnimatedProps(()=>({
            pointerEvents: drawerShown.value ? 'auto' : 'none'
        }))

        return (
            <TapGestureHandler onHandlerStateChange={onTapHandlerStateChange}>
            <Reanimated.View
                //pointerEvents={drawerShown ? 'auto' : 'none'}
                ref={pointerEventsView}
                style={[styles.overlay, dynamicOverlayStyle]}
                animatedProps={showProps}
            />
            </TapGestureHandler>
        )
    }

    

    const handleRelease = ({nativeEvent}) => {
        let { translationX: dragX, velocityX, x: touchX } = nativeEvent;
    
        if (position.value !== 'left') {
          dragX = -dragX;
          touchX = containerWidth.value - touchX;
          velocityX = -velocityX;
        }
    
        const gestureStartX = touchX - dragX;
        let dragOffsetBasedOnStart = 0;
    
        if (drawerType === 'front') {
            dragOffsetBasedOnStart = gestureStartX > drawerWidth ? gestureStartX - drawerWidth : 0;
        }
    
        const startOffsetX = dragX + dragOffsetBasedOnStart + (drawerShown.value ? drawerWidth : 0);
        const projOffsetX = startOffsetX + DRAG_TOSS * velocityX;
    
        const shouldOpen = projOffsetX > drawerWidth / 2;
    
        if (shouldOpen) {
            animateDrawer(startOffsetX, drawerWidth, velocityX);
        } else {
            animateDrawer(startOffsetX, 0, velocityX);
        }
    }

    
    const handleContainerLayout = ({ nativeEvent }) => {
        containerWidth.value = nativeEvent.layout.width
    }
    
    const renderDrawer = () => {

        const dynamicDrawerStyle = useAnimatedStyle(()=>{
            return {
                backgroundColor: 'transparent',//background.value,
                
            }
        })

        const overlayStyle = useAnimatedStyle(()=>{
            const fromLeft = (position.value === 'left');
            const containerSlide = drawerType !== 'front';
            const containerTranslateX = interpolate(
                    openValue.value,
                    [0, 1],
                    fromLeft ? [0, drawerWidth] : [0, -drawerWidth],
                    {
                        extrapolateLeft: Extrapolation.CLAMP,
                        extrapolateRight: Extrapolation.CLAMP
                    }
                )
            if(containerSlide){
                return {
                    transform: [{ translateX: containerTranslateX }],
                }
            }
            return {}
        })
    
        const drawerStyle = useAnimatedStyle(()=>{
            const fromLeft = (position.value === 'left');
            const reverseContentDirection = !fromLeft
            const drawerSlide = drawerType !== 'back';
            let drawerTranslateX = 0;
            if (drawerSlide) {
                const closedDrawerOffset = fromLeft ? -drawerWidth : drawerWidth;
                
                if (drawerState.value !== IDLE) {
                    drawerTranslateX = interpolate(
                        openValue.value,   
                        [0, 1],
                        fromLeft ? [-drawerWidth , 0] : [drawerWidth, 0],
                        {
                            extrapolateLeft: Extrapolation.CLAMP,
                            extrapolateRight: Extrapolation.CLAMP
                        }
                    )
                } else {
                    drawerTranslateX = drawerOpened.value ? 0 : closedDrawerOffset;
                }
            }
            return {
                transform: [{ translateX: drawerTranslateX}], //  
                //flexDirection: (position.value != 'left') ? 'row-reverse' : 'row',
                paddingLeft: (position.value === 'left') ? 0 : containerWidth.value-drawerWidth
            }
        })

        const modalProps = useAnimatedProps(()=>({
            accessibilityViewIsModal: drawerShown.value
        }))

        const overlayProps = useAnimatedProps(()=>({
            importantForAccessibility: drawerShown.value ? 'no-hide-descendants' : 'yes'
        }))


        const childrenTransform = useAnimatedStyle(()=>{
            return {
                transform: [
                    {scale: interpolate(
                        openValue.value,
                        [0, 1],
                        [1, 0.98]
                    )},
                    {translateX: interpolate(
                        openValue.value,
                        [0, 1],
                        [0, position.value === 'left'? 4 : -4]
                    )},
                    {translateY: interpolate(
                        openValue.value,
                        [0, 1],
                        [0, -9]
                    )},
                ]
            }
        })

        return (
            <Reanimated.View style={styles.main} onLayout={handleContainerLayout}>
                <Reanimated.View
                    style={[
                        drawerType === 'front'? styles.containerOnBack: styles.containerInFront,
                        overlayStyle,
                        contentContainerStyle,
                    ]}
                    //importantForAccessibility={drawerShown ? 'no-hide-descendants' : 'yes'}
                    animatedProps={overlayProps}
                >
                    <Reanimated.View
                        style={[childrenTransform, {height: deviceHeight, width: deviceWidth}]}
                    >
                        {props.children}
                    </Reanimated.View>
                    {renderOverlay()}
                </Reanimated.View>
                <Reanimated.View
                    pointerEvents="box-none"
                    ref={accessibilityIsModalView}
                    //accessibilityViewIsModal={drawerShown}
                    animatedProps={modalProps}
                    style={[styles.drawerContainer, drawerStyle, drawerContainerStyle]}
                >
                    <Reanimated.View style={[dynamicDrawerStyle,{width: drawerWidth,}]}>
                        {props.renderNavigationView()}
                    </Reanimated.View>
                </Reanimated.View>
            </Reanimated.View>
        )        
    }

    

    const panGestureEvent = ({nativeEvent}) => {
        //console.log('ACTIVE')
        dragX.value = nativeEvent.translationX
        touchX.value = nativeEvent.x
    }
    

    const openingHandlerStateChange = ({nativeEvent }) => {
        //console.log('openingHandlerStateChange', nativeEvent)
        if (nativeEvent.oldState === State.ACTIVE) {
          handleRelease({ nativeEvent });
        } else if (nativeEvent.state === State.ACTIVE) {
          //emitStateChanged(State.DRAGGING, false);
          drawerState.value = DRAGGING
          //if (this.props.keyboardDismissMode === 'on-drag') {
          //  Keyboard.dismiss();
          //}
          //if (this.props.hideStatusBar) {
          //  StatusBar.setHidden(true, this.props.statusBarAnimation || 'slide');
          //}
        }
    };

    //updateShowing(false)


    const panProps = useAnimatedProps(()=>{
        const fromLeft = (position.value === 'left');
        const gestureOrientation = (fromLeft ? 1 : -1) * (drawerShown.value ? -1 : 1);

        const hitSlop = fromLeft
            ? { left: 0, width:  drawerShown.value ? drawerWidth : edgeWidth } //
            : { right: 0, width: drawerShown.value ? drawerWidth : edgeWidth } //

        //console.log('prop', hitSlop, gestureOrientation * minSwipeDistance)

        return {
            hitSlop: hitSlop,
            activeOffsetX: gestureOrientation * minSwipeDistance,
            enabled: drawerLockMode !== 'locked-closed' && drawerLockMode !== 'locked-open'
        }
    })

    return (
        <RPanGestureHandler
            // @ts-ignore could be fixed in handler types
            //userSelect={this.props.userSelect}
            //activeCursor={this.props.activeCursor}
            ref={panGestureHandler}
            //hitSlop={hitSlop}
            //activeOffsetX={gestureOrientation * minSwipeDistance}
            failOffsetY={[-15, 15]}
            onGestureEvent={panGestureEvent}
            onHandlerStateChange={openingHandlerStateChange}
            //enableTrackpadTwoFingerGesture={this.props.enableTrackpadTwoFingerGesture }
            //enabled={drawerLockMode !== 'locked-closed' && drawerLockMode !== 'locked-open'}

            animatedProps={panProps}
        >
            {renderDrawer()}
        </RPanGestureHandler>
        
    )
}

const styles = StyleSheet.create({
    drawerContainer: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 1001,
      //justifyContent: 'flex-start'
      flexDirection: 'row',
    },
    containerInFront: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 1002,
    },
    containerOnBack: {
      ...StyleSheet.absoluteFillObject,
    },
    main: {
      flex: 1,
      zIndex: 0,
      overflow: 'hidden',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 1000,
    },
})
