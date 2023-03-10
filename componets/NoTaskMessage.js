import React, {useState, useRef} from "react";
import { StyleSheet, Text, View, Dimensions} from "react-native";
import themeColorsAppList from "../app_values/Themes";
const ColorsApp = themeColorsAppList[1]
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const deviceHeigt = Dimensions.get('window').height
const NoTasksMessage = ({LanguageStore}) => {
    
    return (
        <View style = {styles.TextArea}>
            <View position = 'absolute' opacity = {0.6} style = {{transform: [{ rotate: "10deg" }]}}>
                <MaterialCommunityIcons name="blur" size={deviceHeigt/3.9} color={ColorsApp.skyUpUp} />
            </View>
            <View position = 'absolute' opacity = {0.7} style = {{transform: [{ rotate: "5deg" }]}}> 
                <MaterialCommunityIcons name="blur" size={deviceHeigt/3.45} color={ColorsApp.skyUp} />
            </View>
            <View position = 'absolute' opacity = {0.9} >
                <MaterialCommunityIcons name="blur" size={deviceHeigt/3} color={ColorsApp.sky} />
            </View>

            

            <Text style = {styles.Text}>{LanguageStore.NoTaskMessage.NoTasks}</Text>
        </View>
    )
}
export default NoTasksMessage;


const styles = StyleSheet.create({
    TextArea: {
        //position: 'absolute',
        //top: '60%',
        //right: '50%',
        //maxWidth: '90%',
        height: deviceHeigt/3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    Text: {
        fontSize: 18, 
        letterSpacing: 1, 
        color: ColorsApp.symbolDark,
        textAlign: 'center',
        fontWeight: "bold",
        position: 'absolute',
    }
});