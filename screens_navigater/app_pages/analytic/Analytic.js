import React, {useState, useEffect, useRef} from "react";

import {Text, Pressable, Animated, View,Button, Platform, Image, Modal, Dimensions, FlatList, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {connect} from 'react-redux';
import mapStateToProps from "../../../app_redux_files/stateToProps";
import mapDispatchToProps from "../../../app_redux_files/dispatchToProps";
import store from "../../../app_redux_files/store";

import dataRedactor from "../../../app_async_data_manager/data_redactor";

import { 
    BasePressable,
    BaseWindow,
    BaseCheckBox,
    BaseSwitch 
} from "../../../general_components/base_components/BaseElements";

import themesColorsAppList, {themesApp} from "../../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../../app_values/Languages";

import Constants from "expo-constants";

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

const statusBarHeight = Constants.statusBarHeight+1

import { listsHorizontalProximity } from "../../../app_values/AppDefault";

const notactions = [
  'aaaaa', 'bbbbb', 'ccccc', 'aaaaa', 'bbbbb', 'ccccc', 'aaaaa', 'bbbbb', 'ccccc', 'aaaaa', 'bbbbb', 'ccccc', 'aaaaa', 'bbbbb', 'ccccc', 'aaaaa', 'bbbbb', 'ccccc', 'aaaaa', 'bbbbb', 'ccccc', 'aaaaa', 'bbbbb', 'ccccc',
  'aaaaa', 'bbbbb', 'ccccc', 'aaaaa', 'bbbbb', 'ccccc', 'aaaaa', 'bbbbb', 'ccccc', 'aaaaa', 'bbbbb', 'ccccc', 'aaaaa', 'bbbbb', 'ccccc', 'aaaaa', 'bbbbb', 'ccccc',
]

const ANCET = [
  {
    title: 'Вы заметили изменения в дизайне интерфейса приложения?',
    res: null,
    answers: [
      {text: 'Да, изменения в дизайне интерфейса сделали его более привлекательным', point: 1}, 
      {text: 'Изменения незначительно заметны', point: 0.75}, 
      {text: 'Не уверен(а), заметил(а) ли я изменения', point: 0.5}, 
      {text: 'Нет, изменения не заметны', point: 0.25},  
      {text: 'Мне безразлично, как выглядит интерфейс', point: 0},
    ] 
  },
  {
    title: 'Как вы оцениваете результаты изменений в интерфейсе приложения?',
    res: null,
    answers: [
      {text: 'Очень доволен(а), результаты изменений превзошли мои ожидания', point: 1}, 
      {text: 'Доволен(а), изменения частично улучшили интерфейс', point: 0.75}, 
      {text: 'Нейтрально, изменения незначительны ', point: 0.5}, 
      {text: 'Не очень доволен(а), изменения не оправдали моих ожиданий', point: 0.25},  
      {text: 'Совсем не доволен(а), изменения не изменили интерфейс', point: 0},
    ] },
  {
    title: 'Насколько легко вам удалось настроить интерфейс приложения под свои предпочтения?',
    res: null,
    answers: [
      {text: 'Очень легко, я справился(лась) без проблем', point: 1}, 
      {text: 'Достаточно легко, но некоторые настройки были непонятными', point: 0.75}, 
      {text: 'Сложно, но я смог(ла) настроить интерфейс', point: 0.5}, 
      {text: 'Очень сложно, я потратил(а) много времени на настройку интерфейса', point: 0.25},  
      {text: 'Я не смог(ла)  настроить интерфейс ', point: 0},
    ] },
  {
    title: 'Насколько легко вам было выбрать нужные изменения в интерфейсе приложения?',
    res: null,
    answers: [
      {text: 'Я сразу выбрал(а) нужные изменения', point: 1}, 
      {text: 'Не сразу, но я справился(лась) с выбором изменений', point: 0.75}, 
      {text: 'Выбор изменений был для меня не сложным, но и не простым', point: 0.5}, 
      {text: 'Сложно, я потратил(а) много времени на выбор изменений', point: 0.25},  
      {text: 'Очень сложно, я не смог(ла) найти нужные изменения', point: 0},
    ]},
  {
    title: 'Как вы оцениваете изменения всплывающих кнопок в использовании интерфейса приложения?',
    res: null,
    answers: [
      {text: 'Всплывающие кнопки стали более удобными и их легче использовать', point: 1}, 
      {text: 'Я заметил(а) незначительные улучшения в использовании всплывающих кнопок', point: 0.5}, 
      {text: 'Использование всплывающих кнопок для меня не изменилось', point: 0}, 

    ]},
  {
    title: 'Как вы оцениваете изменения навигационного меню  в использовании интерфейса приложения?',
    res: null,
    answers: [
      {text: 'Навигационное меню стало более удобным и его легче использовать', point: 1}, 
      {text: 'Я заметил(а) улучшения в использовании навигационного меню', point: 0.5}, 
      {text: 'Использование навигационного меню не изменилось', point: 0}, 

    ]},
  {
    title: 'Удовлетворяет ли имеющееся количество настроек ваши предпочтения?',
    res: null,
    answers: [
      {text: 'Количество настроек превышает количество моих предпочтений', point: 1}, 
      {text: 'Да, настроек достаточно для выполнения моих предпочтений', point: 0.75}, 
      {text: 'Настроек вполне достаточно, но немного не хватает для выполнения моих предпочтений', point: 0.5}, 
      {text: 'Немного, но я смог(ла) настроить интерфейс по своим предпочтениям', point: 0.25},  
      {text: 'Нет, мне не хватает настроек для выполнения моих предпочтений', point: 0},
    ] 
  },
  {
    title: 'Как важно для вас иметь возможность изменять интерфейс приложения под свои предпочтения?',
    res: null,
    answers: [
      {text: 'Для меня важно иметь возможность изменять интерфейс', point: 1}, 
      {text: 'Не значительно, но я бы предпочел(а) иметь возможность изменять интерфейс', point: 0.5}, 
      {text: 'Не важно, я считаю, что это не нужная функция в приложении', point: 0},
    ] 
  },

]

const Analytic = (props) => {
  
  const {
    tests,
    r_setTests
  } = props

  const [allTests, setAllTests ] = useState(tests)

  store.subscribe(() => {
    const jstore = store.getState();


    if (allTests != jstore.tests){
        setAllTests(jstore.tests);
    }

  })

  const clear = () => {
    AsyncStorage.setItem("storedTests", JSON.stringify([])).then(() => {
      r_setTests([]);
      setAllTests([]);
    }).catch((error) => console.log(error));
  }

  const getDateInfo = () => {
    const date = new Date()

    const hours = date.getHours()
    const minutes = date.getMinutes()

    const month = 1+date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();

    const currentDate = {

        minutes: minutes,
        hours:  hours,
        numberWeekDay: date.getDay(),
        day: day,
        month: `${month>9?month:'0'+month}`,
        year: year,
        
        string: date.toString(),
        source: date,

        formatTime: `${hours>9?hours:'0'+hours}:${minutes>9?minutes:'0'+minutes}`,
        formatDate: `${day>9?day:'0'+day}.${month>9?month:'0'+month}.${year}`
    }
    //console.log(currentDate, date)
    return currentDate
  }
  
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const randTasks_1 = ['Подготовить костюм', 'Запустить стирку', 'Разгрузить стиралку']
  const randTasks_2 = ['Помыть посуду', 'Напомнить Олегу', 'Запустить пылесос']
  const randTasks_3 = ['Купить фрукты', 'Купить пиво', 'Купить перекус']

  const randTasks_4 = ['забрать посылку','проверить почту', 'передать отчет']
  const randTasks_5 = ['купить попкорн ', 'оплатить спортзал', 'забрать документы']
  const randTasks_6 = ['загрузить фильм', 'купить оливки', 'разморозить мясо']
  
  const randTasks_7 = ['заказать фильтры','согласовать выбор', 'доделать работу']


  const testA = () => {

    const date = getDateInfo()

    const newToTime = '23:59'
    const newToDate =  date.formatDate
    const newFireTarget = '1'

    const to = new Date(date.source)

    const t = newToTime.split(':')
    const d = newToDate.split('.')
    //to.setHours(])
    to.setUTCHours(t[0], t[1], 59, 999)
    to.setUTCDate(d[0])
    //to.setMinutes()
    //to.setDate(d[0])
    to.setMonth(d[1]-1)
    to.setFullYear(d[2])

    const newTasks = [
      {
        title: randTasks_1[getRandomInt(2)],
        toTime: newToTime,
        toDate: newToDate,
        fireTarget: newFireTarget,
        date: to,
        dateString: to.toDateString(),
        key: `1`
      },
      {
        title: randTasks_2[getRandomInt(2)],
        toTime: newToTime,
        toDate: newToDate,
        fireTarget: newFireTarget,
        date: to,
        dateString: to.toDateString(),
        key: `2`
      },
      {
        title: randTasks_3[getRandomInt(2)],
        toTime: newToTime,
        toDate: newToDate,
        fireTarget: newFireTarget,
        date: to,
        dateString: to.toDateString(),
        key: `3`
      },
      {
        title:  randTasks_7[getRandomInt(2)],
        toTime: newToTime,
        toDate: newToDate,
        fireTarget: newFireTarget,
        date: to,
        dateString: to.toDateString(),
        key: `4`
      },

    ]
    AsyncStorage.setItem("storedTasks", JSON.stringify(newTasks)).then(() => {
      props.r_setTasksList(newTasks)
    }).catch((error) => console.log(error));
  }



  const testB = () => {
    const date = getDateInfo()

    const newToTime = '23:59'
    const newToDate =  date.formatDate
    const newFireTarget = '1'

    const to = new Date(date.source)

    const t = newToTime.split(':')
    const d = newToDate.split('.')
    //to.setHours(])
    to.setUTCHours(t[0], t[1], 59, 999)
    to.setUTCDate(d[0])
    //to.setMinutes()
    //to.setDate(d[0])
    to.setMonth(d[1]-1)
    to.setFullYear(d[2])

    const newTasks = [
      {
        title:  randTasks_1[getRandomInt(2)],
        toTime: newToTime,
        toDate: newToDate,
        fireTarget: newFireTarget,
        date: to,
        dateString: to.toDateString(),
        key: `1`
      },
      {
        title:  randTasks_2[getRandomInt(2)],
        toTime: newToTime,
        toDate: newToDate,
        fireTarget: newFireTarget,
        date: to,
        dateString: to.toDateString(),
        key: `2`
      },
      {
        title:  randTasks_3[getRandomInt(2)],
        toTime: newToTime,
        toDate: newToDate,
        fireTarget: newFireTarget,
        date: to,
        dateString: to.toDateString(),
        key: `3`
      },
      {
        title:  randTasks_4[getRandomInt(2)],
        toTime: newToTime,
        toDate: newToDate,
        fireTarget: newFireTarget,
        date: to,
        dateString: to.toDateString(),
        key: `4`
      },
      {
        title: randTasks_5[getRandomInt(2)],
        toTime: newToTime,
        toDate: newToDate,
        fireTarget: newFireTarget,
        date: to,
        dateString: to.toDateString(),
        key: `5`
      },
      {
        title:  randTasks_6[getRandomInt(2)],
        toTime: newToTime,
        toDate: newToDate,
        fireTarget: newFireTarget,
        date: to,
        dateString: to.toDateString(),
        key: `6`
      },
      {
        title: randTasks_7[getRandomInt(2)],
        toTime: newToTime,
        toDate: newToDate,
        fireTarget: newFireTarget,
        date: to,
        dateString: to.toDateString(),
        key: `7`
      },
    ]
    AsyncStorage.setItem("storedTasks", JSON.stringify(newTasks)).then(() => {
      props.r_setTasksList(newTasks)
    }).catch((error) => console.log(error));
  }

  const [visible, setVisibe ] = useState(false)

  const openModal = () => {

    setVisibe(true)
  }

  const [ancetAnswers, setAncetAnswers ] = useState(ANCET)


  const Item = ({item, index}) =>{
    const duoble = ancetAnswers[index]
    const [select, setSelect] = useState(duoble.res != null? item.answers.findIndex((el)=>duoble.res == el.point) : null)

    const change = (answer) => {
      setSelect(answer)
    }

    return (
      <View
        key={Math.random()}
        style={{
          marginVertical: 20,
          width: deviceWidth,
          paddingHorizontal: 8,
          minHeight: 100
        }}
      >
        <Text>
        {index+1}. {item.title}
        </Text>
        {item.answers.map((l_item, local_index)=> (
          <Pressable
            key={Math.random()}
            style={{
              height: 40,
              marginVertical: 2,
              backgroundColor: 'lightblue',
              opacity: select != null? (local_index == select? 1 : 0.5) : 1
            }}
            onPress={()=>{
              change(local_index)
              const copy = [ ... ancetAnswers]
              copy[index].res = l_item.point
              setAncetAnswers(copy)
            }}
          >
            <Text>
              {local_index+1} {l_item.text}
            </Text>
          </Pressable>
        )) }
      </View>
    )
  }

  return (
    <View
      style = {{
        paddingTop: statusBarHeight,
        justifyContent: 'center',
        alignItems: 'center',
       
      }}
    >
      <FlatList
        style = {{
          //backgroundColor: 'grey',
          height: deviceHeight*0.85,
          width: deviceWidth-16
        }}
        data={allTests}
        renderItem={({index, item})=>{
          const {
            id,
            actions,
            start,
            stop,
            time
          } = item

          const strActions = (actions.map((item, index)=>`|${item.title}//${ ((item.checkPoint - start)/1000).toFixed(2) } с|`)).join(' > ')

          return (
            <View
              key = {id+index}
              style = {{
                marginTop: 10,
                backgroundColor: 'white',
                padding: 8,
                borderWidth: 1
              }}
            >
              <Text>{id}//{time? String((time/1000).toFixed(2)) + ' с': 'идёт сейчас'}</Text>
              <Text>{strActions}</Text>
            </View>
            
          )
        }}
      />
      <View
        style = {{
          marginTop: 20,
          width: '90%',
          flexDirection: 'row',
          justifyContent: 'space-around'
          
        }}
      >
        <Button 
          title="удалить всё"
          onPress={clear}
        />

        <Button 
          title="тест А"
          onPress={testA}
        />

        <Button 
          title="тест Б"
          onPress={testB}
        />

        <Button 
          title="анкета"
          onPress={openModal}
        />
      </View>
      <Modal
        visible={visible}

      >
        <View 
          slyle ={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center'
          }}
        >
          <FlatList
            style={{
              height: deviceHeight*0.85,
              width: deviceWidth
            }}
            data={ANCET}
            renderItem={({item, index})=>{
              return (
                <Item item={item} index={index}/>
              )
            }}
          />
          
          <FlatList
            horizontal = {true}
            data={ancetAnswers}
            renderItem={({item, index})=>{
              return (
                <View
                  key={Math.random()}
                  style={{
                    marginHorizontal: 5,
                    backgroundColor: 'lightgreen',
                    alignItems: 'center',
                    padding: 3
                  }}
                >
                  <Text>
                    В - {index+1}
                  </Text>
                  <Text>
                    {item.res != null? item.res : '?'}
                  </Text>
                </View>
              )
            }}
          />
          <Button 
            title="закрыть"
            onPress={()=>{setVisibe(false)}}
          />
          <Button 
            title="сбросить ответы"
            onPress={()=>{setAncetAnswers(ANCET)}}
          />
        </View>
      </Modal>
    </View>
  );
    
}
export default connect(mapStateToProps('N_SCREEN'),mapDispatchToProps('N_SCREEN'))(Analytic);


