import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from './serviceWorker';
import styled from 'styled-components';
import '@atlaskit/css-reset';
import {DragDropContext} from 'react-beautiful-dnd';
import Column from './component/column.jsx';
import initialData from './initial-data.js';

let DontSave = false

const MainBoard = styled.div`
  user-select: none;
  outline: none;
  button: focus {outline:0;};
`;

const ToDoDiv = styled.div`
  position: absolute;
  left:0px;
`;

const PomodoroDiv = styled.div`
  position: absolute;
  right:0px;
`;

class App extends Component {
  state = initialData

  constructor(props){
    super(props)
    this.createNewTask = this.createNewTask.bind(this)
    this.ProceedTimeToTask = this.ProceedTimeToTask.bind(this)
  }

  componentDidMount(){
    document.title = "PomoTodo"
    this.setupBeforeUnloadListener();
    const state = JSON.parse(localStorage.getItem('IndexData'))
    if(state){
      this.setState({
        ...state
      })
    }
  }

  doSomethingBeforeUnload = () => {
    if(!DontSave){
      localStorage.removeItem('IndexData')
      localStorage.setItem('IndexData', JSON.stringify(this.state))
    }
  }

  setupBeforeUnloadListener = () => {
  window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault()
      return this.doSomethingBeforeUnload()
  })
  }

  CleanAll =()=> {
    localStorage.clear()
    DontSave = true
    window.location.reload()
  }

  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination){
      return;
    }

    if (
      destination.draggableId === source.draggableId &&
      destination.index === source.index && 
      destination.droppableId === source.droppableId
    ){
      return;
    }
    if(destination.droppableId === 'column-3'){
      const NewColumns = this.state.columns
      NewColumns[source.droppableId].taskIds.splice(source.index,1)
      this.setState({
      columns: NewColumns
    })
      return;
    }
    const NewColumns = this.state.columns
    NewColumns[source.droppableId].taskIds.splice(source.index,1)
    NewColumns[destination.droppableId].taskIds.splice(destination.index, 0, draggableId)
    this.setState({
      columns: NewColumns
    })
  };

  createNewTask(content){
    //create new task
    let newTasks = this.state.tasks
    newTasks['task-' + this.state.idCount] = { id: 'task-' + this.state.idCount, content: content, completed: false, ProceedTime: 0}
    let NewColumns = this.state.columns
    NewColumns['column-1'].taskIds.push('task-' + this.state.idCount)
    this.setState({
      idCount: this.state.idCount + 1,
      tasks: newTasks,
      columns: NewColumns,
    })
  }

  ProceedTimeToTask(columnId, ProceedTime){
    //modify the task
    let NewTasks = this.state.tasks
    this.state.columns[columnId].taskIds.forEach(element => {
      let NewTask = this.state.tasks[element]
      NewTask.ProceedTime += ProceedTime
      NewTasks[element] = NewTask 
    },this)
    this.setState({
      tasks: NewTasks
    })
    /*
    this.state.columns[columnId].taskIds.array.forEach(element => {
      const task = this.state.tasks[element]
      const tasks = this.state.tasks
      task.ProceedTime = ProceedTime
      tasks[element] = task
      this.setState({
        tasks: tasks
      })
    });
    */
  }  

  completeTask =(taskId, state)=> {
    let tasks = this.state.tasks
    let NewColumns = this.state.columns
    tasks[taskId].completed = state
    if(state === true){
      if(this.state.columns['column-2'].taskIds.includes(taskId)){
        NewColumns['column-2'].taskIds.splice(NewColumns['column-2'].taskIds.indexOf(taskId),1)
        NewColumns['column-1'].taskIds.push(taskId)
      }else{
        NewColumns['column-1'].taskIds.splice(NewColumns['column-1'].taskIds.indexOf(taskId),1)
        NewColumns['column-1'].taskIds.push(taskId)
      }
    }
    this.setState({
      tasks: tasks,
      columns: NewColumns
    })
  }
  
        /*
        {this.state.columnOrder.map((columnId) => {
          const column = this.state.columns[columnId];
          const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);

        return <Column key={column.id} column={column} tasks={tasks} createNewTask={this.createNewTask} ProceedTimeToTask={this.ProceedTimeToTask} completeTask={this.completeTask}/>
      })}
      */
      //<button onClick={this.CleanAll}>回復原廠設定</button>
  DisplayColumn = () => {
    const ToDoColumn = this.state.columns['column-1']
    const ToDoTasks = ToDoColumn.taskIds.map(taskId => this.state.tasks[taskId])
    const Pomodoro = this.state.columns['column-2']
    const PomodoroTasks = Pomodoro.taskIds.map(taskId => this.state.tasks[taskId])
    const TrashCan = this.state.columns['column-3']
    const TrashCanTasks = TrashCan.taskIds.map(taskId => this.state.tasks[taskId])
    return (
      <div>
        <ToDoDiv>
          <Column key={ToDoColumn.id} column={ToDoColumn} tasks={ToDoTasks} createNewTask={this.createNewTask} ProceedTimeToTask={this.ProceedTimeToTask} completeTask={this.completeTask}/>
          <Column key={TrashCan.id} column={TrashCan} tasks={TrashCanTasks} />
        </ToDoDiv>
        <PomodoroDiv>
          <Column key={Pomodoro.id} column={Pomodoro} tasks={PomodoroTasks} ProceedTimeToTask={this.ProceedTimeToTask} completeTask={this.completeTask}/>
        </PomodoroDiv>
      </div>
      )
  }

  render(){
    return(
    <div>
      <DragDropContext  onDragEnd={this.onDragEnd}>
      {this.DisplayColumn()}
      </DragDropContext>
    </div>
    );
  }
}

ReactDOM.render(
  <div>
  <MainBoard>
    <App />
  </MainBoard>
  </div>, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
