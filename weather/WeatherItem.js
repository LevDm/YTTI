import React from "react";

import {Text, Pressable, Animated, ActivityIndicator, View, Image,Dimensions, StyleSheet} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Reanimated, {
    useAnimatedStyle,
    useAnimatedProps,
    useDerivedValue
} from "react-native-reanimated";


import { ICONS_SET } from "../app_values/AppDefault";

import SkiaViewDisign from "../general_components/base_components/SkiaViewDisign";
import useLanguage from "../app_hooks/useLanguage";

const WeatherItem = (props) => {

    const {
        item, 
        index = 0,
        elements,

        size,

        uiStyle,
        uiTheme,

    } = props


    const {
        basics: {
            neutrals: {
                primary: basicNP,
                secondary: basicNS,
                tertiary: basicNT,
            },
            accents: {
                primary: basicAP,
                secondary: basicAS,
                tertiary: basicAT,
                quaternary: basicAQ
            }
        },
        texts: {
            neutrals: {
                primary: textNP,
                secondary: textNS,
                tertiary: textNT,
            },
            accents: {
                primary: textAP,
                secondary: textAS,
                tertiary: textAT,
            }
        },
        icons: {
            neutrals: {
                primary: iconNP,
                secondary: iconNS,
                tertiary: iconNT,
            },
            accents: {
                primary: iconAP,
                secondary: iconAS,
                tertiary: iconAT,
            }
        },
        specials: {
            separator,
            shadow/** : {
                primary: shadowColorP,
                secondary: shadowColorS
            }*/
        }
    } = uiTheme

    const {
        borderRadius:{
            secondary: addRadius
        },
        effects: {
            shadows
        }
    } = uiStyle

    const date = new Date(item.dt*1000)

    let hour = date.getHours()
    hour = hour>9?hour: '0'+hour
    let timeItem = hour+':00'

    let windFrom = null
    const PART_DEG = 22.5
    for(let i = 0; i<=8; i++){
        if((PART_DEG*i) <= item.wind_deg && item.wind_deg < (PART_DEG*(2*i+1))){
            windFrom = (i == 8? 0 : i)
            break
        }
    }

    const params = {
        skia: true,
        bg: 'white',
        size: {width: size.w, height: size.h}
    } 
    switch(elements){
        case 'full':
            params.bg = basicAT
            break

        case 'short':
            params.bg =  basicNS
            break

        case 'full_list':
            params.skia = false
            break

        case 'short_list':
            params.size.width = '30%'
            params.size.height = 104
            params.skia = false
            break

        case 'min':
            params.size.width = '100%'
            params.size.height = '100%'
            params.skia = false
            break
    }

    const itemData = {
        hour: timeItem,
        temp: Math.round(item.temp),
        feels_like: Math.round(item.feels_like),
        wind_speed: Math.round(item.wind_speed) == 0? 
                    0 : Math.round(item.wind_speed) + (item.wind_gust && (Math.round(item.wind_speed) != Math.round(item.wind_gust))? ('-'+`${Math.round(item.wind_gust)}`):''),
        wind_direction: windFrom,
        icon: ICONS_SET[item.weather[0].icon],
        description: item.weather[0].description,
        clouds: item.clouds,
        humidity: item.humidity,
    }


    

    const textColorAP = useAnimatedStyle(()=>({
        color: textAP.value
    }))

    const textColorAT = useAnimatedStyle(()=>({
        color: textAT.value
    }))

    const textColorNP = useAnimatedStyle(()=>({
        color: textNP.value
    }))

    const textColorNS = useAnimatedStyle(()=>({
        color: textNS.value
    }))

    const textColorNT = useAnimatedStyle(()=>({
        color: textNT.value
    }))
    const iconColorNP = useAnimatedStyle(()=>({
        color: iconNP.value
    })) 

    const iconColorNS = useAnimatedStyle(()=>({
        color: iconNS.value
    })) 

    const iconColorNT = useAnimatedStyle(()=>({
        color: iconNT.value
    })) 

    const iconColorAP = useAnimatedStyle(()=>({
        color: iconAP.value
    })) 

    const iconColorAT = useAnimatedStyle(()=>({
        color: iconAT.value
    }))

    return (
        <View
            key={item.key} 
            style={[{
                ...params.size,
                //backgroundColor: 'green' 
            }]}
        >
            {params.skia && 
            <SkiaViewDisign 
                aBorderRadius={addRadius}
                aBGColor = {params.bg} 
                //aShadows={aShadows}
                shadowMargin={{horizontal: 4, vertical: 4}}
                adaptiveSizeForStyle={false}
                innerShadow={{
                    used: true,
                    borderWidth: 0
                }}
                initSize={{
                    width: params.size.width,
                    height: params.size.height
                }}

                aShadowStyle = {shadows}
                aShadowColor = {shadow}
            />}

            {elements == 'full_list' && 
            <FullListItem
                data = {itemData}
                {...props}
            />}

            {elements == 'full' &&
            <FullItem
                margin = {4}
                data = {itemData}
                {...props}
            />}

            {elements == 'short' &&
            <ShortItem 
                margin = {4}
                data = {itemData}
                {...props}
            />}
        </View>
    )
}

