import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, Animated } from "react-native";



const TextAnimate = ({
    text = 'Text', 
    textStyle = {}, 
    duration = 2000, 
    startCooefficient = 0.5

    }) => {

    //text === undefined? "0123456789" : text
    //textStyle == undefined? {} : textStyle
    //duration == undefined?  2000 : duration
    //startCooefficient == undefined? 0.5 : startCooefficient //0<...<=1

    const animatedValue = useRef(new Animated.Value(0)).current
    //const opacity = useSharedValue(0);
    
    const [data, setData] = useState([]);
    const [inputRange, setInputRange] = useState([]);
    const [statusAnimated, setStatusAnimated] =  useState(0);
    
    const newDataGenerate = () => {
        let dataList = [];
        let inputRangeList = [];

        for(let i = 0; i < text.length; i++){
            dataList.push({
                id: i+1,
                textValue: text[i]
            });
            let valueInputRangeList = Number(((1/text.length)*i)*startCooefficient)
            inputRangeList.push(Number(valueInputRangeList.toFixed(3)))
        };
        inputRangeList.push(1)
        setData(dataList);
        setInputRange(inputRangeList);
    };

    if(data.length === 0){
        newDataGenerate()
    };

    const startAnimation = (toValue) =>{
        Animated.timing(animatedValue, {
            toValue: toValue,
            duration: toValue === 1? duration : 10,
            useNativeDriver: true
        }).start(()=>{
            setStatusAnimated(toValue);
            if(toValue === 0){startAnimation(1);}
        })
    };

    useEffect(()=>{
        newDataGenerate();
        //console.log('upd')

        if(setStatusAnimated === 0){
            startAnimation(1);
        } else {
            startAnimation(0);
        }
        
    },[text])

    return (
        <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={({item, index})=>{
                //const inputRange = [0, 14.3, 28.6, ]

                let id = Number(item.id-1)
                let valueX = Number(inputRange[id])
                let outputRange = [];

                let k = 1/(1-valueX)
                let b = (1-k*(1+valueX))/2

                for(let i = 0; i < inputRange.length; i++){
                    let value = (i >= id ? (k*Number(inputRange[i]) + b) : 0)
                    value = ((i+1) === inputRange.length? 1 : value)
                    outputRange.push(Number(value.toFixed(3)))
                }
                //console.log('X',valueX)
                //console.log('k',k)
                //console.log('b',b)
                //console.log('i',inputRange)
                //console.log('o',outputRange)
                return(
                    <Animated.View
                        key = {String(item+index)}  
                        style={{
                            
                            opacity: animatedValue.interpolate({
                                inputRange: inputRange,
                               outputRange: outputRange
                            }),
                        }}
                    >
                        <Text style={textStyle}>{item.textValue}</Text>
                    </Animated.View>
                );
            }}
            horizontal = {true}
        />
    );
};

export default TextAnimate;