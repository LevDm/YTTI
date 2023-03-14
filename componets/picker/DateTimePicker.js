import React, {useState, useRef} from "react";

import {Text,StyleSheet, Pressable, Animated, View, Modal, Dimensions, FlatList, SafeAreaView, TouchableOpacity} from 'react-native';

import { MaterialCommunityIcons } from "@expo/vector-icons";
import themesColorsAppList from "../../app_values/Themes";
//import themeColorsAppList from "../../app_values/Themes";
const ColorsApp = themesColorsAppList[1]['light']
import Piker from "./Piker";

const DateTimePicker = ({
    dateTimePickerModalVisible, 
    setDateTimePickerModalVisible, 
    typePicker, //typePicker == 'date' or 'time'
    setToValues,
    LanguageStore
    }) => {

    let date = new Date();

    let thisHours = date.getHours();
    let thisMinute = date.getMinutes();

    let thisDay = date.getDate();
    let thisMonth = date.getMonth();
    let thisYear = date.getFullYear();
        
    const [pikValueDay,setPikValueDay] = useState(thisDay);
    const [pikValueMonth,setPikValueMonth] = useState(thisMonth);
    const [pikValueYear,setPikValueYear] = useState(thisYear);

    //console.log(Number(String(thisYear)[0]), Number(String(thisYear)[1]),Number(String(thisYear)[2]),Number(String(thisYear)[3]) )
        
    const [pikValueHour,setPikValueHour] = useState(thisHours)
    const [pikValueMinute,setPikValueMinute] = useState(thisMinute)


    const [pikValueTimer, setPikValueTimer] = useState(1)

    const [pikThousandYear, setThousandYear] = useState('')
    const [pikHundredYear, setHundredYear] = useState('')
    const [pikTenYear, setTenYear] = useState('')
    const [pikOneYear, setOneYear] = useState('')

    const handleCloseModal = () => {
        setDateTimePickerModalVisible(false);
    }

    
    const handleSelect = () => {
        setDateTimePickerModalVisible(false);
  
        if(typePicker == 'time'){
            setToValues(`${pikValueHour}:${pikValueMinute}`,typePicker)
        } 
        if(typePicker == 'date') {
            setToValues(`${pikValueDay} ${pikValueMonth} ${pikValueYear}`,typePicker)
        }
        if(typePicker == 'timer') {
            setToValues(`${pikValueTimer}`,typePicker)
        }
        if(typePicker == 'monther') {
            setToValues(`${pikValueMonth}`,typePicker)
        }
        if(typePicker == 'full_year') {
            setToValues(`${pikThousandYear}${pikHundredYear}${pikTenYear}${pikOneYear}`,typePicker)
        }
    }

    return (
        <> 
            <Modal 
                animationType = "slide"
                transparent = {true}
                visible = {dateTimePickerModalVisible}
                onRequestClose = {handleCloseModal}
                //style = {{position: 'absolute'}}
            >
                <View style = {styles.ModalContainer}>            
                    <View style = {styles.ModalView}>

                        {typePicker == 'timer' &&
                        <View style = {{alignItems: 'center'}}>
                            <Piker 
                                LanguageStore = {[]} 
                                dataType = 'timer'
                                initialListValue = {0}
                                setPikValue = {setPikValueTimer}
                            /> 
                        </View>
                        }

                        {typePicker == 'full_year' &&
                        <View style = {{alignItems: 'center'}}>
                        <View style = {{flexDirection: 'row',}}>  
                            <Piker 
                                LanguageStore = {[]} 
                                dataType = 'number'
                                initialListValue = {Number(String(thisYear)[0])}
                                setPikValue = {setThousandYear}
                            /> 
                            <Piker 
                                LanguageStore = {[]} 
                                dataType = 'number'
                                initialListValue = {Number(String(thisYear)[1])}
                                setPikValue = {setHundredYear}
                            />                         
                            <Piker 
                                LanguageStore = {[]} 
                                dataType = 'number'
                                initialListValue = {Number(String(thisYear)[2])}
                                setPikValue = {setTenYear}
                            /> 
                            <Piker 
                                LanguageStore = {[]} 
                                dataType = 'number'
                                initialListValue = {Number(String(thisYear)[3])}
                                setPikValue = {setOneYear}
                            />  
                        </View>
                        </View>
                        }

                        {typePicker == 'time' &&
                        <View style = {{alignItems: 'center'}}>
                            <View style = {{position: 'absolute',top: '41%'}}><Text style = {{fontSize: 24, fontWeight: 'bold'}}>:</Text></View>
                            <View style = {{flexDirection: 'row',}}>    
                            <Piker 
                                LanguageStore = {[]} 
                                dataType = 'hour'
                                initialListValue = {thisHours}
                                setPikValue = {setPikValueHour}
                            />
                            <Piker 
                                LanguageStore = {[]} 
                                dataType = 'minute'
                                initialListValue = {thisMinute}
                                setPikValue = {setPikValueMinute}
                            />
                           </View>  
                        </View>
                        }
                        {typePicker == 'date' && 
                        <View style = {{alignItems: 'center'}}>
                            <View style = {{flexDirection: 'row',}}>    
                            <Piker 
                                LanguageStore = {[]} 
                                dataType = 'day'
                                initialListValue = {thisDay-1}
                                setPikValue = {setPikValueDay}
                                volumeDay = {new Date(pikValueYear, pikValueMonth, 0).getDate()}
                            />
                            <Piker 
                                LanguageStore = {LanguageStore} 
                                dataType = 'month'
                                initialListValue = {thisMonth}
                                setPikValue = {setPikValueMonth}
                            />
                            <Piker 
                                LanguageStore = {[]} 
                                dataType = 'year'
                                initialListValue = {0}
                                setPikValue = {setPikValueYear}
                            />
                        </View>  
                        </View>                      
                        }
                        {typePicker == 'monther' && 
                        <View style = {{alignItems: 'center'}}>
                            <View style = {{flexDirection: 'row',}}>    
                            <Piker 
                                LanguageStore = {LanguageStore} 
                                dataType = 'month'
                                initialListValue = {thisMonth}
                                setPikValue = {setPikValueMonth}
                            />
                        </View>  
                        </View>                      
                        }
                    </View>
                    <View style = {styles.ModalActionGroup}>
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
                            onPress = {handleSelect}
                        >
                            <MaterialCommunityIcons name = "check" size = {28} color = {ColorsApp.symbolDark}/>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </>  
  );
    
}

export default DateTimePicker;


const styles = StyleSheet.create({
    ModalContainer: {
        padding: 4,
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        flex: 1,
        //backgroundColor: ColorsApp.shadowBlack,//'rgba(0, 0, 0, 0.4235)',
    },
    ModalView: {
        backgroundColor: ColorsApp.skyUpUp,//Colors.primaryUp,
        width: '98%',
        height: 160,
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center'
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
        backgroundColor: ColorsApp.skyUpUp,
        flexDirection: 'row',
        justifyContent: 'space-around', 
        marginBottom: '15%'
    },
});
