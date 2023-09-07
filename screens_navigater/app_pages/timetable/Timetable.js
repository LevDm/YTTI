import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import {
    Appearance, 
    StyleSheet, 
    Text,
    Button, 
    Pressable,
    TextInput, 
    FlatList, 
    SectionList,
    View, 
    Dimensions,
    ToastAndroid,
    Keyboard,
    BackHandler,
    Vibration 
} from 'react-native';

import Constants from "expo-constants";

import Reanimated, {
    useSharedValue, 
    useAnimatedStyle, 
    withTiming,
    withDelay,
    withSequence, 
    useAnimatedScrollHandler,
    useAnimatedProps, 
    cancelAnimation,
    useAnimatedRef,
    useDerivedValue,
    scrollTo,
    runOnJS,
    interpolateColor,
    interpolate,
    Extrapolate,
    runOnUI,
    Easing,
    Extrapolation,

    Layout,
    SequencedTransition,
    CurvedTransition,
    FadingTransition,
    Transition,
    FadeIn,
    useAnimatedReaction
} from 'react-native-reanimated';

import * as NavigationBar from 'expo-navigation-bar';

import { Svg, Path } from "react-native-svg";
import { BlurView } from "@react-native-community/blur";
import MaskedView from '@react-native-masked-view/masked-view';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import SkiaViewDisign from "../../../general_components/base_components/SkiaViewDisign";
import AsyncStorage from '@react-native-async-storage/async-storage';

import {connect} from 'react-redux';
import mapStateToProps from "../../../app_redux_files/stateToProps";
import mapDispatchToProps from "../../../app_redux_files/dispatchToProps";
import store from "../../../app_redux_files/store";

import dataRedactor from "../../../app_async_data_manager/data_redactor";

import { 
    BasePressable,
    BaseWindow,
    BaseCheckBox,
    BaseSwitch 
} from "../../../general_components/base_components/BaseElements";

import themesColorsAppList, {themesApp} from "../../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../../app_values/Languages";

import { listsHorizontalProximity } from "../../../app_values/AppDefault";

import WeatherComponent from "../../../weather/WeatherComponent";

const { height: DEVICE_H, width: DEVICE_W } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Constants.statusBarHeight

const RPressable = Reanimated.createAnimatedComponent(Pressable);
const RSectionList = Reanimated.createAnimatedComponent(SectionList);
const ReanimatedTextInput = Reanimated.createAnimatedComponent(TextInput);
const ReanimatedPath = Reanimated.createAnimatedComponent(Path);
const ReanimatedSVG = Reanimated.createAnimatedComponent(Svg);
const RIcon = Reanimated.createAnimatedComponent(MaterialCommunityIcons);
const RBlurView = Reanimated.createAnimatedComponent(BlurView);
const RMaskedView = Reanimated.createAnimatedComponent(MaskedView)

import { structureCustomizer as tasksStructure  } from "./tools";

const OS_NAVIGATION_BAR_HEIGHT = Dimensions.get('screen').height - (Dimensions.get('window').height + Constants.statusBarHeight)

const isEqual = (item_1, item_2) => JSON.stringify(item_1) == JSON.stringify(item_2)

import common_values from "./common_values";
const {
    SCREEN_PROXIMYTY_HRZ,

    STYCKYS_HEIGHT,
    HEADER_TOOL_HEIGHT,
    SECTIONS_SELECTOR_HEIGHT,
    PRIMARY_HEADER_HEIGHT,
    SECONDARY_HEADER_HEIGHT,

    HEAD_COMPONENT_HEIGHT,
    LIST_ITEM_SIZE,

    MARGIN_BOBBER,

    TRANSPARENT_COLOR
} = common_values

const listHeights = [LIST_ITEM_SIZE.h * 3, LIST_ITEM_SIZE.h* 2, LIST_ITEM_SIZE.h* 2, LIST_ITEM_SIZE.h* 1, LIST_ITEM_SIZE.h]


import BobberButton from "./FAB";
import HeaderBackground from "./HeaderBackground";
import HeaderToolBar from "./HeaderToolBar";
import HeaderSectionsSelector from "./HeaderSectionsSelector";
import Item from "./ItemList";

