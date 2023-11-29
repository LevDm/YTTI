import { useCallback } from 'react';
import { memo } from 'react';
import { useRef, useState, useEffect} from 'react';

import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { Text } from 'react-native';
import { View, StyleSheet, Image } from 'react-native';

import { UNSPLASH_API_ACCESS_KEY, UNSPLASH_API_SECRET_KEY } from "react-native-dotenv"

const url = `https://api.unsplash.com/photos/random?count=1`

const RectLoader = (props) => {
    const {
      size, 
      bc,
      fc
    } = props
    
    return (
        <ContentLoader 
            style={{
                position: 'absolute'
            }}
            speed={1}
            width={size.w}
            height={size.h}
            viewBox="0 0 300 400"
            backgroundColor={bc.value}
            foregroundColor={fc.value}
        >
            <Rect x="0" y="0" rx="0" ry="0" width="300" height="400"/> 
        </ContentLoader>
    )
}
  

const ImageBackground = memo((props) => {
    const {
        uiTheme,
        componentSize
    } = props 

    const [photo, setPhoto] = useState(undefined)
    const loadind = useRef(0)


    useEffect(() => {
        if(!photo && loadind.current == 0){
            console.log('LOAD -----', photo , loadind.current)
            loadind.current = 0.5
            try{
                fetch(url, {
                    method: "GET",
                    headers: {
                        'Authorization': `Client-ID ${UNSPLASH_API_ACCESS_KEY}`
                    },  
                })
                .then((response) => response.json())
                .then((json) =>{
                    const url = json[0].urls.regular// small
                    console.log( json[0].urls.regular)
                    setPhoto( url)
                })
                .catch((error) => console.error(error))
                .finally(()=>{
                    loadind.current = 1
                })
            } catch {

            }
        }
    }, [])

    const {
        basics: {
            neutrals: {
                secondary: basicNS,
                tertiary: basicNT,
            },
            accents: {
                secondary: basicAS,
                tertiary: basicAT,
            }
        },
    } = uiTheme

    const {
        h: componentHeight, 
        w: componentWidht
    } = componentSize

    return (
        <View
            style={[StyleSheet.absoluteFill, {

            }]}
        >
            {photo && 
                <>
                <Image
                    source={{
                        uri: photo,
                    }}
                    blurRadius={2}
                    //resizeMode='contain'
                    style={{
                        flex: 1,
                        opacity: 0.24
                    }}
                />
                <Text
                    style={{
                        position: 'absolute',
                        fontSize: 8,
                        color: 'white',
                        opacity: 0.5,
                        bottom: 2,
                        right: 30
                    }}
                >
                    Unsplash Images
                </Text>
                </>   
            }
            {!photo && <RectLoader size={componentSize} bc={basicAS} fc={basicNS}/>}
        </View>
    )
})
export default ImageBackground