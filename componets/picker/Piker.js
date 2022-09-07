import React, {useState, useRef} from "react";
import { Text, View, FlatList, Animated } from 'react-native';

let timer;

const Piker = ({
  LanguageStore, 
  dataType, 
  initialListValue, 
  setPikValue,
  volumeDay  // !!! for dataType = 'day'
  }) => {

    //const [volumeDays, setVolumeDays] = useState(volumeDay)

    const widthPiker = dataType == 'month'?130: dataType == 'year'?70: 50;

    const dataBuilder = (LanguageStore, dataType) => {
        let volumeElements;
        let dataForList = [];
        let dataList = [];

        let date = new Date();
        let thisDay = date.getDay();
        let thisMonth = date.getMonth();
        let thisYear = date.getFullYear();

        // date picker

        if(dataType == 'day'){
            // volumeDay
            volumeElements = 62+5;//56+5
            for(let i = 1; i<62; i++){
              dataForList.push(`${i>9?i:'0'+String(i)}`)
          }
        }
        if(dataType == 'month'){
            volumeElements = 24+5;
            dataForList = LanguageStore.Calendar.ListMonthFullName;

        } 
        if(dataType == 'year'){
            volumeElements = 10+5;
            for(let i = thisYear; i<thisYear+10; i++){
              dataForList.push(`${String(i)}`)
          }
        } 
        
        // time picker

        if(dataType == 'hour'){
            volumeElements = 48+5;
            for(let i = 0; i<24; i++){
                dataForList.push(`${i>9?i:'0'+String(i)}`)
            }
        }
        if(dataType == 'minute'){
            volumeElements = 72+5;
            for(let i = 0; i<36; i++){
              let number;
              if(i % 6 != 0){
                //console.log(i)
                if(0 < i&&i < 6) {number = i*2 - 1}
                if(6 < i&&i < 12) {number = i*2 - 3}
                if(12 < i&&i < 18) {number = i*2 - 5}
                if(18 < i&&i < 24) {number = i*2 - 7}
                if(24 < i&&i < 30) {number = i*2 - 9}
                if(30 < i&&i < 36) {number = i*2 - 11}
                
              } else {
                number = i/6 *10
              }
              //console.log(number)
              dataForList.push(`${number>9?number:'0'+String(number)}`)
            }

        }

        // timer picker

        if(dataType == 'timer'){
          volumeElements = 48+5;
          for(let i = 1; i<25; i++){
              dataForList.push(`${i>9?i:'0'+String(i)}`)
          }
        }

        // number picker

        if(dataType == 'number'){
          volumeElements = 20+5;
          for(let i = 0; i<10; i++){
              dataForList.push(`${i}`)
          }
        }

        for(let i = 1; i<=volumeElements; i++){

            let titleElement;
            let modeElement;

            if(i >= 4 && i <= (volumeElements-1)/2+1){
                titleElement = dataForList[i-4];
                modeElement = '0';
            } else {
              titleElement = '';

              if(dataType != 'day' && dataType != 'year')
              { 
                if(i == 2){titleElement = dataForList[dataForList.length-2];}
                if(i == 3){titleElement = dataForList[dataForList.length-1];}
                if(i == (volumeElements-1)/2+2){titleElement = dataForList[0];}
                if(i == (volumeElements-1)/2+3){titleElement = dataForList[1];}
              }

              modeElement = 'false';
            }

            let element = 
            {               
                id: String(i),
                title: titleElement,
                mode: modeElement 
            }

            dataList.push(element)
        }
        //console.log(dataList)
        return dataList;
    }

    const data = dataBuilder(LanguageStore, dataType);
    
    const [centerId, setCenterId] = useState(null);
    
    const [listData, setListData] = useState(data)


    
    //
          //timer
    const [scrollEnabled, setScrollEnabled] = useState(false);
    const [number_1, setNumber_1] = useState('');
    const [number_0, setNumber_0] = useState('');

    const dow = () => {
      //console.log('*');
      setScrollEnabled(true);
    }

    if(number_0 != number_1){
      //console.log(number_1)
      setNumber_0(number_1);
      if (timer != undefined){
        clearTimeout(timer);
      } 
      timer = setTimeout(dow, 500)
    } 

    const scrollY = React.useRef(new Animated.Value(0)).current;

    const onViewRef = React.useRef((viewableItems)=> {
        if (
          viewableItems.viewableItems[0] != undefined &&
          viewableItems.viewableItems[1] != undefined &&
          viewableItems.viewableItems[2] != undefined &&
          viewableItems.viewableItems[3] != undefined &&
          viewableItems.viewableItems[4] != undefined 
          ){
          //console.log(viewableItems.viewableItems)
          if(viewableItems.viewableItems[2].item.mode == 'false'){
            if(parseInt(viewableItems.viewableItems[2].item.id) < 6){
              flatListRef.current.scrollToIndex({ animated: false, index: `${(data.length-5)/2}` })
              //console.log((data.length-5)/2)
            } else {
              flatListRef.current.scrollToIndex({ animated: false, index: '1' })
            }
            return;
          }

          let newObjects = [
          {
            id: viewableItems.viewableItems[0].item.id,
            title: viewableItems.viewableItems[0].item.title,
            mode: viewableItems.viewableItems[0].item.mode=='false'?'false':'2'
          },
          {
            id: viewableItems.viewableItems[1].item.id,
            title: viewableItems.viewableItems[1].item.title,
            mode: viewableItems.viewableItems[1].item.mode=='false'?'false':'3'
          },
          {
            id: viewableItems.viewableItems[2].item.id,
            title: viewableItems.viewableItems[2].item.title,
            mode: '4'
          },
          {
            id: viewableItems.viewableItems[3].item.id,
            title: viewableItems.viewableItems[3].item.title,
            mode: viewableItems.viewableItems[3].item.mode=='false'?'false':'3'
          },
          {
            id: viewableItems.viewableItems[4].item.id,
            title: viewableItems.viewableItems[4].item.title,
            mode: viewableItems.viewableItems[4].item.mode=='false'?'false':'2'
          },
          ]

          const newDATA = [...data];

          //if(volumeDays != undefined){console.log(volumeDays) }

          
          let datIndex_0 = data.findIndex((DAT) => DAT.id === newObjects[0].id);
          newDATA.splice(datIndex_0, 1, newObjects[0]);

          let datIndex_1 = data.findIndex((DAT) => DAT.id === newObjects[1].id);
          newDATA.splice(datIndex_1, 1, newObjects[1]);

          let datIndex_2 = data.findIndex((DAT) => DAT.id === newObjects[2].id);
          newDATA.splice(datIndex_2, 1, newObjects[2]);

          let datIndex_3 = data.findIndex((DAT) => DAT.id === newObjects[3].id);
          newDATA.splice(datIndex_3, 1, newObjects[3]);

          let datIndex_4 = data.findIndex((DAT) => DAT.id === newObjects[4].id);
          newDATA.splice(datIndex_4, 1, newObjects[4]);

          //setListData([]);
          setListData(newDATA);
          setCenterId(parseInt(viewableItems.viewableItems[2].item.id))

          //pikValue
          setNumber_1(`${parseInt(viewableItems.viewableItems[2].item.id)-3}`)

          //let timer;
          //clearTimeout(timer);
          //setTimeout(flatListRef.current.scrollToIndex({ animated: false, index: `${parseInt(viewableItems.viewableItems[2].item.id)-3}` }),200);

          let returnValue = viewableItems.viewableItems[2].item.title
          returnValue = dataType == 'timer'? parseInt(returnValue): returnValue
          //returnValue = dataType == 'day'? parseInt(returnValue): returnValue
          returnValue = dataType == 'month'? (1+LanguageStore.Calendar.ListMonthFullName.findIndex((month) => month == returnValue)) : returnValue
          returnValue = dataType == 'month'? returnValue>9?returnValue:`${'0'+returnValue}`  : returnValue
          setPikValue(returnValue)
        }
    })
    const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 10,  })

    const flatListRef = useRef()

    const renderItem = ({ item,index }) => {
      let rotateXItem = '0deg';
      let translateYItem = 0;
      let scaleItem = 0;
      let opacityItem = .1;

      let orientation = 1;

      let fontAccent = false;

      const inputRange = [
        // 30 - размер строки   
        (index-5) * 30,
        (index-4) * 30,
        (index-3) * 30,

        (index-2) * 30,

        (index-1) * 30,
        (index) * 30,
        (index+1) * 30,
        //(index+1) * 30,
        //(index+2) * 30,
      ]

      const inputRangeRotateX = [   
        '0deg',
        '0deg',
        '0deg',
        '0deg',
        '0deg',
      ]

      

      const opacity = scrollY.interpolate({
        inputRange,
        outputRange: [.2, .35, .55, 1, .55, .35, .2 ]
      })

      const scale = scrollY.interpolate({
        inputRange,
        outputRange: [.7, .9, .95, 1.1, .95, .9, .7 ]
      })

      const rotateX = scrollY.interpolate({
        inputRange,
        outputRange: ['-60deg','-50deg', '-40deg', '0deg', '40deg', '50deg', '60deg' ]
      })

      const translateY = scrollY.interpolate({
        inputRange,
        outputRange: [-85, -25, -5, 0, 5, 25, 85 ]
      })

      //console.log(scrollY == 0? '' : scrollY)

      if(centerId < parseInt(item.id)){orientation = -1}
      
      if(item.mode == '4'){
        rotateXItem = '0deg';
        translateYItem = 0;
        scaleItem = 1;
        opacityItem = 1;
        fontAccent = true;
      }
      if(item.mode == '3'){
        rotateXItem = `${orientation*40}deg`;
        translateYItem = 10*orientation;
        scaleItem = 0.97;
        opacityItem = 0.6;
      } 
      if(item.mode == '2'){
        rotateXItem = `${orientation*50}deg`;
        translateYItem = 52*orientation;
        scaleItem = 0.94;
        opacityItem = 0.45;
      }
      if(item.mode == '1'){
        rotateXItem = `${orientation*60}deg`;
        translateYItem = 153*orientation;
        scaleItem = 0.91;
        opacityItem = 0.3;
      }
      if(item.mode == '0'){
        rotateXItem = `${orientation*70}deg`;
        translateYItem = 323*orientation;
        scaleItem = 0.88;
        opacityItem = 0.2;
      }

      if(item.mode == 'false'){
        if(item.id == '3' || item.id == `${(data.length-5)/2+4}`){
          rotateXItem = `${orientation*40}deg`;
          translateYItem = 10*orientation;
          scaleItem = 0.97;
          opacityItem = 0.6;
        }
        if(item.id == '2' || item.id == `${(data.length-5)/2+5}`){
          rotateXItem = `${orientation*50}deg`;
          translateYItem = 52*orientation;
          scaleItem = 0.94;
          opacityItem = 0.45;
        }
      }
      

      //red days 

      if(dataType == 'day'){
        if(volumeDay != undefined){
          if(parseInt(item.id)-3 > volumeDay || parseInt(item.id) < 4 ){
            item.title = ''
          } else {
            if(item.title == '') {
              item.title = String(parseInt(item.id)-3)
            }
          }
        }
      }
      
      return (
        <Animated.View
          nativeID = {String(index)}
          style={{
            //marginBottom: 5,
            height: 30, 
            width: widthPiker,
            alignItems: 'center',//dataType == 'month'?'flex-start':'center',
            justifyContent: 'center',
            //backgroundColor: 'red',
            opacity,
            //transform: [  {scale: scale}]//,
            transform: [ 
              { scale: scale },
              { rotateX: rotateX},
              { translateY: translateY }
            ]

          }}
        >
          <Text 
            nativeID = {String(index)} 
            style={{
                fontSize: 20, 
                fontWeight: 'bold',//fontAccent?'bold':'normal'
                textAlign: 'center',
                textAlignVertical: 'top',
                //marginBottom: 
              }}
            >
              {item.title}
            </Text>
        </Animated.View>
        
      );
    }
    
    if(scrollEnabled){
      //скачки
      //flatListRef.current.scrollToIndex({ animated: true, index: number_1 })//scrollToOffset({ animated: true, offset: number_0})
    }

    

      return (
        <View style={{ alignItems: 'center', height: 150}}>        
            <View>
            <Animated.FlatList
              data={listData}
              renderItem={renderItem}
              keyExtractor={(item, index) => {
                return item.id
              }}  
              //initialNumToRender = {20}
              //removeClippedSubviews = {false}
              //disableIntervalMomentum = {true}
              //overScrollMode = "always"
              //snapToInterval = {1}
              initialScrollIndex = {
                dataType == 'minute' ?

                `${(Math.round(initialListValue*0.6+1))}` 
                :
                `${initialListValue+1}`
              }
              onViewableItemsChanged={onViewRef.current}
              viewabilityConfig={viewConfigRef.current}
              showsVerticalScrollIndicator = {false}

              //scrollEnabled = {scrollEnabled}

              ref={flatListRef}

              //onScrollBeginDrag = {}
              //onScrollEndDrag = {setScrollEnabled(true)} 
              bounces = {false}
              snapToInterval={30}
              /*
              onScroll = { (event) => {

                // Animated.event(
                //   [{nativeEvent: {contentOffset: {y: scrollY}}}],
                //  {useNativeDriver: true}
                //)

                const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {    
                  //return layoutMeasurement.height +  >= contentSize.height/2+90;
                  //let res = Math.ceil(contentOffset.y/30)*30
                  //res = Math.abs(res) == 0? 30: res
                  //setNumber_1(res)
                  //flatListRef.current.scrollToOffset({ animated: true, offset: number_1})
                }
                  //console.log()
                  //
                //isCloseToBottom(event.nativeEvent)
                setScrollEnabled(false)
              }}
              */
              onScroll = {
                Animated.event(
                  [{nativeEvent: {contentOffset: {y: scrollY}}}],
                  {useNativeDriver: true},
                  //{listener: () => {setScrollEnabled(false)}}
                )
              }
            />
            </View>
            <View style ={{position: 'absolute', width: widthPiker+1, height: 1.5, top: 62.5, backgroundColor: 'black',opacity: 0.5}}/>
            <View style ={{position: 'absolute', width: widthPiker+1, height: 1.5, top: 92.5, backgroundColor: 'black',opacity: 0.5}}/>
            
            
        </View>
      );
    
}

export default Piker;