import HeadItemList from "./HeadItemList";


const Settings = function(props){
    const {
        openSettingsWindow,
        uiTheme, //: global_aTheme,
        uiStyle, //: global_aStyle
        uiCompositions,
        //uiStyle,
        //uiTheme,
        openDrawer
    } = props

    const [appStyle, setAppStyle] = useState(props.appStyle);
    const [appConfig, setAppConfig] = useState(props.appConfig);


    //const visibilityBar = NavigationBar.useVisibility() !!!<- this hook called re-render
    let androidNBarHeight = 0
    NavigationBar.addVisibilityListener(({ visibility }) => {
        androidNBarHeight = (visibility === 'visible'? OS_NAVIGATION_BAR_HEIGHT : 0)
    });



    const LanguageAppIndex = languagesApp.indexOf(appConfig.languageApp)

    const ThemeColorsAppIndex = themesApp.indexOf(appStyle.palette.theme)

    store.subscribe(() => {
        const jstore = store.getState();

        if(!isEqual(appStyle, jstore.appStyle)){
            console.log('app style upd')
            setAppStyle(jstore.appStyle);
        }

        if(!isEqual(appConfig, jstore.appConfig)){
            console.log('app config upd')
            setAppConfig(jstore.appConfig);
        }
    })

    const listenerColorSheme = Appearance.getColorScheme()
    const ThemeSchema = listenerColorSheme? appStyle.palette.scheme == 'auto'? listenerColorSheme : appStyle.palette.scheme : ThemeSchema

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen

    /* 
    const aStyle = useDerivedValue(()=>{
        //console.log('TASK STYLE', global_aStyle.value? '1' : '2')
        return global_aStyle.value? global_aStyle.value : appStyle
    })

    const aTheme = useDerivedValue(()=>{
        //console.log('TASK Palette', global_aTheme.value)
        return global_aTheme.value? global_aTheme.value : Theme
    })
    */


    const fabVisible = useSharedValue(0);//bottomBord


    const fabLongPress =()=>{
        console.log('pressj')
        
    }

    const fabPress =()=>{
        console.log('pressa')
    }

    const backScreen = () => {
        Vibration.vibrate([5,8])
        props.navigation.goBack()
        console.log('screen_go_back')
    }

    useEffect(() => {
        const backAction = () => {
            backScreen()
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        console.log('add even back swipe')
        return () => backHandler.remove();
    }, []);

    const {
        navigationMenu: {
            type 
        }
    } = uiStyle
    
    const menuPress = () => { 
        Vibration.vibrate([5,8])
        if(type.value == 'not' || (appConfig.weather.type == 'panel' && appConfig.weather.locationInfo.length>0)){
            openDrawer()
        } else {
            openSettingsWindow()
            //props.navigation.navigate('settingsStack')
        }

    }

    


    const fabShow = (value) => {
        'worklet';
        cancelAnimation(fabVisible);
        fabVisible.value = value? 0 : 1
    }
    

    console.log('$$$$$$$ ? screen RENDER', )
    return (
    <>  
        <BasisList
            fabShow={fabShow}

            menuPress = {menuPress}
            fabPress = {fabPress}
            fabLongPress = {fabLongPress}

            appConfig = {appConfig}
            LanguageAppIndex = {LanguageAppIndex}

            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}

            uiStyle={uiStyle}
            uiTheme={uiTheme}
        />
        
        <BobberButton 
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}

            aVisible = {fabVisible}
            onPress = {fabPress}
            onLongPress = {fabLongPress}
   
            uiStyle={uiStyle}
            uiTheme={uiTheme}
        />

        
        
    </>)  
}

export default connect(mapStateToProps('SETTINGS_SCREEN'), mapDispatchToProps('SETTINGS_SCREEN'))(Settings);

//====================================================================================================================================


//====================================================================================================================================



