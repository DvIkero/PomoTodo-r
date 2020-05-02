import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Task from './task.jsx'
import Clock from './clock.jsx'

//color sitting
let color0 = "#cbd1d5" //background color
let color1 = "#607d92"
let color2  = "#869fb1"
let color3 = "#b8c7d7"

const TrashCan = styled.div`
    padding: 8px;
    background-color: ${props => (props.isDraggingOver ? '#cdcac5' : color2 )};
    box-shadow: 0 0px 6px 0px ${props => (props.isDraggingOver ? '#cdcac5' : color2 )};
    border: 0px;
    border-radius: 2px;;
`;
/*
const Container = styled.div`
    margin: 8px;
    width: 300px;
    border: 1px solid lightgrey;
    border-radius: 2px;
`;
*/
const Container = styled.div`
    width: 290px;
    color: ${color3};
    background-color: ${color0};
    margin: 10px 5px;
    padding: 10px;
    border-radius: 3px;
    box-shadow: 0px 0px 10px 3px ${color0}
`;
const Title = styled.h3`
    padding: 8px;
`;
/*
const TaskList = styled.div`
    padding: 8px;
    background-color: ${props => (props.isDraggingOver ? 'blue' : 'lightgrey')};
`;
*/
const TaskList = styled.div`
    padding: 8px;
    background-color: ${props => (props.isDraggingOver ? '#cdcac5' : color2 )};
    box-shadow: 0 0px 6px 0px ${props => (props.isDraggingOver ? '#cdcac5' : color2 )};
    border: 0px;
    border-radius: 2px;
`;
/*
const InputForm = styled.input`
    position: relative;
    left: 8px;
    width: 266px;
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    background-color: "white";
`;
*/
const InputForm = styled.input`
    position: relative;
    left: 3px;
    width:266px;
    border: 1px solid ${color2};
    border-radius: 2px;
    background-color: ${color2};
    color: ${color3};
    padding: 8px;
    margin-bottom: 8px;
    box-shadow: 0px 0px 10px 3px ${color2};
    outline: none;
`;

export default class Column extends React.Component {

    state:{
        value: ""
    }

    constructor(props){
        super(props)
        this.createNewTask = this.createNewTask.bind(this)
        this.onChange = this.onChange.bind(this)
        this.state = {
            value: ""
        }
    }

    createNewTask(e){
        if(e.target.value !== "" && e.key === 'Enter'){
          this.props.createNewTask(e.target.value)
          this.setState({
            value: ""
        })
        }
      }

    ProceedTimeToTask =(columnId, ProceedTime)=> {
        this.props.ProceedTimeToTask(columnId, ProceedTime)
    }
      
    completeTask =(taskId, state)=> {
        this.props.completeTask(taskId, state)
    }

    onChange(e){
        const NewValue = e.target.value
        this.setState({
            value: NewValue
        })
    }

    render(){
        if(this.props.column.type === 'Todo'){
        return (
            <div>
                <Container>
                    <Title>{this.props.column.title}</Title>
                    <InputForm onKeyPress={this.createNewTask} value={this.state.value} onChange={this.onChange}></InputForm>
                    <Droppable droppableId={this.props.column.id}>
                    {(provided,snapshot) => (
                        <TaskList
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            isDraggingOver = {snapshot.isDraggingOver}
                        >
                            {this.props.tasks.map((task,index) => (
                                <Task key={task.id} task={task} index={index} completeTask={this.completeTask}/>
                            ))}
                            {provided.placeholder}
                            {(this.props.column.taskIds.length === 0) ? "請將待辦放置於此或新增待辦" : ""}
                        </TaskList>
                    )}
                    </Droppable>
                </Container>
            </div>
        )
        }
        if(this.props.column.type === 'Pomo'){
            return (
                <div>
                    <Container>
                        <Title>{this.props.column.title}</Title>
                        <Droppable droppableId={this.props.column.id}>
                        {(provided,snapshot) => (
                            <TaskList
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                isDraggingOver = {snapshot.isDraggingOver}
                            >
                                {}
                                {this.props.tasks.map((task,index) => (
                                    <Task key={task.id} task={task} index={index} completeTask={this.completeTask} backgroundColor={'blue'}/>
                                ))}
                                {provided.placeholder}
                                {(this.props.column.taskIds.length === 0) ? "將待辦放置於此開始工作" : ""}
                            </TaskList>
                        )}
                        </Droppable>
                        <Clock ProceedTimeToTask={this.ProceedTimeToTask}/>

                    </Container>
                </div>
            )
        }
        if(this.props.column.type === 'trash'){
            return(
                <Container>
                        <Title>{this.props.column.title}</Title>
                        <Droppable droppableId={this.props.column.id}>
                        {(provided, snapshot) => (
                            <TrashCan
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                isDraggingOver = {snapshot.isDraggingOver}
                            >
                                {this.props.tasks.map((task,index) => (
                                    <Task key={task.id} task={task} index={index}/>
                                ))}
                                {provided.placeholder}
                                {(this.props.column.taskIds.length === 0) ? "刪除待辦" : ""}
                            </TrashCan>
                        )}
                        </Droppable>
                </Container>
            )
        }
    }
}