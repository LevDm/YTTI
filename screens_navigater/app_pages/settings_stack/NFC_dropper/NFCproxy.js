import {Platform, Alert} from 'react-native';
import NfcManager, {
  NfcTech,
  Ndef,
  NfcEvents,
  NfcError,
} from 'react-native-nfc-manager';

import {getOutlet} from 'reconnect.js';

const withAndroidPrompt = (fn) => {
  async function wrapper() {
    try {
      if (Platform.OS === 'android') {
        getOutlet('androidPrompt').update({
          visible: true,
          message: 'Ready to scan NFC',
        });
      }

      const resp = await fn.apply(null, arguments);

      if (Platform.OS === 'android') {
        getOutlet('androidPrompt').update({
          visible: true,
          message: 'Completed',
        });
      }

      return resp;
    } catch (ex) {
      throw ex;
    } finally {
      if (Platform.OS === 'android') {
        setTimeout(() => {
          getOutlet('androidPrompt').update({
            visible: false,
          });
        }, 800);
      }
    }
  }

  return wrapper;
};

const handleException = (ex) => {
  if (ex instanceof NfcError.UserCancel) {
    // bypass
  } else if (ex instanceof NfcError.Timeout) {
    Alert.alert('NFC Session Timeout');
  } else {
    console.warn(ex);

    if (Platform.OS === 'ios') {
      NfcManager.invalidateSessionWithErrorIOS(`${ex}`);
    } else {
      Alert.alert('NFC Error', `${ex}`);
    }
  }
};

class NfcProxy {
  async init() {
    const supported = await NfcManager.isSupported();
    if (supported) {
      await NfcManager.start();
    }
    return supported;
  }

  async isEnabled() {
    return NfcManager.isEnabled();
  }

  async goToNfcSetting() {
    return NfcManager.goToNfcSetting();
  }

  readTag = withAndroidPrompt(async () => {
    let tag = null;

    try {
      await NfcManager.requestTechnology([NfcTech.Ndef]);

      tag = await NfcManager.getTag();
      tag.ndefStatus = await NfcManager.ndefHandler.getNdefStatus();

      if (Platform.OS === 'ios') {
        await NfcManager.setAlertMessageIOS('Success');
      }
    } catch (ex) {
      // for tag reading, we don't actually need to show any error
      console.log(ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }

    return tag;
  });

  writeNdef = withAndroidPrompt(async ({type, value}) => {
    let result = false;

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef, {
        alertMessage: 'Ready to write some NDEF',
      });

      let bytes = null;
      if (type === 'TEXT') {
        bytes = Ndef.encodeMessage([Ndef.textRecord(value)]);
      } 

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);

        if (Platform.OS === 'ios') {
          await NfcManager.setAlertMessageIOS('Success');
        }

        result = true;
      }
    } catch (ex) {
      handleException(ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }

    return result;
  });

}

export default new NfcProxy();