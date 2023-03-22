import React from "react";

import {Text, Pressable, Animated, ActivityIndicator, View, Image,Dimensions, StyleSheet} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

        appStyle,
        appConfig,
        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex,
    } = props

    const Theme  = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex]

    //index == 0? console.log(item.weather[0].description)  : null

    let date = new Date(item.dt*1000)
    //let dateDay = date.toString().substring(7,21)

    let hour = date.getHours()
    hour = hour>9?hour: '0'+hour
    //console.log(hour)
    let timeItem = hour+':00'
    //let dateItem = Language.Weather.today
    //dateItem = date.getDate()==new Date().getDate()? dateItem : Language.Weather.morrow

    //dateDay = dateDay.substring(0,3)+(date.getMonth()+1)+dateDay.substring(2,)
    //if){dateDay = dateDay.substring(11)}

    let listDirections = Language.Weather.windFrom
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

    //let windGustSpeed = (Math.round(item.wind_speed) != Math.round(item.wind_gust) && item.wind_gust != undefined)? ('-'+`${Math.round(item.wind_gust)}`):''

    //let itemWind = Math.round(item.wind_speed)+windGustSpeed+Language.Weather.ms
    //itemWind = Math.round(item.wind_speed) == 0? Language.Weather.calm : itemWind

    const params = {
        skia: true,
        bg: 'white',
        size: {width: 100, height: 100}
    } 
    switch(elements){
        case 'full':
            params.size.width = (279)*(2/3)
            params.size.height = 90
            params.bg = Theme.basics.accents.tertiary
            break

        case 'short':
            params.size.width = (279)/3
            params.size.height = 90
            params.bg = Theme.basics.neutrals.secondary
            break

        case 'full_list':
            params.size.width = '60%'
            params.size.height = 104
            params.skia = false
            break

        case 'short_list':
            params.size.width = '40%'
            params.size.height = 104
            params.skia = false
            break

        case 'min':
            params.size.width = '100%'
            params.size.height = '100%'
            params.skia = false
            break
    }

    return (
        <View
            key={item.key} 
            style={[ 
                {
                    //width: elements == 'full'? (279)*(2/3) : (279)/3,
                    //height: 90,
                    ...params.size 
                }, 
            ]}
        >
            {params.skia && 
            <SkiaViewDisign 
                borderRadius = {appStyle.borderRadius.additional}
                backgroundColor = {params.bg}
                shadowColors = {Theme.specials.shadow}
                shadowMargin={{horizontal: 3, vertical: 3}}
                shadowStyle = {appStyle.effects.shadows}
                adaptiveSizeForStyle={false}
                innerShadow={{
                    used: true,
                    borderWidth: 1
                }}
            />}

            {elements == 'min' && 
            <MinItem
                data = {{
                    hour: timeItem,
                    temp: Math.round(item.temp),
                    feels_like: Math.round(item.feels_like),
                    wind_speed: Math.round(item.wind_speed) == 0? 0 : Math.round(item.wind_speed) + (item.wind_gust && (Math.round(item.wind_speed) != Math.round(item.wind_gust))? ('-'+`${Math.round(item.wind_gust)}`):''),
                    wind_direction: windFrom,
                    icon: ICONS_SET[item.weather[0].icon],
                    description: item.weather[0].description,
                    clouds: item.clouds,
                    humidity: item.humidity,
                }}
                {...props}
            />}

            {elements == 'full_list' && 
            <FullListItem
                data = {{
                    hour: timeItem,
                    temp: Math.round(item.temp),
                    feels_like: Math.round(item.feels_like),
                    wind_speed: Math.round(item.wind_speed) == 0? 0 : Math.round(item.wind_speed) + (item.wind_gust && (Math.round(item.wind_speed) != Math.round(item.wind_gust))? ('-'+`${Math.round(item.wind_gust)}`):''),
                    wind_direction: windFrom,
                    icon: ICONS_SET[item.weather[0].icon],
                    description: item.weather[0].description,
                    clouds: item.clouds,
                    humidity: item.humidity,
                }}
                {...props}
            />}

            {elements == 'short_list' && 
            <ShortListItem
                data = {{
                    hour: timeItem,
                    temp: Math.round(item.temp),
                    feels_like: Math.round(item.feels_like),
                    wind_speed: Math.round(item.wind_speed) == 0? 0 : Math.round(item.wind_speed) + (item.wind_gust && (Math.round(item.wind_speed) != Math.round(item.wind_gust))? ('-'+`${Math.round(item.wind_gust)}`):''),
                    wind_direction: windFrom,
                    icon: ICONS_SET[item.weather[0].icon],
                    description: item.weather[0].description,
                    clouds: item.clouds,
                    humidity: item.humidity,
                }}
                {...props}
            />}

            {elements == 'full' &&
            <FullItem
                margin = {3}
                data = {{
                    hour: timeItem,
                    temp: Math.round(item.temp),
                    feels_like: Math.round(item.feels_like),
                    wind_speed: Math.round(item.wind_speed) == 0? 0 : Math.round(item.wind_speed) + (item.wind_gust && (Math.round(item.wind_speed) != Math.round(item.wind_gust))? ('-'+`${Math.round(item.wind_gust)}`):''),
                    wind_direction: windFrom,
                    icon: ICONS_SET[item.weather[0].icon],
                    description: item.weather[0].description,
                    clouds: item.clouds,
                    humidity: item.humidity,
                }}
                {...props}
            />}

            {elements == 'short' &&
            <ShortItem 
                margin = {3}
                data = {{
                    hour: timeItem,
                    temp: Math.round(item.temp),
                    feels_like: Math.round(item.feels_like),
                    wind_speed: Math.round(item.wind_speed) == 0? 0 : Math.round(item.wind_speed) + (item.wind_gust && (Math.round(item.wind_speed) != Math.round(item.wind_gust))? ('-'+`${Math.round(item.wind_gust)}`):''),
                    wind_direction: windFrom,
                    icon: ICONS_SET[item.weather[0].icon],
                    description: item.weather[0].description,
                    clouds: item.clouds,
                    humidity: item.humidity,
                }}
                {...props}
            />}



        </View>
    )
}

