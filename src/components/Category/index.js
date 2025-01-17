import React from "react";
import Button from "../UI/Button";
import styles from "./Category.module.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function Category({setSelectedTaskListID, category}){
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: category.id,
        data: category
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none'
    };

    return (
        <li 
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={styles.li}
        >
            <Button onClick={()=>{setSelectedTaskListID(category.id)}}>
                {category.text}
            </Button>
        </li>
    );
}

export default Category;