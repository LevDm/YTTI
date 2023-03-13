import React, {useState, useEffect, useRef, useMemo} from "react";

import {
  Text,
  Pressable, 
  View,
  Dimensions, 
  FlatList, 
  StyleSheet,
  useWindowDimensions
} from 'react-native';

import Constants from "expo-constants";
const {deviceHeight, deviceWidth }= Dimensions.get('window')
const statusBarHeight = Constants.statusBarHeight+1

export default Timetable = (props) => {

  return (
    <View style = {{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      
  
    </View>
  );
}

