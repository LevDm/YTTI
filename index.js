import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

if (typeof(global.HermesInternal) === "undefined") {
    console.log("Hermes is not enabled");
} else {
    console.log("Hermes is enabled");
}

registerRootComponent(App);
