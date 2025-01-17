import React, { useContext } from "react";
import styles from "./Input.module.css"
import ThemeContext from "../../../context/ThemeContext";

function Input({refsrc,...props}){
    const extraclasses = props.className ? ` ${props.className}`:"";
    const themeColor = useContext(ThemeContext);
    return (
    <input
    {...props}
    ref={refsrc}
    className={styles[themeColor+"input"]+extraclasses}
    />
    );
}

export default Input;