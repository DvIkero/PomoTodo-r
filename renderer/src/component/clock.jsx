import React from 'react';
import styled from 'styled-components';
import UIfx from 'uifx';
import C2 from './sound/C2.ogg';
import D2 from './sound/D2.ogg';
import allRing from './sound/allRing.ogg'

//color sitting
let color0 = "#465c70"
let color1 = "#607d92"
let color2  = "#869fb1"
let color3 = "#b8c7d7"

/*
margin: "0px 3px";
background-color: color1;
height: "25px";
width: "auto";
box-shadow: "0 0px 6px 0px" + color1;
border: "0px";
color: color3;
borderRadius: "10px";
*/
const StyleButton = styled.button`
  margin: 0px 3px;
  background-color: ${color1};
  height: 25px;
  width: auto;
  box-shadow: 0 0px 6px 0px ${color1};
  border: 0px;
  color: ${color3};
  border-radius: 10px;
`;

const DisplayBoardStyle = styled.div`
    position: relative;
    bottom: -10px;
    left: 3px;
    width:266px;
    border: 1px solid ${color2};
    border-radius: 2px;
    background-color: ${color2};
    color: ${color0};
    padding: 8px;
    margin-bottom: 8px;
    box-shadow: 0px 0px 10px 3px ${color2};
`;

const ButtonBoard = styled.div`
    position: relative;
    bottom: -10px;
    left: 3px;
    width:266px;
    border: 1px solid ${color2};
    border-radius: 2px;
    background-color: ${color2};
    color: ${color3};
    padding: 8px;
    margin-bottom: 8px;
    box-shadow: 0px 0px 10px 3px ${color2};
`;

const OptionBoardStyle = styled.div`
    position: relative;
    bottom: -10px;
    left: 3px;
    width:266px;
    border: 1px solid ${color2};
    border-radius: 2px;
    background-color: ${color2};
    color: ${color0};
    padding: 8px;
    margin-bottom: 8px;
    box-shadow: 0px 0px 10px 3px ${color2};
`;

const nextSound = new UIfx(
  D2,
  {
    volume: 0.9, // value must be between 0.0 ⇔ 1.0
    throttleMs: 50
  }
)

const relax = new UIfx(
  allRing,
  {
    volume: 0.9, // value must be between 0.0 ⇔ 1.0
    throttleMs: 50
  }
)

const aPomodoro = new UIfx(
  C2,
  {
    volume: 0.9, // value must be between 0.0 ⇔ 1.0
    throttleMs: 50
  }
)

class Clock extends React.Component {

  state:{
      'work': 25,
      'shortBreak':5,
      'longBreak':10,
      'round': 4,
      'volume': 0,
      stage: 0,
      Timer: null,
      time: 0,
      leftTime: 0,
      mode:[],
      isPause: false,
      DoingTime: 0,
      progress: 1,
      option: false
  } 

  constructor(props){
      super(props)
      this.state = {
          'work': 25,
          'shortBreak': 5,
          'longBreak': 10,
          'round': 4,
          'volume': 0.9,
          stage: 0,
          Timer: null,
          time: 0,
          leftTime: 0,
          mode:[],
          isPause: false,
          DoingTime: 0,
          progress: 1,
          option: false
      }
      this.Timer = this.Timer.bind(this)
      this.ProceedTimeToTask = this.ProceedTimeToTask.bind(this)
  }

  componentDidMount(){
    this.setupBeforeUnloadListener();
    const state = JSON.parse(localStorage.getItem('ClockData'))
    if(state){
      this.setState({
        ...state
      })
    }
    this.SetRound(this.state['round'])
  }

  doSomethingBeforeUnload = () => {
    localStorage.setItem('ClockData', JSON.stringify(this.state))
  }

