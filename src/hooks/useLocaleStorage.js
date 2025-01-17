import React, { useEffect, useState } from "react";
import { TaskObj, TaskListObj, TaskStageObj } from "../factory";
import themeList from "../themeList";

function useLocaleStorage(){
    
    const initDataObject = [
        new TaskListObj("Дом")
    ];

    const initData = JSON.parse(localStorage.getItem("todoData")) || initDataObject;

    const [data,setData] = useState(initData);

    //Сохранение списка задач в localStorage при обновлении списка задач
    useEffect(()=>{
        localStorage.setItem("todoData",JSON.stringify(data));
    },[data]);

    const initTheme = JSON.parse(localStorage.getItem("todoTheme")) || themeList.BLACK;

    const [theme,setTheme] = useState(initTheme);

    //Сохранение темы в localStorage при смене темы
    useEffect(()=>{
        localStorage.setItem("todoTheme",JSON.stringify(theme));
    },[theme]);

    return [data,setData,theme,setTheme];
}

export default useLocaleStorage;