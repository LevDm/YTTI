import React, { useRef, useState } from "react";
import { Animated, StyleSheet, Modal, TextInput, Text, View, TouchableOpacity, Pressable } from "react-native";

import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import themeColorsAppList from "../app_values/Themes";
const ColorsApp = themeColorsAppList[1]

const ModalItems = ({
    itemModalVisible, 
    setItemModalVisible,
    swipedRow,
    setSwipedRow,
    tasks,
    handleTriggerEdit,
    handleDeleteTask,

    LanguageStore

    }) => {

    const handleCloseModal = () => {
        setItemModalVisible(false);
        setSwipedRow(null);
    }

    const taskIndexInList = tasks.findIndex((task) => task.key === swipedRow);

    return (
        <> 
            <Modal 
                animationType = "slide"
                transparent = {true}
                visible = {itemModalVisible}
                onRequestClose = {handleCloseModal}
                //style = {{position: 'absolute'}}
            >
                <View style = {styles.ModalContainer}>
                    
                    <View style = {[styles.ModalView,{height: '30%'}]}>
                    <View >
                        <TouchableOpacity style = {styles.HiddenButton}>
                            <MaterialCommunityIcons name="check" size={25} color = {ColorsApp.symbolLight}  />
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.HiddenButton} 
                            onPress = {() => {
                                handleDeleteTask(swipedRow, tasks[taskIndexInList].key);
                                handleCloseModal()
                                }}
                            >
                            <MaterialCommunityIcons name="delete" size={25} color = {ColorsApp.symbolLight} />
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.HiddenButton} 
                            onPress = {() => {
                                handleTriggerEdit(tasks[taskIndexInList])
                                handleCloseModal()
                                }}
                            >
                            <MaterialCommunityIcons name="pencil" size={25} color = {ColorsApp.symbolLight} />
                        </TouchableOpacity>                 
                    </View> 
                        
                    </View>
                    <View style = {[styles.ModalActionGroup,{marginBottom: 10}]}>
                        <Pressable 
                            android_ripple = {{color: ColorsApp.sky,borderless: true}} 
                            style = {styles.ModalAction} 
                            onPress = {handleCloseModal}
                        >
                            <MaterialCommunityIcons name = "close" size = {28} color = {ColorsApp.symbolDark}/>
                        </Pressable>
                    </View>
                </View> 
            </Modal>

        </>
    );
}
export default ModalItems;


const styles = StyleSheet.create({
    ModalContainer: {
        padding: 4,
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        flex: 1,
        //backgroundColor: ColorsApp.shadowBlack,//'rgba(0, 0, 0, 0.4235)',
    },
    ModalView: {
        backgroundColor: "green",//ColorsApp.skyUp,//Colors.primaryUp,
        width: '98%',
        height: '50%',
        borderRadius: 12,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        padding: 10,
        alignItems: 'center',
        marginBottom: 3,
        //flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    ModalAction: {
        height: 50,
        borderRadius: 12,
        
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
        alignSelf: 'center',
    },
    HiddenButton: {
        width: 55,
        marginRight: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ModalActionGroup: {
        width: '98%',
        borderRadius: 12,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        backgroundColor: "green",//ColorsApp.skyUp,
        flexDirection: 'row',
        justifyContent: 'space-around', 
        //marginBottom: keyboardVisible?10:'58%'
    },
    StyledInput: {
        width: 300,
        height: 50,
        backgroundColor: "green",//ColorsApp.skyUpUp,//Colors.tertiary,
        padding: 10,
        fontSize: 16, 
        borderRadius: 12,
        color: "green",//ColorsApp.symbolDark,//'black',//Colors.secondary,
        letterSpacing: 1,
    },
    ModalIcon: {
        alignItems: 'center', 
        marginBottom: 10,
    },
    ModalText: {
        marginTop: 10,
        alignItems: 'flex-start',
    },
    HeaderTitle: {
        fontSize: 30, 
        fontWeight: 'bold',
        color: "green",//ColorsApp.symbolDark,//Colors.tertiary, 
        letterSpacing: 2, 
        fontStyle: 'italic'
    },
});
