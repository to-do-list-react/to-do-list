import React, { useContext, useState } from "react";
import styles from "./Stage.module.css"
import DataContext from "../../context/DataContext";
import Input from "../UI/Input";
import FocusAwareInput from "../UI/FocusAwareInput";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Button from "../UI/Button";
import IMAGES from "../../images";
import ThemeContext from "../../context/ThemeContext";

function Stage({currentTaskList, currentTask, stageNumber, stage, addToDeleteList, removeFromDeleteList, isDeleting}) {
    const themeColor = useContext(ThemeContext);
    const selectedTaskListID = currentTaskList.id;
    const selectedTaskID = currentTask.id;
    const {data, setData} = useContext(DataContext);    
    const [inputValue, setInputValue] = useState(stage.text);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: stage.id,
        data: stage
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none'
    };

    function updateStage(updatedStage){
        setData([...data.map(tl=>{
            if(tl.id === selectedTaskListID){
                tl.taskList.map(t=>{
                    if(t.id === selectedTaskID){
                        return updatedStage;
                    }
                    return t;
                });
            }
            return tl;
        })]);
        }

    function doneStatusToggleHandler(){
        stage.isDone = !stage.isDone;
        updateStage(stage);
    }

    function setStageTitleHandler(title){
        stage.text = title;
        updateStage(stage);
    }

    const deleteButton = (
        <Button 
            onClick={()=>addToDeleteList(stage)}
            className={styles.deleteButton}
        >
            <img src={IMAGES[themeColor].emptyDelete} alt="delete" className={styles.deleteHoverAnimation} />
        </Button>
    )

    const cancelDeleteButton = (
        <Button 
            onClick={()=>removeFromDeleteList(stage)}
            className={styles.deleteButton}
        >
            <img src={IMAGES[themeColor].coloredDelete} alt="delete" className={styles.onDeleting} />
        </Button>
    )

    return (
        <li 
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={styles.li}
        >
            <Input 
                type="checkbox"
                checked={stage.isDone}
                onChange={doneStatusToggleHandler}
            />
            <span>{stageNumber + ". "}</span>
            <FocusAwareInput
                style={{
                    textDecoration: stage.isDone ? "line-through" : "none",
                }}
                inputValue={inputValue}
                setInputValue={setInputValue}
                name={stage.id}
                text={inputValue}
                inputHandler={setStageTitleHandler}
            />
            {isDeleting ? cancelDeleteButton : deleteButton}
        </li>
    );
}

export default Stage;