const BasisList = function (props) {
    const {
        fabShow,

        bottomBord, //

        appStyle,
        appConfig,
        LanguageAppIndex, //
        ThemeColorsAppIndex, //
        ThemeSchema, //

        uiStyle,
        uiTheme,
    } = props

    const {
        lists: {
            invertColorsHeader,
            fullWidth
        }
    } = uiStyle

    const {
        basics: {
            accents: {
            },
            neutrals: {
                primary: basicNP,
            }
        },
        texts: {
            accents: {
                primary: textAP,
            },
            neutrals: {
            }
        },
        icons: {
            accents: {
            },
            neutrals: {
                tertiary: iconNT,
            }
        }
    } = uiTheme


    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].TasksScreen

    const sectListRef = useRef();

    const animValueScrollY = useSharedValue(0)
    
    const logg = (info) =>{
        'worklet';
        console.log('lg_'+info)
    }

    const scrollSectionsList = useAnimatedScrollHandler({
        onScroll: (event, ctx) => {
            const hht = HEAD_COMPONENT_HEIGHT

            const isUpScroll = Math.abs(event.velocity.y).toFixed(4) != 0? (event.velocity.y).toFixed(4) < 0.0001 : false;
            const isEnd = (event.layoutMeasurement.height + event.contentOffset.y) >= (event.contentSize.height - 5);
            const isStart = event.contentOffset.y > -(HEADER_TOOL_HEIGHT+10);//+hht
            
            const visibleBobber = (isUpScroll && isStart) || isEnd
            fabShow(visibleBobber)

            const useScroll = -Math.max(event.contentOffset.y, 0)

            cancelAnimation(animValueScrollY);
            animValueScrollY.value = useScroll
        },
    }) //



    const showSection = (index) => {
        console.log('show section', index)
        sectListRef.current.scrollToLocation({
            itemIndex: 1,
            sectionIndex: index,
            animated: false,
            viewOffset: SECTIONS_SELECTOR_HEIGHT //STYCKYS_HEIGHT
        })
    }


    const sectionExtractor = (item, index) => String(item[0].category + index)
    

    const renderHeaderSticks = ({section: {category, indexSection: index}})=>{ 
        if(index==0){return null}
        return (
            <HeaderStick 
                key={String(category)} 
                keyID={String(category)} 
                title={Language.categorys[category]}//
                index={index}
            />
        )
    }

    
    
    const HeaderStick = memo(({keyID = 'stick_header', title, index = 'index'})=>{
        console.log('stick', index)
        const colorHeaderStick = useAnimatedStyle(()=>({color: textAP.value}))
        return (
            <View
                key={keyID} 
                style={{
                    height: STYCKYS_HEIGHT,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Reanimated.Text
                    style = {[colorHeaderStick, {
                        //color: Theme.texts.accents.primary,
                        fontSize: 20,
                        fontWeight: '500',
                        letterSpacing: 4,
                        fontVariant: ['small-caps'],
                    }]}
                >
                    {title}
                </Reanimated.Text>
            </View> 
        )
    })


    const paddingColums = useAnimatedStyle(()=>{
        return {
            paddingHorizontal: (fullWidth.value? 0 : SCREEN_PROXIMYTY_HRZ)/2
        }
    })


    const renderColums = useCallback(({item: data, index: indexSection})=>{
        console.log('render colums')
        
        return (
            <Reanimated.View
                key={String(data[0].category + indexSection)}
                style={[paddingColums, { //
                    width: DEVICE_W+2,
                    minHeight: LIST_ITEM_SIZE.h-SCREEN_PROXIMYTY_HRZ/2,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginLeft: -1,
                    //paddingHorizontal: -12,
                    //backgroundColor: 'red'
                }]}
                layout={Layout}
            >
                {data.map((item, index)=>renderItems({item: item, index: index}))}
            </Reanimated.View>
        )
    })

   





    const chosenItems = useRef([])

    const chosesMod = useSharedValue(0)

    const openItem = useSharedValue(null)
    const onOpen = (value) => {
        openItem.value = value
    }
    
    const changesClose = () => {
        chosenItems.current = []
        chosesMod.value = 0
    }


    const listItemPress = () => {
        
    }

    

    const listItemChosePress = (place) => { //props = task
        const {
            categoryIndex,
            itemIndex
        } = place
        console.log('press item', place)
        if(chosenItems.current.length > 0){
            let newChangesTask
            if(chosenItems.current.includes(place)){
                Vibration.vibrate([5,3, 30, 3])
                newChangesTask = chosenItems.current.filter(item=>JSON.stringify(item)!= JSON.stringify(place))                           
            } else {
                Vibration.vibrate([5,8])
                newChangesTask = [place, ...chosenItems.current]
            }
            chosenItems.current = newChangesTask
        } else {
            
        }
    }
    
    const listItemLongChosePress = (place) => { //props = key
        const {
            categoryIndex,
            itemIndex
        } = place
        Vibration.vibrate([5,8])
        console.log('long press item', place)
        chosenItems.current = [place]
    }



    const renderItems = useCallback(({item, index})=>(
        <Item 
            key = {`${item.category}_${item.indexSection}_${index}`}
            keyID={`${item.category}_${item.indexSection}_${index}`}
            item = {item}
            index = {index}

            chosenItems = {chosenItems}
            chosesMod = {chosesMod}
            openItem = {openItem}
            onOpen = {onOpen}

            listItemChosePress = {listItemChosePress}
            listItemLongChosePress = {listItemLongChosePress}
            listItemPress = {listItemPress}

            {...props}
        />
    ))

    
    const generalBG = useAnimatedStyle(()=>({backgroundColor: basicNP.value}))

    // GENERAL RENDER style={generalBG}
    return(
        <Reanimated.View >
        {console.log('########## BASE LIST GENERAL RENDER')}

        {/*HEADER PANEL*/}
        <HeaderBackground 
            animValueScrollY={animValueScrollY} 
            {...props}
        />

        {/*HEADER TOOLBAR*/}
        <HeaderToolBar
            chosesMod = {chosesMod}
            changesClose = {changesClose} 
            {...props}
        />

        {/*HEADER CATEGORY SELECTOR*/}
        <HeaderSectionsSelector
            animValueScrollY={animValueScrollY}
            openItem={openItem}
            showSection={showSection}
            {...props}
        />

        {/*BODY*/}
        <RSectionList
            ref={sectListRef}
            //initialNumToRender={2}
            showsVerticalScrollIndicator={false}
            onScroll={scrollSectionsList}
            sections={tasksStructure}
            keyExtractor={sectionExtractor}
            style={{
                paddingTop: PRIMARY_HEADER_HEIGHT-0.4, //0.4 - borderWidth
            }}
            ListHeaderComponent={
                <Reanimated.View
                    style={[paddingColums, {
                        width: '100%',
                        //backgroundColor: 'red',
                        height: HEAD_COMPONENT_HEIGHT,
                        marginBottom: SECTIONS_SELECTOR_HEIGHT,
                    }]}
                >   
                    <HeadItemList 
                        //uiStyle = {uiStyle}
                        //uiTheme = {uiTheme}
                        {...props}
                    />
                </Reanimated.View> 
            }
            renderSectionHeader={renderHeaderSticks}
            renderItem={renderColums}
            layout={Layout}
            ListFooterComponent = {
                <View 
                    style={{
                        //-HEAD_COMPONENT_HEIGHT    -statusBarHeight -itemCategoryHeight  -selectorLineHeight -headerStickysHeight
                        height: DEVICE_H  -LIST_ITEM_SIZE.h ,//+SCREEN_PROXIMYTY_HRZ/2, 
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}
                />
            } 
        />

    </Reanimated.View>)
}

const staticStyles = StyleSheet.create({
    FlatListsArea: {
        width: DEVICE_W,
    },
    frontFLArea: {
        marginHorizontal: 5,
        paddingHorizontal: 5,
        marginTop: 1,
    },

    frontFLText: {
        fontSize: 15,
        fontWeight: '500',
        fontVariant: ['small-caps'],
    },

    AnimatedHeaderText: {
        fontSize: 18,
        fontWeight: '500',
        letterSpacing: 0.5,
        fontVariant: ['small-caps'],
    }

});