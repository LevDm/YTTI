import React, { useState } from "react";
import { StyleSheet, Pressable, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import Calendar from "./calendar/Calendar";

import NoTasksMessage from "./NoTaskMessage"
import ModalItems from "./ModalItems";

import WeatherList from "./weather/WeatherList";
import { LinearGradient } from 'expo-linear-gradient';

import ThemeColorsAppList from "./../styles/ColorsApp"
const ColorsApp = ThemeColorsAppList[0]

let deviceHeight = Dimensions.get('screen').height
let deviceWidth = Dimensions.get('window').width

const  ListItems = ({
    tasks, 
    handleTriggerEdit, 
    handleDeleteTask,
    setTrojanButtonVisible,
    setPointerVisible,

    LanguageStore

    }) => {

    //для стилизации текущей строки списка задач
    const [swipedRow, setSwipedRow] = useState(null);
    const [swipeDirections, setSwipeDirections] = useState(0);

    const [itemModalVisible, setItemModalVisible] = useState(false);

    //const [calendarHeigt, setCalendarHeigt] = useState(null);
    
    //const [fixed, setFixed] = useState(false);
 
    return (
        <>       
        <SwipeListView 
            data = {tasks}
            renderItem = {(data) => {
                
                let timeInFire = 'none';

                let toDate = new Date(
                    parseInt(data.item.toDate.substr(6,10)),
                    parseInt(data.item.toDate.substr(3,5))-1,
                    parseInt(data.item.toDate.substr(0,2)),

                    parseInt(data.item.toTime.substr(0,2)),
                    parseInt(data.item.toTime.substr(3,5))
                );

                let thisDate = new Date();

                let across = (toDate - thisDate)/3600000

                if(across >= 0 && across <= 24){ // 
                    timeInFire = 'soon';
                }
                if(across >= 0 && across <= 1+parseInt(data.item.fireTarget)){ // 
                    timeInFire = 'soonBurn';
                }
                if(across >= 0 && across <= parseInt(data.item.fireTarget)){
                    timeInFire = 'burn';
                }
                if(across < 0){ //
                    timeInFire = 'burnOut';
                }
                //<Text style = {styles.TaskDate}>{LanguageStore.ListItems.from}: {data.item.date}</Text>

                let numberLinesInText = Math.round( (data.item.title).length / (((deviceWidth-10)-20)/(16*0.6)) )+1
                //console.log(numberLinesInText)
                
      
                return (
                    <View style = {[styles.BaseListView,{}]}>
                        <View style = {[styles.ListView,{width: /*swipedRow == data.item.key? deviceWidth-10-70:*/ deviceWidth-10, }]}>   
                        <Pressable 
                            style = {{flex: 1}}
                            android_ripple = {{color: ColorsApp.sky,borderless: true}}
                            unstable_pressDelay = {300}
                            onLongPress = {() => {}}
                            onPress = {() => {}}
                            //backgroundColor = 'red'
                        >   
                            <View margin = {10} marginBottom = {38} flex = {1}>
                                <Text numberOfLines = {numberLinesInText} style = {swipedRow == data.item.key?{fontSize: 16, letterSpacing: 1, color: ColorsApp.symbolDark, textDecorationLine: 'underline'}:styles.TaskText}>{data.item.title}</Text> 
                            </View>
                        </Pressable>
                            <Text style = {[styles.TaskDate,{textDecorationLine: timeInFire == 'burnOut'?'line-through':'none',color: timeInFire == 'burn'?'red':ColorsApp.symbolNeutral}]}>{LanguageStore.ListItems.to}: {data.item.toDate} {data.item.toTime}</Text>
                        {timeInFire != 'none' &&
                            <View style = {{position: 'absolute', bottom: 5, left: 5}}>
                                <MaterialCommunityIcons 
                                    name = {timeInFire == 'burnOut'?"timer-off-outline":"timer-outline"} 
                                    size={30} 
                                    color={timeInFire == 'soon'?'grey':"black"} 
                                />
                                <View style = {{position: 'absolute', bottom: 10, left: -7}}>
                                    {(timeInFire != 'soon' && timeInFire != 'soonBurn')  &&
                                    <MaterialCommunityIcons name="fire" size={25} color = {timeInFire == 'burn'?'red':'grey'}/>
                                    }
                                </View>
                            </View>
                        }
                        </View>
                    </View>
                )
                          
            }}

            renderHiddenItem = {(data, rowMap) => {
                return (
                    <View style = {styles.ListViewHidden}>
                        <TouchableOpacity style = {styles.HiddenButton} 
                            onPress = {() => {
                                handleDeleteTask(rowMap, data.item.key);
                                setSwipedRow(null)
                                }}
                            >
                            <MaterialCommunityIcons name="auto-fix" size={40} color={ColorsApp.symbolLight} />
                        </TouchableOpacity>
                    </View>
                )
            }}

            rightOpenValue = {-0.1}
            stopRightSwipe = {-70}
            previewRowKey = {"1"}
            previewOpenValue = {-70}
            previewOpenDelay = {800}
            disableRightSwipe = {true}
            showsVerticalScrollIndicator = {false}

            

            style = {{flex: 1, 
                paddingBottom: 10, 
                marginBottom: 0, 
            }}
        
            onRowOpen = {(rowKey) => {
                setSwipedRow(rowKey);
               // console.log(rowKey)
              //  const taskKey = tasks.findIndex((task) => task.key === rowKey);
              //  console.log(taskKey)
                //console.log(tasks[rowKey-1])
                setItemModalVisible(true)
                //handleTriggerEdit(tasks[rowKey])
            }}

            onRowClose = {() => {
                setSwipedRow(null);
            }}

            //onSwipeValueChange = {(event)=>{console.log(event)}}

            ListHeaderComponent = {
            <View style = {{flexGrow: 1}}>
                <LinearGradient
                    colors={[ColorsApp.statusBar, "transparent",]}
                    style={{
                        position: 'absolute',
                        //borderRadius: 12,
                        left: 0,
                        right: 0,
                        top: 0,
                        height: 300,
                    }}
                />
                <WeatherList LanguageStore = {LanguageStore} />
                <Calendar LanguageStore = {LanguageStore}/>
            </View>}
            ListFooterComponent = {
            <View 
                height = {130} // if navigatemenu = 'hidden'->80, 'classical_animated'->130, 'classical'->100, 
            />}
            ListEmptyComponent = {<NoTasksMessage LanguageStore = {LanguageStore}/>}

            onScroll = { event => {
                let inlet =  Math.abs(event.nativeEvent.contentOffset.y)

                if (inlet > swipeDirections) {setTrojanButtonVisible(false)}
                else {setTrojanButtonVisible(true)}
            
                setSwipeDirections(inlet)

                //const isCloseToTop = ({layoutMeasurement, contentOffset, contentSize}) => {
                //   return contentOffset.y <= calendarHeigt;
                //}

                const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {    
                    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 5;
                }
                
                //console.log(event.nativeEvent.layoutMeasurement)
                //console.log(event.nativeEvent.contentOffset)
                //console.log(event.nativeEvent.contentSize)

                //if(isCloseToTop(event.nativeEvent)){

                    //console.log('top')
                //}
                
                if(isCloseToBottom(event.nativeEvent)){
                    setTrojanButtonVisible(true);
                    setPointerVisible(true);
                } else {
                    setPointerVisible(false);
                }
            }}
        />
        <ModalItems
            itemModalVisible = {itemModalVisible}
            setItemModalVisible = {setItemModalVisible}
            swipedRow = {swipedRow}
            setSwipedRow = {setSwipedRow}
            tasks = {tasks}
            handleTriggerEdit = {handleTriggerEdit}
            handleDeleteTask = {handleDeleteTask}

            LanguageStore = {LanguageStore}
        />
        </>

    );
}
export default ListItems;


const styles = StyleSheet.create({
    BaseListView: {
        //flex: 1,
        minHeight: 100,
        margin: 5, 
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        //backgroundColor: 'red',
        //backgroundColor: ColorsApp.ground,
        borderRadius: 12,
        elevation: 0,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    ListView: {
        flex: 1,
        backgroundColor: 'white',
        minHeight: 100, 
        //padding: 10,
        //padding: 10,
        //marginRight: 15,
        justifyContent: 'space-around',
        borderBottomLeftRadius: 12,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        borderBottomRightRadius: 12,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,   
    },
    ListViewHidden: {
        margin: 7,
        //marginLeft: 70,
        flex: 1,
        backgroundColor: ColorsApp.sky,
        minHeight: 85, 
        justifyContent: 'space-around', 
        alignItems: 'flex-end',
        borderRadius: 12,
        elevation: 4,
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,  
    },
    HiddenButton: {
        width: 55,
        marginRight: 5,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    TaskText: {
        fontSize: 16, 
        letterSpacing: 1, 
        color: ColorsApp.symbolDark
    },
    TaskDate: {
        fontSize: 10,
        //marginTop: 18, 
        letterSpacing: 1, 
        color: ColorsApp.symbolNeutral,
        textAlign: 'right',
        textTransform: 'uppercase',
        position: 'absolute', bottom: 13, right: 8
    },
});