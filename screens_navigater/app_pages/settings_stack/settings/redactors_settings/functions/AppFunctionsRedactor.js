import React, {useState, useRef, useEffect} from "react";

import { 
    StyleSheet, 
    Text, 
    Pressable, 
    ScrollView,
    FlatList, 
    SectionList,
    Modal, 
    View,
    Button, 
    Dimensions, 
    Switch, 
    ActivityIndicator, 
    TextInput,
    Keyboard,
    Vibration
} from 'react-native';

import Reanimated, {
    useDerivedValue,
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

import DraggableFlatList, {ScaleDecorator,} from "react-native-draggable-flatlist";

import { MaterialCommunityIcons } from '@expo/vector-icons';

import dataRedactor from "../../../../../../app_async_data_manager/data_redactor";

import BaseBox from "../../../../../../general_components/base_components/BaseBox";

import commonStaticStyles, { SwitchField, BoxsField, ripple } from "../CommonElements";

import useLanguage from "../../../../../../app_hooks/useLanguage";

export default AppFunctionsRedactor = (props) => {
    const {
        uiComposition,

        r_uiStyle,
        Theme,
        
    } = props

    const {
        appFunctions
    } = uiComposition

    //const Theme = r_uiPalette[ThemeSchema]

    const screenSubsequence = () => {
        const subsequence = new Array(Object.keys(appFunctions).length)
        for(const key in appFunctions){
            const item = appFunctions[key]
            subsequence[item.useId.value] = key// item.used.value
        }
        return subsequence
    }

    
    const getGroup = (changeIndex = -1) => {
        'worklet';
        let group = []
        
        //if(checkGroup){
        if(usedScreens?.value){
            //checkGroup.map((item, index)=>{
            usedScreens?.value.map((item, index)=>{
                if(changeIndex != -1){
                    group.push(changeIndex == index? !item : item)
                } else {
                    group.push(item)
                }
            })
        } else {
            Object.keys(appFunctions).map((key, index)=>{
                const isUsed = appFunctions[key].used.value
                if(changeIndex != -1){
                    group.push(changeIndex == index? !isUsed : isUsed)
                } else {
                    group.push(isUsed)
                }
            })
        }
        return group
    };


    const usedScreens = useDerivedValue(()=>{
        //aValue? console.log('UPDATE', groupItems, aValue.value) : null
        return getGroup()
    }, [appFunctions])
 
    const [screenOrder, setScreensOrder] = useState(screenSubsequence());

    //console.log('screens', screenOrder, usedScreens.value)


    const settingFunctions = (index, subsequence) => {
        const newGroup = index != undefined? getGroup(index) : usedScreens.value
        const usedSubsequence = subsequence? subsequence : screenOrder

        const countScreens = (newGroup.filter((el)=>el)).length

        if(countScreens == 0){return}
        //console.log('usedSubsequence', usedSubsequence)
        //console.log('usedSubsequence', newGroup, countScreens)
        

        Object.keys(appFunctions).map((item, index)=>{
            appFunctions[item].used.value = newGroup[index]
            appFunctions[item].useId.value = usedSubsequence.indexOf(item)
        })

        if((usedScreens.value).join() != newGroup.join()){
            usedScreens.value = newGroup
        }
        if(screenOrder.join() != usedSubsequence.join()){
            setScreensOrder(usedSubsequence)
        }
    }
    
    const endDrag = ({ data }) => {
        //console.log('funcs', data)
        settingFunctions(undefined, data)
    }
    
    const ItemTitle = (props) => {
        const Language = useLanguage()
        const titles = {
            'tasks':       Language.TasksScreen.HeaderTitle,
            "analytics":   Language.AnalyticsScreen.HeaderTitle,
            "notes":       Language.NotesScreen.HeaderTitle,
            "timetable":   Language.TimetableScreen.HeaderTitle
        } 
        const title = titles[props.title].charAt(0).toUpperCase() + titles[props.title].slice(1)
        return (
            <Text style = {[staticStyles.listText, {color: Theme.texts.neutrals.secondary}]}>{title}</Text>
        )
    }

    const BoxItem = ({childItem}) => {
        const icons = {
            'tasks': 'sticker-check-outline',
            "analytics": 'circle-outline',
            "notes": 'note-edit-outline',
            "timetable": 'timetable'
        }
   
        return(
            <View
                style = {{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginLeft: 8
                }}
            >
                <MaterialCommunityIcons 
                    name={icons[childItem]} 
                    size={18} 
                    color = {Theme.texts.neutrals.secondary}
                />
                <ItemTitle title = {childItem}/>
            </View>
        )
    }

    const renderItem = ({ item, drag = undefined, isActive = false }) => {
        const index = Object.keys(appFunctions).indexOf(item)
        const longPress = () => {
            Vibration.vibrate([5,10])
            drag? drag() : null
        }
        return (
        <ScaleDecorator>
            <View 
                style={{
                    backgroundColor: '#00000001',
                    borderRadius: r_uiStyle.borderRadius.secondary,
                    marginLeft: 30,
                    width: '85%',
                }}
            >
            <Pressable
                delayLongPress={300}
                onLongPress={longPress}
                disabled={isActive}
                style={[
                    { 
                        height: 32,
                        //marginLeft: 30,
                        //width: '85%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        borderRadius: r_uiStyle.borderRadius.secondary,
                        backgroundColor: isActive ? `${Theme.basics.neutrals.tertiary}10` : 'transparent',
                    },
                ]}
                android_ripple={ripple(Theme.basics.neutrals.tertiary)}
            >
                <BaseBox
                    key = {`functions_${item}`}
                    isCheckBox={true}
                    style = {{
                        //flex: 4,
                        width: '80%',
                        //marginTop: index > 0 ? 4 : 0,
                        backgroundColor: 'transparent',
                        borderRadius: r_uiStyle.borderRadius.secondary,
                    }}
                    android_ripple={ripple(Theme.icons.accents.secondary)}
                    Item = {<BoxItem childItem={item}/>}
                    //check = {checkGroup[index]}
                    boxId = {index}
                    aCheck = {usedScreens}
                    onPress = {()=>{settingFunctions(index)}}
                    boxBorderRadius = {r_uiStyle.borderRadius.secondary}
                    designType = {r_uiStyle.selectors.design.checkBox}
                    colors={{
                        background: Theme.basics.neutrals.secondary,
                        primary: Theme.specials.selector.primary,
                        secondary: Theme.specials.selector.quaternary,
                    }}
                />
                <MaterialCommunityIcons name="drag-horizontal-variant" size={26} color={Theme.icons.neutrals.secondary} />
            </Pressable>
            </View>
        </ScaleDecorator>
        )
    }

    return (
        <View style={{paddingBottom: 12}}>
            <DraggableFlatList
                data={screenOrder}
                onDragEnd={endDrag}
                keyExtractor={(item) => item}
                renderItem={renderItem}
            />
        </View>
    )
}

const staticStyles = StyleSheet.create({
    
    ...commonStaticStyles
});