export default WeatherItem;

function MinItem(props){
    
    return (
        null
    )
}

function FullListItem(props){
    const {
        data,
        
        size, 

        uiStyle,
        uiTheme,

    } = props

    const Language = useLanguage().Weather

    const {
        basics: {
          neutrals: {
            primary: basicNP,
            secondary: basicNS,
            tertiary: basicNT,
          },
          accents: {
            primary: basicAP,
            secondary: basicAS,
            tertiary: basicAT,
            quaternary: basicAQ
          }
        },
        texts: {
          neutrals: {
            primary: textNP,
            secondary: textNS,
            tertiary: textNT,
          },
          accents: {
            primary: textAP,
            secondary: textAS,
            tertiary: textAT,
          }
        },
        icons: {
          neutrals: {
            primary: iconNP,
            secondary: iconNS,
            tertiary: iconNT,
          },
          accents: {
            primary: iconAP,
            secondary: iconAS,
            tertiary: iconAT,
          }
        },
        specials: {
          separator
        }
    } = uiTheme

    const {

    } = uiStyle

    const textColorAP = useAnimatedStyle(()=>({
        color: textAP.value
    }))

    const textColorAT = useAnimatedStyle(()=>({
        color: textAT.value
    }))

    const textColorNP = useAnimatedStyle(()=>({
        color: textNP.value
    }))

    const textColorNS = useAnimatedStyle(()=>({
        color: textNS.value
    }))

    const textColorNT = useAnimatedStyle(()=>({
        color: textNT.value
    }))
    const iconColorNP = useAnimatedStyle(()=>({
        color: iconNP.value
    })) 

    const iconColorNS = useAnimatedStyle(()=>({
        color: iconNS.value
    })) 

    const iconColorNT = useAnimatedStyle(()=>({
        color: iconNT.value
    })) 

    const iconColorAP = useAnimatedStyle(()=>({
        color: iconAP.value
    })) 

    const iconColorAT = useAnimatedStyle(()=>({
        color: iconAT.value
    }))

    const {
        temp,
        feels_like,
        wind_speed,
        wind_direction,
        icon,
        description,
        clouds,
        humidity,
    } = data

    const secondaryIconsSize = 13
    const secondaryTextSize = 13

    const imageSize = size.h // - 8//* 0.7

    const tempStyle = useAnimatedStyle(()=>({
        textShadowColor: textNT.value
    }))
    return (
        <View
            style={[{
                    flex: 1,
                    justifyContent: 'center', 
                    alignItems: 'center',
                    paddingBottom: 6
                }
            ]}
        >
            <Image
                resizeMode="contain"
                style={{
                    position: 'absolute',
                    //backgroundColor: 'red',
                    bottom: 0,
                    width: imageSize,
                    height: imageSize,
                    opacity: 0.86
                }}
                source={icon}
            />
            <Reanimated.Text 
                numberOfLines={2}
                style = {[textColorNP, {
                    flex: 2,
                    //marginTop: 2,
                    width: '90%',
                    //position: 'absolute',
                    fontWeight: '500', 
                    fontVariant: ['small-caps'], 
                    fontSize: 13, 
                    letterSpacing: 0.2, 
                    textAlign: 'center', 
                }]}
            >
                {description}
            </Reanimated.Text>
            <Reanimated.Text 
                style = {[textColorNP, tempStyle, {
                    flex: 3,
                    //marginTop: 4,
                    fontWeight: 'bold', 
                    fontSize: 48,
                    textShadowRadius: 2,
                    marginLeft: 12,
                    textAlign: 'center',
                    shadowOffset: {height: 10, width: 10},
                }]}
            >
                {temp}° 
            </Reanimated.Text>
            
            <Reanimated.Text 
                style = {[textColorNP, {
                    flex: 2,
                    //marginTop: -2,
                    //position: 'absolute',
                    fontWeight: '500', 
                    fontVariant: ['small-caps'],
                    fontSize: 13, 
                    letterSpacing: 0.2,
                    textAlign: 'center', 
                }]}
            >
                {Language.feelsLike}: <Text style={{fontSize: 16, fontWeight: 'bold'}}>{feels_like}°</Text> 
            </Reanimated.Text>

            <View 
                style = {{
                    flex: 1,
                    //marginTop: 8,
                    width: '94%',
                    alignItems: 'flex-start', 
                    justifyContent: 'space-around', 
                    flexDirection: 'row', 
                }}
            >
                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                    <Reanimated.Text style={iconColorNT}>
                        <MaterialCommunityIcons name="weather-windy" size={secondaryIconsSize}/>
                    </Reanimated.Text>
                    {wind_speed != 0 && 
                    <Reanimated.Text style = {[textColorNT, {fontSize: secondaryTextSize}]}>
                        {wind_speed}
                        <Text style = {{fontSize: 13}}>M/C</Text>
                    </Reanimated.Text>}
                    {wind_speed == 0 && 
                    <Reanimated.Text style = {[textColorNT, { fontSize: secondaryTextSize,}]}>
                        {Language.calm}
                    </Reanimated.Text>}
                </View>
                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                    <Reanimated.Text style={iconColorNT}>
                        <MaterialCommunityIcons name="compass-outline" size={secondaryIconsSize}/>
                    </Reanimated.Text>
                    <Reanimated.Text style = {[textColorNT,{ fontSize: secondaryTextSize,}]}>{wind_direction? Language.windFrom[wind_direction] : '.'}</Reanimated.Text>
                </View>
            </View>

            <View 
                style = {{
                    flex: 1,
                    width: '94%',
                    alignItems: 'flex-start', 
                    justifyContent: 'space-around', 
                    flexDirection: 'row', 
                }}
            >
                <View style = {{flexDirection: 'row',alignItems: 'center'}}>
                    <Reanimated.Text style={iconColorNT}>
                        <MaterialCommunityIcons name="cloud-outline" size={secondaryIconsSize}/>
                    </Reanimated.Text>
                    <Reanimated.Text style = {[textColorNT, {fontSize: secondaryTextSize,}]}>
                        {clouds}<Text style = {{fontSize: 13}}>%</Text>
                    </Reanimated.Text>
                </View>
                <View style = {{flexDirection: 'row',alignItems: 'center'}}>
                    <Reanimated.Text style={iconColorNT}>
                        <MaterialCommunityIcons name="water-outline" size={secondaryIconsSize}/>
                    </Reanimated.Text>
                    <Reanimated.Text style = {[textColorNT, {fontSize: secondaryTextSize,}]}>
                        {humidity}<Text style = {{fontSize: 13}}>%</Text>
                    </Reanimated.Text>
                </View>
            </View>
        </View>
    )
}



