import React, {useState} from "react";

import {Text, Pressable, View, StyleSheet} from 'react-native';
import ThemeColorsAppList from "./../styles/ColorsApp"
const ColorsApp = ThemeColorsAppList[0]
import {connect} from 'react-redux';
import mapStateToProps from "../../redux_files/stateToProps";
import mapDispatchToProps from "../../redux_files/dispatchToProps";

import store from "../../redux_files/store";

const BasePressable = ({
    type,
    icon,
    text,
    textStyle,
    style, 
    onPress,
    onLongPress,
    direction, //column || row(-reverse)
    rippleColor,
    },
    props
    ) => {
    icon = (icon == undefined? {} : icon)
    type = (type == undefined? 'ti' : type)
    //icon.name = (icon.name == undefined? "border-none-variant" : icon.name)
    //icon.size = (icon.size == undefined? 25 : icon.size)
    //icon.color = (icon.color == undefined? ColorsApp.symbolDark : icon.color)

    //text = (text == undefined? 'Text' : text)
    
    //console.log(store.getState());

    //КОСЯК 
    //не проходят пропсы редакса -- используется редакс стор напрямую 
    const [appStyle, setAppStyle] = useState(props.appStyle == undefined?store.getState().appStyle : props.appStyle);

    store.subscribe(() => {
        let stor = store.getState();

        if (stor.appStyle != appStyle) {
            setAppStyle(stor.appStyle)
        }
        //console.log(appStyle);
    })

    //{borderRadius: appStyle.borderRadius}
    

    return (
        <View style = {[styles.area, style, {borderRadius: appStyle.borderRadius}]}>
            
        </View>               
    )
}

export default connect(mapStateToProps("BASE_PRESSABLE"),mapDispatchToProps("BASE_PRESSABLE"))(BasePressable);


const styles = StyleSheet.create({
    area: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 30,
        minWidth: 30,
        //alignContent: 'center',
        //borderRadius: 12,
        //backgroundColor: 'blue',
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //alignContent: 'center', 
        //borderRadius: 12,
        height: '100%',
        width: '100%',
        //backgroundColor: 'grey',
    },
    text: {
        fontSize: 20,
    }
});