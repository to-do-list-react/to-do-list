import React from "react";

function ContextMenu({refsrc, hidden,setHidden,...props}){

    return (
    <>{(!hidden)&&
        <div ref={refsrc} {...props}>
            {props.children}
        </div>
    }</>
    )
}

export default ContextMenu;