function FullItem(props){
    const {
        data,
        margin,

        size,

        uiStyle,
        uiTheme,
         
    } = props

    const Language = useLanguage().Weather

    const {
        basics: {
            neutrals: {
                primary: basicNP,
                secondary: basicNS,
                tertiary: basicNT,
            },
            accents: {
                primary: basicAP,
                secondary: basicAS,
                tertiary: basicAT,
                quaternary: basicAQ
            }
        },
        texts: {
            neutrals: {
                primary: textNP,
                secondary: textNS,
                tertiary: textNT,
            },
            accents: {
                primary: textAP,
                secondary: textAS,
                tertiary: textAT,
            }
        },
        icons: {
            neutrals: {
                primary: iconNP,
                secondary: iconNS,
                tertiary: iconNT,
            },
            accents: {
                primary: iconAP,
                secondary: iconAS,
                tertiary: iconAT,
            }
        },
        specials: {
            separator,
            shadow: {
                primary: shadowColorP,
                secondary: shadowColorS
            }
        }
    } = uiTheme

    const {
        borderRadius:{
            secondary: addRadius
        }
    } = uiStyle

    const textColorAP = useAnimatedStyle(()=>({
        color: textAP.value
    }))

    const textColorAT = useAnimatedStyle(()=>({
        color: textAT.value
    }))

    const textColorNP = useAnimatedStyle(()=>({
        color: textNP.value
    }))

    const textColorNS = useAnimatedStyle(()=>({
        color: textNS.value
    }))

    const textColorNT = useAnimatedStyle(()=>({
        color: textNT.value
    }))
    const iconColorNP = useAnimatedStyle(()=>({
        color: iconNP.value
    })) 

    const iconColorNS = useAnimatedStyle(()=>({
        color: iconNS.value
    })) 

    const iconColorNT = useAnimatedStyle(()=>({
        color: iconNT.value
    })) 

    const iconColorAP = useAnimatedStyle(()=>({
        color: iconAP.value
    })) 

    const iconColorAT = useAnimatedStyle(()=>({
        color: iconAT.value
    }))

    const radiusStyle=useAnimatedStyle(()=>({
        borderRadius: addRadius.value-4
    }))

    const {
        temp,
        feels_like,
        wind_speed,
        wind_direction,
        icon,
        description,
        clouds,
        humidity,
    } = data

    const secondaryIconsSize = 13
    const secondaryTextSize = 12


    const itemSize = {
        h: size.h - margin,
        w: size.w - margin
    }
    //console.log(Math.min(...Object.values(itemSize)))
    const imageSize = Math.min(...Object.values(itemSize))*0.6

    return (
        <View
            style={[{
                flex: 1,
                margin: margin,
                justifyContent: 'flex-start', 
            }]}
        >
            <View 
                style = {{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between'
                }}
            >
                <Reanimated.Image
                    style={[radiusStyle, {
                        width: imageSize,
                        height: imageSize,
                        margin: 4,
                    }]}
                    source={icon}
                />
                <View 
                    style = {{
                        flex: 1,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingBottom: 10,
                    }}
                >
                    <Reanimated.Text 
                        style = {[textColorNP, {
                            fontWeight: 'bold', 
                            fontSize: 24,
                            textAlign: 'center',
                        }]}
                    >
                        {temp}°
                    </Reanimated.Text>
                    <Reanimated.Text 
                        numberOfLines={2}
                        style = {[textColorNP, {
                            marginLeft: 4,
                            width: 72,
                            fontWeight: '500', 
                            fontVariant: ['small-caps'], 
                            fontSize: 10, 
                            textAlign: 'center', 
                            //backgroundColor: 'red'
                        }]}
                    >
                        {description}
                    </Reanimated.Text>                  
                </View>         
            </View>
            <Reanimated.Text
                style = {[textColorNP,{
                    position: 'absolute',
                    bottom: 26,
                    left: 24,
                    width: '100%',
                    fontWeight: '600', 
                    fontVariant: ['small-caps'],
                    fontSize: 11, 
                    textAlign: 'center', 
                }]}
            >
                {Language.feelsLike}: <Text style={{fontSize: 11, fontWeight: 'bold'}}>{feels_like}°</Text> 
            </Reanimated.Text>
            
            <View 
                style = {{
                    alignItems: 'flex-start', 
                    justifyContent: 'space-around', 
                    flexDirection: 'row', 
                    paddingHorizontal: 10, 
                }}
            >
                <View style = {{flexDirection: 'row',alignItems: 'center'}}>
                    <Reanimated.Text style={iconColorNT}>
                        <MaterialCommunityIcons name="cloud-outline" size={secondaryIconsSize}/>
                    </Reanimated.Text>
                    <Reanimated.Text style = {[textColorNT, {fontSize: secondaryTextSize, marginLeft: 0,}]}>
                        {clouds}<Text style = {{fontSize: 10}}>%</Text>
                    </Reanimated.Text>
                </View>

                <View style = {{flexDirection: 'row',alignItems: 'center'}}>
                    <Reanimated.Text style={iconColorNT}>
                        <MaterialCommunityIcons name="water-outline" size={secondaryIconsSize}/>
                    </Reanimated.Text>
                    <Reanimated.Text style = {[textColorNT, {fontSize: secondaryTextSize, marginLeft: -3,}]}>
                        {humidity}<Text style = {{fontSize: 10}}>%</Text>
                    </Reanimated.Text>
                </View>

                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                    <Reanimated.Text style={iconColorNT}>
                        <MaterialCommunityIcons name="weather-windy" size={secondaryIconsSize}/>
                    </Reanimated.Text>
                    {wind_speed != 0 && 
                    <Reanimated.Text style = {[textColorNT, {fontSize: secondaryTextSize}]}>
                        {wind_speed}
                        <Text style = {{fontSize: 9}}>M/C</Text>
                    </Reanimated.Text>}
                    {wind_speed == 0 && 
                    <Reanimated.Text style = {[textColorNT, { fontSize: secondaryTextSize,}]}>
                        {Language.calm}
                    </Reanimated.Text>}
                </View>

                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                    <Reanimated.Text style={iconColorNT}>
                        <MaterialCommunityIcons name="compass-outline" size={secondaryIconsSize}/>
                    </Reanimated.Text>
                    <Reanimated.Text style = {[textColorNT,{ fontSize: secondaryTextSize,}]}>{wind_direction? Language.windFrom[wind_direction] : '.'}</Reanimated.Text>
                </View>
            </View>
           
        </View>
    )
}


