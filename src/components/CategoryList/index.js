import React, { useContext, useEffect, useState } from "react";
import styles from "./CategoryList.module.css"
import Category from "../Category";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DataContext from "../../context/DataContext";

function CategoryList({setSelectedTaskListID, categoryList}){
    const [items, setItems] = useState(categoryList);
    const {data, setData} = useContext(DataContext);
    
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        setItems(categoryList);
    }, [categoryList]);

    function handleDragEnd(event) {
        const {active, over} = event;
        
        if (active.id !== over.id) {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);
            
            if (oldIndex !== -1 && newIndex !== -1) {
                const newItems = arrayMove(items, oldIndex, newIndex);
                setItems(newItems);
                
                // Обновляем порядок в основных данных
                const updatedData = arrayMove(data, oldIndex, newIndex);
                setData(updatedData);
            }
        }
    }

    return (
        <ul className={styles.ul}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext
                    items={items.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {items.map(category => (
                        <Category
                            key={category.id}
                            category={category}
                            setSelectedTaskListID={setSelectedTaskListID}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </ul>
    );
}

export default CategoryList;