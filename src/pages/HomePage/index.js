import React, { useContext } from "react";
import SearchBar from "../../components/SearchBar";
import CategoryList from "../../components/CategoryList";
import Button from "../../components/UI/Button";
import IMAGES from "../../images";
import ThemeContext from "../../context/ThemeContext";
import DataContext from "../../context/DataContext";
import styles from "./HomePage.module.css";
import AddButton from "../../components/UI/AddButton";
import SuggestedCategoryList from "../../components/SuggestedCategoryList";

function HomePage({suggestedCategory,setSelectedTaskListID,setSelectedTaskID,switchTheme,addNewTaskList,...props}){ 
    const themeColor = useContext(ThemeContext);
    const {data} = useContext(DataContext);
    

    function addCategoryHandler(taskListName){
        addNewTaskList(taskListName);
    }

    return (
    <div {...props}>
        <div className={styles.container}>
            
        <Button className={styles.themeButton} onClick={switchTheme}>
            <img draggable={false} src={IMAGES[themeColor].theme} alt="theme" />
        </Button>
        <SearchBar
            setSelectedTaskID={setSelectedTaskID}
            setSelectedTaskListID={setSelectedTaskListID}
        />
        <SuggestedCategoryList setSelectedTaskListID={setSelectedTaskListID} categoryList={suggestedCategory}/>
        <AddButton
        imgsrc={{colored:IMAGES[themeColor].coloredPlus, empty: IMAGES[themeColor].emptyPlus}}
        name="category" text="Добавить список"
        addValueHandler={addCategoryHandler}
        />
        <CategoryList setSelectedTaskListID={setSelectedTaskListID} categoryList={data}/>
        </div>
    </div>
    )
}

export default HomePage;