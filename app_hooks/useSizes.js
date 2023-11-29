import Constants from "expo-constants";
import { Dimensions, useWindowDimensions } from "react-native";

export const getNavigationBarHeight = (orientation = 'height') => {

    let dec = Math.abs(Dimensions.get('screen')[orientation] - (Dimensions.get('window')[orientation]))
    let reverse = false


    //console.log('osbar', dec)

    if(dec > 100){
        const newOrientation = orientation == 'height'? 'width' : 'height'
        dec = Math.abs( Dimensions.get('screen')[newOrientation] - (Dimensions.get('window')[newOrientation]) )
        reverse = true
    }

    const result =  Math.abs( dec - ((!reverse && orientation == 'height')?Constants.statusBarHeight:0))

    //console.log('osbar', result)

    return (
        result
    )
}


import {useDeviceOrientation} from '@react-native-community/hooks'



function useSizes(){
    const {width, height, scale, fontScale} = useWindowDimensions()

    const screen = Dimensions.get('screen')
    const window = Dimensions.get('window')

    const orientation = { portrait: 'p', landscape: 'l'}[useDeviceOrientation()]
    //console.log('orientation', orientation)
    const osHeights = {
        statusBar: Constants.statusBarHeight,
        navigationBar: getNavigationBarHeight(orientation == 'p'? 'height' : 'width')
    }

    const result = { width, height, osHeights}

    return result
}

export default useSizes