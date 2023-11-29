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
    Vibration,
    ScrollView, 
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
    ZoomInDown,
    FadeInDown,
    SlideOutLeft,
    SlideInRight,
    SlideOutRight,
    ZoomOut,
    FadeOut,
    SlideInDown,
    SlideInUp,
    convertToRGBA,
    createAnimatedPropAdapter,
    processColor
} from 'react-native-reanimated';

import { BlurView } from "@react-native-community/blur";
import MaskedView from '@react-native-masked-view/masked-view';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import  { Svg, Path, Defs, LinearGradient, Stop } from "react-native-svg";
const RPath = Reanimated.createAnimatedComponent(Path);
const RStop = Reanimated.createAnimatedComponent(Stop);


import SkiaViewDisign from "../../../general_components/base_components/SkiaViewDisign";
import BaseBox from "../../../general_components/base_components/BaseBox";


const RPressable = Reanimated.createAnimatedComponent(Pressable);

import { getDateInfo, isEqual  } from "./tools";
import useTasksSizes, {TRANSPARENT_COLOR} from "./common_values";



import useLanguage from "../../../app_hooks/useLanguage";

const PATH = "M2 17H11.0092L17 4L26.5 30L33 13L38 19L46.5 4L52.5 27L57 17L59 13L62 17H124"
const LEN_PATH = 188.4635772705078 //186.72584533691406 
const LEN_PATH_2 = 188.09034729003906 //198.08993530273438

