import React, {

} from "react";

import { 
    StyleSheet, 
    Text, 
    Pressable, 
    View,
} from 'react-native';

import Reanimated, {
    useSharedValue, 
    useAnimatedStyle, 
    withTiming, 
    useDerivedValue,
} from 'react-native-reanimated';

const RPressable = Reanimated.createAnimatedComponent(Pressable)

export default (props) => {
    const {
        Item = <Text>Text</Text>,
        StateItem = null,// <Text>State</Text>,
        designType: sDesignType = 'type_1',

        separator,
        separatorStyle,
        borderRadius: sBorderRadius = 3,

        style = {},
        size = 24,
        primeValue = false,
        
        colors: sColors = {
            //track: {true: 'green', false: 'grey'}, thumb: {true: 'green', false: 'blue'}, 
            background: 'white',
            primary: '#087150',
            secondary: '#065130',
            tertiary: 'white',
            quaternary: 'grey',
            //separator:  Theme.specials.separator
        },

        aValue,
        aBorderRadius,
        aColors,
        aDesignType,

        onChange,
        android_ripple = {}
    } = props

    const switchState = aValue??  useDerivedValue(()=>primeValue)

    const borderRadius = aBorderRadius?? useDerivedValue(()=>sBorderRadius)

    const bg = aColors?.background?? useDerivedValue(()=>sColors.background)

    const accentTrumb = aColors?.primary?? useDerivedValue(()=>sColors.primary)
    const accentTrack = aColors?.secondary?? useDerivedValue(()=>sColors.secondary)
    const notAccentThumb = aColors?.tertiary?? useDerivedValue(()=>sColors.tertiary)
    const notAccentTrack = aColors?.quaternary?? useDerivedValue(()=>sColors.quaternary)
    
    const designType = aDesignType?? useDerivedValue(()=>sDesignType)

    const duration = 200

    const dynamicStyleTrumb = useAnimatedStyle(()=>{
        return {
            transform: [
                {translateX: withTiming(
                    designType.value == 'type_3'? (size*(!switchState.value? 0.2 : 1.3)) : (size*(!switchState.value? -0.5 : 0.7)),

                    {duration: duration}
                )}
            ]
        }
    })

    const onPress = () => {
        const newValue = !switchState.value
        //switchState.value = newValue
        onChange(newValue)
    }

    const trackStyle = useAnimatedStyle(()=>{
        return {
            marginHorizontal: (designType.value == 'type_3'? 0 : (size*0.5)),
            height: (designType.value == 'type_3'? size : (size*0.7)),
            width: (designType.value == 'type_3'? 2*size : (size*1.2)),
            borderRadius: borderRadius.value,
            backgroundColor: switchState.value? (designType.value != 'type_2'? accentTrumb.value : accentTrack.value) : notAccentTrack.value,
        }
    })

    const trumbStyle = useAnimatedStyle(()=>{
        return {
            height: (designType.value == 'type_3'? size*0.5 : size),
            width: (designType.value == 'type_3'? size*0.5 : size),
            borderRadius: borderRadius.value - (designType.value == 'type_3'? 6 : 0),
            backgroundColor: designType.value == 'type_3'? notAccentThumb.value 
                            : designType.value == 'type_1'? (switchState.value? accentTrumb.value : notAccentTrack.value)
                            : (switchState.value? accentTrumb.value : notAccentThumb.value),
            

            ...designType.value == 'type_2'? {
                elevation: 2
            } : {}
        }
    })

    const trumbItemStyle = useAnimatedStyle(()=>{
        return {
            borderRadius: borderRadius.value-2,
            backgroundColor: designType.value == 'type_1'? bg.value : 'transparent'
        }
    })

    return (
        <RPressable
            props = {props}
            style = {[{
                minHeight: size,
                minWidth: size*2.2,
                justifyContent: 'center',
                alignItems: 'center',
            }, style]}
            android_ripple = {android_ripple}
            onPress = {onPress}
        >
            <View 
                style = {{
                    //marginLeft: size/2,
                    //minHeight: size,
                    //minWidth: size*2.2,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    //backgroundColor: 'red'
                }}
            >
                <Reanimated.View
                    style = {[trackStyle, {
                        justifyContent: 'center',
                    }]}
                >  
                    <Reanimated.View
                        style = {[{
                            position: 'absolute',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }, dynamicStyleTrumb, trumbStyle]}
                    >
                        <Reanimated.View
                            style = {[trumbItemStyle, {
                                position: 'absolute',
                                height: size*(0.77),
                                width: size*(0.77),
                            }]}
                        />
                    </Reanimated.View>
                </Reanimated.View>
                {StateItem}
            </View>
            {separator && <Reanimated.View style={separatorStyle}/>}
            {Item}
        </RPressable>
    );
};
