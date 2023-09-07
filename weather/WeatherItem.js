import React from "react";

import {Text, Pressable, Animated, ActivityIndicator, View, Image,Dimensions, StyleSheet} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Reanimated, {
    useAnimatedStyle,
    useAnimatedProps,
    useDerivedValue
} from "react-native-reanimated";

import themesColorsAppList, {themesApp} from "../app_values/Themes";
import languagesAppList, {languagesApp} from "../app_values/Languages";

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

import { ICONS_SET } from "../app_values/AppDefault";

import SkiaViewDisign from "../general_components/base_components/SkiaViewDisign";

const WeatherItem = (props) => {

    const {
        item, 
        index = 0,
        elements,

        size,

        uiStyle,
        uiTheme,

        appStyle,
        appConfig,
        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex,
    } = props

    const Theme  = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex]

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
            additional: addRadius
        },
        effects: {
            shadows
        }
    } = uiStyle

    const date = new Date(item.dt*1000)

    let hour = date.getHours()
    hour = hour>9?hour: '0'+hour
    let timeItem = hour+':00'

    const listDirections = Language.Weather.windFrom
    let windFrom = '?'
    if ( 337.5 <= item.wind_deg && item.wind_deg <= 360 ||
        0      <= item.wind_deg && item.wind_deg < 22.5  ) {windFrom = listDirections[0]}
    if ( 22.5  <= item.wind_deg && item.wind_deg < 67.5  ) {windFrom = listDirections[1]}
    if ( 67.5  <= item.wind_deg && item.wind_deg < 112.5 ) {windFrom = listDirections[2]}
    if ( 112.5 <= item.wind_deg && item.wind_deg < 157.5 ) {windFrom = listDirections[3]}
    if ( 157.5 <= item.wind_deg && item.wind_deg < 202.5 ) {windFrom = listDirections[4]}
    if ( 202.5 <= item.wind_deg && item.wind_deg < 247.5 ) {windFrom = listDirections[5]}
    if ( 247.5 <= item.wind_deg && item.wind_deg < 292.5 ) {windFrom = listDirections[6]}
    if ( 292.5 <= item.wind_deg && item.wind_deg < 337.5 ) {windFrom = listDirections[7]}



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

    const aShadows = useDerivedValue(()=>{
        return {
            style: shadows.value,
            colors: {
                primary: shadowColorP.value,
                secondary: shadowColorS.value,
            } 
        }
    })

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
                aShadows={aShadows}
                shadowMargin={{horizontal: 4, vertical: 4}}
                adaptiveSizeForStyle={false}
                innerShadow={{
                    used: true,
                    borderWidth: 1
                }}
                initSize={{
                    width: params.size.width,
                    height: params.size.height
                }}
            />}

            {elements == 'min' && 
            <MinItem
                data = {itemData}
                {...props}
            />}

            {elements == 'full_list' && 
            <FullListItem
                data = {itemData}
                {...props}
            />}

            {elements == 'short_list' && 
            <ShortListItem
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

        appStyle,
        appConfig,
        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex,
    } = props

    const Theme  = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].Weather

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
        borderRadius:{
            additional: addRadius
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

    const imageSize = size.w // - 8//* 0.7

    const tempStyle = useAnimatedStyle(()=>({
        textShadowColor: textNT.value
    }))
    return (
        <View
            style={[{
                    flex: 1,
                    justifyContent: 'center', 
                    alignItems: 'center',
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
                    //opacity: 0.64
                }}
                source={icon}
            />
            <Reanimated.Text 
                numberOfLines={2}
                style = {[textColorNP, {
                    marginTop: 2,
                    width: '90%',
                    //position: 'absolute',
                    fontWeight: '500', 
                    fontVariant: ['small-caps'], 
                    fontSize: 12, 
                    textAlign: 'center', 
                }]}
            >
                {description}
            </Reanimated.Text>
            <Reanimated.Text 
                style = {[textColorNP, tempStyle, {
                    marginTop: -4,
                    //position: 'absolute',
                    fontWeight: 'bold', 
                    fontSize: 48,
                    marginLeft: 12,
                    textAlign: 'center',
                    shadowOffset: {height: 10, width: 10},
                    textShadowRadius: 1.6
                }]}
            >
                {temp}° 
            </Reanimated.Text>
            
            <Reanimated.Text 
                style = {[textColorNP, {
                    marginTop: 8,
                    //position: 'absolute',
                    fontWeight: '600', 
                    fontVariant: ['small-caps'],
                    fontSize: 12, 
                    textAlign: 'center', 
                }]}
            >
                {Language.feelsLike}: <Text style={{fontSize: 15, fontWeight: 'bold'}}>{feels_like}°</Text> 
            </Reanimated.Text>
            <View 
                style = {{
                    marginTop: 12,
                    width: '80%',
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
                    <Reanimated.Text style = {[textColorNT,{ fontSize: secondaryTextSize,}]}>{wind_direction}</Reanimated.Text>
                </View>
            </View>
            <View 
                style = {{
                    width: '80%',
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
                        {clouds}<Text style = {{fontSize: 10}}>%</Text>
                    </Reanimated.Text>
                </View>
                <View style = {{flexDirection: 'row',alignItems: 'center'}}>
                    <Reanimated.Text style={iconColorNT}>
                        <MaterialCommunityIcons name="water-outline" size={secondaryIconsSize}/>
                    </Reanimated.Text>
                    <Reanimated.Text style = {[textColorNT, {fontSize: secondaryTextSize,}]}>
                        {humidity}<Text style = {{fontSize: 10}}>%</Text>
                    </Reanimated.Text>
                </View>
            </View>
        </View>
    )
}


function ShortListItem(props){
    const {
        data,
        appStyle,
        appConfig,
        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex,
    } = props

    const Theme  = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].Weather

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
                    alignItems: 'center', 
                    justifyContent: 'center',
                }
            ]}
        >
            <Text 
                style = {{
                    marginTop: -9,
                    fontSize: 20, 
                    fontWeight: '700', 
                    fontVariant: ['small-caps'],
                    letterSpacing: 0.6,
                    color: Theme.texts.neutrals.primary
                }}
            >
                {hour}
            </Text>
            <Text 
                numberOfLines={2}
                style = {{
                    fontWeight: '500', 
                    fontVariant: ['small-caps'], 
                    fontSize: 10, 
                    width: 110,
                    textAlign: 'center', 
                    color: Theme.texts.neutrals.primary
                }}
            >
                {description}
            </Text>
            <Text 
                style = {{
                    fontWeight: 'bold', 
                    fontSize: 24,
                    textAlign: 'center',
                    color: Theme.texts.neutrals.primary
                }}
            >
                {temp}°
                <Text style={{fontSize: 15,}} >{feels_like}° </Text>
            </Text>

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
         
        appStyle,
        appConfig,
        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex,
    } = props

    const Theme  = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].Weather

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
            additional: addRadius
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
                            //width: 64,
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
                    bottom: 20,
                    width: '100%',
                    fontWeight: '600', 
                    fontVariant: ['small-caps'],
                    fontSize: 12, 
                    textAlign: 'center', 
                }]}
            >
                {Language.feelsLike}: <Text style={{fontSize: 15, fontWeight: 'bold'}}>{feels_like}°</Text> 
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
                    <Reanimated.Text style = {[textColorNT,{ fontSize: secondaryTextSize,}]}>{wind_direction}</Reanimated.Text>
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
         
        appStyle,
        appConfig,
        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex,
    } = props

    const Theme  = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].Weather

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
            additional: addRadius
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

