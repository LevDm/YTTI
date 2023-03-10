import React, { useRef, useState } from "react";
import { Animated, StyleSheet, Modal, TextInput, Text, View, TouchableOpacity, Pressable } from "react-native";

import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import themeColorsAppList from "../app_values/Themes";
const ColorsApp = themeColorsAppList[1]
import DateTimePicker from "../componets/picker/DateTimePicker";

const ModalInput = ({
    InputModalVisible, 
    setInputModalVisible, 
    taskInputValue, 
    setTaskInputValue, 
    handleAddTask,
    taskToBeEditer,
    setTaskToBeEditer,
    handleEditTask,
    tasks,
    keyboardVisible,

    LanguageStore

    }) => {
        
    const [timePickerModalVisible, setTimePickerModalVisible] = useState(false);
    const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);

    const [timerPickerModalVisible, setTimerPickerModalVisible] = useState(false);

    const [toTimeValue, setToTimeValue] = useState(null);
    const [toDateValue, setToDateValue] = useState(null);
    const [inFireValue, setInFireValue] = useState(null);

    const setToValues = (values, type) => {
        if(type == 'time'){
            setToTimeValue(values);
            //setToValues(`${pikValueHour} ${pikValueMinute}`,typePicker)
        } 
        if(type == 'date') {
            setToDateValue(values);
            //setToValues(`${pikValueDay} ${pikValueMonth} ${pikValueYear}`,typePicker)
        }
        if(type == 'timer') {
            setInFireValue(values);
            //setToValues(`${pikValueTimer}`,typePicker)
        }
        //console.log(toTimeValue)
        //console.log(toDateValue)
    }

    const handleCloseModal = () => {
        setInputModalVisible(false);
        setTaskInputValue("");
        setTaskToBeEditer(null);

        setToTimeValue(null);
        setToDateValue(null);
        setInFireValue(null);
    }


    const handleSubmit = () => {
        if (!taskToBeEditer) {
            
            //console.log(tasks)
            let date = new Date()

            let thisDay = date.getDate();
            let thisMonth = 1+date.getMonth();
            let thisYear = date.getFullYear();

            let dateNewTask = date.toString().substring(8,23)
            dateNewTask = dateNewTask.substring(0,3)+(date.getMonth()+1)+dateNewTask.substring(2,)

            let keyNewTask = ((tasks[tasks.length-1] && parseInt(tasks[tasks.length-1].key)+1) || 1)
            //let keyNewTask = (tasks != []?(parseInt(tasks[tasks.length-1].key)+1): 1)
            //console.log(keyNewTask)
            //keyNewTask = keyNewTask == 0?1: keyNewTask 
            //console.log('task key',keyNewTask)
            let toTime;
            let toDate;
            let fireTarget;

            if (taskInputValue == '') {taskInputValue = '*'+keyNewTask}

            if (toTimeValue != null ) {
                toTime = toTimeValue
            } else {
                toTime = '23:59'
            }

            if (toDateValue != null) {
                toDate = toDateValue
            } else {
                toDate = `${thisDay>9?thisDay:'0'+thisDay} `+`${thisMonth>9?thisMonth:'0'+thisMonth} `+`${thisYear}`
            }
    
    
            if (inFireValue != null) {
                fireTarget = inFireValue
            } else {
                fireTarget = '1'
            }

            

            handleAddTask({
                title: taskInputValue,
                toTime: toTime,
                toDate: toDate,
                fireTarget: fireTarget,
                date: dateNewTask,
                key: `${keyNewTask}`
                //key: `${(tasks[tasks.length-1] && parseInt(tasks[tasks.length-1].key) ) }`
            });

        } else {
            handleEditTask({
                title: taskInputValue,
                toTime: taskToBeEditer.toTime,
                toDate: taskToBeEditer.toDate,
                fireTarget: taskToBeEditer.fireTarget,
                date: taskToBeEditer.date,
                key: taskToBeEditer.key
            })
        }
        setTaskInputValue("");
        setToTimeValue(null);
        setToDateValue(null);
        setInFireValue(null);
    }


    return (
        <> 
            <Modal 
                animationType = "fade"
                transparent = {true}
                visible = {InputModalVisible}
                onRequestClose = {handleCloseModal}
                //style = {{position: 'absolute'}}
            >
                <View style = {styles.ModalContainer}>
                    
                    <View style = {[styles.ModalView,{height: keyboardVisible?'80%':'50%'}]}> 
                        <View style = {styles.ModalIcon}>
                            <Text style = {styles.HeaderTitle}>{LanguageStore.ModalInput.title}</Text> 
                        </View>

                        <View style = {styles.ModalText}>
                        <Text style = {{fontSize: 16}}>{LanguageStore.ModalInput.text}:</Text>
                        

                        <TextInput style = {styles.StyledInput}
                            placeholder = {LanguageStore.ModalInput.placeholderInputArea}
                            placeholderTextColor = {ColorsApp.symbolNeutral}//{Colors.alternative}
                            selectionColor = {ColorsApp.symbolDark}//'black'//{Colors.secondary}
                            autoFocus = {false}
                            onChangeText = {(text) => setTaskInputValue(text)}
                            value = {String(taskInputValue)}
                            //onSubmitEditing = {handleSubmit}
                        />
                        </View>

                        <View style = {styles.ModalText}>
                        <Text style = {{fontSize: 16}}>{LanguageStore.ModalInput.to}:</Text>
                        

                        <View
                            style = {{
                                //marginTop: 10,
                                width: 300,
                                height: 50,
                                backgroundColor: ColorsApp.skyUpUp,//Colors.tertiary,
                                padding: 10,
                                borderRadius: 12,
                            }}
                        >
                            <Pressable
                                onPress = {()=>{
                                    setTimePickerModalVisible(true)
                                }}
                            >
                                <Text 
                                    style = {toTimeValue == null?{fontSize: 16,letterSpacing: 1,color: ColorsApp.symbolNeutral}:{fontSize: 16,letterSpacing: 1,color: ColorsApp.symbolDark}}
                                >
                                    {toTimeValue == null?LanguageStore.ModalInput.placeholderTimeArea:toTimeValue}
                                </Text>
                            </Pressable>
                        </View>
                        <View
                            style = {{
                                marginTop: 5,
                                width: 300,
                                height: 50,
                                backgroundColor: ColorsApp.skyUpUp,//Colors.tertiary,
                                padding: 10,
                                borderRadius: 12,
                            }}
                        >
                            <Pressable
                                onPress = {()=>{
                                    setDatePickerModalVisible(true)
                                }}
                            >
                                <Text 
                                    style = {toDateValue == null?{fontSize: 16,letterSpacing: 1,color: ColorsApp.symbolNeutral}:{fontSize: 16,letterSpacing: 1,color: ColorsApp.symbolDark}}
                                >
                                   {toDateValue == null?LanguageStore.ModalInput.placeholderDateArea:toDateValue}
                                </Text>
                            </Pressable>
                        </View>
                        </View>

                        <View style = {styles.ModalText}>
                        <Text style = {{fontSize: 16}}>{LanguageStore.ModalInput.deadlineTarget}:</Text>
                        

                        <View
                            style = {{
                                //marginTop: 10,
                                width: 300,
                                height: 50,
                                backgroundColor: ColorsApp.skyUpUp,//Colors.tertiary,
                                padding: 10,
                                borderRadius: 12,
                            }}
                        >
                            <Pressable
                                onPress = {()=>{
                                    setTimerPickerModalVisible(true)
                                }}
                            >
                                <Text 
                                    style = {inFireValue == null?{fontSize: 16,letterSpacing: 1,color: ColorsApp.symbolNeutral}:{fontSize: 16,letterSpacing: 1,color: ColorsApp.symbolDark}}
                                >
                                   {inFireValue == null?LanguageStore.ModalInput.placeholderDeadlineTargetArea:inFireValue}
                                </Text>
                            </Pressable>
                        </View>
                        </View>
                    </View>
                    <View style = {[styles.ModalActionGroup,{marginBottom: keyboardVisible?10:'58%'}]}>
                        <Pressable 
                            android_ripple = {{color: ColorsApp.sky,borderless: true}} 
                            style = {styles.ModalAction} 
                            onPress = {handleCloseModal}
                        >
                            <MaterialCommunityIcons name = "close" size = {28} color = {ColorsApp.symbolDark}/>
                        </Pressable>

                        <Pressable 
                            android_ripple = {{color: ColorsApp.sky,borderless: true}} 
                            style = {styles.ModalAction} 
                            onPress = {handleSubmit}
                        >
                            <MaterialCommunityIcons name = "check" size = {28} color = {ColorsApp.symbolDark}/>
                        </Pressable>
                    </View>
                </View> 
            </Modal>

            <DateTimePicker
                dateTimePickerModalVisible = {timePickerModalVisible} 
                setDateTimePickerModalVisible = {setTimePickerModalVisible}
                typePicker = {'time'}
                setToValues = {setToValues}
                LanguageStore = {LanguageStore}
            />

            <DateTimePicker 
                dateTimePickerModalVisible = {datePickerModalVisible} 
                setDateTimePickerModalVisible = {setDatePickerModalVisible}
                typePicker = {'date'}
                setToValues = {setToValues}
                LanguageStore = {LanguageStore}      
            />

            <DateTimePicker 
                dateTimePickerModalVisible = {timerPickerModalVisible} 
                setDateTimePickerModalVisible = {setTimerPickerModalVisible}
                typePicker = {'timer'}
                setToValues = {setInFireValue}
                LanguageStore = {LanguageStore}      
            />
        </>
    );
}
export default ModalInput;


const styles = StyleSheet.create({
    ModalContainer: {
        padding: 4,
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        flex: 1,
        backgroundColor: ColorsApp.shadowBlack,//'rgba(0, 0, 0, 0.4235)',
    },
    ModalView: {
        backgroundColor: ColorsApp.skyUp,//Colors.primaryUp,
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
    ModalActionGroup: {
        width: '98%',
        borderRadius: 12,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        backgroundColor: ColorsApp.skyUp,
        flexDirection: 'row',
        justifyContent: 'space-around', 
        //marginBottom: keyboardVisible?10:'58%'
    },
    StyledInput: {
        width: 300,
        height: 50,
        backgroundColor: ColorsApp.skyUpUp,//Colors.tertiary,
        padding: 10,
        fontSize: 16, 
        borderRadius: 12,
        color: ColorsApp.symbolDark,//'black',//Colors.secondary,
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
        color: ColorsApp.symbolDark,//Colors.tertiary, 
        letterSpacing: 2, 
        fontStyle: 'italic'
    },
});
