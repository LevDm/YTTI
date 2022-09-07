import React, { useState, useRef }  from "react";
import { Animated, Text,View, StyleSheet, FlatList, TouchableOpacity, Dimensions, Pressable } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import RowDaysWeek from "./RowDaysWeek";
import ThemeColorsAppList from "./../../styles/ColorsApp";
const ColorsApp = ThemeColorsAppList[0]
import { BasePressable } from "../base/BaseElements"

import DateTimePicker from '../picker/DateTimePicker';

import { Transition, Transitioning } from "react-native-reanimated";

const transition = (
    <Transition.Together>
        <Transition.In type = "fade" duration = {500}/>
        <Transition.Change/>
        <Transition.Out type = "fade" duration = {500}/>
    </Transition.Together>
)

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width

const Calendar = ({LanguageStore}) => {
    const initdate = [];
    const [calendarList, setCalendarList] = useState(initdate);

    const [thisWeekList, setThisWeek] = useState(initdate);

    const [calendarMonth, setCalendarMonth] = useState('');
    const [calendarYear, setCalendarYear] = useState('');

    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    //const [yearInputValue, setYearInputValue] = useState(thisYear);

    const [smartAreaVisible, setSmartAreaVisible] = useState(false);
    const [smartMonth, setSmartMonth] = useState(false);
    const [smartYear, setSmartYear] = useState(false);
    const [smartWeather, setSmartWeather] = useState(false);
    
    const [fullCalendarVisible, setFullCalendarVisible] = useState(false)

    const calendarCreate = (month,year) => {
        let init = [];

        const dat = new Date();

        let thisDay = dat.getDate(); //текущий день 

        //if (yearInputValue != '') {year = yearInputValue}
        //else {year = year}
   
        setCalendarYear(year)

        let fullMonthList = LanguageStore.Calendar.ListMonthFullName;
        setCalendarMonth(month);

        let daysInThisMonth = new Date(year, month+1, 0).getDate(); //кол-во дней в текущем месяц

        let firstDayThisMonth =  new Date(year, month, 0).getDay(); //первый день текущего месяца
        firstDayThisMonth = firstDayThisMonth+1

        let daysInPastMonth = new Date(year, month, 0).getDate(); //кол-во дней в прошлом месяце
   
        let i = 1;
        let stop = false;
        let dayNubmer = 0;
        let dayAccent = 0;
        while (i < 43){
            let keys = (init[init.length-1] && parseInt(init[init.length-1].key) + 1) || 1 ;
            if (i < firstDayThisMonth){
                dayNubmer = daysInPastMonth - firstDayThisMonth + i + 1
                dayAccent = 0;

            } 
            if ( firstDayThisMonth <= i && i < daysInThisMonth+firstDayThisMonth){
                dayNubmer = i+1 - firstDayThisMonth
                if (dayNubmer == thisDay && year == thisYear && month == thisMonth) {dayAccent = 2;}
                else {{dayAccent = 1;}}
                if (i % 7 == 0 && i+1 >= daysInThisMonth+firstDayThisMonth) {stop = true}
            }
            if (i >= daysInThisMonth+firstDayThisMonth){
                dayNubmer += 1
                dayAccent = 0;
                if (dayNubmer > 14){ dayNubmer = 1}
                if (i % 7 == 0) {stop = true}
               
            }
            
            init.push({
                key: keys,
                title: dayNubmer,
                accent: dayAccent
            });
            if (stop == true) {break;}
            i = i + 1;
            
        }
        setCalendarList(init)

        
        //Текущая неделя
        if(year == thisYear && month == thisMonth){
            let indexThisDay = init.findIndex((el) => el.title === thisDay);
            let nubmerWeek = Math.floor(indexThisDay/7);
            let week = [];
            for(let i = 7*nubmerWeek; i< 7+7*nubmerWeek; i++){
                week.push(init[i])
            }
            setThisWeek(week)
            //console.log(week)
        }
    }
    if (calendarList.length == 0){calendarCreate(thisMonth, thisYear);}


    const renderItem = ({ item }) => {
        let styleV;
        let styleT;

        if (item.accent == 0){
            styleV = styles.styleAccentItem;
            styleT = [styles.styleAccentText, {color: ColorsApp.symbolNeutral}]
        }
        if (item.accent == 1){
            styleV = styles.styleAccentItem;
            styleT = [styles.styleAccentText, {fontSize: 22}];
        }
        if (item.accent == 2){
            styleV = [styles.styleAccentItem, {backgroundColor: ColorsApp.skyUp, borderWidth: 0,borderBottomWidth: 0, borderColor: ColorsApp.skyUpUp}];
            styleT = [styles.styleAccentText, {fontSize: 30,fontWeight: "bold",letterSpacing: -2 }];
        }

        return (
            <View style = {styleV}>
                <BasePressable
                    type = {"t"}
                    text = {item.title}
                    textStyle = {styleT}
                />
            </View>
        );
    }
    
    const animate_state = {start: 0, end: 100}
    const [statusAnimated, setStatusAnimated] = useState(true)
    const value = useRef(new Animated.Value(animate_state.start)).current
    
    const Animate = () => { 
        Animated.timing(value, { toValue: animate_state.end, useNativeDriver: true, duration: 400 }).start(() =>{
            setFullCalendarVisible(!fullCalendarVisible);
            Animated.timing(value, { toValue: animate_state.start, useNativeDriver: true, duration: 600 }).start()
        })
    }
    
    const inputRange = [animate_state.start, animate_state.end]
    const opacity = value.interpolate({ inputRange, outputRange: [1, 0]})


    const [monthPickerModalVisible, setMonthPickerModalVisible] = useState(false);
    const [yearPickerModalVisible, setYearPickerModalVisible] = useState(false);

    const setToValues = (values, type) => {
        //console.log(values,type)
        if(type == 'monther') {
            calendarCreate(values-1, calendarYear);     
        }
        if(type == 'full_year') {
            //console.log('?')
            calendarCreate(calendarMonth, Number(values));     
        }
    }
    
    const ref = React.useRef();

    return (
        <>
        
        <Transitioning.View
            ref = {ref}
            transition = {transition} 
            style = {[styles.base, {opacity: 1}]}
        >
                <RowDaysWeek LanguageStore = {LanguageStore}/>

                <View style = {styles.container}>
                <FlatList
                    numColumns = {7}                     
                    style = {{height: fullCalendarVisible?(calendarList.length/7)*46 : 50 }}
                    data={fullCalendarVisible?calendarList : thisWeekList}
                    renderItem={renderItem}
                    keyExtractor={item => item.key}
                />
                </View>

                {fullCalendarVisible && 
                <View style = {styles.yearMonth}>
                    <View style = {styles.ModalAction}>
                    <BasePressable
                        type = {"ti"}
                        text = {LanguageStore.Calendar.ListMonthFullName[calendarMonth]}
                        textStyle = {styles.textYearMonth}
                        icon = {{name: "dots-vertical", size: 16}}
                        onPress = {() => {setMonthPickerModalVisible(true);}}
                    />
                    </View>

                    <View style = {styles.ModalAction}>
                    <BasePressable
                        type = {"ti"}
                        text = {calendarYear}
                        textStyle = {styles.textYearMonth}
                        icon = {{name: "dots-vertical", size: 16}}
                        onPress = {() => {setYearPickerModalVisible(true);}}
                    />
                    </View>
                </View>}
                
                <BasePressable
                    type = {"i"}
                    icon = {{name: fullCalendarVisible? "chevron-up":"chevron-down", size: 28}}
                    onPress = {() => {
                        fullCalendarVisible? calendarCreate(thisMonth, thisYear) : true
                        
                        //Animate();
                        ref.current.animateNextTransition();
                        setFullCalendarVisible(!fullCalendarVisible);
                    }}
                />
        </Transitioning.View>
        
        <DateTimePicker 
            dateTimePickerModalVisible = {monthPickerModalVisible} 
            setDateTimePickerModalVisible = {setMonthPickerModalVisible}
            typePicker = {'monther'}
            setToValues = {setToValues}
            LanguageStore = {LanguageStore}      
        />
        <DateTimePicker 
            dateTimePickerModalVisible = {yearPickerModalVisible} 
            setDateTimePickerModalVisible = {setYearPickerModalVisible}
            typePicker = {'full_year'}
            setToValues = {setToValues}
            LanguageStore = {LanguageStore}      
        />
        </>
    );
}
export default Calendar;

