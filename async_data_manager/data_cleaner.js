import AsyncStorage from "@react-native-async-storage/async-storage";

const dataCleaner = (jsonStoreName) => {
    console.log('>ASYNC_CLEANER_APP_DATA>')
    AsyncStorage.setItem(jsonStoreName, JSON.stringify()).then(() => {
        console.log(`>>${jsonStoreName.toUppeCase()}_CLEARED`)
    }).catch((error) => console.log(error));
}

export default dataCleaner;