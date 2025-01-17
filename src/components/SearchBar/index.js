import React, {useContext, useEffect, useRef, useState} from "react";
import Fuse from "fuse.js";
import styles from "./SearchBar.module.css"
import IMAGES from "../../images";
import Input from "../UI/Input";
import ThemeContext from "../../context/ThemeContext";
import DataContext from "../../context/DataContext";
import Button from "../UI/Button";

function Search({setSelectedTaskID,setSelectedTaskListID,...props}){

    const themeColor = useContext(ThemeContext);
    const IMGS = IMAGES[themeColor];
    const [inputValue,setInputValue] = useState("");
    const [searchResult,setSearchResult] = useState({
        taskList: [],
        task: [],
        taskStage: [],
    });

    const {data} = useContext(DataContext);
    
    const inputRef = useRef(null);

    function renderResultSuggestion(result){
        const TYPES = {
            taskList: "taskList",
            task: "task",
            taskStage: "taskStage",
        }
        const {taskList,task,taskStage} = result;
        const resultArray = taskStage.map(el=>{return {type:TYPES.taskStage,...el}})
            .concat(
                task.map(el=>{return {type:TYPES.task,...el}})
            )
            .concat(
                taskList.map(el=>{return {type:TYPES.taskList,...el}})
            )
            .sort((a,b)=>b.score-a.score)
            .slice(0,5);

        return resultArray.map(item=>{
            return <li key={item.id}>
                    <Button onClick={()=>{
                        if(item.type === TYPES.taskList){
                            setSelectedTaskListID(item.id);
                            onChangeHandler({target:{value:""}});
                        }
                        if(item.type === TYPES.task){
                            const currentTaskList = data.find(el=>el.taskList.some(ts=>ts.id === item.id));
                            setSelectedTaskListID(currentTaskList.id);
                            setSelectedTaskID(item.id);
                            onChangeHandler({target:{value:""}});
                        }
                        if(item.type === TYPES.taskStage){
                            const currentTaskList = data.find(el=>el.taskList.some(t=>t.taskStages.some(ts=>ts.id === item.id)));
                            const currentTask = currentTaskList.taskList.find(t=>t.taskStages.some(ts=>ts.id === item.id));
                            setSelectedTaskListID(currentTaskList.id);
                            setSelectedTaskID(currentTask.id);
                            onChangeHandler({target:{value:""}});
                        }
                    }}>
                        {item.text.length>10 ? item.text.slice(0,10)+"..." : item.text}
                        {item.type === TYPES.taskStage ? " - этап" :
                        item.type === TYPES.task ? " - задача" :
                        " - список задач"}
                    </Button>
                </li>
        })
    }

    function focusHandler(){
        inputRef.current.focus();
    }

    function onSearchHandler(){
        const {taskList,task,taskStage} = searchResult;
        const foundResult = taskStage
            .concat(task)
            .concat(taskList)
            .sort((a,b)=>b.score-a.score)[0];
        if(!foundResult){
            onChangeHandler({target:{value:""}});
            return false;
        }
        if(data.some(el=>el.id === foundResult.id)){
            setSelectedTaskListID(foundResult.id);
            onChangeHandler({target:{value:""}});
        }else if(data.some(el=>el.taskList.some(el=>el.id === foundResult.id))){
            const currTaskList = data.find(el=>el.taskList.some(el=>el.id === foundResult.id));
            setSelectedTaskListID(currTaskList.id);
            setSelectedTaskID(foundResult.id);
            onChangeHandler({target:{value:""}});
        }else if(data.some(el=>el.taskList.some(el=>el.taskStages.some(el=>el.id === foundResult.id)))){
            const currTaskList = data.find(el=>el.taskList.some(el=>el.taskStages.some(el=>el.id === foundResult.id)));
            const currTask = currTaskList.taskList.find(el=>el.taskStages.some(el=>el.id === foundResult.id))
            
            setSelectedTaskListID(currTaskList.id);
            setSelectedTaskID(currTask.id);
            onChangeHandler({target:{value:""}});
        };
    }

    useEffect(()=>{
        function onKeyDownHandler(e){
            if(e.key === "Enter" && inputValue.length>0){
                onSearchHandler();
            }
        }

        window.addEventListener("keydown",onKeyDownHandler);
        return ()=>{
            window.removeEventListener("keydown",onKeyDownHandler);
        }
    },[inputValue])

    const coloredIMG = <img onClick={onSearchHandler} className={styles.coloredImg} src={IMGS.coloredSearch} alt="colored search" /> 
    const transparentIMG = <img className={styles.transparentImg} onClick={focusHandler} src={IMGS.emptySearch} alt="empty search"/>

    function onChangeHandler(e){
        const value = e.target.value;
        setInputValue(value);
        setSearchResult(search(value));
    }

    function search(prompt){
        const fuseTaskList = new Fuse(data,{
            includeScore: true,
            keys:['text'],
        });
        
        const resultTaskList = fuseTaskList.search(prompt);

        const fuseTask = new Fuse(data.reduce((acc,el)=>{return [...acc,...el.taskList]},[]),{
            includeScore: true,
            keys:['text'],
        });
        const resultTask = fuseTask.search(prompt);
        
        const fuseTaskStage = new Fuse(data.reduce((acc,el)=>{return [...acc,...el.taskList.map(item=>item.taskStages).flat()]},[]),{
            includeScore: true,
            keys:['text'],
        });
        const resultTaskStage = fuseTaskStage.search(prompt);

        return {
            taskList: resultTaskList.map(el=>el.item),
            task: resultTask.map(el=>el.item),
            taskStage: resultTaskStage.map(el=>el.item),
        }
    }

    return (
        <div className={styles.searchBar} {...props}>
        {inputValue.length>0 ? coloredIMG : transparentIMG}
        <Input
            className={styles.searchInput} 
            refsrc={inputRef} 
            value={inputValue} 
            onChange={onChangeHandler} 
            placeholder={"поиск по задачам..."}
        />
        {(searchResult.taskList.length>0 ||
          searchResult.task.length>0 ||
          searchResult.taskStage.length>0) && (
            <ul className={styles.dropDownList}>
                {renderResultSuggestion(searchResult)}
            </ul>
            )}
        </div>
    )
}

export default Search;