import React, {
    useState,  
    useEffect,
    useRef,
} from "react";

import { 
    Pressable, 
    View,
    Modal,
    Keyboard,
    TextInput,
} from 'react-native';

import BasePressable from "./BasePressable";

export default (props) => {
    const {
        //generals
        textValue,
        setTextValue,

        exit,
        enter,
        focus,

        //panele
        paneleStyle,
        //text input
        textInputProps,
        //pressable
        basePressableProps,
    } = props

    const [localText, setLocalText] = useState((textValue && textValue.length > 0)? textValue : textInputProps.placeholder)
    const [openState, setOpenState] = useState(false)

    const texInputref = useRef()

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {setKeyboardVisible(true);});
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useEffect(()=>{
        if(openState){
            setTimeout(()=>{
                console.log('ti focus')
                texInputref.current.focus()
            }, 100) 
        }
    },[openState])

    useEffect(()=>{
        if(!keyboardVisible){
            console.log('exit <', !keyboardVisible, openState)
            openState ? onExit() : null
        }
    },[keyboardVisible])

    const onFocus = () => {
        console.log('onfocus')
        focus? focus() : null
        setOpenState(true)
    }
    
    const onEnter =()=> {
        console.log('onEnter')
        enter? enter() : null
    }

    const onExit =()=> {
        console.log('onExit', localText)
        if(localText && localText != textInputProps.placeholder && localText.length> 0){
            setTextValue(localText)
            exit? exit(localText) : null
        } else {
            setTextValue(null)
            exit? exit(null) : null
            setLocalText(textInputProps.placeholder)
        }
        
        setOpenState(false)
    }

    const setText = (text) => {
        setLocalText(text)
    }

    return (
        <>
        <Modal
            visible={openState}
            transparent = {true}
        >
            <Pressable
                style={{
                    flex: 1
                }}
                onPress={onExit}
            >        
            <View
                style={[{
                    position: 'absolute',
                    height: 50,
                    width: '100%',
                    bottom: 0,
                    borderTopWidth: 1,
                    borderColor: 'grey',
                    backgroundColor: 'white',
                    paddingHorizontal: 20
                }, paneleStyle]}
            >
                <TextInput
                    ref={texInputref}

                    //all props
                    {...textInputProps}

                    style={[{
                        flex: 1,
                        color: 'black',
                        fontSize: 16
                    }, textInputProps.style]}

                    onSubmitEditing={onEnter}
                    onEndEditing={onExit}
                    placeholder={textInputProps.placeholder}
                    placeholderTextColor = {textInputProps.placeholderTextColor}
                    maxLength={textInputProps.maxLength}
                    defaultValue={textValue}
                    selectTextOnFocus={true}//(text)=>{setTextValue(text)}
                    onChangeText={setText}
                    
                    selectionColor = {textInputProps.selectionColor}
                    
                    //android
                    autoComplete={textInputProps.autoComplete}
                    cursorColor={textInputProps.cursorColor}            
                />
            </View>
            </Pressable>
        </Modal>
        <BasePressable
            type="t"

            //all props
            {...basePressableProps}

            text={localText}
            onPress={onFocus}
        />
        </>
    )
}