const styles = StyleSheet.create({
    ModalAction: {
        //width: 90,
        minWidth: 100, 
        height: 30,
        padding: 5,
        borderRadius: 12,
        //borderBottomLeftRadius: 0,
        //borderBottomRightRadius: 0,
        backgroundColor: ColorsApp.skyUp,
        justifyContent: 'center',
        alignItems: 'center', 
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        //marginHorizontal: 20
        //flexDirection: 'column'
    },
    smartArea: {
        flex: 0,
        height: 280,
        backgroundColor: ColorsApp.skyUp,
        flexDirection: "row",
        justifyContent: 'flex-end',
        //alignItems: 'center',
        paddingBottom: 2,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        marginHorizontal: 5,
    },
    base: {
        padding: 0,
        marginTop: 5,
        justifyContent: 'center', 
        flexGrow: 1,
        marginHorizontal: 5,
        zIndex: 1,
        flexDirection: "column",
        backgroundColor: ColorsApp.sky,
        borderRadius: 12,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4, 
    },
    container: {
        flex: 0,
        alignItems: 'center', 
    },
    styleAccentItem : {
        justifyContent: 'center',
        alignItems: 'center', 
        height: 44,
        width: 50,
        //flex: 0,
        backgroundColor: ColorsApp.skyUp,
        borderRadius: 12,
        padding: 0,
        margin: 1,
    },
    styleAccentText: {
        fontSize: 18,
        //fontWeight: "bold",
        //fontStyle: 'italic',
        color: ColorsApp.symbolDark
    },
    yearMonth: {
        //justifyContent: 'space-around',
        flex: 0, 
        //alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    textYearMonth: {
        fontSize: 14,
        //fontWeight: "bold",
        //fontStyle: 'italic',
        color: ColorsApp.symbolDark,
        textTransform: 'uppercase'
    },
});