  setupBeforeUnloadListener = () => {
  window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault()
      return this.doSomethingBeforeUnload()
  })
  }

  onChange =(e)=> {
      const mode = e.target.name
      const value= e.target.value
      switch(mode){
          default:
              break;
          case 'work' :
              this.setState({
                  work: value
              })
              break;
          case 'shortBreak':
              this.setState({
                  shortBreak: value
              })
              break;
          case 'longBreak':
              this.setState({
                  longBreak: value
              })
              break;
          case 'round':
              this.setState({
                round: value
              })
              this.SetRound(value)
              break;
          case 'volume':
              this.setState({
                volume: value/100
              })
              break;
      }
  }

  Pomodoro = (action) => {
    let time
    let stage = this.state.stage
    let progress = this.state.progress
    let isPause = this.state.isPause
    const mode = this.state.mode
    const TimerExist = !!this.state.Timer
    if(action === 'skip'){
      if(!!mode[stage+1]){
        if(mode[stage] === 'shortBreak'){
          //play start to work sound
          nextSound.setVolume(this.state.volume).play()
        }else{
          //play relax sound
          relax.setVolume(this.state.volume).play()
        }
        stage++
        if(mode[stage] === 'work'){
          progress++
        }
      }else{
        stage = 0
        progress = 1
        //play finish a pomodoro sound
        aPomodoro.setVolume(this.state.volume).play()
      }
      isPause = false
      this.setState({
        stage: stage,
        isPause: isPause,
        progress: progress
      })
      if(!TimerExist){
        return;
      }
    }
    if(action === 'start&pause'){
      if(TimerExist){
        //pause
        isPause = true
      }else{
        if(isPause){
          //get time from leftTime & isPause: false
          time = this.state.leftTime
          isPause = false
        }else{
          //get time from mode 
          time = this.state[mode[stage]]
        }
      }
      this.setState({
        isPause: isPause
      })
    }
    //reset action to here
    if(action === 'reset'){
      if(!!this.state.Timer){
      }else{
        time = this.state[mode[stage]]
        this.setState({
          time: time,
          isPause: false
        })
        return;
      }
    }
    this.Timer(time)
  }

  SetRound = (round) => {
    let mode = []
    for(let i = 0; i < round; i++){
      if(i === (round - 1)){
        mode.push('work')
        mode.push('longBreak')
      }else{
        mode.push('work')
        mode.push('shortBreak')
      }
    }
    this.setState({
      stage: 0,
      mode: mode,
      progress: 1
    })
  }

  Timer(time){
      const StopTimer =()=> {
        clearInterval(this.state.Timer)
        this.setState({
            Timer: null,
            leftTime: this.state.time/60
        })
      }
      const Ticking = () => {
        if(this.state.time > 0){
        this.setState({
          time: this.state.time - 1,
          DoingTime: this.state.DoingTime + 1
        })
        this.ProceedTimeToTask(1)
      }
        else{
          StopTimer()
          this.Pomodoro('skip')
        }
      }
      if(this.state.Timer === null){
        this.setState({
          time: time*60,
          Timer: setInterval(function(){Ticking()},1000)
        }) 
      }
        else{
          StopTimer()
        }
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

  ProceedTimeToTask(ProceedTime){
    if(this.state.mode[this.state.stage] === 'work'){
      this.props.ProceedTimeToTask('column-2', ProceedTime)
    }
  }  

  DisplayBoard =()=> {
    return(
      <div>
        <DisplayBoardStyle>
          <p>階段：{this.state.mode[this.state.stage] ? this.state.mode[this.state.stage]: this.state.mode[0]}</p>
          <p>計時{this.state.Timer ? this.DisplayTime(this.state.time) : this.state.isPause ? this.DisplayTime(this.state.leftTime*60) : this.DisplayTime(this.state[this.state.mode[this.state.stage]]*60)}</p>
          <p>已進行至{this.state.progress + "/" +this.state.round}輪</p>
        </DisplayBoardStyle>
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
        <div>
          <OptionBoardStyle>
          <p>work : {this.state.work}</p>
          <input name='work' type='range' min='1' max='60' value={this.state['work']} onChange={e => this.onChange(e)}></input>
          <p>short break : {this.state.shortBreak} </p>
          <input name='shortBreak' type='range' min='1' max='60' value={this.state['shortBreak']} onChange={e => this.onChange(e)}></input>
          <p>long break : {this.state.longBreak}</p>
          <input name='longBreak' type='range' min='1' max='60' value={this.state['longBreak']} onChange={e => this.onChange(e)}></input>
          <p>round : {this.state.round}</p>
          <input name='round' type='range' min='1' max='12' value={this.state['round']} onChange={e => this.onChange(e)}></input>
          <p>sound volume : {parseInt(this.state.volume*100)}</p>
          <input name='volume' type='range' min='0' max='100' value={this.state['volume']*100} onChange={e => this.onChange(e)}></input>
          </OptionBoardStyle>
        </div>
      )
    }else{
      return;
    }
  }
  //<StyleButton onClick={() => this.optionBoard()}>option ^</StyleButton>
  render(){
      return (
          <div>
              {this.DisplayBoard()}
              <ButtonBoard>
              <StyleButton onClick={() => this.Pomodoro('start&pause')}>{this.state.Timer ? 'Pause' : 'Start'}</StyleButton>
              <StyleButton onClick={() => this.Pomodoro('reset')}>reset</StyleButton>
              <StyleButton onClick={() => this.Pomodoro('skip')}>skip</StyleButton>
              <StyleButton onClick={() => this.OptionBoard(true)}>option{this.state.option ? '(^)' : '(v)'}</StyleButton>
              </ButtonBoard>
              {this.OptionBoard()}
          </div>
      );
  }
}

export default Clock