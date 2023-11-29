import React, {

} from "react";

import { 
    Pressable, 
} from 'react-native';


import Reanimated, {
    useAnimatedStyle, 
    withTiming, 
    useDerivedValue,
} from 'react-native-reanimated';


const RPressable = Reanimated.createAnimatedComponent(Pressable)
import { Ionicons } from '@expo/vector-icons';

export default (props) => {
    const {
        isCheckBox = false,
        //outerRing = true,
        Item = null, //<Text>Text</Text>,
        boxBorderRadius: sBorderRadius = 12,
        designType: sDesignType = 'type_2',

        colors: sColors = {
            background: 'white',
            primary: '#087150',
            secondary: '#065130',
            //tertiary: Theme.icons.accents.quaternary,
            //quaternary: Theme.icons.neutrals.tertiary,
        },

        aCheck,
        aBorderRadius,
        aColors,
        aDesignType,

        style = {},
        size = 22,
        boxId = 0,
        //keyId,
        check : checkValue = false,
        onLongPress,
        onPress,
        android_ripple = {}, 
    } = props

    const designType = aDesignType?? useDerivedValue(()=>sDesignType)

    const borderRadius = aBorderRadius?? useDerivedValue(()=>sBorderRadius)
    const bg = aColors?.background?? useDerivedValue(()=>sColors.background)
    const accent = aColors?.primary?? useDerivedValue(()=>sColors.primary)
    const notAccent = aColors?.secondary?? useDerivedValue(()=>sColors.secondary)

    const duration = 200

    const dynamicStylePrimaryBox = useAnimatedStyle(()=>{
        const aCheckValue = aCheck? Array.isArray(aCheck.value)? aCheck.value[boxId] : aCheck.value : checkValue
        return {
            borderRadius: borderRadius.value,
            borderColor: withTiming((aCheckValue? accent.value : isCheckBox? accent.value : designType.value == 'type_2'? notAccent.value : 'transparent' ), {duration: duration}),
        }
    })


    const dynamicStyleSecondaryBox = useAnimatedStyle(()=>{
        const aCheckValue = aCheck? Array.isArray(aCheck.value)? aCheck.value[boxId] : aCheck.value : checkValue
        return {
            borderRadius: borderRadius.value -(designType.value == 'type_2'? 0 : 4),
            backgroundColor: withTiming((aCheckValue? accent.value : isCheckBox? 'transparent': designType.value == 'type_2'? 'transparent' : notAccent.value  ), {duration: duration}),

            height: withTiming(  (designType.value == 'type_2'&& aCheckValue? size : size - (isCheckBox? 8 : aCheckValue? 11 : 6)) , {duration: duration}),
            width:  withTiming(  (designType.value == 'type_2'&& aCheckValue? size : size - (isCheckBox? 8 : aCheckValue? 11 : 6)) , {duration: duration}),
        }
    })


    const tertiaryBox = useAnimatedStyle(()=>{
        const aCheckValue = aCheck? Array.isArray(aCheck.value)? aCheck.value[boxId] : aCheck.value : checkValue
        return {
            borderRadius: borderRadius.value-6,
            backgroundColor: bg.value,
            opacity: withTiming( (designType.value == 'type_2' && aCheckValue && !isCheckBox)? 1 : 0, {duration: duration}),
        }
    })


    const icon = useAnimatedStyle(()=>{
        const aCheckValue = aCheck? Array.isArray(aCheck.value)? aCheck.value[boxId] : aCheck.value : checkValue
        return {
            color: bg.value,
            opacity: withTiming( (designType.value == 'type_2' && aCheckValue && isCheckBox)? 1 : 0, {duration: duration}),
        }
    })

  
    return (
        <Reanimated.View
            props = {props}
            style = {[{
                minHeight: size,
                minWidth: size, 
            }, style]}
        >
            <RPressable
                disabled = {(!isCheckBox && checkValue) && onPress}
                style = {{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
                android_ripple = {android_ripple}
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
                            justifyContent: 'center',
                            alignItems: 'center',
                        }, dynamicStyleSecondaryBox]}
                    >
                        <Reanimated.Text style={icon}>
                            <Ionicons name="checkmark" size={size-8}/>
                        </Reanimated.Text>
                        <Reanimated.View 
                            style={[{
                                position: 'absolute',
                                width: (size-1)/2,
                                height: (size-1)/2,
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
            </RPressable>
        </Reanimated.View>
    )
}