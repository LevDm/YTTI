import React, {

} from "react";

import { 
    StyleSheet,  
    Pressable, 

    Modal,
} from 'react-native';

import Reanimated, {
    SlideInDown,
    SlideOutDown,

} from 'react-native-reanimated';


const RPressable = Reanimated.createAnimatedComponent(Pressable)

import { LinearGradient } from "expo-linear-gradient";

import { BlurView } from "@react-native-community/blur";




export default (props) => {
    const {
        animationType = 'fade',
        visible = false,

        onShow,

        outPress,

        modalStyle,

        blur = true,

        colors = {
            bg: 'white',
            accent: 'blue',
            dimout: 'black'
        },

        highlight = {
            dimOutDark: true,
            gradient: true,
            outline: true,
        },

        children
    } = props


    const {
        dimOutDark,
        gradient,
        outline 
    } = highlight

    const {
        bg,
        accent,
        dimout
    } = colors 

    const BlurFill = () => {    
        if(!blur){return null}
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

    const show = (p) => {
        onShow? onShow(p) : null
    }

    const close = () => {
        outPress()
    }


    return(
        <Modal
            //ref={ref}
            visible={visible}
            animationType = {animationType}
            transparent= {true}
            statusBarTranslucent = {true}
            onShow={show}
        >   
            <RPressable
                style={[StyleSheet.absoluteFill, {
                    zIndex: -1, 
                    opacity: dimOutDark? 0.12 : 0,
                    backgroundColor: dimout,
                }]}
                onPress={close}
            />
            <Reanimated.View
                style = {{
                    zIndex: 5,
                    minHeight: 220,
                    position: 'absolute',
                    bottom: 0,
                    width: '100%', 
                }}
            >   
                <Reanimated.View
                    style={[{
                        flex: 1, 
                        overflow: 'hidden',
                        borderWidth: outline? 1 : 0,
                        borderBottomWidth: 0,
                        borderColor: accent
                    }, modalStyle]}
                    //
                    entering={SlideInDown}
                    exiting={SlideOutDown}
                >
                    <BlurFill/>
                    <Reanimated.View style={[StyleSheet.absoluteFill, {backgroundColor: bg, opacity: blur? 0.41 : 1,}]}/> 
                    <LinearGradient
                        colors={[ accent,'transparent']}
                        style={{
                            position: 'absolute',
                            //top: -25,
                            top: 0,
                            //opacity: .25,
                            height: 100,
                            width: '100%',
                            opacity: gradient? (blur? 0.1 : .25) : 0
                        }}
                    /> 

                    {children}
                </Reanimated.View>
            </Reanimated.View>
        </Modal>
    )
}
