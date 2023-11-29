import React, { useState, useRef, useEffect, useMemo, useCallback, memo, forwardRef } from "react";
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
    useAnimatedReaction,
    ZoomIn,
    FadeOut,
    ZoomOut,
    createAnimatedPropAdapter,
    convertToRGBA
} from 'react-native-reanimated';

import * as NavigationBar from 'expo-navigation-bar';

import { Svg, Path } from "react-native-svg";
import { BlurView } from "@react-native-community/blur";
import MaskedView from '@react-native-masked-view/masked-view';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import SkiaViewDisign from "../../../general_components/base_components/SkiaViewDisign";
import AsyncStorage from '@react-native-async-storage/async-storage';

import {connect, useSelector} from 'react-redux';
import mapStateToProps from "../../../app_redux_files/stateToProps";
import mapDispatchToProps from "../../../app_redux_files/dispatchToProps";
import store from "../../../app_redux_files/store";

import dataRedactor from "../../../app_async_data_manager/data_redactor";


import { listsHorizontalProximity } from "../../../app_values/AppDefault";

const { height: DEVICE_H, width: DEVICE_W } = Dimensions.get('window');

import { STRUCTURE, categorys, useGetTasks, getTasks, isEqual, getDateInfo } from "./tools";


import useTasksSizes, {TRANSPARENT_COLOR} from "./common_values";


import BobberButton from "./FAB";
import HeaderBackground from "./HeaderBackground";
import HeaderToolBar from "./HeaderToolBar";
import HeaderSectionsSelector from "./HeaderSectionsSelector";
import Item from "./ItemList";
import HeadItemList from "./HeadItemList";
import InputModal from "./ModalItemInput";


import useLanguage from "../../../app_hooks/useLanguage";


