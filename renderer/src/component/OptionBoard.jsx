import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

let color0 = "#cbd1d5" //background color
let color1 = "#607d92"
let color2  = "#869fb1"
let color3 = "#b8c7d7"

const StyleButton = styled.button`
  margin: 5px 3px;
  background-color: ${color1};
  height: auto;
  width: auto;
  box-shadow: 0 0px 6px 0px ${color1};
  border: 0px;
  color: ${color3};
  border-radius: 10px;
`;


const BigBotton = styled.button`
    position: fixed;
    right: 10px;
    bottom: 10px;
	width: 30px;
	height: 30px;
    text-align:center;
    vertical-align: middle;
    line-height:25px;
    margin: 0px 3px;
    background-color: ${color1};
    box-shadow: 0 0px 6px 0px ${color1};
    border: 0px;
    color: ${color3};
    border-radius: 10px;
`;

const Board = styled.div`
    position: fixed;
    right: 10px;
    bottom: 50px;
    width: 100px;
	height: fit-content;
    border: 1px solid ${color2};
    border-radius: 2px;
    background-color: ${color2};
    color: ${color0};
    padding: 8px;
    margin-bottom: 8px;
    box-shadow: 0px 0px 10px 3px ${color2};
`;

export default class OptionBoard extends React.Component{
    state:{
        display: false
    }

    constructor(props){
        super(props)
        this.state = {
            display: false
        }
    }

    CleanAll =()=> {
        this.props.CleanAll()
    }

    createNewColumn =(columnType, Title)=> {
        this.props.createNewColumn(columnType,Title)
    }

    displayBoard =(change)=> {
        let display = this.state.display
        if(change){
            this.setState({
                display: !display
            })
            display = !display
        }
        if(display){
        return(
            <Board>
            <StyleButton onClick={this.CleanAll}>回復原廠設定</StyleButton>
            <StyleButton onClick={() => {this.createNewColumn('Todo','New to do')}}>New To do</StyleButton>
            <StyleButton onClick={() => {this.createNewColumn('Pomo','New Pomodoro Clock')}}>New Pomodoro Clock</StyleButton>
            <StyleButton onClick={() => {this.createNewColumn('trash','New Trash Can')}}>New Trash Can</StyleButton>
            </Board>
        )
        }else{
            return;
        }
    }


    render(){
        return(
            <div>
            {this.displayBoard()}
            <BigBotton onClick={()=>{this.displayBoard(true)}}>
            +
            </BigBotton>
            </div>
        )
    }
}