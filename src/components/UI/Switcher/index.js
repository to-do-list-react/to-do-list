import React from "react";
import Button from "../Button";
import styles from "./Switcher.module.css";

function Switcher({prevButtonHandler,nextButtonHandler,...props}){

    return (
    <div className={styles.switcher} {...props}>
        <Button
            onClick={prevButtonHandler}
        >{"<"}</Button>
        <span>
            {props.children}
        </span>
        <Button
            onClick={nextButtonHandler}
        >{">"}</Button>
    </div>
    );
}
export default Switcher;