import React, { useContext, useEffect, useState } from "react";
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
import Task from "../Task";
import Calendar from "../Calendar";
import DataContext from "../../context/DataContext";
import styles from "./TaskList.module.css";

function TaskList({setSelectedTaskID, taskList, ...props}) {
    const [items, setItems] = useState(taskList);
    const [changeDateTask,setChangeDateTask] = useState(null);
    const [pickedDate,setPickedDate] = useState(null);
    const [calendarPosition,setCalendarPosition] = useState({
        top: 0,
        left: 0
    });
    const {data,setData} = useContext(DataContext);

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
        setItems(taskList);
    }, [taskList]);

    function handleDragEnd(event) {
        const {active, over} = event;
        
        if (active.id !== over.id) {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);
            
            if (oldIndex !== -1 && newIndex !== -1) {
                const newItems = arrayMove(items, oldIndex, newIndex);
                setItems(newItems);
                
                // Обновляем порядок в основных данных
                const updatedData = data.map(tl => {
                    const updatedTaskList = [...tl.taskList];
                    const taskListOldIndex = updatedTaskList.findIndex(t => t.id === active.id);
                    const taskListNewIndex = updatedTaskList.findIndex(t => t.id === over.id);
                    
                    if (taskListOldIndex !== -1 && taskListNewIndex !== -1) {
                        return {
                            ...tl,
                            taskList: arrayMove(updatedTaskList, taskListOldIndex, taskListNewIndex)
                        };
                    }
                    return tl;
                });
                
                setData(updatedData);
            }
        }
    }

    function pickDateHandler(date){
        if(+date === +pickedDate){
            setPickedDate(null);
            return;
        }
        setPickedDate(new Date(date));
    }

    function cancelHandler(){
        setChangeDateTask(null);
        setPickedDate(null);
    }

    function toggleDatePickerHandler(e, task) {
        setChangeDateTask(task?.id === changeDateTask?.id ? null : task);
        setPickedDate(task?.deadLine ? new Date(task.deadLine) : null);
        
        if(!e) return;
        const button = e.target.parentElement.querySelector('img[alt="calendar"]');
        const ulElement = e.target.closest('ul');
        const calendar = document.querySelector(`.${styles.datePicker}`);
        
        if (!button || !ulElement || !calendar) return;

        // Временно делаем календарь видимым для измерения
        const originalDisplay = calendar.style.display;
        calendar.style.display = 'block';
        calendar.style.visibility = 'hidden';
        
        const buttonRect = button.getBoundingClientRect();
        const ulRect = ulElement.getBoundingClientRect();
        const calendarRect = calendar.getBoundingClientRect();
        
        // Возвращаем исходное состояние
        calendar.style.display = originalDisplay;
        calendar.style.visibility = '';
        
        // Проверяем, поместится ли календарь снизу
        const spaceBelow = ulRect.height - (buttonRect.bottom - ulRect.top);
        const spaceAbove = buttonRect.top - ulRect.top;
        
        // Определяем позицию по вертикали
        let top;
        if (spaceBelow >= calendarRect.height) {
            // Если достаточно места снизу - размещаем под кнопкой
            top = buttonRect.bottom - ulRect.top;
        } else if (spaceAbove >= calendarRect.height) {
            // Если достаточно места сверху - размещаем над кнопкой
            top = buttonRect.top - ulRect.top - calendarRect.height;
        } else {
            // Если нет места ни сверху, ни снизу - размещаем снизу с прокруткой
            top = buttonRect.bottom - ulRect.top;
        }
        
        // Позиция по горизонтали - центрирование календаря относительно кнопки
        let left = buttonRect.left - ulRect.left - (calendarRect.width / 2) + (buttonRect.width / 2);
        
        // Проверка выхода за правую границу
        if (left + calendarRect.width > ulRect.width) {
            left = ulRect.width - calendarRect.width;
        }
        
        // Проверка выхода за левую границу
        if (left < 0) {
            left = 0;
        }

        setCalendarPosition({
            top,
            left
        });
    }

    function saveButtonClickHandler(){
        setDeadLine(pickedDate);
        toggleDatePickerHandler(null,pickedDate);
        setChangeDateTask(null);
        setPickedDate(null);
    }

    function setDeadLine(deadLine){
        changeDateTask.deadLine = deadLine ? deadLine.toISOString() : null;
        
        setData([...data.map(tl=>{
            tl.taskList.map(t=>{
                if(t.id === changeDateTask.id) return changeDateTask;
                return t;
            });
            return tl;
        })]);
    }
    
    return (
        <ul className={styles.ul} {...props}>
            <Calendar
                hidden={changeDateTask === null}
                className={styles.datePicker}
                date={pickedDate}
                onPickDate={pickDateHandler}
                onCancel={cancelHandler}
                onSave={saveButtonClickHandler}
                style={{
                    top: calendarPosition.top,
                    left: calendarPosition.left
                }}
            />
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
                    {items.map(el => (
                        <Task
                            key={el.id}
                            task={el}
                            toggleDatePicker={toggleDatePickerHandler}
                            setSelectedTaskID={setSelectedTaskID}
                        />
                    ))}
                </SortableContext>
            </DndContext>
            {props.children}
        </ul>
    );
}

export default TaskList;