export default WeatherItem;

function MinItem(props){
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
                    //borderRadius: 20, 
                    //padding: 4,
                    flex: 1,
                    //width: size.width,
                    //height: size.height, 
                    //alignItems: 'center',
                    justifyContent: 'flex-start', 
                    //backgroundColor: 'red'
                    paddingLeft: 5
                }
            ]}
        >
            <View 
                style = {{
                    //width: '100%',
                    //flex: 3,
                    marginTop: 13,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexDirection: 'row',
                    //backgroundColor: 'blue'
                }}
            >
                <Text 
                    style = {{
                        fontWeight: 'bold', 
                        fontSize: 18,
                        textAlign: 'center',
                        color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary
                    }}
                >
                    {temp}°
                </Text>
                <Text 
                    style = {{
                        fontWeight: '500', 
                        fontVariant: ['small-caps'], 
                        fontSize: 9, 
                        textAlign: 'center', 
                        color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary
                    }}
                >
                    {description}
                </Text>                               
            </View> 
            <Text 
                style = {{
                    //flex: 1,
                    marginTop: -9,
                    //backgroundColor: 'green',
                    fontWeight: '600', 
                    fontVariant: ['small-caps'],
                    fontSize: 9, 
                    textAlign: 'left', 
                    color: appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary
                }}
            >
                {Language.feelsLike}: <Text style={{fontSize: 12, fontWeight: 'bold'}}>{feels_like}°</Text> 
            </Text>
        </View>
    )
}

