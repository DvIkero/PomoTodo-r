import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import OptionBoard from './OptionBoard';

//color sitting
let color0 = "#465c70"
let color1 = "#607d92"
let color2  = "#869fb1"
let color3 = "#b8c7d7"

/*
const Container = styled.div`
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    background-color:${props => props.isCompleted ? 'green' : backgroundColor};
`;
*/
const Container = styled.div`
    position:relative;
    color: ${color3};
    background-color: ${color1};
    margin: 10px 5px;
    padding: 10px;
    min-width:200px;
    border-radius: 3px;
    box-shadow: 0px 0px 10px 3px ${color1};
`;

const TitleInput = styled.textarea`
    font-size: 15px;
    border: 0px;
    color: ${color3};
    background-color: transparent;
`;

const TextArea = styled.div`
    max-width: 170px;
    color: ${props => props.isCompleted ? '#cdcac5' : color3};
    text-decoration:${props => props.isCompleted ? 'line-through' : ''};
`;

const StyleButton = styled.button`
  margin: 0px 3px;
  background-color: ${color0};
  height: 25px;
  width: auto;
  box-shadow: 0 0px 6px 0px ${color0};
  border: 0px;
  color: ${color3};
  border-radius: 10px;
`;

const OptionButton = styled.button`
  position:absolute;
  right:4px;
  top:7px;
  margin: 0px 3px;
  width:20px;
  height:20px;
  font-size: 20px;
  background-color: transparent;
  color: ${color0};
  border:0px;
`;

const OptionBoardStyle = styled.div`
    position: relative;
    top:10px;
    border: 1px solid ${color2};
    border-radius: 2px;
    background-color: ${color2};
    color: ${color0};
    padding: 8px;
    margin-bottom: 8px;
    box-shadow: 0px 0px 10px 3px ${color2};
`;
export default class Task extends React.Component {

    state:{
      completed: false,
      modifying: false,
      content: '',
      option: false
    }

    constructor(props){
      super(props)
      this.state = {
        completed: false,
        modifying: false,
        content:'',
        option: false
      }
    }

    componentDidMount(){
      this.setState({
        completed: this.props.task.completed,
      })
      /*
      if(this.props.backgroundColor){
        backgroundColor = this.props.backgroundColor
      }else{
        backgroundColor = 'white'
      }
      */
    }

    DisplayTime =(InputSecond)=> {
        let minutes = parseInt(InputSecond/60)
        let hours = parseInt(minutes/60)
        let days = parseInt(hours/24)
        let second = InputSecond - parseInt(InputSecond/60)*60
        minutes -= hours*60
        hours -= days*24
        if(days > 0){
          return days + "天" + hours + "小時" + minutes + "分" + second + "秒"
        }
        if(hours > 0){
          return hours + "小時" + minutes + "分" + second + "秒"
        }
        if(minutes > 0){
          return minutes + "分" + second + "秒"
        }
        else{
          return second + "秒"
        }
      }
    
    changeTaskContent =(content)=>{
      this.props.changeTaskContent(this.props.task.id,content)
    }

    completeTask =()=> {
      let state = !this.props.task.completed
      let taskId = this.props.task.id
      this.props.completeTask(taskId, state)
      this.setState({
        completed: state
      })
      if(state){
      }
    }

    DisplayContent =(content)=> {

      let modifying = this.state.modifying


      const ModifyContent =()=>{
          if(!modifying){
          modifying = !modifying
          this.setState({
              modifying: modifying,
              content: content
          })
          }else{
              return;
          }
      }

      const onChange =(e)=>{
          this.setState({
              content: e.target.value
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
              this.changeTaskContent(this.state.content)
          }
      }

      const DisplayInput =()=>{
          return(
              <TitleInput 
                  onKeyPress={e =>{Submit(e)}}
                  value={this.state.content}
                  onChange={e => onChange(e)}
              />
          )
      }

      return(
          <div onClick={()=>{ModifyContent()}}>
              {modifying ? DisplayInput() : content}
          </div>
      )
  }

  OptionBoard =(change)=> {
    if(change){
      this.setState({
        option: !this.state.option
      })
    }
    if(this.state.option){
      return(
        <OptionBoardStyle>
          <p>此任務已進行：{this.DisplayTime(this.props.task.ProceedTime)}</p>
          <StyleButton onClick={() => {this.completeTask()}}>{this.props.task.completed ? "已完成" : "完成"}</StyleButton>
        </OptionBoardStyle>
      )
    }else{
      return;
    }
  }
  
    render(){
        return (
          <Draggable draggableId={this.props.task.id} index={this.props.index}>
              {provided =>  (
                  <Container
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      isCompleted = {this.props.task.completed}
                  >   
                    <TextArea isCompleted = {this.props.task.completed}>
                      {this.DisplayContent(this.props.task.content)}
                    </TextArea>
                    <OptionButton onClick={()=>{this.OptionBoard(true)}}>{this.state.option ? '^' : 'v'}</OptionButton>
                      {this.OptionBoard()}
                  </Container>
              )}
          </Draggable>
        );
    }
}