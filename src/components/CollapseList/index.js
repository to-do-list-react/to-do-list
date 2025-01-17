import React, { useContext, useState } from "react";
import styles from "./CollapseList.module.css";
import ThemeContext from "../../context/ThemeContext";
import IMAGES from "../../images";
import Button from "../UI/Button";
import TaskList from "../TaskList"; 

function CollapseList({taskList,setSelectedTaskID,...props}) {
    const [collapsed,setCollapsed] = useState(true);
    const themeColor = useContext(ThemeContext);

    return (<>
        <Button
            onClick={()=>setCollapsed(!collapsed)}
            className={styles.collapseButton}>
                <img
                style={{
                    height:"65px",
                    width:"65px",
                    transform:collapsed ? "rotate(90deg)" : "rotate(180deg)",
                    transition:"transform 0.15s ease-in-out",
                }}
                draggable={false}
                src={ collapsed ? IMAGES[themeColor].emptyCollapse : IMAGES[themeColor].coloredCollapse}
                alt="collapse"
                />
                <h2>Завершённые: 
                    <span> {taskList.taskList.filter(t=>t.isDone).length}</span>
                </h2>
            </Button>
            {!collapsed && (
                <TaskList
                setSelectedTaskID={setSelectedTaskID} 
                taskList={taskList.taskList.filter(t=>t.isDone)}
                />
            )}
    </>
    )
}

export default CollapseList;