function FullListItem(props){
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

    return (
        <View
            style={[{
                    //borderRadius: 20, 
                    //padding: 4,
                    flex: 1,
                    //width: size.width,
                    //height: size.height, 
                    //alignItems: 'center',
                    justifyContent: 'flex-start', 
                    //backgroundColor: 'red'
                }
            ]}
        >
            
            <View 
                style = {{
                    //alignItems: 'center',
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    //backgroundColor: 'red'
                }}
            >
                <Image
                    style={{
                        width: 84,
                        height: 84,
                        borderTopLeftRadius: appStyle.borderRadius.basic,
                        //backgroundColor: 'red',
                        borderRadius: 0
                    }}
                    source={icon}
                />

                <View>
                    <View 
                        style = {{
                            //width: '100%',
                            //flex: 3,
                            marginTop: 15,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            flexDirection: 'row',
                            //backgroundColor: 'red'
                        }}
                    >
                        <Text 
                            style = {{
                                fontWeight: 'bold', 
                                fontSize: 28,
                                textAlign: 'center',
                                color: Theme.texts.neutrals.primary
                            }}
                        >
                            {temp}°
                        </Text>
                        <Text 
                            numberOfLines={2}
                            style = {{
                                fontWeight: '500', 
                                fontVariant: ['small-caps'], 
                                fontSize: 12, 
                                textAlign: 'center', 
                                color: Theme.texts.neutrals.primary,
                                width: 110
                            }}
                        >
                            {description}
                        </Text>
                        
                        
                    </View> 
                    <Text 
                        style = {{
                            //flex: 1,
                            marginTop: -4,
                            fontWeight: '600', 
                            fontVariant: ['small-caps'],
                            fontSize: 12, 
                            textAlign: 'center', 
                            color: Theme.texts.neutrals.primary
                        }}
                    >
                        {Language.feelsLike}: <Text style={{fontSize: 15, fontWeight: 'bold'}}>{feels_like}°</Text> 
                    </Text>

                </View>              
            </View>
            
            
            <View 
                style = {{
                    alignItems: 'flex-start', 
                    justifyContent: 'space-around', 
                    flexDirection: 'row', 
                    paddingLeft: 20, 
                    marginTop: -10
                    //paddingBottom: 3,
                    //backgroundColor: 'red'
                }}
            >
                <View style = {{flexDirection: 'row',alignItems: 'center'}}>
                    <MaterialCommunityIcons name="cloud-outline" size={secondaryIconsSize} color={Theme.icons.neutrals.tertiary}/>
                    <Text style = {{marginLeft: 0, fontSize: secondaryTextSize, color: Theme.texts.neutrals.tertiary}}>
                        {clouds}
                        <Text style = {{fontSize: 10}}>%</Text>
                    </Text>
                </View>
                
                <View style = {{flexDirection: 'row',alignItems: 'center'}}>
                    <MaterialCommunityIcons name="water-outline" size={secondaryIconsSize} color={Theme.icons.neutrals.tertiary} />
                    <Text style = {{marginLeft: -3, fontSize: secondaryTextSize, color: Theme.texts.neutrals.tertiary}}>
                        {humidity}
                        <Text style = {{fontSize: 10}}>%</Text>
                    </Text>
                </View>
                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                    <MaterialCommunityIcons name="weather-windy" size={secondaryIconsSize} color={Theme.icons.neutrals.tertiary} />
                    {wind_speed != 0 && 
                    <Text style = {{ fontSize: secondaryTextSize, color: Theme.texts.neutrals.tertiary}}>
                        {wind_speed}
                        <Text style = {{fontSize: 9}}>M/C</Text>
                    </Text>}
                    {wind_speed == 0 && 
                    <Text style = {{ fontSize: secondaryTextSize, color: Theme.texts.neutrals.tertiary}}>
                    {Language.calm}
                    </Text>}
                </View>
                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                    <MaterialCommunityIcons name="compass-outline" size={secondaryIconsSize} color={Theme.icons.neutrals.tertiary}/>
                    <Text style = {{ fontSize: secondaryTextSize, color: Theme.texts.neutrals.tertiary}}>{wind_direction}</Text>
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
                    justifyContent: 'center'
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
         
        appStyle,
        appConfig,
        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex,
    } = props

    const Theme  = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].Weather

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

    return (
        <View
            style={[{
                    //borderRadius: 20, 
                    //padding: 4,
                    flex: 1,
                    margin: margin,
                    //width: size.width,
                    //height: size.height, 
                    //alignItems: 'center',
                    justifyContent: 'flex-start', 
                }
            ]}
        >
            

            <View 
                style = {{
                    //alignItems: 'center',
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between'
                    //backgroundColor: 'red'
                }}
            >
                <Image
                    style={{
                        width: 64,
                        height: 62,
                        borderTopLeftRadius: appStyle.borderRadius.additional,
                        //backgroundColor: 'red',
                        borderRadius: 0
                    }}
                    source={icon}
                />

                <View 
                    style = {{
                        //width: '100%',
                        flex: 1,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingBottom: 10,
                        //backgroundColor: 'red'
                    }}
                >
                    <Text 
                        style = {{
                            fontWeight: 'bold', 
                            fontSize: 24,
                            textAlign: 'center',
                            color: Theme.texts.neutrals.primary
                        }}
                    >
                        {temp}°
                    </Text>
                    <Text 
                        style = {{
                            fontWeight: '500', 
                            fontVariant: ['small-caps'], 
                            fontSize: 10, 
                            textAlign: 'center', 
                            color: Theme.texts.neutrals.primary
                        }}
                    >
                        {description}
                    </Text>
                    
                    
                </View>         
            </View>
            <Text 
                style = {{
                    position: 'absolute',
                    bottom: 20,
                    width: '100%',
                    fontWeight: '600', 
                    fontVariant: ['small-caps'],
                    fontSize: 12, 
                    textAlign: 'center', 
                    color: Theme.texts.neutrals.primary
                }}
            >
                {Language.feelsLike}: <Text style={{fontSize: 15, fontWeight: 'bold'}}>{feels_like}°</Text> 
            </Text>
            
            <View 
                style = {{
                    alignItems: 'flex-start', 
                    justifyContent: 'space-around', 
                    flexDirection: 'row', 
                    paddingHorizontal: 10, 
                    //paddingBottom: 3,
                    //backgroundColor: 'red'
                }}
            >
                <View style = {{flexDirection: 'row',alignItems: 'center'}}>
                    <MaterialCommunityIcons name="cloud-outline" size={secondaryIconsSize} color={Theme.icons.neutrals.tertiary}/>
                    <Text style = {{marginLeft: 0, fontSize: secondaryTextSize, color: Theme.texts.neutrals.tertiary}}>
                        {clouds}
                        <Text style = {{fontSize: 10}}>%</Text>
                    </Text>
                </View>
                
                <View style = {{flexDirection: 'row',alignItems: 'center'}}>
                    <MaterialCommunityIcons name="water-outline" size={secondaryIconsSize} color={Theme.icons.neutrals.tertiary} />
                    <Text style = {{marginLeft: -3, fontSize: secondaryTextSize, color: Theme.texts.neutrals.tertiary}}>
                        {humidity}
                        <Text style = {{fontSize: 10}}>%</Text>
                    </Text>
                </View>
                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                    <MaterialCommunityIcons name="weather-windy" size={secondaryIconsSize} color={Theme.icons.neutrals.tertiary} />
                    {wind_speed != 0 && 
                    <Text style = {{ fontSize: secondaryTextSize, color: Theme.texts.neutrals.tertiary}}>
                        {wind_speed}
                        <Text style = {{fontSize: 9}}>M/C</Text>
                    </Text>}
                    {wind_speed == 0 && 
                    <Text style = {{ fontSize: secondaryTextSize, color: Theme.texts.neutrals.tertiary}}>
                    {Language.calm}
                    </Text>}
                </View>
                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                    <MaterialCommunityIcons name="compass-outline" size={secondaryIconsSize} color={Theme.icons.neutrals.tertiary}/>
                    <Text style = {{ fontSize: secondaryTextSize, color: Theme.texts.neutrals.tertiary}}>{wind_direction}</Text>
                </View>
            </View>
            
        </View>
    )
}


