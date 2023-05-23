import React, {useState, useEffect, useRef, useMemo, useCallback} from "react";

import {
  Text,
  Vibration,
  Pressable, 
  View,
  Dimensions, 
  FlatList, 
  StyleSheet,
  useWindowDimensions
} from 'react-native';

import TapticalPicker from "./TapticalPicker";

import languagesAppList from "../../app_values/Languages";

export function DatePicker(props){
    const currenDate = new Date()
    const currentYear = currenDate.getFullYear()
    const years = new Array(6).fill(0).map((_, index)=>String(currentYear+index))
    
    const days = new Array(31).fill(0).map((_, index)=>String(index+1))

    const defaultDate = [
        {
            index: currenDate.getDate()-1,
            item: days[currenDate.getDate()-1]
        },
        {
            index: currenDate.getMonth(),
            item: `${currenDate.getMonth()+1<9? '0' : ''}${currenDate.getMonth()+1}`
        },
        {
            index: 0,
            item: String(currentYear)
        }
    ]
  
    const {
        primaryValue = defaultDate,
        setValue,
        colors,//: {
            //backgroundColor = 'black',
            //textColor = 'white',
            //separatorColor = 'white',
        //}
        LanguageAppIndex
    } = props

    const Language = languagesAppList[LanguageAppIndex]

    const months = Language.Calendar.ListMonthFullName//new Array(12).fill(0).map((_, index)=>String(index+1))

    useEffect(()=>{
        setValue? setValue(defaultDate) : null
    })

    const setDay = (day) => {
        primaryValue[0] = day
        setValue? setValue(primaryValue) : null
    }
  
    const setMonth = (month) => {
        const newMonth = {...month}
        newMonth.item = `${currenDate.getMonth()+1<9? '0' : ''}${currenDate.getMonth()+1}`
        primaryValue[1] = newMonth
        setValue? setValue(primaryValue) : null
    }
  
    const setYear = (year) => {
        primaryValue[2] = year // {item, index}
        setValue? setValue(primaryValue) : null
    }
  
    return(
      <View style={{flexDirection :'row'}}>
        <TapticalPicker 
          data={days}
          //fontSize={}
          primaryIndex={primaryValue[0].index}
          pickerParams ={{
            inDisplay: 5,
            itemHeight: 40,
            
            itemsMargin: 110,
            opacityLimit: 0.75,
  
            separatorHeight: 30,
            separatorMarginTop:  -3,
            transitionBoost: 3.2
          }}
          setValue={setDay}
          {...colors}
        />
        <TapticalPicker 
          data={months}
          //fontSize={}
          primaryIndex={primaryValue[1].index}
          pickerParams ={{
            inDisplay: 5,
            itemHeight: 40,
            itemsMargin: -40, 
            anim_rotation_out:  [25, 20, 15, 0],
            opacityLimit: 0,   
            separatorHeight: 30,
            separatorMarginTop:  -3,
            transitionBoost: 1.6
          }}
          setValue={setMonth}
          {...colors}
        />
        
        <TapticalPicker 
          data={years}
          primaryIndex={primaryValue[2].index}
          //fontSize={}
          pickerParams ={{
            inDisplay: 5,
            itemHeight: 40,
            itemsMargin: -90, 
            anim_rotation_inp: [0, 0.98, 0.99, 1],
            anim_rotation_out:  [10, 8, 6, 0],
            opacityLimit: 0,   
            separatorHeight: 30,
            separatorWidth: '80%',
            separatorMarginTop:  -3,
            transitionBoost: 0.8
          }}
          setValue={setYear}
          {...colors}
        />
      </View>
    )
}




  
export function TimePicker(props){
    const hoursList =   ['00','01','02','03','04','05','06','07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
    const minutesList = ['00','01','02','03','04','05','06', '07', '08', '09', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '56', '57', '58', '59']
    const currenDate = new Date()

    const adaptiveTime = (minutes) => {
      //console.log(minutes)
      const adaptive = (minutes > 10 && minutes<55)? (minutes & 5 == 0? minutes : 5*Math.round(minutes/5)) : minutes
      //console.log(adaptive)
      const minutesString = (adaptive > 9? '' : '0') + adaptive
      //console.log(minutesString,minutesList.indexOf(minutesString))
      return minutesList.indexOf(minutesString)
    }

    const defaultValue = [
        {
            index: currenDate.getHours(),
            item: hoursList[currenDate.getHours()] 
        },
        {
            index: adaptiveTime(currenDate.getMinutes()),
            item: minutesList[adaptiveTime(currenDate.getMinutes())]
        }
    ]
    
    const {
      primaryValue = defaultValue,
      setValue,
      colors//: {
        //backgroundColor = 'black',
        //textColor = 'white',
        //separatorColor = 'white',
      //}
    } = props



    useEffect(()=>{
        setValue? setValue(defaultValue) : null
    })
  
    const setHours = (hour) => {
        primaryValue[0] = hour // {item, index}
        setValue? setValue(primaryValue) : null
    }
  
    const setMinutes = (minute) => {
        primaryValue[1] = minute // {item, index}
        setValue? setValue(primaryValue) : null
    }
  
    
  
    return (
      <View style={{flexDirection :'row', justifyContent: 'center', alignItems: 'center'}}>
        <TapticalPicker 
          data={hoursList}
          setValue={setHours}
          primaryIndex={primaryValue[0].index}
          pickerParams ={{
            width: 80,
            itemWidth: 80,
            inDisplay: 5,
            itemHeight: 40,    
            itemsMargin: 50,
            separatorHeight: 30,
            separatorMarginTop:  -3,
            transitionBoost: 3 //3.5
          }}
          {...colors}
        />
        <TapticalPicker 
          data={minutesList}
          setValue={setMinutes}
          primaryIndex={primaryValue[1].index}
          pickerParams ={{
            width: 80,
            itemWidth: 80,
            inDisplay: 5,
            itemHeight: 40,
            itemsMargin: 50,
            separatorHeight: 30,
            separatorMarginTop:  -3,
            transitionBoost: 3
          }}
          {...colors}
        />
        <Text style={{color: colors.textColor, fontSize: 30, bottom: 83, position: 'absolute'}}>:</Text>
      </View>
    )
}


export function TimerPicker(props){
    const hoursList =   ['01','02','03','04','05','06','07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']

    const {
      primaryValue = 0,
      setValue,
      colors//: {
        //backgroundColor = 'black',
        //textColor = 'white',
        //separatorColor = 'white',
      //}
    } = props

    useEffect(()=>{
        setValue? setValue({item: '01', index: 0}) : null
    })
  
    const setHours = (hour) => {
        //const result = [...primaryValue]
        //result[0] = hour // {item, index}
        setValue? setValue(hour) : null
    }

    return (
        <View style={{flexDirection :'row', justifyContent: 'center', alignItems: 'center'}}>
            <TapticalPicker 
                data={hoursList}
                setValue={setHours}
                primaryIndex={primaryValue}
                pickerParams ={{
                    width: 80,
                    itemWidth: 80,
                    inDisplay: 5,
                    itemHeight: 40,    
                    itemsMargin: 50,
                    separatorHeight: 30,
                    separatorMarginTop:  -3,
                    transitionBoost: 3 //3.5
                }}
                {...colors}
            />
        </View>
    )
}