export default Item = memo((props) => {
    const {
        keyID,
        item,
        category,
        index,
        chosenItems,
        chosesMod,
        openItem,
        onOpen,

        openModal,
        taskDelete,
        taskEdit,
        taskCheck,


        listItemChosePress,
        listItemLongChosePress,
        listItemPress,

        uiStyle,
        uiTheme

    } = props

    const {
        borderRadius : {
            primary: borderRadius,
            secondary: additionalBorderRadius
        },
        selectors: {
            design: {
                checkBox,
                radioButton,
            }
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
                secondary: itemColor
            },
            accents: {
      
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
                secondary: textNS,
                tertiary: textNT
            }
        },
        specials: {
            shadow, /* : {
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


    const place = {
        category: category,
        keyId: item.keyId,
    }

    const [scale, setScale] = useState(false)
    const choses = useSharedValue(false)

    useAnimatedReaction(()=>(chosesMod.value == 0 && choses.value == true), (newValue)=>{if(newValue){choses.value = false}})
    useAnimatedReaction(()=>
        Object.values(openItem.value ?? {}).includes(place.keyId), 
        (newValue)=>{
            console.log(newValue, '|', scale)
            if(newValue != scale){runOnJS(setScale)(newValue)}
        }
    )

    const doneState = useSharedValue(item.compleated? 1 : 0)

    const doneItem = () => {
        taskCheck([place])
        doneState.value = (doneState.value == 0? 1 : 0)
    }

    const headerPress = (_, state) => {
        const newState = state?? listItemChosePress(place)
        console.log('headerPress', newState)
        if(newState != undefined){
            choses.value = newState
        } else {
            doneItem()
        }
        
    }

    const headerLongPress = () => {
        const newState = listItemLongChosePress(place)
        headerPress('', newState)
    }


    const contentPress = () => {
        console.log('contentPress', Object.values(openItem.value ?? {}).includes(place.keyId))
        onOpen(Object.values(openItem.value ?? {}).includes(place.keyId)? null : place) 
    }


    const itemsMargin = useDerivedValue(()=>{
        const margin = (fullWidth.value?? 0 )*0.5 || 1
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
    }) */

    const rippleProps = useAnimatedProps(()=>({
        android_ripple: {
            color: `${textNS.value}18`,
            //borderless: true,
            foreground: false
        }
    }))


    const chosesStyle = useAnimatedStyle(()=>{
        return {
            opacity: withTiming(chosesMod.value > 0? 1 : 0),
            zIndex: chosesMod.value > 0? 2 : 1,
        }
    })

    
    const doneBoxStyle = useAnimatedStyle(()=>{
        return {
            opacity: chosesMod.value > 0? 0 : 1,
            zIndex: chosesMod.value > 0? 1 : 2,
        }
    })

    const itemDoneStyle = useAnimatedStyle(()=>{
        return {
            opacity: withTiming((doneState.value == 1 && !scale)? 0.42 : 1, {duration: 200})
        }
    })

    const separatorStyle = useAnimatedStyle(()=>{
        return {
            backgroundColor: separator.value
        }
    })


    const aSize = useDerivedValue(()=>{
        const margin = (fullWidth.value?? 0 )/2
        return {
            width: (scale? 2 : 1) * (LIST_ITEM_SIZE.w-margin),
            height: (scale? 2 : 1) * (LIST_ITEM_SIZE.h)//-margin,
        }
    })

    const itemSize = useAnimatedStyle(()=>{
        const margin = (fullWidth.value?? 0 )/2
        return {
            width: (scale? 2 : 1) * (LIST_ITEM_SIZE.w -margin),
            height: (scale? 2 : 1) * (LIST_ITEM_SIZE.h),
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


    const exiting = (values) => {
        'worklet';
        const animations = {
          // your animations
          transform: [
            {scale: withTiming(0)}
          ],
          opacity: withTiming(0),
        };
        const initialValues = {
          // initial values for animations
          transform: [
            {scale: scale? 2 : 1}
          ],
          opacity: 1,
        };
        const callback = (finished) => {
          // optional callback that will fire when layout animation ends
        };
        return {
          initialValues,
          animations,
          callback,
        };
    }

    const entering = (values) => {
        'worklet';
        const animations = {
          // your animations
          transform: [
            {scale: withTiming(1)}
          ],
          opacity: withTiming(1),
        };
        const initialValues = {
          // initial values for animations
          transform: [
            {scale: 0}
          ],
          opacity: 0,
        };
        const callback = (finished) => {
          // optional callback that will fire when layout animation ends
        };
        return {
          initialValues,
          animations,
          callback,
        };
    }


    const ref = useRef(null);


    const beatBG = useAnimatedProps(() => ({
            stroke: iconNT.value
        }), 
        [], 
        createAnimatedPropAdapter(
            (props) => {
                'worklet';
            /*
            if (Object.keys(props).includes('fill')) {
                props.fill = {type: 0, payload: processColor(props.fill)}
            }*/
            if (Object.keys(props).includes('stroke')) {
                props.stroke = {type: 0, payload: processColor(props.stroke)}
            }
            },
            ['stroke']
        )
    )

    const getDeadlineProgress = () => {
        const target = new Date(...item.tracking.dateList).getTime()/1000 
        const current = getDateInfo()
        const currentDate = new Date(...current).getTime()/1000 
        const progress = 1 -(Math.max(target-currentDate, 0)/(12*3600)) 
        return Math.min(Math.max(progress, 0), 1)
    }

    const deadlineProgress =  getDeadlineProgress()

    const beatProps = useAnimatedProps(() => ({
            strokeDashoffset: interpolate(
                deadlineProgress,
                [0, 1],
                [LEN_PATH, 0],
                {extrapolateLeft: Extrapolation.CLAMP, extrapolateRight: Extrapolation.CLAMP}
            ),
            stroke: iconAT.value
        }),
        [], 
        createAnimatedPropAdapter(
            (props) => {
                'worklet';
            /*
            if (Object.keys(props).includes('fill')) {
                props.fill = {type: 0, payload: processColor(props.fill)}
            }*/
            if (Object.keys(props).includes('stroke')) {
                props.stroke = {type: 0, payload: processColor(props.stroke)}
            }
            },
            ['stroke']
        )
    )

    const beatGrad = useAnimatedProps(() => ({
        strokeDashoffset: interpolate(
            Math.min(deadlineProgress+0.007, 1),
            [0, 1],
            [LEN_PATH_2, 0],
            {extrapolateLeft: Extrapolation.CLAMP, extrapolateRight: Extrapolation.CLAMP}
        ),
    }))


    const stopColor = useAnimatedProps(()=>({
        stopColor: iconAT.value
    }))

   

    const ToolBarButton = (props) => {
        const {
            keyID,
            icon,
            isStick,
            buttonProps,
            size = 16,
            stickSize = 25
        } = props

        const rippleProps = useAnimatedProps(()=>({
            android_ripple: {
                color: `${iconNS.value}18`,
                //borderless: true,
                foreground: false
            }
        }))

        const iconsColor = useAnimatedStyle(()=>({color: iconNS.value}))

        const widthButton = useAnimatedStyle(()=>({
            width: (2*LIST_ITEM_SIZE.w-2-((fullWidth.value?? 0 )* 1.75))/6,
        }))

        return (
            <RPressable
                keyID={keyID}
                style={[widthButton, {
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }]}
                animatedProps={rippleProps}
                {...buttonProps}
                layout={Layout}
                //entering={FadeIn.duration(150)}
                //exiting={FadeOut.duration(250)}
            >   
                {!isStick && 
                <Reanimated.Text
                    style={[{
                        position: 'absolute',
                        top: 8.2
                    }, iconsColor]}
                >
                    <MaterialCommunityIcons name={'sticker-outline'} size={stickSize}/>
                </Reanimated.Text>}
                <Reanimated.Text
                    style={[{
                        color: iconNS,
                        top: isStick? 1 : 2
                    }, iconsColor]}
                >
                    <MaterialCommunityIcons name={icon} size={isStick? stickSize : size}/>
                </Reanimated.Text>
            </RPressable>
        )
    }


    const expandToolBar = useSharedValue(0)
    const hideDone = useAnimatedStyle(()=>({
        opacity: withTiming(expandToolBar.value == 0? 1 : 0)
    }))

    
    const editPress = () => {
        openModal(item)
    }

    const delItem = () => {
        taskDelete([place])
    }

    const StickToolBar = () => {
        const contentCollapse = () => {      
            if(expandToolBar.value != 0){
                toolBarExpand()
            }
            contentPress()
        }


        const toolBarExpand = () => {
            setTools((value)=>{
                if(value.length <= 3){
                    expandToolBar.value = 1
                    return [...value.slice(0,2), ...addTools, ...value.slice(2)]
                } else {
                    expandToolBar.value = 0
                    return [...value.slice(0,2), ...value.slice(5),]
                }
            })
        }

        const basicTools = [
            {
                icon: "arrow-collapse",
                isStick: false,
                buttonProps: {
                    onPress: contentCollapse
                }
            },
            
            {
                icon: "pencil",
                isStick: false,
                buttonProps: {
                    onPress: editPress 
                }
            },
            {
                icon: "dots-horizontal",
                isStick: false,
                buttonProps: {
                    onPress: toolBarExpand
                }
            }
        ]

        const addTools = [
            {
                icon: "sticker-minus-outline",
                isStick: true,
                buttonProps: {
                    onPress: delItem
                }
            },
            {
                icon: "repeat-variant",
                isStick: false,
                size: 14,
                buttonProps: {

                }
            },
            {
                icon: "bell",
                isStick: false,
                size: 10,
                buttonProps: {

                }
            },
        ]


        const [tools, setTools] = useState(basicTools)

        const bg = useAnimatedStyle(()=>({
            //backgroundColor: 'red',//itemColor.value,
            //borderColor: `${separator.value}20`,
            //borderLeftWidth: tools.length > 3 ?  0.8 : 0
        }))

        return (
            <Reanimated.View
                style={{
                    flex: 1,
                    //backgroundColor: 'red',
                    //alignItems: 'center'
                    //flexDirection:'row',
                }}
                entering={SlideInRight}
                exiting={FadeOut.duration(150)}
            >
                <Reanimated.View
                    style={[{
                        position: 'absolute',
                        height: '100%',
                        //marginTop: 5,
                        //borderTopLeftRadius: 20,
                        //borderBottomLeftRadius: 20,
                        flexDirection: 'row',
                        overflow: 'hidden',
                        right: 0
                    }]}
                    layout={Layout.springify().mass(0.5)}
                >
                    {tools.map((item, index)=>(
                        <ToolBarButton 
                            key = {item.icon}
                            keyID = {item.icon}
                            {...item}
                        />
                    ))}
                </Reanimated.View>
            </Reanimated.View>
        )
    }


    const DoneCheckBox = (props) => {
        const {
            size = 25
        } = props

        const falseStyle = useAnimatedStyle(()=>({
            opacity: withTiming(doneState.value == 0? 1 : 0),
            color: iconNT.value,
        }))

        const trueStyle = useAnimatedStyle(()=>({
            opacity: withTiming(doneState.value == 1? 1 : 0),
            color: iconAT.value,
        }))

        return (
            <Reanimated.View
                style={[doneBoxStyle, staticStyles.tapBox]}
            >
                <Reanimated.Text
                    style={[{
                        position: 'absolute',
                    }, falseStyle]}
                >
                    <MaterialCommunityIcons name={'sticker-check-outline'} size={size}/>
                </Reanimated.Text>
                <Reanimated.Text
                    style={[{}, trueStyle]}
                >
                    <MaterialCommunityIcons name={'sticker-check'} size={size}/>
                </Reanimated.Text>
            </Reanimated.View>
        )
    }

    const timeColor = useAnimatedStyle(()=>({
        color: textNS.value
    }))

    const textColor = useAnimatedStyle(()=>({
        color: textNS.value
    }))


    const StageItem = (props) => {
        const {
            keyId,
            description,
            compleated
        } = props

        const StageText = (
            <Reanimated.Text
                numberOfLines={2}
                style={[textColor, {
                    fontSize: 16,
                    marginLeft: 4,
                    flex: 1,
                }]}
            >
                {description}
            </Reanimated.Text>
        )

        const onPress = () => {
            const newItem = JSON.parse(JSON.stringify(item))
            const index = item.content.stages.findIndex((st)=>st.keyId == keyId)
            newItem.content.stages[index].compleated = !compleated
            taskEdit(newItem)
        }
        

        return (
            <BaseBox
                
                key={keyId}
                size={22}
                isCheckBox={true}
                check = {compleated}
                onPress = {onPress}
                android_ripple={{
                    color: `${textNS.value}18`,
                    borderless: true,
                    foreground: false
                }}
                style={{
                    flex: 1,
                    height: 48,
                    borderRadius: 24,
                }}
                aBorderRadius = {additionalBorderRadius}
                aDesignType = {checkBox}
                aColors={{
                    background: itemColor,
                    primary: checkBoxP,
                    secondary: checkBoxS,
                }}
                Item={StageText}
            />
        )
    }
    const Stages = () => {
        if(!item.content.stages){
            return null
        }
        return (
            <View
                style={{
                    gap: 2,
                    paddingBottom: 24
                }}
            >
                {item.content.stages.map((stageInfo)=><StageItem key={stageInfo.keyId} {...stageInfo} />)}
            </View>
        )
    }

    const SEPARATORS = false

    const progressBarBG = useAnimatedStyle(()=>({
        backgroundColor: iconNT.value,
        borderRadius: additionalBorderRadius.value
    }))

    /* 
    const stagesProgress = useDerivedValue(()=>
        (!item.content.stages? 0 : (item.content.stages?.reduce((acc, cur)=>acc+(cur.compleated? 1 : 0), 0)/item.content.stages?.length)),
        [item.content.stages]
    )
    console.log('stagesProgress', stagesProgress)
    */

    const stagesProgress = (!item.content.stages? 0 : (item.content.stages?.reduce((acc, cur)=>acc+(cur.compleated? 1 : 0), 0)/item.content.stages?.length))
        
    
    const progressBar = useAnimatedStyle(()=>{
        
        return {
            /* 
            width: interpolate(
                stagesProgress,//.value,
                [0, 1],
                [0, 120]
            ),*/
            backgroundColor: iconAT.value,
            borderRadius: additionalBorderRadius.value
        }
    }, [])

    const formatNum = (num) => `${num > 9?'':'0'}${num}`
    const getFormatTime = (dateList) => `${formatNum(dateList[3])}:${formatNum(dateList[4])}`
    const getFormatDate = (dateList) => `${formatNum(dateList[2])}.${formatNum(dateList[1])}.${formatNum(Number(String(dateList[0]).slice(2)))}`

    const proxColor = useAnimatedStyle(()=>{
        return {
            color: textNT.value
        }
    })

    const DateTimeProximity = (props) => {
        const {
            prefix,
            data
        } = props

        const Language = useLanguage().TasksScreen.listItems

        if(!data){return null}
        return (
            <Reanimated.Text
                style={[proxColor, {
                    fontSize: 14,
                }]}
                layout={Layout}
                entering={FadeIn}
                exiting={FadeOut.duration(150)}
            >
                {Language[prefix]} {getFormatDate(data)}{` / `}{getFormatTime(data)}
            </Reanimated.Text>
        )
    }
  
    console.log('item render', item)
    return (
        <Reanimated.View 
            key={keyID}
            style={[itemSize, {
                //backgroundColor: 'red'
            }]}
            layout={CurvedTransition.easingX(Easing.in(Easing.elastic(1)))} //.easingY(Easing.out(Easing.elastic(1.2)))
            entering={entering}
            exiting={exiting}
        >    
            {true && 
            <SkiaViewDisign 
                aBorderRadius = {borderRadius} //itemsBR
                aBGColor = {itemColor} //itemsBG
                fullShadowMargin = {itemsMargin}
  
                aShadowStyle={shadows}
                aShadowColor={shadow}

                aSize = {aSize}
                innerShadow={{
                    used: true,
                    borderWidth: 0
                }}
            />}
            <Reanimated.View 
                //layout={FadingTransition} 
                layout={Layout}
                //exiting={FadeInDown}
                style={[dynamicStyleListItems, {
                    backgroundColor: TRANSPARENT_COLOR,
                    //borderRadius: borderRadius,
                    //alignItems: 'center',
                    overflow: 'hidden'
                }]}
            >
                <Reanimated.View
                    style={{
                        flexDirection: 'row'
                    }}
                    //layout={FadingTransition} 
                >
                    <RPressable
                        style={[{
                            width: '100%',
                            maxWidth: LIST_ITEM_SIZE.w-2-12,
                            height: 40, 
                            padding: 6,
                            paddingBottom: 0,
                           //backgroundColor: 'blue',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }, hideDone]}
                        animatedProps={rippleProps}
                        onPress={headerPress}
                        onLongPress={headerLongPress}  
                        //layout={Layout}
                        hitSlop={{left: 0, right: 0, bottom: 4, top: 4}}
                    >
                        <View
                            style={{
                                height: 34,
                                width: 26,
                                marginLeft: 6,
                            }}
                        >    
                            <BaseBox
                                size={22}
                                isCheckBox={true}
                                aCheck = {choses}
                                style={[chosesStyle, staticStyles.tapBox, {left: 5.5, top: 4} ]}
                                aBorderRadius = {additionalBorderRadius}
                                aDesignType = {checkBox}
                                aColors={{
                                    background: itemColor,
                                    primary: iconAT,//checkBoxP,
                                    secondary: iconNT,//checkBoxS,
                                }}
                            />
                            <DoneCheckBox/>
      
                        </View>
                                
                        <Reanimated.View
                            style={[{
                                height: 34,
                                width: 125,
                                //backgroundColor: 'blue'
                            }, itemDoneStyle]}
                            layout={Layout}
                        >
                            {true && 
                            <Svg width="124" height="34" viewBox="0 -1 124 34" fill="none">
                                <RPath                             
                                    d="M2 17H11.0092L17 4L26.5 30L33 13L38 19L46.5 4L52.5 27L57 17L59 13L62 17H112" 
                                    strokeWidth="2.4" 
                                    strokeLinecap="round"
                                    animatedProps={beatBG}
                                />
                                
                                <RPath 
                                    d="M0.5 21.5H13.5L16.5 15.5L26 42L34.5 22L38.5 27.5L45 16L51.5 40.5L60.5 20.5L61 21 L111.5 21.5" 
                                    stroke="url(#paint0_linear_572_614)"
                                    strokeWidth="7" 
                                    strokelinecap="square"
                                    strokeDasharray={`${LEN_PATH_2} ${LEN_PATH_2}`}
                                    animatedProps={beatGrad}
                                    
                                />


                                <RPath 
                                    d="M2 17H11.0092L17 4L26.5 30L33 13L38 19L46.5 4L52.5 27L57 17L59 13L62 17H112"
                                    strokeWidth="2.4" 
                                    strokeLinecap="round"
                                    strokeDasharray={`${LEN_PATH} ${LEN_PATH}`}
                                    animatedProps={beatProps}
             
                                    /*
                                    ref={ref} 
                                    onLayout={() =>{
                                        const len = ref.current?.getTotalLength()
                                        console.log('layout len 1', len, (LIST_ITEM_SIZE.w-2-12-12-40))
                                        //setLength(len)
                                    }} */
                                />
                               

                                <Defs>
                                    <LinearGradient id="paint0_linear_572_614" x1="0" y1="7" x2="0" y2="52.5" gradientUnits="userSpaceOnUse">
                                        <Stop stopOpacity="0.6" stopColor={iconAT.value}/>
                                        <Stop offset="0.390625" stopColor="#00000000" stopOpacity="0"/>
                                    </LinearGradient>
                                </Defs>
               

                            </Svg>}
                            <Reanimated.Text
                                style={[{
                                    position: 'absolute',
                                    right: 18,
                                    fontSize: 14,
                                    top: -1.1,
                                    fontWeight: '800',
                                    letterSpacing: 0.6,
                                }, timeColor]}
                            >
                                {getFormatTime(item.tracking.dateList)}
                            </Reanimated.Text>
                            {!["today", "tomorrow"].includes(category) &&
                            <Reanimated.Text
                                style={[{
                                    position: 'absolute',
                                    right: 5,
                                    fontSize: 13,
                                    top: 17,
                                    fontWeight: '500',
                                    //letterSpacing: 0.6,
                                }, timeColor]}
                            >
                                {getFormatDate(item.tracking.dateList)}
                            </Reanimated.Text>}
                        </Reanimated.View>
                    </RPressable> 
                    {scale && <StickToolBar/>}
                </Reanimated.View>

                {SEPARATORS && <Reanimated.View style={[{height: 0.8, width: "86%", opacity: 0.24, borderRadius: 1, alignSelf: 'center', marginTop: 1}, separatorStyle]} layout={Layout}/>}
                
                
                {!scale && <RPressable
                    disabled={scale}
                    style={{
                        flex: 1,
                        //marginBottom: 20,
                        padding: 6,
                        paddingTop: 0
                        //backgroundColor: 'green'
                    }}
                    animatedProps={rippleProps}
                    //layout={FadingTransition} 
                    entering={FadeIn}
                    exiting={FadeOut}
                    onPress={contentPress}
                >
                    <Reanimated.View
                        style={[{
                            flex: 1,
                            overflow: 'hidden'
                        },]} //textFrame
                    > 
                        <Reanimated.Text
                            style={[{
                                fontSize: 16,
                                flex: 1,
                                
                            }, itemDoneStyle, textColor]}
                            //numberOfLines={8}
                            //animatedProps={textProps}
                            layout={Layout}
                        >
                            {item.content.description}
                        </Reanimated.Text>
                    </Reanimated.View>
                </RPressable>}

                {scale && 
                <Reanimated.ScrollView
                    style={{
                        flex: 1,
                        //marginBottom: 20,
                        padding: 6,
                        paddingTop: 0
                        //backgroundColor: 'green'
                    }}
                    nestedScrollEnabled={true}
                    layout={Layout} 
                    entering={FadeIn}
                    exiting={FadeOut.duration(200)}
                >
                    <Reanimated.Text
                        style={[{
                            fontSize: 16,
                            flex: 1,
                            
                        }, itemDoneStyle, textColor]}
                        //numberOfLines={8}
                        //animatedProps={textProps}
                        layout={Layout}
                    >
                        {item.content.description}
                    </Reanimated.Text>
                    <Stages />
                </Reanimated.ScrollView>}

                {SEPARATORS && <Reanimated.View style={[{height: 0.8, width: "86%", opacity: 0.24, borderRadius: 1, alignSelf: 'center', marginBottom: 18}, separatorStyle]} layout={Layout}/> } 
                <Reanimated.View 
                    style={[{
                        height: 24,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingBottom: 4,
                    }, itemDoneStyle]}
                    layout={Layout}
                >
                    {!scale && item.content.stages &&
                    <Reanimated.View 
                        style={[progressBarBG, {
                            height: 5, 
                            marginBottom: 4,
                            width: 120,
                            overflow: 'hidden'
                        }]}
                        layout={Layout}
                        entering={FadeIn.delay(100)}
                        exiting={FadeOut}
                    >
                        <Reanimated.View 
                            style={[progressBar, {
                                position: 'absolute',
                                width: 120*stagesProgress,
                                height: 5, 
                                left: 0,
                            }]}
                        />
                    </Reanimated.View>}

                    {scale &&

                    <View
                        style={{
                            alignSelf: 'flex-start',
                            marginHorizontal: 28,
                        }}
                    >
                        {item.compleated && 
                        <DateTimeProximity 
                            prefix="end"
                            data={item.compleated?.dateList}
                        />} 
                        {!item.compleated &&
                        <DateTimeProximity 
                            prefix="from"
                            data={item.created.dateList}
                        />}
                    </View>
                    }

                </Reanimated.View>
            </Reanimated.View>
        </Reanimated.View>
    )
},
(prevProps, nextProps)=>{
    return isEqual(prevProps.item, nextProps.item) 
})


const staticStyles = StyleSheet.create({
    tapBox: {
        position: 'absolute',
        top: 2,
        left: 4
    }
});