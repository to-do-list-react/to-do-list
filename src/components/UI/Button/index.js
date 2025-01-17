import React from "react";

function Button({refsrc, ...props}) {
    return <div 
        ref={refsrc} 
        {...props} 
        style={{...props.style, cursor: "pointer"}}
    >
        {props.children}
    </div>
}

export default Button;