import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from './serviceWorker';
import styled from 'styled-components';
import '@atlaskit/css-reset';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import Column from './component/column.jsx';
import OptionBoard from './component/OptionBoard.jsx'
import initialData from './initial-data.js';

let DontSave = false

const MainBoard = styled.div`
  user-select: none;
  outline: none;
  button: focus {outline:0;};
`;

const Container = styled.div`
  display: flex;
  height: auto;
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
    const { destination, source, draggableId, type } = result;
    console.log(source)
    console.log(destination)
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

    if(type === 'column'){
      const newColumnOrder = Array.from(this.state.columnOrder)
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0,draggableId)

      const newState = {
        ...this.state,
        columnOrder: newColumnOrder,
      }
      this.setState(newState)
      return;
    }

    if(this.state.columns[destination.droppableId].type === 'trash'){
      const NewTasks = this.state.tasks
      const NewColumns = this.state.columns
      console.log(NewTasks[NewColumns[source.droppableId].taskIds[source.index]])
      delete NewTasks[NewColumns[source.droppableId].taskIds[source.index]]
      NewColumns[source.droppableId].taskIds.splice(source.index,1)
      delete NewTasks[source.draggableId]
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

  createNewTask(columnId,content){
    //create new task
    let newTasks = this.state.tasks
    newTasks['task-' + this.state.TaskIdCount] = { id: 'task-' + this.state.TaskIdCount, content: content, completed: false, ProceedTime: 0}
    let NewColumns = this.state.columns
    NewColumns[columnId].taskIds.push('task-' + this.state.TaskIdCount)
    this.setState({
      TaskIdCount: this.state.TaskIdCount + 1,
      tasks: newTasks,
      columns: NewColumns,
    })
  }

  createNewColumn =(columnType,title)=> {
    let NewColumns = this.state.columns
    NewColumns['column-' + this.state.ColumnIdCount] = { id: 'column-' + this.state.ColumnIdCount, type: columnType, title: title, taskIds: []}
    let newColumnOrder = this.state.columnOrder
    newColumnOrder.push('column-' + this.state.ColumnIdCount)
    this.setState({
      ColumnIdCount: this.state.ColumnIdCount + 1,
      columns: NewColumns,
      columnOrder: newColumnOrder
    })
  }

  changeTaskContent =(taskId, content)=> {
    let newTasks = this.state.tasks
    newTasks[taskId].content = content
    this.setState({
      tasks: newTasks
    })
  }

  changeColumnTitle =(columnId, title)=> {
    let NewColumns = this.state.columns
    NewColumns[columnId].title = title
    this.setState({
      columns: NewColumns
    })
  }

  deleteColumn =(columnId)=>{
    let newTasks = this.state.tasks
    let NewColumns = this.state.columns
    let newColumnOrder = this.state.columnOrder
    NewColumns[columnId].taskIds.forEach(element => delete newTasks[element])
    delete NewColumns[columnId]
    newColumnOrder.splice(newColumnOrder.indexOf(columnId),1)
    this.setState({
      tasks: newTasks,
      columns: NewColumns,
      columnOrder: newColumnOrder
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
    /*
    if(state === true){
      if(this.state.columns['column-2'].taskIds.includes(taskId)){
        NewColumns['column-2'].taskIds.splice(NewColumns['column-2'].taskIds.indexOf(taskId),1)
        NewColumns['column-1'].taskIds.push(taskId)
      }else{
        NewColumns['column-1'].taskIds.splice(NewColumns['column-1'].taskIds.indexOf(taskId),1)
        NewColumns['column-1'].taskIds.push(taskId)
      }
    }
    */
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
    return (
        <Droppable 
          droppableId='all-columns' 
          direction='horizontal' 
          type='column'
        >
          {provided => (
            <Container
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {this.state.columnOrder.map((columnId,index) => {
                  const column = this.state.columns[columnId]
                  const tasks = column.taskIds.map(
                    taskId => this.state.tasks[taskId],
                  );

                  return (
                    <Column 
                      key={column.id} 
                      column={column} 
                      tasks={tasks} 
                      index={index} 
                      createNewTask={this.createNewTask}
                      ProceedTimeToTask={this.ProceedTimeToTask}
                      completeTask={this.completeTask}
                      deleteColumn={this.deleteColumn}
                      changeColumnTitle={this.changeColumnTitle}
                      changeTaskContent={this.changeTaskContent}
                            />
                )
              })}
              {provided.placeholder}
              </Container>
          )}
        </Droppable>
      )
  }

  render(){
    return(
    <div>
      <DragDropContext  onDragEnd={this.onDragEnd}>
        {this.DisplayColumn()}
      </DragDropContext>
      <OptionBoard CleanAll={this.CleanAll} createNewColumn={this.createNewColumn}/>
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
