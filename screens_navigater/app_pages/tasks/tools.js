import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import store from "../../../app_redux_files/store";


export const categorys = ["today", "tomorrow", "week", "later", "overdue"]


const isBefore = (ld1, ld2, fn) => fn(new Date(...ld1).getTime() , new Date(...ld2).getTime()) 

const getCategory = (dateList) => {
    let resultCategory = "overdue"
    let resultCategoryIndex = 4 //overdue

    const currentDate = getDateInfo()

    const today = [...currentDate]
    today.splice(3, 3, /*last time ->*/  0, 0, 0);
    
    const tomorrow = [...today]
    tomorrow[2] += 1

    const tomorrow2 = [...today]
    tomorrow2[2] += 2
    
    const week = [...today]
    week[2] += 7

    if(isBefore(week, dateList, (a,b)=>a<b)){
        resultCategory = "later"
        resultCategoryIndex = 3
    }

    if(isBefore(dateList, tomorrow2, (a,b)=>a>=b) && isBefore(dateList, week, (a,b)=>a<=b)){
        resultCategory = "week"
        resultCategoryIndex = 2
    } 
    
    if(isBefore(dateList, tomorrow, (a,b)=>a>=b) && isBefore(dateList, tomorrow2, (a,b)=>a<b)){
        resultCategory = "tomorrow"
        resultCategoryIndex = 1
    }

    if(isBefore(dateList, today, (a,b)=>a>=b) && isBefore(dateList, tomorrow, (a,b)=>a<b)){
        resultCategory = "today"
        resultCategoryIndex = 0
    }

    return ({
        category: resultCategory, 
        index: resultCategoryIndex
    })
}


const sortCallback = (item_a, item_b) => {
    const a_c = new Date(...item_a.tracking.dateList).getTime()
    const b_c = new Date(...item_b.tracking.dateList).getTime()

    if ( a_c < b_c){return -1}
    if ( a_c > b_c ){return 1}
    return 0
}


export const createrTaksStructure = (taskList) => {
    const structure = []
    for(const task of taskList){
        const {category, index} = getCategory(task.tracking.dateList)
        if(structure[index]){
            const newData = [...structure[index].data, task]
            newData.sort(sortCallback)
            structure[index].data = newData
        } else {
            structure[index] = {
                category: category,
                data: [task]
            }
        }
    }
    return structure.filter(column=>column? true : false) 
}


export const isEqual = (item_1, item_2) => JSON.stringify(item_1) == JSON.stringify(item_2)

/* 
export function getTasks(index){
    const rstore = store.getState();
    const data = index !== undefined? rstore.tasksData[index] : rstore.tasksData
    return data
}
*/

export const getDateInfo = (fromDate) => {
    const date = fromDate?? new Date()

    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()

    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();

    const dateList = [year, month, day, hours, minutes, seconds]

    return dateList
}

