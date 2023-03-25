import * as React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Platform,
  Button,
  Alert,
  Linking,
  ScrollView,
} from 'react-native';
import NfcProxy from './NFCproxy';
import NfcManager, { Ndef, NfcEvents, NfcTech} from 'react-native-nfc-manager';

//import qs from 'query-string';



const getTechList = (tag) => {
  let techs = [];
  if (Platform.OS === 'ios') {
    if (!tag.tech) {
      // it might happen when we use legacy `registerTagEvent`
      return ['Ndef'];
    }
    techs.push(tag.tech);
  } else {
    techs = tag.techTypes;
  }
  return techs.map((tech) => tech.replace(/android\.nfc\.tech\./, ''));
};


const TNF_MAP = {
  EMPTY: 0x0,
  WELL_KNOWN: 0x01,
  MIME_MEDIA: 0x02,
  ABSOLUTE_URI: 0x03,
  EXTERNAL_TYPE: 0x04,
  UNKNOWN: 0x05,
  UNCHANGED: 0x06,
  RESERVED: 0x07,
};

const RTD_MAP = {
  TEXT: 'T', // [0x54]
  URI: 'U', // [0x55]
  SMART_POSTER: 'Sp', // [0x53, 0x70]
  ALTERNATIVE_CARRIER: 'ac', //[0x61, 0x63]
  HANDOVER_CARRIER: 'Hc', // [0x48, 0x63]
  HANDOVER_REQUEST: 'Hr', // [0x48, 0x72]
  HANDOVER_SELECT: 'Hs', // [0x48, 0x73]
};

function tnfValueToName(value) {
  for (let name in TNF_MAP) {
    if (value === TNF_MAP[name]) {
      return name;
    }
  }
  return null;
}

function rtdValueToName(value) {
  value = value.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
  for (let name in RTD_MAP) {
    if (value === RTD_MAP[name]) {
      return name;
    }
  }
  return null;
}

let tnf_c = '/tnf'
let trd_c = '/trd'
let techs_c = '/techs'
let res_c = '/res'


