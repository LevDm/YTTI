import React, { useRef, useState } from "react";
import { Animated, StyleSheet,View, Text, Dimensions, Pressable, Alert, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AnimatPointerText from "./AnimatPointerText"; 

import ThemeColorsAppList from "./../styles/ColorsApp"
const ColorsApp = ThemeColorsAppList[0]

const TrojanButton = ({trojanButtonVisible, handleClearTasks, setInputModalVisible,pointerVisible,LanguageStore }) => {

    const [openValueButton, setOpenValueButton] = useState(true);

    const animate_state = {start: 0, end: 100}
    const inputRange = [animate_state.start, animate_state.end]

    const [statusAnimated, setStatusAnimated] = useState(true)

    const value = useRef(new Animated.Value(animate_state.start)).current

    const startAnimate = (toValue) => {
        setStatusAnimated(false);
        Animated.timing(value, { toValue: toValue, useNativeDriver: true, duration: 90 }).start(() => {
            setStatusAnimated(true);
        });
    }

    let deviceWidth = Dimensions.get('window').width

    const translateY = value.interpolate({ inputRange, outputRange: [0, deviceWidth*0.04+60]})  

    const opacit = value.interpolate({ inputRange, outputRange: [1 , 0.5 ] })

    if (trojanButtonVisible && statusAnimated) {startAnimate(animate_state.start);}
    if (!trojanButtonVisible && statusAnimated) {startAnimate(animate_state.end);}

 
    return (
        <>
        <Animated.View 
            style = {[
                styles.areaTrojanButton,
                {
                    height: 60,
                    width: 60,
                    bottom: '8%', // if navigatemenu = 'hidden'->2, 'classical_animated'->8, 'classical'->8, 
                    right: '2%',
                    opacity: opacit,
                    transform: [{translateY}]
                } 
            ]}
        >
            <Pressable
                android_ripple = {{color: ColorsApp.shadowWhite0, borderless: true}}
                unstable_pressDelay = {300}
                style = {styles.button} 
                onPress = {() => {

                    if(openValueButton){
                        setInputModalVisible(true);
                    } else {
                        Alert.alert(
                            LanguageStore.DeleteAlert.Warning,
                            LanguageStore.DeleteAlert.DeleteAll,
                            [
                                { text: LanguageStore.DeleteAlert.Cancel, style: "cancel",onPress: () => {setOpenValueButton(true);} },
                                { text: LanguageStore.DeleteAlert.Ok, onPress: () => {handleClearTasks(); setOpenValueButton(true);}}
                            ]
                        );
                    }
                    
                }}
                onLongPress = {() => {
                    setOpenValueButton(!openValueButton);
                    //console.log(LanguageStore)
                }}
            >
                {openValueButton && <MaterialCommunityIcons name = "pencil" size = {36} color = 'white'/>}
                {!openValueButton &&
                    <>
                    <MaterialCommunityIcons name = "delete" size = {36} color = 'white'/>
                    <Text style = {{fontSize: 8, color: 'black', position: 'absolute', bottom: '35%',textTransform: 'uppercase'}}>{LanguageStore.TrojanButton.ALL}</Text>
                    </> 
                }
            </Pressable>
        </Animated.View>
        
        {false && pointerVisible && trojanButtonVisible && <AnimatPointerText action = {true} LanguageStore = {LanguageStore}/>}
        </>
    )
}
export default TrojanButton;


const styles = StyleSheet.create({
    ModalButton: {
        width: 60,
        height: 60,
        backgroundColor: ColorsApp.symbolLight,
        borderRadius: 50, 
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    areaTrojanButton: {
        position: 'absolute',
        flex: 1,
        borderRadius: 50,
        //width: 60,
        //bottom: '2%',
        //right: '2%',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        width: 60,
        height: 60,
        backgroundColor: ColorsApp.sky,
        borderRadius: 50, 
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center', 
    },
});
