import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./TaskListPage.module.css";
import TaskList from "../../components/TaskList";
import AddButton from "../../components/UI/AddButton";
import DataContext from "../../context/DataContext";
import ThemeContext from "../../context/ThemeContext";
import { TaskObj } from "../../factory";
import IMAGES from "../../images";
import TaskListHeader from "../../components/TaskListHeader";
import CollapseList from "../../components/CollapseList";

function TaskListPage({setSelectedTaskID,setSelectedTaskListID,taskList,...props}){

    const themeColor = useContext(ThemeContext);
    const {data,setData} = useContext(DataContext);
    
    const [titleInput,setTitleInput] = useState(taskList.text);
    const [hidden,setHidden] = useState(true);
    const contextMenu = useRef(null);
    const contextMenuButton = useRef(null);
    const menuItems = [
        {name:"Переименовать",onClick:()=>{
            setTimeout(()=>{
                document.getElementById("addtaskListTitleButton").click();
            },100);
        }},
        {name:"Удалить список",onClick:()=>{
            setData([...data.filter(tl=>tl.id!==taskList.id)]);
            setSelectedTaskID(null);
        }},
    ]
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

    useEffect(()=>{
        setTitleInput(taskList.text);
    },[taskList.id])

    function addTaskHandler(taskTitle){
        if(!taskTitle) return;
        setData([...data.map(tl=>{
            if(tl.id === taskList.id){
                tl.taskList = [new TaskObj({taskTitle:taskTitle}),...tl.taskList];
            }
            return tl;
        })])
    }
    
    function setTaskListTitle(title){
        setData([...data.map(tl=>{
            if(tl.id === taskList.id){
                tl.text = title;
            }
            return tl;
        })]);
    }

    function backButtonHandler(){
        setSelectedTaskListID(null);
    }

    return (
        <div {...props}>
            <div className={styles.container}>
            <TaskListHeader
                backButtonHandler={backButtonHandler}
                inputValue={titleInput}
                setInputValue={setTitleInput}
                inputHandler={setTaskListTitle}
                name="taskListTitle"
                text={titleInput}
                menuItems={menuItems}
            /><AddButton
            addValueHandler = {addTaskHandler}
            name = "task"
            text = "Добавить задачу"
            imgsrc = {{colored:IMAGES[themeColor].coloredAdd,empty:IMAGES[themeColor].emptyAdd}}
            />
                <TaskList setSelectedTaskID={setSelectedTaskID} taskList={taskList.taskList.filter(t=>!t.isDone)}/>
                <CollapseList setSelectedTaskID={setSelectedTaskID} taskList={taskList}/>
            </div>
        </div>
    )
}

export default TaskListPage;