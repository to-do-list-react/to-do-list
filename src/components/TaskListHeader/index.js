import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./TaskListHeader.module.css";
import FocusAwareInput from "../UI/FocusAwareInput";
import Button from "../UI/Button";
import ContextMenu from "../UI/ContextMenu";
import ThemeContext from "../../context/ThemeContext";
import IMAGES from "../../images";

function TaskListHeader({menuItems,backButtonHandler,...props}){
    const themeColor = useContext(ThemeContext);
    const [hidden,setHidden] = useState(true);
    const contextMenu = useRef(null);
    const contextMenuButton = useRef(null);

    useEffect(()=>{
        window.addEventListener('click',windowClickHandler);
        
        function windowClickHandler(e){
            if(!contextMenu.current?.contains(e.target)&&e.target!==contextMenuButton.current){
                setHidden(true);
            }
        }

        return ()=>{
            window.removeEventListener('click',windowClickHandler);
        }
    },[hidden,contextMenu]);

    return (
    <h1 className={styles.taskHeader}>
        <Button onClick={backButtonHandler}>
            <img
            className={styles.backButton}
            src={IMAGES[themeColor].coloredCollapse}
            alt="collapse"
            draggable={false}
            />
        </Button>
        <FocusAwareInput
            className={styles.taskHeaderText}
            {...props}
        />
        <Button
        className={styles.menuButton}
        refsrc={contextMenuButton}
        onClick={()=>{setHidden(!hidden)}}>... </Button>
        <ContextMenu
            className={styles.menu}
            refsrc={contextMenu}
            hidden={hidden}
            setHidden={()=>{setHidden(!hidden)}}
            >
                <ul className={styles[`${themeColor}MenuItems`]}>
                {menuItems.map((item,index)=>{
                    return (
                        <li className={styles[`${themeColor}MenuItem`]} key={index}>
                            <Button onClick={item.onClick}>{item.name}</Button>
                        </li>
                    )
                })}
                </ul>
        </ContextMenu>
    </h1>
    );
}

export default TaskListHeader;