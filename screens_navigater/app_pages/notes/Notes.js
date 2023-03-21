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

import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
  GestureDetector,
  Gesture
} from 'react-native-gesture-handler';

import Reanimated, {
  interpolateColor,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  event,
  Extrapolation,
} from 'react-native-reanimated';

import { LinearGradient } from "expo-linear-gradient";

import Constants from "expo-constants";

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');
const statusBarHeight = Constants.statusBarHeight+1

export default Notes = (props) => {

  return (
    <View style = {{ flex: 1, justifyContent: 'center', alignItems: 'center',}}>
      
    </View>
  );
}



