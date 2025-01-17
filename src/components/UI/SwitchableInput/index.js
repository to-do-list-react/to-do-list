import React, { useEffect, useRef } from "react";
import Input from "../Input";

function SwitchableInput({isFocused,inputProps,spanProps,...props}){

    const inputRef = useRef(null);

    useEffect(()=>{
        if(isFocused){    
            inputRef.current.focus();
        }
    },[isFocused])

    const input = <Input refsrc={inputRef} {...inputProps}/>;
    const span = <span {...spanProps}>{props.children}</span>
    return <div {...props}>{isFocused ? input : span }</div>
}

export default SwitchableInput;