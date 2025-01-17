import React, { useEffect, useState } from 'react';
import {useResize} from "./hooks/useResize.js";
import useLocaleStorage from "./hooks/useLocaleStorage";
import DataContext from "./context/DataContext.js";
import Theme from './context/ThemeContext.js';
import themeList from './themeList';
import { TaskListObj } from './factory/index.js';

import HomePage from './pages/HomePage';
import TaskListPage from './pages/TaskListPage';
import styles from './App.module.css';
import TaskStagePage from './pages/TaskStagePage/TaskStagePage.js';
import SuggestedTaskListPage from './pages/SuggestedTaskListPage/index.js';

  const todayList = new TaskListObj("🌞мой день");
  const importantList = new TaskListObj("⭐важно");
  const deadLineList = new TaskListObj("🕒запланировано");

function App() {

  const { width, isScreenSm, isScreenMd, isScreenLg, isScreenXl } = useResize();
  const [data,setData,theme,setTheme] = useLocaleStorage();

  const [selectedTaskListID,setSelectedTaskListID] = useState(null);
  const [selectedTaskID,setSelectedTaskID] = useState(null);
  
  const [suggestedCategory,setSuggestedCategory] = useState([importantList]);

  useEffect(()=>{
    importantList.taskList = data.map(tl=>tl.taskList).flat().filter(t=>t.isImportant);
    deadLineList.taskList = data.map(tl=>tl.taskList).flat().filter(t=>t.deadLine).sort((t1,t2)=>+t1.deadLine -(+t2.deadLine));

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate()+2);

    const burningDeadLines = deadLineList.taskList.filter(t=>t.deadLine&&(+t.deadLine < +tomorrow)&&!t.isDone).sort((t1,t2)=>+t1.deadLine -(+t2.deadLine));
    
    if(burningDeadLines.length){
      //в первую очеред показываем горящие дедлайны
      todayList.taskList = burningDeadLines.filter(t=>!t.isDone);
    } else {
      if(importantList.taskList.length >= 5){
        //во вторую очередь показываем важные задачи (лимит 5)
        todayList.taskList = importantList.taskList.filter(t=>!t.isDone);
        todayList.taskList.splice(5);
      } else {
        //дальше показываем все что осталось (лимит 5)
        const notImportantTaskList = data.map(tl=>tl.taskList).flat().filter(t=>!t.isImportant&&!t.isDone);
        const notImportantWithDLTL = notImportantTaskList.filter(t=>t.deadLine).sort((t1,t2)=>+t1.deadLine -(+t2.deadLine));
        const notImportantWithNoDLTL = notImportantTaskList.filter(t=>!t.deadLine);
        todayList.taskList = importantList.taskList.concat(notImportantWithDLTL,notImportantWithNoDLTL);
        todayList.taskList.splice(5);
      }
    }
    setSuggestedCategory([importantList,deadLineList,todayList]);
  },[data]);

  function changeCategory(categoryID){
    if(categoryID===selectedTaskListID){
      setSelectedTaskID(null);
      setSelectedTaskListID(null);
    } else {
      setSelectedTaskID(null);
      setSelectedTaskListID(categoryID);
    }
  }
 
  function changeTask(taskID){
    if(taskID===selectedTaskID){
      setSelectedTaskID(null);
    } else {
      setSelectedTaskID(taskID);
    }
  }

  function switchTheme(){
    setTheme(theme === themeList.BLACK ? themeList.WHITE : themeList.BLACK);
  }

  function addNewTaskList(taskName){
    setData([...data, new TaskListObj(taskName)]);
  }

  const selectedTaskList = data.find(tl=>tl.id === selectedTaskListID);
  const selectedSuggestedTaskList = suggestedCategory.find(tl=>tl.id === selectedTaskListID);

  const selectedTask = selectedTaskList?.taskList
  .find(t=>t.id === selectedTaskID) || selectedSuggestedTaskList?.taskList
  .find(t=>t.id === selectedTaskID);

  useEffect(()=>{
    if(selectedSuggestedTaskList&&!selectedSuggestedTaskList.taskList.some(t=>t.id === selectedTaskID)){
      setSelectedTaskID(null);
    }
  },[data])

  return (
    <DataContext.Provider value={{data,setData}}>
      <Theme.Provider value={theme}>
      <div className={styles[theme+"App"]}>
        <HomePage
        className={styles.homePage}
        suggestedCategory={suggestedCategory}
        setSelectedTaskListID={changeCategory}
        setSelectedTaskID={changeTask}
        addNewTaskList={addNewTaskList}
        switchTheme={switchTheme}/>
        
        {selectedSuggestedTaskList&&<SuggestedTaskListPage
        className={styles.taskListPage}
        suggestedCategory={suggestedCategory}
        setSuggestedCategory={setSuggestedCategory}
        setSelectedTaskListID={changeCategory}
        setSelectedTaskID={changeTask}
        taskList={selectedSuggestedTaskList}
        />}
        
        {selectedTaskList&&<TaskListPage
        className={styles.taskListPage}
        setSelectedTaskListID={changeCategory}
        setSelectedTaskID={changeTask}
        taskList={selectedTaskList}
        />}
        
        {selectedTaskListID&&selectedTaskID&&<TaskStagePage
        setSelectedTaskID={changeTask}
        selectedTask={selectedTask}
        className={styles.taskStagePage}
        />}
      </div>
      </Theme.Provider>
    </DataContext.Provider>
  );
}

export default App;
