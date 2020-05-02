import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

let color0 = "#465c70"
let color1 = "#607d92"
let color2  = "#869fb1"
let color3 = "#b8c7d7"

let TimerTime = 0
let displayCondition = 0

const LeftDivStyle = {
  float:"left",
  width:"200px",
  height: "auto",
  marginRight: "-400px",
  margin: "10px 10px",
  padding: "10px",
  backgroundColor: color3,
  boxShadow: "0px 0px 10px 3px " + color3
}

const RightDivStyle = {
  color: color3,
  float: "right",
  width:"300px",
  height: "auto",
  backgroundColor: color0,
  margin: "10px 5px",
  padding: "10px",
  borderRadius: "3px",
  boxShadow: "0px 0px 10px 3px " + color0
}

const buttonStyle = {
  margin: "0px 3px",
  backgroundColor: color1,
  height: "25px",
  width: "auto",
  boxShadow: "0 0px 6px 0px" + color1,
  border: "0px",
  color: color3,
  borderRadius: "10px"
}

const InputFormStyle = {
  margin: "10px 5px",
  padding: "10px",
  width: "150px",
  borderRadius: "3px",
  backgroundColor: color2,
  color: color3,
  boxShadow: "0px 0px 10px 3px " + color2
  }

const InputBoxStyle = {
  width: "100%",
  height: "25px",
  backgroundColor: color2,
  border: "0",
  borderRadius: "3px",
  resize: "none", 
  color: "block"
}

const TimerInputStyle = {
  color: color0,
  margin: "10px 5px",
  padding: "10px",
  width: "auto",
  borderRadius: "3px",
  backgroundColor: color2,
}

const TimerInputFormStyle = {
  width: "30px",
  height: "20px",
  backgroundColor: color0,
  border: "0",
  borderRadius: "3px",
  resize: "none",
  color: color2
}

const focusingStyle = {
  color: color3,
  width:"auto",
  height: "auto",
  backgroundColor: color0,
  margin: "10px 5px",
  padding: "10px",
  borderRadius: "10px",
  boxShadow: "0px 0px 10px 3px " + color0
}

class TimerInput extends React.Component{
  state:{
    h:0,
    m:0,
    s:0
  }

  constructor(props){
    super(props)
    this.state = {
      h:0,
      m:0,
      s:0
    }
    this.NumChange = this.NumChange.bind(this)
    this.Submit = this.Submit.bind(this)
  }

  NumChange(event){
    if(event.target.placeholder === "hours"){
      this.setState({
        h: parseInt(event.target.value)
      })
    }
    if(event.target.placeholder === "minute"){
      this.setState({
        m: parseInt(event.target.value)
      })
    }
    if(event.target.placeholder === "second"){
      this.setState({
        s: parseInt(event.target.value)
      })
    }
  }

  Submit(){
    this.props.Submit(this.state.h*60*60 + this.state.m*60 + this.state.s)
  }

  render(){
    return(
      <div style={TimerInputStyle}>
      <input type="number" value={this.state.h} placeholder="hours" min="0" onChange={this.NumChange} style={TimerInputFormStyle}/>&nbsp;時&nbsp;
      <input type="number" value={this.state.m} placeholder="minute" max="59" min="0" onChange={this.NumChange} style={TimerInputFormStyle}/>&nbsp;分&nbsp; 
      <input type="number" value={this.state.s} placeholder="second" max="59" min="0" onChange={this.NumChange} style={TimerInputFormStyle}/>&nbsp;秒&nbsp;&nbsp;&nbsp;
      <button type="button" style={buttonStyle} onClick={this.Submit}>Start Timer</button>
      </div>
    )
  }
}

const InputForm =(props)=>{

  const Press = (event) =>{
    props.KeyPress(event)
  }
  return <div style={InputFormStyle}><textarea cols="100" onKeyPress={Press} style={InputBoxStyle} placeholder="請輸入任務名稱"/></div>
}

const TodoItem = (props) => {
  const TodoItemStyle = {
    color: color3,
    margin: "20px 5px",
    padding: "10px",
    width: "150px",
    borderRadius: "3px 3px",
    backgroundColor: color0,
    boxShadow: "0px 0px 10px 3px " + color0
  }
  const Click = () => {
    props.RemoveTodoItem(props.index)
  }
  return (
    <div onClick={Click} style={TodoItemStyle}>{props.value} </div>
    )
} 

class MainBoard extends React.Component{
  state: {
    time: 0,
    items: [],
    doingTime: [],
    target: null,
    MainBoardTimer: null,
    mode: ""
  }
  constructor(props){
    super(props)
    this.state = {
      time: 0,
      items: [],
      doingTime: [],
      target: null,
      MainBoardTimer: null,
      mode: "StopWatch"
    }
    this.StopWatch = this.StopWatch.bind(this)
    this.SwitchMod = this.SwitchMod.bind(this)
    this.StartDoing = this.StartDoing.bind(this)
    this.ReceiveTime = this.ReceiveTime.bind(this)
  }

  doSomethingBeforeUnload = () => {
    localStorage.removeItem('items')
    localStorage.removeItem('doingTime')
    localStorage.setItem("items",JSON.stringify(this.state.items))
    localStorage.setItem('doingTime',JSON.stringify(this.state.doingTime))
  }

