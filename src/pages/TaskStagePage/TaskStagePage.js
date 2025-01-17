import React, { useContext, useRef, useState } from "react";
import styles from "./TaskStagePage.module.css";
import TaskStages from "../../components/TaskStages";
import TaskListHeader from "../../components/TaskListHeader";
import ThemeContext from "../../context/ThemeContext";
import DataContext from "../../context/DataContext";

import IMAGES from "../../images";
import { TaskStageObj } from "../../factory";
import AddButton from "../../components/UI/AddButton";

function TaskStagePage({setSelectedTaskID,selectedTask,...props}){
    const {data, setData} = useContext(DataContext);
    const currentTaskList = data.find(taskL=>taskL.taskList.some(t=>t.id === selectedTask.id));

    const menuItems = [
        {name:"Переименовать",onClick:()=>{
            setTimeout(()=>{
                document.getElementById("addtaskTitleButton").click();
            },100);
        }},
        {name:"Удалить задачу",onClick:()=>{
            setData([...data.map(tl=>{
                if(tl.id !== currentTaskList.id){
                    return tl;
                }
                return {
                    ...tl,
                    taskList:tl.taskList.filter(t=>t.id!==selectedTask.id)
                };
            })]);
            setSelectedTaskID(null);
        }}
    ]

    

    const themeColor = useContext(ThemeContext);
    const [titleInput,setTitleInput] = useState(selectedTask.text);

    function addStageHandler(stageTitle){
        if(!stageTitle) return;
        setData([...data.map(tl=>{
            if(tl.id === currentTaskList.id){
                tl.taskList.map(t=>{
                    if(t.id===selectedTask.id){
                        t.taskStages.push(new TaskStageObj({taskStage:stageTitle}));
                    }
                    return t;
                });
            }
            return tl;
        })]);
    }

    function setTaskTitle(title){
        setData([...data.map(tl=>{
            if(tl.id === currentTaskList.id){
                tl.taskList.map(t=>{
                    if(t.id === selectedTask.id){
                        t.text = title;
                    }
                    return t;
                });
            }
            return tl;
        })]);
    }

    function backButtonHandler(){
        setSelectedTaskID(null);
    }

    return (
        <div {...props}>
            <div className={styles.container}>
                <TaskListHeader
                    backButtonHandler={backButtonHandler}
                    inputValue={titleInput}
                    setInputValue={setTitleInput}
                    inputHandler={setTaskTitle}
                    name="taskTitle"
                    text={selectedTask.text}
                    menuItems={menuItems}
                />
                <AddButton
                    className={styles[`${themeColor}AddButton`]}
                    addValueHandler = {addStageHandler}
                    name = "stage"
                    text = "Добавить шаг"
                    imgsrc = {{colored:IMAGES[themeColor].coloredAdd,empty:IMAGES[themeColor].emptyAdd}}
                />
                <TaskStages
                    currentTaskList={currentTaskList}
                    currentTask={selectedTask}
                />
            </div>
        </div>
    )
}

export default TaskStagePage;