import React, { useContext, useEffect, useState } from "react";
import Stage from "../Stage";
import styles from "./TaskStages.module.css";
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

function TaskStages({currentTaskList, currentTask, ...props}) {
    const [items, setItems] = useState(currentTask.taskStages);
    const {data, setData} = useContext(DataContext);
    const [stagesToDelete, setStagesToDelete] = useState([]);
    const [timeToDelete, setTimeToDelete] = useState(null);
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
        setItems(currentTask.taskStages);
    }, [currentTask.taskStages]);

    useEffect(() => {
        let timeout;
        if(stagesToDelete.length > 0){
            if(timeToDelete){
                clearTimeout(timeToDelete);
            }
            timeout = setTimeout(() => {
                deleteStageList(stagesToDelete);
                setStagesToDelete([]);
                setTimeToDelete(null);
            }, 3000);
            setTimeToDelete(timeout);
        }
        return ()=>clearTimeout(timeout);
    }, [stagesToDelete]);

    function handleDragEnd(event) {
        const {active, over} = event;
        
        if (active.id !== over.id) {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);
            
            if (oldIndex !== -1 && newIndex !== -1) {
                const newItems = arrayMove(items, oldIndex, newIndex);
                setItems(newItems);
                
                setData([...data.map(tl => {
                    if (tl.id === currentTaskList.id) {
                        return {
                            ...tl,
                            taskList: tl.taskList.map(t => {
                                if (t.id === currentTask.id) {
                                    return {
                                        ...t,
                                        taskStages: newItems
                                    };
                                }
                                return t;
                            })
                        };
                    }
                    return tl;
                })]);
            }
        }
    }
    function addToDeleteList(stage){
        setStagesToDelete([...stagesToDelete, stage.id]);
    }
    function removeFromDeleteList(stage){
        setStagesToDelete(stagesToDelete.filter(id => id !== stage.id));
    }
    function deleteStageList(stageList){
        setData([...data.map(tl=>{
            if(tl.id === currentTaskList.id){
                return {
                    ...tl,
                    taskList: tl.taskList.map(t=>{
                        if(t.id === currentTask.id){
                            return {
                                ...t,
                                taskStages: t.taskStages.filter(ts=>!stageList.includes(ts.id))
                            }
                        }
                        return t;
                    })
                }
            }
            return tl;
        })]);
    }

    return (
        <ul className={styles.ul} {...props}>
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
                    {items.map((el, index) => (
                        <Stage
                            key={el.id}
                            currentTaskList={currentTaskList}
                            currentTask={currentTask}
                            stageNumber={index + 1}
                            stage={el}
                            addToDeleteList={addToDeleteList}
                            removeFromDeleteList={removeFromDeleteList}
                            isDeleting={stagesToDelete.includes(el.id)}
                        />
                    ))}
                </SortableContext>
            </DndContext>
            {props.children}
        </ul>
    );
}

export default TaskStages;