const Tasks = function(props){
    const {
        openSettingsWindow,
        uiTheme, //: global_aTheme,
        uiStyle, //: global_aStyle
        uiComposition,
        //uiStyle,
        //uiTheme,
        openDrawer,


        appLanguage,
        r_uiStyle,
        r_uiPalette,
        r_uiComposition,
        r_setTasksData,
        userData,
        tasksData,
    } = props

    const {
        weather: {
            type: weatherType 
        }
    } = uiComposition

    const {
        navigationMenu: {
            type: navigaterType 
        }
    } = uiStyle

    const {
        basics: {
            accents: {
                secondary: basicAS,
                tertiary: basicAT,
                
            },
            neutrals: {
                quaternary: basicNQ
            }
        },
        specials: {
            dimout
        }
    } = uiTheme

    const fabVisible = useSharedValue(0);//bottomBord

    const fabLongPress =()=>{
        console.log('pressj')
    }
  
    const backScreen = () => {
        Vibration.vibrate([5,8])
        //props.navigation.goBack()
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

    
    
    const menuPress = () => { 
        Vibration.vibrate([5,8])
        if(navigaterType.value == 'type_2' || weatherType.value == 'panel'){
            openDrawer()
        } else {
            openSettingsWindow()
            //props.navigation.navigate('settingsStack')
        }

    }

    
    const fabPress =()=>{
        console.log('pressa', )
        openModal()
        //testTasksAdd()
        //modalVisible.value = 1
    }


    const taskAdd = (task) => {
        console.log('taskAdd')
        const neystyTasks = store.getState().tasksData
        const newTasksData = [...neystyTasks, task]
        r_setTasksData(newTasksData)
        dataRedactor('storedTasks', newTasksData)
    }

    
    const taskEdit = (task) => {
        console.log('taskEdit')
        const newTasksData = [...store.getState().tasksData]
        const index = newTasksData.findIndex((item)=>item.keyId == task.keyId)
        newTasksData[index] = task
        r_setTasksData(newTasksData)
        dataRedactor('storedTasks', newTasksData)
    }


    const taskDelete = (taskPlacesList) => {
        console.log('taskDel')
        const deletingKeys = taskPlacesList.map((item)=>item.keyId)
        const tasks = [...store.getState().tasksData]
        const newTasksData = tasks.filter((item)=>!deletingKeys.includes(item.keyId))
        r_setTasksData(newTasksData)       
        dataRedactor('storedTasks', newTasksData) 
    }


    const taskCheck = (taskPlacesList) => {
        console.log('taskCheck')
        const checkingKeys = taskPlacesList.map((item)=>item.keyId)
        const tasks = [...store.getState().tasksData]
        const newTasksData = tasks.map((item)=>{
            if(checkingKeys.includes(item.keyId)){
                const newItem = JSON.parse(JSON.stringify(item))
                if(!newItem.compleated){
                    newItem.compleated = {
                        dateList: getDateInfo()
                    }
                } else {
                    newItem.compleated = null
                }
                return newItem
            }
            return item
        })
        r_setTasksData(newTasksData) 
        dataRedactor('storedTasks', newTasksData) 
    }


    const fabShow = (value) => {
        'worklet';
        cancelAnimation(fabVisible);
        fabVisible.value = value? 0 : 1
    }

    const modalRef = useRef()
    const openModal = (content) => {
        modalRef.current.present()
        if(content){
            setTimeout(()=>{modalRef.current.setItemContent(content)}, 24)   
        }
    }
    

    console.log('$$$$$$$ ? screen RENDER', )
    return (
    <>  
        <BasisList
            menuPress = {menuPress}


            fabShow={fabShow}
            fabPress = {fabPress}
            fabLongPress = {fabLongPress}

            openModal={openModal}
            taskEdit = {taskEdit}
            taskDelete = {taskDelete}
            taskCheck = {taskCheck}

            {...props}
        />
        
        <BobberButton 
            aVisible = {fabVisible}
            onPress = {fabPress}
            onLongPress = {fabLongPress}
   
            uiStyle={uiStyle}
            uiTheme={uiTheme}
            uiComposition={uiComposition}
        />

        <InputModal 
            modalRef = {modalRef}

            taskAdd = {taskAdd}
            taskEdit = {taskEdit}

            {...props}
        />
        
    </>)  
}
//mapStateToProps('TASKS'),
export default connect(undefined, mapDispatchToProps('TASKS'))(Tasks); 

//====================================================================================================================================
//====================================================================================================================================



const BasisList = function (props) {
    const {
        fabShow,

        taskDelete,
        taskCheck,

        uiStyle,
        uiTheme,
    } = props

    const {
        borderRadius: {
            primary: radiusP
        },
        lists: {
            proximity: {
                h: fullWidth
            }
        }
    } = uiStyle

    const {
        basics: {
            accents: {
                primary: basicAP,
                secondary: basicAS,
                tertiary: basicAT
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


    const {
        SCREEN_PROXIMYTY_HRZ,

        STYCKYS_HEIGHT,
        HEADER_TOOL_HEIGHT,
        SECTIONS_SELECTOR_HEIGHT,
        PRIMARY_HEADER_HEIGHT,
        SECONDARY_HEADER_HEIGHT,

        HEAD_COMPONENT_HEIGHT,
        LIST_ITEM_SIZE,

        DEVICE_H,
        DEVICE_W
    } = useTasksSizes()



    const sectListRef = useRef();

    const animValueScrollY = useSharedValue(0)
    
    const logg = (info) =>{
        'worklet';
        console.log('lg_'+info)
    }

    const scrollSectionsList = useAnimatedScrollHandler({
        onScroll: (event, ctx) => {
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



    const showSection = (indexSection, countItems = 0) => {
        const offset = (
            LIST_ITEM_SIZE.h *countItems 
            +HEAD_COMPONENT_HEIGHT
            //+openItem.value? : 0
            +(Math.max(indexSection, 0)*STYCKYS_HEIGHT)
        )
        sectListRef.current.scrollToOffset({
            offset: offset,
            animated: false,
        })
    }

    


    const sectionExtractor = (item, index) => String(item.category + index)
    
    
    const HeaderStick = memo(({keyID = 'stick_header', title})=>{
        console.log('stick', title)
        const colorHeaderStick = useAnimatedStyle(()=>({color: textAP.value}))

        const Title = () => {
            const Language = useLanguage().TasksScreen
            return (
                <Reanimated.Text
                    style = {[colorHeaderStick, {
                        //color: Theme.texts.accents.primary,
                        //flex: 1,
                        paddingLeft: 1.5*SCREEN_PROXIMYTY_HRZ+8+12,
                        fontSize: 19,
                        fontWeight: '500',
                        letterSpacing: 0.6,
                        fontVariant: ['small-caps'],
                    }]}
                >
                    {Language.categorys[title]}
                </Reanimated.Text>
            )
        }

        return (
            <Reanimated.View
                key={keyID} 
                style={{
                    height: STYCKYS_HEIGHT,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                }}
                entering={FadeIn}
                exiting={FadeOut}
            >
                <Title />
            </Reanimated.View> 
        )
    })


    const paddingColums = useAnimatedStyle(()=>{
        return {
            paddingHorizontal: (fullWidth.value??0)/2
        }
    })

    
    const Tile = memo(({item: {category, data}}) => {
        console.log('tile', category,)
        return (
            <Reanimated.View          
                style={[ paddingColums, { 
                    width: DEVICE_W+2,
                    minHeight: LIST_ITEM_SIZE.h-SCREEN_PROXIMYTY_HRZ/2,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginLeft: -1,
                }]}
                entering={FadeIn}
                layout={Layout}    
            >
                {data.map((item)=>(
                    <Item 
                        key = {`${category}_${item.keyId}`}
                        keyID={`${category}_${item.keyId}`}
                        category = {category}
                        item = {item}

                        chosenItems = {chosenItems}
                        chosesMod = {chosesMod}
                        openItem = {openItem}
                        onOpen = {onOpen}

                        listItemChosePress = {listItemChosePress}
                        listItemLongChosePress = {listItemLongChosePress}
                        listItemPress = {listItemPress}

                        {...props}
                    />
                ))}
            </Reanimated.View>
        )
    }, 
    (prevProps, nextProps)=>{
        return isEqual(prevProps.item, nextProps.item) 
    })
    

    const renderColums = useCallback((column)=>{
        const  {item: {category}, index: indexSection} = column
        console.log('Callback render colums', category)
        return (
            <Reanimated.View
                key={String('column_' + category)}
                layout={Layout}
            >
                {indexSection != 0 && <HeaderStick title={category}/>}
                <Tile {...column}/>
            </Reanimated.View>
        )
    })


    const chosenItems = useRef([])

    const chosesMod = useSharedValue(0)

    const openItem = useSharedValue(null)

    const onOpen = (value) => {
        console.log('open', value)
        openItem.value = value
    }
   

    const changesClose = () => {
        chosenItems.current = []
        chosesMod.value = 0
    }


    const listItemPress = () => {
        
    }

    
    const listItemChosePress = (place) => { 
        console.log('press item', place)
        let answer 
        if(chosenItems.current.length > 0){
            let newChangesTask
            const isInclude = (chosenItems.current).findIndex((item)=>item.keyId == place.keyId) != -1
            if(isInclude){
                Vibration.vibrate([5,3, 30, 3])
                newChangesTask = chosenItems.current.filter(item=>JSON.stringify(item)!= JSON.stringify(place))   
                chosesMod.value -= 1  
                answer = false                      
            } else {
                Vibration.vibrate([5,8])
                newChangesTask = [place, ...chosenItems.current]
                chosesMod.value += 1
                answer = true
            }
            chosenItems.current = newChangesTask
        } else {
            
        }
        return answer 
    }
    

    const listItemLongChosePress = (place) => {
        if(chosenItems.current.length == 0){
            Vibration.vibrate([5,8])
            console.log('long press item', place)
            chosenItems.current = [place]
            chosesMod.value = 1
            return true
        } else {
            return listItemChosePress(place)
        }
    }

    const changesCheck = () => {
        taskCheck(chosenItems.current)
        changesClose()
    }
    const changesDelete = () => {
        taskDelete(chosenItems.current)
        changesClose()
    }
    const changesAllDelete = () => {
        console.log('changesAllDelete is -', )
        changesClose()
    }

    




    const HeadComponent = memo(() => {

        const br = useAnimatedStyle(()=>{
            const r = interpolate(
                animValueScrollY.value, 
                [0, -HEAD_COMPONENT_HEIGHT], 
                [radiusP.value, 0],
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }  
            )
            return ({
                borderTopLeftRadius: r,
                borderTopRightRadius: r,
            })
            
        })

        const bordersPanel = useAnimatedStyle(()=>({
            backgroundColor: basicNP.value,
        }))

        const container = useAnimatedStyle(()=>{
            return {
                transform: [
                    {translateY: interpolate(
                        animValueScrollY.value, 
                        [0, -HEAD_COMPONENT_HEIGHT], 
                        [0, HEAD_COMPONENT_HEIGHT],
                        {
                            extrapolateLeft: Extrapolation.CLAMP,
                            extrapolateRight: Extrapolation.CLAMP
                        }  
                    )}
                ]
            }
        })

        const gradientColors = useDerivedValue(()=>([
            basicAP.value, basicAT.value
        ]))

        return (
            <Reanimated.View
                style={[{
                    width: '100%',
                    height: HEAD_COMPONENT_HEIGHT+SECTIONS_SELECTOR_HEIGHT,
                    //marginBottom: SECTIONS_SELECTOR_HEIGHT,
                    overflow: 'hidden'
                }]}
            >   
                <GradientBackground 
                    colors={ gradientColors}
                    size={{height: HEAD_COMPONENT_HEIGHT+SECTIONS_SELECTOR_HEIGHT, width: DEVICE_W}} 
                    container={container}
                />
                <HeadItemList container={container} {...props}/>
                <Reanimated.View 
                    style={[bordersPanel, br, {
                        position: 'absolute',
                        bottom: 0,         
                        height: SECTIONS_SELECTOR_HEIGHT,
                        width: '100%',
                    }]}
                />
            </Reanimated.View> 
        )
    })


    // GENERAL RENDER style={generalBG}
    return(
        <>
        {console.log('########## BASE LIST GENERAL RENDER')}
        <DataListItems
            reff={sectListRef}

            style={{
                paddingTop: PRIMARY_HEADER_HEIGHT-0.4, //0.4 - borderWidth
            }}
            layout={Layout}

            showsVerticalScrollIndicator={false}
            onScroll={scrollSectionsList}

            //data={tasks}
            keyExtractor={sectionExtractor}
            
            ListHeaderComponent={HeadComponent}
            ListEmptyComponent={<TaskIntro uiStyle={uiStyle} uiTheme={uiTheme} />}
            renderItem={renderColums}    
        />
        <HeaderBackground 
            animValueScrollY={animValueScrollY} 
            {...props}
        />
        <HeaderSectionsSelector
            animValueScrollY={animValueScrollY}
            openItem={openItem}
            showSection={showSection}
            {...props}
        />
        <HeaderToolBar
            chosesMod = {chosesMod}
            changesClose = {changesClose} 

            changesCheck = {changesCheck}
            changesDelete = {changesDelete}
            changesAllDelete = {changesAllDelete}


            {...props}
        />
    </>)
}

const RCanvas = Reanimated.createAnimatedComponent(Canvas)

const GradientBackground = (props) => {
    const {
        size,
        colors,
        container
    } = props

    return (
        <RCanvas
            style={[container, {
                ...size,
                position: 'absolute',
                top: 0,
                left: 0
            }]}
        >
            <Rect x={0} y={0} width={size.width} height={size.height}>
                <LinearGradient
                    start={vec(0, 0)}
                    end={vec(0, size.height)}
                    colors={colors}
                />
            </Rect>
        </RCanvas>
    )
}

import { createrTaksStructure } from "./tools";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";

const ListItems = memo((props) => {
        const {
            LIST_ITEM_SIZE,
            STATUS_BAR_HEIGHT,
            DEVICE_H,
        } = useTasksSizes()

        const dataStructure = createrTaksStructure(props.tasksData)
        console.log('dataStructure', dataStructure)
        return (
        <Reanimated.FlatList 
            data={dataStructure} 
            {...props} 
            ref = {props.reff}
            ListFooterComponent = {
                <View 
                    style={{
                        height: dataStructure.length > 0? (DEVICE_H -LIST_ITEM_SIZE.h+STATUS_BAR_HEIGHT-3): 200,
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}
                />
            } 
        />
        )
    }, 
    (prev, next)=>isEqual(prev.tasksData, next.tasksData)
)
const DataListItems = connect(mapStateToProps('TASKS_LIST'))(ListItems);



const TaskIntro = (props) => {
    const {
        uiStyle,
        uiTheme
    } = props

    const {
        borderRadius : {
            primary: borderRadius,

        },
        lists: {
            proximity: {
                h: fullWidth
            }
        },
        effects: {
            shadows,
        }
    } = uiStyle

    const {
        basics: {
            neutrals: {
                secondary
            },
            accents: {
                secondary: itemColor
            }
        },
        icons: {
            accents: {
                tertiary: iconAT,
            },
            neutrals: {
                secondary: iconNS,
                tertiary: iconNT
            }
        },
        texts: {
            accents: {
                tertiary: textAT,
            },
            neutrals: {
                primary: textNP,
                secondary: textNS,
                tertiary: textNT
            }
        },
        specials: {
            shadow,/* : {
                primary: shadowColorP,
                secondary: shadowColorS
            },*/
            selector :{
                primary: checkBoxP,
                quaternary: checkBoxS,
            },
            separator,
        },
        
    } = uiTheme

    const {
        LIST_ITEM_SIZE,
    } = useTasksSizes()

    const itemsMargin = useDerivedValue(()=>{
        const margin = (fullWidth.value?? 0 )*0.5
        return {
            l: margin,
            r: margin,
            t: margin,
            b: margin,
        }
    })
    /* 
    const aShadows = useDerivedValue(()=>{
        return {
            style: shadows.value,
            colors: {
                primary: shadowColorP.value,
                secondary: shadowColorS.value,
            } 
        }
    })*/

    const paddingColums = useAnimatedStyle(()=>{
        return {
            paddingHorizontal: (fullWidth.value?? 0 )/2
        }
    })

    const aSize = useDerivedValue(()=>{
        const margin = (fullWidth.value?? 0 )/2
        return {
            width: 2 * (LIST_ITEM_SIZE.w-margin),
            height: 1 * (LIST_ITEM_SIZE.h) -20,
        }
    })

    const itemSize = useAnimatedStyle(()=>{
        const margin = (fullWidth.value?? 0 )/2
        return {
            width: 2 * (LIST_ITEM_SIZE.w -margin),
            height: 1 * (LIST_ITEM_SIZE.h) -20,
        }
    }) 

    const dynamicStyleListItems = useAnimatedStyle(()=>{
        return {
            marginHorizontal: itemsMargin.value.l,
            marginVertical: itemsMargin.value.t,

            borderRadius: borderRadius.value, //itemsBR.value, // raStyle.borderRadius.basic.value,

            width: aSize.value.width-2*itemsMargin.value.l,
            height: aSize.value.height-2*itemsMargin.value.t
        }
    })

    const text = useLanguage().TasksScreen.intro

    const textColor = useAnimatedStyle(()=>({
        color: textNP.value
    }))
    
    return (
        <Reanimated.View
            style={[paddingColums, itemSize, {
                width: '100%',
            }]}
            exiting={FadeOut.duration(150)}
        >   
            <Reanimated.View 
                style={[itemSize, {

                }]}
            > 
                <SkiaViewDisign 
                    aBorderRadius = {borderRadius} //itemsBR
                    aBGColor = {itemColor} //itemsBG
                    fullShadowMargin = {itemsMargin}
        
                    aShadowColor = {shadow}
                    aShadowStyle = {shadows}

                    aSize = {aSize}
                    innerShadow={{
                        used: true,
                        borderWidth: 0
                    }}
                />
                <Reanimated.View 
                    style={[dynamicStyleListItems, {
                        overflow: 'hidden',
                        padding: 18
                    }]}
                >
                    <Reanimated.Text
                        style={[textColor, {
                            fontSize: 16,
                            lineHeight: 25
                        }]}
                    >
                        {`  `}{text[0]}
                        {`\n`}
                        {`  `}{text[1]}
                        {` `}<MaterialCommunityIcons name="sticker-plus-outline" size={24}/>
                    </Reanimated.Text>
                </Reanimated.View>
            </Reanimated.View>
        </Reanimated.View> 
    )
}

const staticStyles = StyleSheet.create({
    
});