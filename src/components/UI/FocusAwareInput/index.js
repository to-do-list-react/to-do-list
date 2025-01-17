import React, { useEffect, useRef, useState } from "react";
import Button from "../Button";
import SwitchableInput from "../SwitchableInput";
import styles from "./FocusAwareInput.module.css";

function FocusAwareInput({inputValue,setInputValue,inputHandler,name,text,...props}){
    const addButtonID = `add${name}Button`;
    const addInputID = `add${name}Input`;
    const addSpanID = `add${name}Span`
    const addImgID = `add${name}Img`

    const [focusMode,setFocusMode] = useState(false);
    const addValueButtonRef = useRef(null);

    const previousInputValue = useRef(null);
    useEffect(()=>{
        previousInputValue.current = inputValue;
    },[]);

    useEffect(()=>{
        function enterClickHandler(e){
            if(e.keyCode === 13 || e.key === "Enter"){
                const input = document.querySelector("input:focus");
                if(!input) return;
                if(input.id === addInputID){
                    if(!inputValue){ 
                        inputHandler(previousInputValue.current);
                        setInputValue(previousInputValue.current);
                    } else {
                        inputHandler(inputValue);
                    }
                    setFocusMode(false);
                }
            }
        }

        window.addEventListener('keydown',enterClickHandler);

        return ()=>{
            window.removeEventListener('keydown',enterClickHandler);
        }
    },[inputValue]);

    useEffect(()=>{
        function windowClickHandler(e){
            const element = e.srcElement;
            if(addValueButtonRef.current&&
                (addValueButtonRef.current.contains(element)||
                element.closest(`#${addButtonID}`)||
                element.closest(`#${addSpanID}`)||
                element.closest(`#${addImgID}`)
                )){
                setFocusMode(true);        
                return;
            };
            setFocusMode(false);
        }

        window.addEventListener('click',windowClickHandler);
        
        return ()=>{
            window.removeEventListener('click',windowClickHandler);
        }
    },[]);

    function onBlurInputHandler(){
        if(!inputValue){
            inputHandler(previousInputValue.current);
            setInputValue(previousInputValue.current);
        } else {
            inputHandler(inputValue);
        }
    }
    function onFocusInputHandler(){
        previousInputValue.current = inputValue;
    }

    return (
        <Button
        onClick={()=>{setFocusMode(true)}}
        {...props}
        refsrc={addValueButtonRef}
        id={addButtonID}>
            <SwitchableInput 
                className={styles.focusAwareInput}
                isFocused = {focusMode}
                inputProps = {
                    {id:addInputID,
                    placeholder:text,
                    value:inputValue,
                    onFocus:onFocusInputHandler,
                    onChange:(e)=>{setInputValue(e.target.value)},
                    onBlur: onBlurInputHandler
                }
                }
                spanProps = {
                    {
                        id:addSpanID, 
                    }
                }
                >
                {text}
                </SwitchableInput>
                {props.children}
            </Button>
            );
}

export default FocusAwareInput;