import React, { useContext, useEffect, useState } from "react";
import styles from "./SuggestedCategoryList.module.css"
import Category from "../Category";

function SuggestedCategoryList({setSelectedTaskListID, categoryList}){

    return (
        <ul className={styles.ul}>
            {categoryList.map(category => (
                <Category
                    key={category.id}
                    category={category}
                    setSelectedTaskListID={setSelectedTaskListID}
                />
            ))}
        </ul>
    );
}

export default SuggestedCategoryList;