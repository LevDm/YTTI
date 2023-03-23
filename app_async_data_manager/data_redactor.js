import AsyncStorage from "@react-native-async-storage/async-storage";

const dataRedactor = (jsonStoreName,dataForSave) => {
    console.log('>ASYNC_REDACTOR_APP_DATA>')
    console.log(dataForSave)
    AsyncStorage.setItem(jsonStoreName, JSON.stringify(dataForSave)).then(() => {
        console.log(`>>NEW_VALUE_SET_TO_${String(jsonStoreName).toUpperCase()}`)
    }).catch((error) => console.log(error));
}

export default dataRedactor;