function ShortItem(props){
    const {
        data,
        margin,
         
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
                    //borderRadius: 20, 
                    //padding: 4,
                    flex: 1,
                    margin: margin,
                    //width: size.width,
                    //height: size.height, 
                    alignItems: 'center', 
                    justifyContent: 'center'
                }
            ]}
        >
            <Image
                style={{
                    position: 'absolute',
                    width: 82,
                    height: 82,
                    left: 3.3,
                    borderRadius: appStyle.borderRadius.additional-3,//-6,
                    //backgroundColor: 'red'
                    opacity: .6
                }}
                source={icon}
            />
            <Text 
                style = {{
                    fontSize: 14, 
                    fontWeight: '700', 
                    fontVariant: ['small-caps'],
                    letterSpacing: 0.6,
                    color: Theme.texts.neutrals.secondary
                }}
            >
                {hour}
            </Text>
            <View 
                style = {{
                    alignItems: 'center',
                    flexDirection: 'row'
                }}
            >
      
                <Text style = {{fontSize: 20, fontWeight: 'bold', color: Theme.texts.neutrals.secondary}}>
                    {temp}° 
                    <Text style={{fontSize: 14,}}>{feels_like}°</Text>
                </Text>
            </View>
            <Text 
                style = {{
                    height: 35, 
                    fontSize: 9,
                    paddingHorizontal: 4,
                    fontWeight: '500', 
                    fontVariant: ['small-caps'], 
                    textAlign:'center', 
                    color: Theme.texts.neutrals.secondary,
                    opacity: .9 
                }}
            >
                {description}
            </Text>
            
            
        </View>
    )
}