function NFC_test(props) {
  const {
    navigation,
    AppStyle,
  } = props;
  const [supported, setSupported] = React.useState(null);
  const [enabled, setEnabled] = React.useState(null);
  const padding = 40;
  const width = Dimensions.get('window').width - 2 * padding;

  React.useEffect(() => {
    async function initNfc() {
      try {
        const success = await NfcProxy.init();
        setSupported(success);
        setEnabled(await NfcProxy.isEnabled());

        if (success) {
            /* 
          function onBackgroundTag(bgTag) {
            navigation.navigate('TagDetail', {tag: bgTag});
          }

          function onDeepLink(url, launch) {
            try {
              const customScheme = [
                'com.washow.nfcopenrewriter://', // android
                'com.revteltech.nfcopenrewriter://', // ios
              ].find((scheme) => {
                return scheme === url.slice(0, scheme.length);
              });

              if (!customScheme) {
                return;
              }

              url = url.slice(customScheme.length);

              // issue #23: we might have '?' in our payload, so we cannot simply "split" it
              let action = url;
              let query = '';
              let splitIdx = url.indexOf('?');

              if (splitIdx > -1) {
                action = url.slice(0, splitIdx);
                query = url.slice(splitIdx);
              }

              const params = qs.parse(query);
              if (action === 'share') {
                const sharedRecord = JSON.parse(params.data);
                if (sharedRecord.payload?.tech === NfcTech.Ndef) {
                  navigation.navigate('NdefWrite', {savedRecord: sharedRecord});
                } else if (sharedRecord.payload?.tech === NfcTech.NfcA) {
                  navigation.navigate('CustomTransceive', {
                    savedRecord: sharedRecord,
                  });
                } else if (sharedRecord.payload?.tech === NfcTech.NfcV) {
                  navigation.navigate('CustomTransceive', {
                    savedRecord: sharedRecord,
                  });
                } else if (sharedRecord.payload?.tech === NfcTech.IsoDep) {
                  navigation.navigate('CustomTransceive', {
                    savedRecord: sharedRecord,
                  });
                } else {
                  console.warn('unrecognized share payload tech');
                }
              }
            } catch (ex) {
              console.warn('fail to parse deep link', ex);
            }
          }

          // get the initial launching tag
          const bgTag = await NfcManager.getBackgroundTag();
          if (bgTag) {
            onBackgroundTag(bgTag);
          } else {
            const link = await Linking.getInitialURL();
            console.warn('DEEP LINK', link);
            if (link) {
              onDeepLink(link, true);
            }
          }

          // listen to other background tags after the app launched
          NfcManager.setEventListener(
            NfcEvents.DiscoverBackgroundTag,
            onBackgroundTag,
          );
            */

          // listen to the NFC on/off state on Android device
          if (Platform.OS === 'android') {
            NfcManager.setEventListener(
              NfcEvents.StateChanged,
              ({state} = {}) => {
                NfcManager.cancelTechnologyRequest().catch(() => 0);
                if (state === 'off') {
                  setEnabled(false);
                } else if (state === 'on') {
                  setEnabled(true);
                }
              },
            );
          }
          /*
          Linking.addEventListener('url', (event) => {
            if (event.url) {
              onDeepLink(event.url, false);
            }
          }); */
        }
      } catch (ex) {
        console.warn(ex);
        Alert.alert('ERROR', 'fail to init NFC', [{text: 'OK'}]);
      }
    }

    initNfc();
  }, [navigation]);


  const [tnf, setTnf] = React.useState('tnf-')
  const [trd, setTrd] = React.useState('trd-')
  const [techs, setTechs] = React.useState('ts-') //
  const [result, setResult] = React.useState('2 r-')

  

  function acceptTag(tag) {
    Alert.alert('ПРИНЯЛ', JSON.stringify(tag), [{text: 'OK'}]);
    const techs = getTechList(tag);
    techs_c = getTechList(tag);
    
    
    const ndef =
      Array.isArray(tag.ndefMessage) && tag.ndefMessage.length > 0
        ? tag.ndefMessage[0]
        : null;

    Alert.alert('ОБРАБОТАЛ', `${ndef}`, [{text: 'OK'}]);

    console.log('tag',tag)
    console.log('TECHNOLOGIES', techs)

    const tnfName = tnfValueToName(ndef.tnf);
    const rtdName = rtdValueToName(ndef.type);
    tnf_c = tnfValueToName(ndef.tnf);
    trd_c = rtdValueToName(ndef.type);

    Alert.alert('СЧИТАЛ', `${rtdName} ${tnfName} ${techs}`, [{text: 'OK'}]);

    console.log('tnfName', tnfName)
    console.log('tnfName', rtdName)

    setTnf(tnfName)
    setTrd(rtdName)
    setTechs(techs)

    Alert.alert('ПРОВЕРЯЮ', `${ndef.tnf}=${Ndef.TNF_WELL_KNOWN}`, [{text: 'OK'}]);
    if (ndef.tnf === Ndef.TNF_WELL_KNOWN) {
      if (rtdName === 'TEXT') {
        const text = Ndef.text.decodePayload(ndef.payload);
        //return <RtdTextPayload ndef={ndef} />;
        res_c = text;
        Alert.alert('ПОЛУЧИЛ', `${text}`, [{text: 'OK'}]);
        console.log(text)
        setResult(text)
      }
    }

  }

  function renderNfcButtons() {
    return (
      <View
        style={{
          //alignItems: 'stretch',
          //alignSelf: 'center',
          height: 500,
          width: 250,
        }}>
          <ScrollView
            style={{
              height: 400,
              width: 250,
            }}
          >
            <Text style={{marginTop: 20}}>*: {tnf} {tnf_c}</Text>
            <Text style={{marginTop: 20}}>*: {trd} {trd_c}</Text>
            <Text style={{marginTop: 20}}>*: {techs} {techs_c}</Text>

            <Text>res: {result} {res_c}</Text>
          </ScrollView>
        <Button
          title="READ NDEF"
          onPress={async () => {
            const tag = await NfcProxy.readTag();
            if (tag) {
              //navigation.navigate('TagDetail', {tag});
              acceptTag(tag)
            }
          }}
          style={{marginBottom: 10}}
        />

        <Button 
          title="WRITE NDEF"
          onPress={async () => {
            const value = JSON.stringify(AppStyle) //'GUSI GUSI га-га-га {:}#,10.9'
            await NfcProxy.writeNdef({type: 'TEXT', value: value});
          }}
        />
        
      </View>
    );
  }

  function renderNfcNotEnabled() {
    return (
      <View
        style={{
          //flex: 2,
          alignItems: 'stretch',
          alignSelf: 'center',
          height: 400,
          width: 300,
        }}
      >
        <Text style={{textAlign: 'center', marginBottom: 10}}>
          Your NFC is not enabled. Please first enable it and hit CHECK AGAIN
          button
        </Text>

        <Button
          title="GO TO NFC SETTINGS"
          onPress={() => NfcProxy.goToNfcSetting()}
          style={{marginBottom: 10}}
        />

        <Button
          title="CHECK AGAIN"
          onPress={async () => {
            setEnabled(await NfcProxy.isEnabled());
          }}
        />

      </View>
    );
  }

  console.log('nfc',supported, enabled )

  return (

      <View style={{flex: 1, padding}}>


        {supported && !enabled && renderNfcNotEnabled()}

        {supported && enabled && renderNfcButtons()}

      </View>

  );
}

export default NFC_test;