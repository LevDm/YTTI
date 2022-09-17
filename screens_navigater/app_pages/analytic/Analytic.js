import React, {useState, useEffect, useRef} from "react";

import {Text, Pressable, Animated, View,Button, Platform, Image, Dimensions, FlatList, SafeAreaView, TouchableOpacity, StyleSheet} from 'react-native';


import * as Location from 'expo-location';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Analytic = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  ///

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location)
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    
  }

  return (
    <View style = {{backgroundColor: 'red', flex: 1}}>
      {location != null &&
      <Text>{location.coords.latitude},{location.coords.longitude}</Text>
      }
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <Text>Your expo</Text>
        <Text>Your expo push token: {expoPushToken}</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Title: {notification && notification.request.content.title} </Text>
          <Text>Body: {notification && notification.request.content.body}</Text>
          <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
        </View>
        <Button
          title="Press to schedule a notification"
          onPress={async () => {
            await schedulePushNotification();
          }}
        />
      </View>
    </View>
  );
    
}

export default Analytic;

async function schedulePushNotification() {
  console.log('async push')
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  console.log('async reg')
  let token = 'C7QfUUEc4txJFhn5KmdSDV';
  //MediaLibrary.getPermissionsAsync() and MediaLibrary.requestPermissionsAsync().
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }
  
  //token = 'C7QfUUEc4txJFhn5KmdSDV';

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}