  setupBeforeUnloadListener = () => {
  window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault()
      return this.doSomethingBeforeUnload()
  })
  }

  componentDidMount(){
    document.title = "PomoTodo"
    this.setupBeforeUnloadListener();
    if(localStorage.getItem('items') != null && localStorage.getItem('doingTime') != null){
      this.setState({
        items: JSON.parse(localStorage.getItem('items')),
        doingTime: JSON.parse(localStorage.getItem('doingTime'))
      })
    }
  }

  ReceiveTime(t){
    if(t === "NaN"){
      alert("請輸入正確內容")
      t = 0
    }
    this.setState({
      time: t
    })
    this.StartDoing()
  }

  CreateNewTodoItem =(event)=>{
    if(event.key === 'Enter'){
    const Newitems = [...this.state.items, event.target.value]
    const NewDoingTime = [...this.state.doingTime, 0]
    this.setState({
      items: Newitems,
      doingTime: NewDoingTime
    }) 
    event.target.value = ""
    }
  }

  RemoveTodoItem =()=>{
    let index = this.state.target
    const Newitems = [...this.state.items.slice(0,index),...this.state.items.slice(index+1)]
    const NewDoingTime = [...this.state.doingTime.slice(0,index),...this.state.doingTime.slice(index+1)]
    this.setState({
      items: Newitems,
      doingTime: NewDoingTime,
      target: null
    })
  }

  launchTodoItem =(index)=>{
    this.setState({
      target: index
    })
  }

  SwitchMod(){
    if(this.state.mode === "StopWatch"){
      this.setState({
        mode: "Timer"
      })
    }else{
      this.setState({
        mode: "StopWatch"
      })
    }
  }

  StartDoing(){
    if(this.state.mode === "StopWatch"){
      this.StopWatch()
    }else{
      this.Timer()
    }
  }

  Timer(){
    const StopTimer = () =>{
      clearInterval(this.state.MainBoardTimer)
        this.setState({
          MainBoardTimer: null
        })
        let index = this.state.target
        let NewDoingTime = this.state.doingTime
        NewDoingTime[index] = TimerTime
        this.setState({
          doingTime: NewDoingTime,
          time: 0
        })
    }
    const Ticking = () => {
      if(this.state.time > 0){
      this.setState({
        time: this.state.time - 1
      })
      TimerTime += 1
    }
      else{
        StopTimer()
      }
    }
    if(this.state.MainBoardTimer === null || this.state.MainBoardTimer === undefined){
      this.setState({
        MainBoardTimer: setInterval(function(){Ticking()},1000)
      }) 
    }
      else{
        StopTimer()
      }
  }

  StopWatch(){
    const Ticking =()=>{
        const NewTime = this.state.time + 1
        this.setState({time: NewTime})
    }
    if(this.state.MainBoardTimer === null || this.state.MainBoardTimer === undefined){
    this.setState({
      MainBoardTimer: setInterval(function(){Ticking()},1000)
    }) 
  }
    else{
      clearInterval(this.state.MainBoardTimer)
      this.setState({
        MainBoardTimer: null
      })
      let index = this.state.target
      let NewDoingTime = this.state.doingTime
      NewDoingTime[index] = this.state.time
      this.setState({
        doingTime: NewDoingTime,
        time: 0
      })
    }
  }

  DisplayTime(InputSecond){
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

  render(){
    if(this.state.MainBoardTimer === null){
      if(this.state.target === null){
          displayCondition = 0
        }else{
          if(this.state.mode === "StopWatch"){
          displayCondition = 1
        }
        else{
          displayCondition = 2
        }
      }
    }else{
      if(this.state.mode === "Timer"){
          displayCondition = 3
      }
      else{
          displayCondition = 4
      }
    }

    const LeftDiv = () => { return(<div style={LeftDivStyle}>
      <InputForm KeyPress={this.CreateNewTodoItem} />
      <div>{this.state.items.map((value,index)=><TodoItem value={value} index={index} target={this.state.target} key={index} RemoveTodoItem={this.launchTodoItem}/>)}</div>
      </div>)}

  switch(displayCondition){
    default:
      case 0:
          return(
              <div>
                <LeftDiv/>
                <div style={RightDivStyle}>
                <h1>想做什麼?</h1>
                <p>在左側新增或選擇任務</p>
                </div>
              </div>
          )
      case 1:
          return (
              <div>
                <LeftDiv/>
                <div style={RightDivStyle}>
                <h1>{this.state.items[this.state.target]} </h1>
                <p>已投入 {this.DisplayTime(this.state.doingTime[this.state.target])}</p>
                <button type="button" style={buttonStyle} onClick={this.StartDoing}>Start StopWatch</button>
                <button type="button" style={buttonStyle} onClick={this.SwitchMod}>Switch to Timer</button>
                <button type="button" style={buttonStyle} onClick={this.RemoveTodoItem}>delete</button>
                </div>
              </div>
            )
      case 2:
          return (
              <div>
                <LeftDiv/>
                <div style={RightDivStyle}>
                <h1>{this.state.items[this.state.target]} </h1>
                <p>已投入 {this.DisplayTime(this.state.doingTime[this.state.target])}</p>
                  <TimerInput Submit={this.ReceiveTime}/>
                  <button type="button" style={buttonStyle} onClick={this.SwitchMod}>Switch to StopWatch</button>
                  <button type="button" style={buttonStyle} onClick={this.RemoveTodoItem}>delete</button>
                </div>
              </div>
            )
      case 3:
          return(
            <div style={focusingStyle}> 
            <h1>專注...</h1>
              <p>現在在做的是 {this.state.items[this.state.target]}.</p>
              <p>你還剩下{this.DisplayTime(this.state.time)}</p>
              <button type="button" style={buttonStyle} onClick={this.StartDoing}>leave</button>
          </div>
            )
      case 4:
          return(
            <div style={focusingStyle}>
              <h1>專注...</h1>
              <p>現在在做的是 {this.state.items[this.state.target]}</p>
              <p>你已經專注了 {this.DisplayTime(this.state.time)}</p>
              <button type="button" style={buttonStyle} onClick={this.StartDoing}>leave</button>
          </div>

            )
    }
  }
}

ReactDOM.render(
  <div>
    <MainBoard/>
  </div>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
