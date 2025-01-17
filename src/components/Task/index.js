import React, { useContext,useState } from "react";
import Button from "../UI/Button";
import styles from "./Task.module.css"
import IMAGES from "../../images";
import Theme from "../../context/ThemeContext"
import DataContext from "../../context/DataContext";
import Input from "../UI/Input";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function Task({setSelectedTaskID,toggleDatePicker,task}){
    const [showMore,setShowMore] = useState(false);
    const colorTheme = useContext(Theme);
    const {data,setData} = useContext(DataContext);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: task.id,
        data: task
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none'
    };

    function updateTask(updatedTask){
        setData([...data.map(tl=>{
            tl.taskList.map(t=>{
                if(t.id === updatedTask.id) return updatedTask;
                return t;
            });
            return tl;
        })]);
    }

    function importantButtonToggle(){
        task.isImportant = !task.isImportant;
        updateTask(task);
    }

    function doneStatusToggleHandler(){
        task.isDone = !task.isDone;
        updateTask(task);
    }
    
    function showMoreHandler(){
        setShowMore(!showMore);
    }
    function getColorByTask(t){
        if(t.isDone) return colorTheme === "white"? "#78ff78" : "#78ff78bb";
         
        const deadline = task.deadLine;
        const today = new Date().toISOString();
        const weekBeforeDeadline = new Date((new Date().setDate(new Date(deadline).getDate() - 7))).toISOString();
        
        if(deadline < today) return "#ff7878";
        if(today <= weekBeforeDeadline){
            if(colorTheme === "white") return "#8ce7f2";
            if(colorTheme === "black") return "#0078d4";    
        }
        let red = (Math.floor(((86400000*7) - Math.abs((new Date().getTime() - new Date(deadline).getTime())))/(86400000*7)*75)+180);
        let green = (255 - Math.floor(((86400000*7) - Math.abs((new Date().getTime() - new Date(deadline).getTime())))/(86400000*7)*120));
        if(green > red) green = red;
        red = red.toString(16);
        green = green.toString(16);
        console.log(colorTheme === "white" ? `#${red}${green}78` : `#${red}${green}78bb`);
        return colorTheme === "white" ? `#${red}${green}78` : `#${red}${green}78bb`;
    }
    return (
    <li 
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={styles.li}
    >
        <div>
            <Input type="checkbox" checked={task.isDone} onChange={doneStatusToggleHandler}/>
            
            <Button
            style={{
                textDecoration: task.isDone ? "line-through" : "none",
            }}
            onClick={()=>{setSelectedTaskID(task.id)}}>
            {task.text.length > 16 ? task.text.slice(0,16) + "..." : task.text}
            </Button>

            {task.text.length > 16 && (
                <Button
                style={{
                    width: "40px",
                    height: "40px",
                    transform: showMore ? "rotate(180deg)" : "rotate(90deg)",
                    transition: "transform 0.15s ease-in-out",
                }}
                onClick={()=>{showMoreHandler()}}>
                    <img src={showMore ? IMAGES[colorTheme].coloredCollapse : IMAGES[colorTheme].emptyCollapse} alt="collapse"/>
                </Button>
            )}
        <Button onClick={(e)=>toggleDatePicker(e,task)}>
            <img alt="calendar" src={task.deadLine ? IMAGES[colorTheme].coloredCalendar : IMAGES[colorTheme].emptyCalendar}/>
        </Button>
        <Button onClick={importantButtonToggle}>
            <img alt="star" src={task.isImportant ? IMAGES[colorTheme].coloredStar : IMAGES[colorTheme].emptyStar}/>
        </Button>
        </div>
        {task.deadLine && (
            <div
            className={styles.deadLineSpan}
            style={{
                color: getColorByTask(task),
            }}
            >
                {task.deadLine.split("T")[0].slice(2).split("-").reverse().join(".")}
            </div>
        )}
        {showMore && (
        <div className={styles.showMore}>
            <span>
                {task.text}
            </span>
        </div>
        )}
    </li>
    )
}

export default Task;