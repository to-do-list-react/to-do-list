import React, { useContext, useEffect, useState } from "react";
import Button from "../UI/Button";
import Switcher from "../UI/Switcher";
import styles from "./Calendar.module.css";
import ThemeContext from "../../context/ThemeContext";

function Calendar({date, onPickDate,onCancel,onSave, ...props}){
    const initDate = date!=null ? new Date(date) : new Date();

    const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

    const themeColor = useContext(ThemeContext);
    const [selectedMonth,setSelectedMonth] = useState(initDate);
 
    useEffect(()=>{
        if(date){
            setSelectedMonth(new Date(date));
        }
    },[date]);

    const monthController = {
        prev: function(){
            const curMonth = monthController.get();
            const newMonthDate = new Date(selectedMonth);
            newMonthDate.setMonth(curMonth-1);
            setSelectedMonth(newMonthDate);
            return monthController.get();
        },
        next: function(){
            const curMonth = monthController.get();
            const newMonthDate = new Date(selectedMonth);
            newMonthDate.setMonth(curMonth+1);
            setSelectedMonth(newMonthDate);
            return monthController.get();
        },
        get: function(){
            return selectedMonth.getMonth();
        },
        getYear: function(){
            return selectedMonth.getFullYear();
        },
    }

    function createTable(initDate){
        const curTableDate = initDate ? new Date(initDate) : new Date();
        curTableDate.setDate(1);
        const lastDayDate = new Date(curTableDate);
        lastDayDate.setMonth(lastDayDate.getMonth()+1);
        lastDayDate.setDate(0);
        
        function getWeekday(d){
            const day = d.getDay();
            return day === 0 ? 6 : day - 1;
        }

        const tableRows = [];

        tableRows.push(
            <tr className={styles.calendarTableTr} key={-1+"r"}>
                {weekDays.map((day,index)=><td
                className={styles.td}
                key={index}>
                    {day}
                </td>)}
            </tr>
        );

        const rows = [[]];
        let curWeekNumber = 0;
        let i = 0;

        function curDateIterator(){
            curTableDate.setDate(curTableDate.getDate()+1);
        }
        function isEqualDates(date1,date2){
            if(date1 == null || date2 == null) return false;
            return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
        }
        while(i < getWeekday(curTableDate)){
            rows[curWeekNumber].push(<td className={styles.td} key={i-8}></td>);
            i++;
        }

        while(curTableDate <= lastDayDate){
            if(getWeekday(curTableDate) === 0) ++curWeekNumber; //Может быть первая пустая строка, если месяц начинается с понедельника
            if(!rows[curWeekNumber]) rows[curWeekNumber] = [];

            rows[curWeekNumber].push(
            <td
            className={isEqualDates(date,curTableDate) ? styles[themeColor+"SelectedTd"] : styles.td}
            key={+curTableDate}>
                <Button
                date={+curTableDate}
                onClick={(e)=>{
                    const thisDate = new Date(+e.target.getAttribute("date"));
                    onPickDate(thisDate);
                    }}>
                    {curTableDate.getDate()}
                </Button>
            </td>
            );
            
            curDateIterator();
        }
        if(getWeekday(curTableDate)!==0){
            while(getWeekday(curTableDate) !== 6){
                rows[curWeekNumber].push(<td className={styles.td} key={curTableDate.getDate()}></td>);
                curDateIterator();
            }
        }
        
        rows.map((r,index)=>{
            if(r.length !== 0){ // проверка на пустую строку.
            tableRows.push(
                <tr className={styles.calendarTableTr} key={index+"r"}>{r}</tr>
            )
            }
        });

        return (
            <table>
                <tbody className={styles.calendarTableBody}>
                    {tableRows}
                </tbody>
            </table>
        )
    }

    return (
        <div {...props} className={`${styles[themeColor+"CalendarContainer"]} ${props.className}`}>
            <Switcher
                style={{
                    backgroundColor:themeColor==="black" ? "rgb(85,85,85)" : "rgb(92,112,190)",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "calc(100%-30px)",
                    padding: "0 15px 0 15px",
                    fontSize: "24px",
                }}
                prevButtonHandler={monthController.prev}
                nextButtonHandler={monthController.next}
            >
                {monthNames[monthController.get()]} {monthController.getYear()}
            </Switcher>
            {createTable(selectedMonth)}
        
            <div className={styles.controls}>
                <Button onClick={onCancel}>Отмена</Button>
                <Button onClick={onSave}>Сохранить</Button>
            </div> 
        </div>
    )
}

export default Calendar;