function ShortItem(props){
    const {
        data,
        margin,

        size,

        uiTheme,
        uiStyle,
    } = props

    const {
        basics: {
            neutrals: {
                primary: basicNP,
                secondary: basicNS,
                tertiary: basicNT,
            },
            accents: {
                primary: basicAP,
                secondary: basicAS,
                tertiary: basicAT,
                quaternary: basicAQ
            }
        },
        texts: {
            neutrals: {
                primary: textNP,
                secondary: textNS,
                tertiary: textNT,
            },
            accents: {
                primary: textAP,
                secondary: textAS,
                tertiary: textAT,
            }
        },
        icons: {
            neutrals: {
                primary: iconNP,
                secondary: iconNS,
                tertiary: iconNT,
            },
            accents: {
                primary: iconAP,
                secondary: iconAS,
                tertiary: iconAT,
            }
        },
        specials: {
            separator,
            shadow: {
                primary: shadowColorP,
                secondary: shadowColorS
            }
        }
    } = uiTheme

    const {
        borderRadius:{
            secondary: addRadius
        }
    } = uiStyle

    const textColorAP = useAnimatedStyle(()=>({
        color: textAP.value
    }))

    const textColorAT = useAnimatedStyle(()=>({
        color: textAT.value
    }))

    const textColorNP = useAnimatedStyle(()=>({
        color: textNP.value
    }))

    const textColorNS = useAnimatedStyle(()=>({
        color: textNS.value
    }))

    const textColorNT = useAnimatedStyle(()=>({
        color: textNT.value
    }))
    const iconColorNP = useAnimatedStyle(()=>({
        color: iconNP.value
    })) 

    const iconColorNS = useAnimatedStyle(()=>({
        color: iconNS.value
    })) 

    const iconColorNT = useAnimatedStyle(()=>({
        color: iconNT.value
    })) 

    const iconColorAP = useAnimatedStyle(()=>({
        color: iconAP.value
    })) 

    const iconColorAT = useAnimatedStyle(()=>({
        color: iconAT.value
    }))

    const radiusStyle=useAnimatedStyle(()=>({
        borderRadius: addRadius.value-3
    }))

    const itemSize = {
        h: size.h - margin,
        w: size.w - margin
    }
    //console.log(Math.min(...Object.values(itemSize)))
    const imageSize = Math.min(...Object.values(itemSize)) - 8

    const {
        hour,
        temp,
        feels_like,
        wind_speed,
        wind_direction,
        icon,
        description,
        clouds,
        humidity,
    } = data

    return (
        <View
            style={[{
                flex: 1,
                margin: margin,
                alignItems: 'center', 
                justifyContent: 'center'
            }]}
        >
            <Reanimated.Image
                style={[radiusStyle, {
                    position: 'absolute',
                    width: imageSize,
                    height: imageSize,
                    left: 4,
                    top: 4,
                    opacity: .6
                }]}
                source={icon}
            />
            <Reanimated.Text 
                style = {[textColorNS, {
                    fontSize: 14, 
                    fontWeight: '700', 
                    fontVariant: ['small-caps'],
                    letterSpacing: 0.6,
                }]}
            >
                {hour}
            </Reanimated.Text>
            <View 
                style = {{
                    alignItems: 'center',
                    flexDirection: 'row'
                }}
            >
                <Reanimated.Text style = {[textColorNS, {fontSize: 20, fontWeight: 'bold',}]}>
                    {temp}° 
                    {false && <Text style={{fontSize: 14,}}>{feels_like}°</Text>}
                </Reanimated.Text>
            </View>
            <Reanimated.Text 
                style = {[textColorNS, {
                    height: 35, 
                    fontSize: 9,
                    paddingHorizontal: 4,
                    fontWeight: '500', 
                    fontVariant: ['small-caps'], 
                    textAlign:'center', 
                    opacity: .9 
                }]}
            >
                {description}
            </Reanimated.Text>
        </View>
    )
}

