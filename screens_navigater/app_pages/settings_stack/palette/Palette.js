import React, {useState, useEffect, useRef} from "react";

import {
    Text, 
    Pressable, 
    Animated, 
    View,
    Button, 
    Platform, 
    Image, 
    Dimensions, 
    FlatList, 
    SafeAreaView, 
    TouchableOpacity, 
    StyleSheet
} from 'react-native';

import store from "../../../../redux_files/store";
import {connect} from 'react-redux';
import mapStateToProps from "../../../../redux_files/stateToProps";
import mapDispatchToProps from "../../../../redux_files/dispatchToProps";

import { BasePressable } from "../../../../general_components/base_components/BaseElements";

import themesColorsAppList, { themesApp } from "../../../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../../../app_values/Languages";

const Palette = (props) => {

  const back = () => {
    props.r_setHideMenu(false)
    props.navigation.goBack()
  }

  //console.log(props.route.params.themeIndex)


  return (
    <View style = {{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>{themesApp[props.route.params.themeIndex]}</Text>
      <BasePressable
        type='i'
        icon={{name: "keyboard-backspace", size: 30, color: 'black'}}
        onPress={back}
      /> 
    </View>
  );
    
}
export default connect(mapStateToProps('PALETTE_SCREEN'), mapDispatchToProps('PALETTE_SCREEN'))(Palette);