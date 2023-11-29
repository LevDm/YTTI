import React, {useState, useEffect, useRef} from "react";

import {Text, Pressable, Animated, View,Button, Platform, Image, Modal, Dimensions, FlatList, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {connect} from 'react-redux';
import mapStateToProps from "../../../app_redux_files/stateToProps";
import mapDispatchToProps from "../../../app_redux_files/dispatchToProps";
import store from "../../../app_redux_files/store";

import dataRedactor from "../../../app_async_data_manager/data_redactor";


import Constants from "expo-constants";

import { listsHorizontalProximity } from "../../../app_values/AppDefault";


const Timetable = (props) => {

  return (
    <View
      style = {{
        justifyContent: 'center',
        alignItems: 'center',
       
      }}
    >
    
    </View>
  );
    
}
export default connect(mapStateToProps('N_SCREEN'),mapDispatchToProps('N_SCREEN'))(Timetable);


