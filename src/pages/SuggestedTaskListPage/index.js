import React, { useContext, useEffect, useState } from "react";
import styles from "./SuggestedTaskListPage.module.css";
import TaskList from "../../components/TaskList";
import Button from "../../components/UI/Button";
import FocusAwareInput from "../../components/UI/FocusAwareInput";
import CollapseList from "../../components/CollapseList";
import IMAGES from "../../images";
import themeContext from "../../context/ThemeContext"; 

function SuggestedTaskListPage({suggestedCategory,setSuggestedCategory,setSelectedTaskID,setSelectedTaskListID,taskList,...props}){
 
    const [titleInput,setTitleInput] = useState(taskList.text);
    const themeColor = useContext(themeContext);

    useEffect(()=>{
        setTitleInput(taskList.text);
    },[taskList.id])

    function setSuggestedTaskListTitle(title){
        setSuggestedCategory([...suggestedCategory.map(tl=>{
            if(tl.id === taskList.id){
                tl.text = title;
            }
            return tl;
        })]);
    }

    function backButtonHandler(){
        setSelectedTaskID(null);
        setSelectedTaskListID(null);
    }

    return (
        <div {...props}>
            <div className={styles.container}>
                <h1 className={styles.title}>
                    <Button onClick={backButtonHandler}>
                        <img
                        src={IMAGES[themeColor].coloredCollapse}
                        alt="collapse"
                        className={styles.backButton}
                        draggable={false}
                        />
                    </Button>
                    <FocusAwareInput
                    inputValue={titleInput}
                    setInputValue={setTitleInput}
                    inputHandler={setSuggestedTaskListTitle}
                    name="suggestedTaskListTitle"
                    text={titleInput}
                    />
                </h1>
                <TaskList setSelectedTaskID={setSelectedTaskID} taskList={taskList.taskList.filter(t=>!t.isDone)}/>
                <CollapseList setSelectedTaskID={setSelectedTaskID} taskList={taskList}/>
            </div>
    </div>
    )
}

export default SuggestedTaskListPage;