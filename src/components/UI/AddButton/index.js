import React, { useContext, useEffect, useRef, useState } from "react";

import Button from "../../../components/UI/Button";
import styles from "./AddButton.module.css";
import SwitchableInput from "../SwitchableInput";
import ThemeContext from "../../../context/ThemeContext";

function AddButton({addValueHandler,name,text,imgsrc,...props}){

    const {colored,empty} = imgsrc;

    const [addValueMode,setAddValueMode] = useState(false);
    const [inputAddValue,setInputAddValue] = useState("");
    const addValueButtonRef = useRef(null);
    const themeColor = useContext(ThemeContext);

    const addButtonID = `add${name}Button`;
    const addInputID = `add${name}Input`;
    const addSpanID = `add${name}Span`
    const addImgID = `add${name}Img`

    useEffect(()=>{
        function enterClickHandler(e){
            if(!inputAddValue) return;
            if(e.keyCode === 13 || e.key === "Enter"){
                const input = document.querySelector("input:focus");
                if(input.id === addInputID){
                    addValueHandler(inputAddValue);
                    setInputAddValue("");
                }
            }
        }

        window.addEventListener('keydown',enterClickHandler);

        return ()=>{
            window.removeEventListener('keydown',enterClickHandler);
        }
    },[inputAddValue]);

    function addButtonClickHandler(){
        if(inputAddValue.trim().length === 0) return;
        if(!inputAddValue) switchAddValueMode();
        addValueHandler(inputAddValue);
        setInputAddValue("");
    }

    function switchAddValueMode(){
        setAddValueMode(!addValueMode);
    }

    useEffect(()=>{
        function windowClickHandler(e){
            const element = e.srcElement;
            if(addValueButtonRef.current&&
                (addValueButtonRef.current.contains(element)||
                element.closest(`#${addButtonID}`)||
                element.closest(`#${addSpanID}`)||
                element.closest(`#${addImgID}`)
                )){
                setAddValueMode(!addValueMode);        
                return;
            };
            setAddValueMode(false);
        }

        window.addEventListener('click',windowClickHandler);
        
        return ()=>{
            window.removeEventListener('click',windowClickHandler);
        }
    },[]);
    
    const addValueButton = (
            <Button onClick={addButtonClickHandler}>
                <img 
                className={styles.addValueImg}
                draggable={false}
                alt={`add ${name}`}
                src={inputAddValue.length > 0 ? colored : empty}/>
            </Button>
        );

    return (
    <div 
    {...props}
    ref={addValueButtonRef}
    id={addButtonID}
    className={`${props.className}${styles.addValueButton} ${styles[`${themeColor}AddButton`]}
    `}>
        {addValueButton}
        <SwitchableInput 
            isFocused = {addValueMode}
            className={styles.addValueInput}
            inputProps = {
                {id:addInputID,
                placeholder:text,
                value:inputAddValue,
                onChange:(e)=>{setInputAddValue(e.target.value)}
                }
            }
            spanProps = {
                {
                    className:styles.addValueSpan,
                    id:addSpanID, 
                }
            }
            >{text}</SwitchableInput>
        {props.children}
    </div>
    );
}

export default AddButton;