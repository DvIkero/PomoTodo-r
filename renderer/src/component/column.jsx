import React from 'react';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './task.jsx'
import Clock from './clock.jsx'

//color sitting
let color0 = "#cbd1d5" //background color
let color1 = "#607d92"
let color2  = "#869fb1"
let color3 = "#b8c7d7"

/*
const Container = styled.div`
    margin: 8px;
    width: 300px;
    border: 1px solid lightgrey;
    border-radius: 2px;
`;
*/
const Container = styled.div`
    position: relative;
    width: fit-content;
    height: fit-content;
    color: ${color3};
    background-color: ${color0};
    margin: 10px 5px;
    padding: 10px;
    border-radius: 3px;
    box-shadow: 0px 0px 10px 3px ${color0}
`;

const StyleButton = styled.button`
    position: absolute;
    top:3px;
    right: 3px;
    background-color: transparent;
    border: 0px;
    color: ${color1};
`;

const Title = styled.h3`
    padding: 8px;
`;

const TitleInput = styled.textarea`
    border: 0px;
    max-width:266px;
    font-size: 20px;
    color: ${color1};
    background-color: transparent;
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
const InputForm = styled.textarea`
    ::placeholder{color: ${color3}};
    position: relative;
    left: 0px;
    width:fit-content;
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
        value: "",
        modifying: false,
        title: ''
    }

    constructor(props){
        super(props)
        this.createNewTask = this.createNewTask.bind(this)
        this.onChange = this.onChange.bind(this)
        this.state = {
            value: "",
            modifying: false,
            title: ''
        }
    }

    changeColumnTitle =(title)=> {
        this.props.changeColumnTitle(this.props.column.id,title)
    }

    deleteColumn =()=>  {
        this.props.deleteColumn(this.props.column.id)
    }

    createNewTask =(e)=> {
        if(e.target.value !== "" && e.key === 'Enter'){
          this.props.createNewTask(this.props.column.id,e.target.value)
          this.setState({
            value: ""
        })
        }
      }

    ProceedTimeToTask =(columnId, ProceedTime)=> {
        this.props.ProceedTimeToTask(columnId, ProceedTime)
    }
      
    changeTaskContent =(taskId, content)=> {
        this.props.changeTaskContent(taskId, content)
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

    DisplayTaskList =(context)=> {
        return(
            <div>
                <Droppable droppableId={this.props.column.id}>
                    {(provided,snapshot) => (
                        <TaskList
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            isDraggingOver = {snapshot.isDraggingOver}
                        >
                            {this.props.tasks.map((task,index) => (
                                <Task 
                                key={task.id} 
                                task={task} 
                                index={index} 
                                completeTask={this.completeTask}
                                changeTaskContent={this.changeTaskContent}
                                />
                            ))}
                            {provided.placeholder}
                            {(this.props.column.taskIds.length === 0) ? snapshot.isDraggingOver ? "" : context : ""}
                        </TaskList>
                    )}
                </Droppable>
            </div>
        )
    }

    DisplayTitle =(title)=>{

        let modifying = this.state.modifying

        const ModifyTitle =()=>{
            if(!modifying){
            modifying = !modifying
            this.setState({
                modifying: modifying,
                title: title
            })
            }else{
                return;
            }
        }

        const onChange =(e)=>{
            this.setState({
                title: e.target.value
            })
        }

        const Submit =(e)=> {
            if(e.key === 'Enter'){
                if(modifying){
                    modifying = !modifying
                    this.setState({
                        modifying: modifying
                    })
                }else{
                    return;
                }
                this.changeColumnTitle(this.state.title)
            }
        }

        const DisplayInput =()=>{
            return(
                <TitleInput 
                    onKeyPress={e =>{Submit(e)}}
                    value={this.state.title}
                    onChange={e => onChange(e)}
                />
            )
        }

        return(
            <Title onClick={()=>{ModifyTitle()}}>
                {modifying ? DisplayInput() :title}
            </Title>
        )
    }

    DisplayColumn =(columnType)=> {
        if(columnType === 'Todo'){
            return (
                <div>
                    <InputForm 
                    onKeyPress={this.createNewTask} 
                    value={this.state.value} 
                    onChange={this.onChange}
                    placeholder='新建任務...'
                    >
                    </InputForm>
                    {this.DisplayTaskList('請將任務放置於此')}
                </div>
            )
            }
            if(columnType === 'Pomo'){
                return (
                    <div>
                            {this.DisplayTaskList('請將任務放置於此')}
                        <Clock ProceedTimeToTask={this.ProceedTimeToTask}/>
                    </div>
                )
            }
            if(columnType === 'trash'){
                return(
                    <div>
                        {this.DisplayTaskList('刪除任務')}
                    </div>

                )
            }
    }

    render(){
        return(
            <Draggable draggableId={this.props.column.id} index={this.props.index}>
            {provided => (
                <Container
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <div {...provided.dragHandleProps}
                    >
                    {this.DisplayTitle(this.props.column.title)}
                    </div>
                    <StyleButton onClick={()=>{this.deleteColumn()}}>X</StyleButton>
                    {this.DisplayColumn(this.props.column.type)}
                    {provided.placeholder}
                </Container>
            )}
            </Draggable>
        )
    }
}