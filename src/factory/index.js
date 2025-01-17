import { nanoid } from "nanoid";

function TaskListObj(taskListName){
    this.id = nanoid();
    this.text = taskListName;
    this.taskList = [];
}

function TaskObj({taskTitle,isImportant = false, deadLine = null,isDone = false}){
    this.id = nanoid();
    this.text = taskTitle;
    this.taskStages = [];
    this.isImportant = isImportant;
    this.deadLine = deadLine;
    this.isDone = isDone;
}

function TaskStageObj({taskStage,isDone = false}){
    this.id = nanoid();
    this.text = taskStage;
    this.isDone = isDone;
}

export { TaskListObj, TaskObj, TaskStageObj };