import { useRef, useState } from 'react'
import './App.css'
import sound from "./assets/music/elevator-music.mp3"



function App() {
  
  let floor = useRef(Number(localStorage.getItem('floor')) || 1);
  let [floorS, setfloorS] = useState(floor.current)
  let CorrectFloor = useRef(0);
  let LiftIsMove = useRef(false);
  let UpOrDown = useRef(undefined);
  let [Sdoors, setSDoors] = useState(false);
  let doors = useRef(false)
  let tasksList = useRef([]);
  let [LiftIsMoveS, setLiftIsMoveS] = useState()
  let WorkTaskE = useRef(false)
  let InProcess = useRef(false)
  let ListFloors = useRef({
    1 : false,
    2 : false,
    3 : false,
    4 : false,
    5 : false,
    6 : false,
    7 : false,
    8 : false,
    9 : false,
    10 : false,
    11 : false,
  })
  let LPlist = useRef([])
  let LowPriority = useRef({
    1 : false,
    2 : false,
    3 : false,
    4 : false,
    5 : false,
    6 : false,
    7 : false,
    8 : false,
    9 : false,
    10 : false,
    11 : false,
  })
  
  
  let timerM
  let timerTE
  let Music = new Audio(sound)
  
  let OpenDoors = () => {
    doors.current = true
    setSDoors(true)
  }
  let CloseDoors = () => {
    doors.current = false
    setSDoors(false)
  }

  let activFlors = (list) => {
    let arr = []
    for (let el in list) {
      if (list[el]) {
        arr.push(Number(el))
      }
    };
    return arr
    
  }

  let Move = () =>{

    if (CorrectFloor.current < floor.current) {
      floor.current = floor.current-1
    } else if (CorrectFloor.current > floor.current){
      floor.current = floor.current+1
    }

    if (activFlors(LowPriority.current).includes(floor.current) && UpOrDown.current == 'Down' && floor.current != CorrectFloor.current) {
      clearInterval(timerM);
      LowPriority.current[floor.current] = false
      if (LPlist.current.indexOf(floor.current) != -1) {
        LPlist.current.splice(LPlist.current.indexOf(floor.current), 1)
      }
      setTimeout(OpenDoors, 1000);
      setTimeout(CloseDoors, 6000);
      setTimeout(() => {InProcess.current = false}, 9000);

    }

    if (activFlors(ListFloors.current).includes(floor.current) && floor.current != CorrectFloor.current) {
      clearInterval(timerM);
      ListFloors.current[floor.current] = false
      tasksList.current.splice(tasksList.current.indexOf(floor.current), 1)
      if (LPlist.current.indexOf(floor.current) != -1) {
        LPlist.current.splice(LPlist.current.indexOf(floor.current), 1)
      }
      setTimeout(OpenDoors, 1000);
      setTimeout(CloseDoors, 6000);
      setTimeout(() => {InProcess.current = false}, 9000);

    }

    if (CorrectFloor.current == floor.current) {
      clearInterval(timerM);
      ListFloors.current[floor.current] = false
      tasksList.current.shift()

      if (LPlist.current.indexOf(floor.current) != -1) {
        LPlist.current.splice(LPlist.current.indexOf(floor.current), 1)
      }


      setTimeout(OpenDoors, 1000);
      setTimeout(CloseDoors, 6000);
      setTimeout(() => {InProcess.current = false}, 9000);
    }



    setfloorS(floor.current)
    localStorage.setItem('floor', floor.current);
  }


  let taskExecutor = () => {
    // console.log(tasksList.current);
    setLiftIsMoveS(true)
    WorkTaskE.current = true
    // console.log(LPlist.current);
    
    
    if (!InProcess.current && tasksList.current.length != 0) {
      LiftIsMove.current = true
      InProcess.current = true
      CorrectFloor.current = tasksList.current[0]

      tasksList.current[0] < floor.current ? UpOrDown.current = "Down" : UpOrDown.current = "Up"
      timerM = setInterval(() => {Move()}, 1000)
    }


    // console.log(tasksList.current.length == 0);

    if (tasksList.current.length == 0 && LPlist.current.length != 0) {
      tasksList.current.push(LPlist.current[0])
      LPlist.current.shift()
    }

    
    if (tasksList.current.length == 0 && !InProcess.current) {
      Music.pause()
      clearInterval(timerTE)
      InProcess.current = false
      WorkTaskE.current = false
      LiftIsMove.current = false
      setLiftIsMoveS(false)
    }
    
  }

  let tapOnButton = (num) => {
    if (!(num in tasksList.current)) {
      if (tasksList.current.length < 9) {
        ListFloors.current[num] = true
        tasksList.current.push(num)
      }
      if (!WorkTaskE.current && !InProcess.current && !LiftIsMove.current) {
        Music.play()
        WorkTaskE.current = true
        timerTE = setInterval(() => taskExecutor(), 1000)
      }
    }
    
  }

  let tapOnButtonLP = (num) => {
    if (!(num in tasksList.current)) {
      LowPriority.current[num] = true

      if (tasksList.current.length == 0) {
        tapOnButton(num)
      } else {
        
        LPlist.current.push(num)
      }

    }

  }
  
  


  return (
    <>
      <section className='Padik'>
        <div className='elevator'>
          <div className='elevator_leftPart'></div>

          <div className='elevator_centerPart'>
            <div className={`elevator_leftDoor ${Sdoors ? "elevator_leftDoor_activ" : ''}`}></div>
            <div className={`elevator_rightDoor ${Sdoors ? "elevator_rightDoor_activ" : ''}`}></div>
          </div>

          <div className='elevator_rightPart'>
            <div className='display'>
              {floorS}
              <div className='pointers'>
                <div className='pointerUp_box'><span className={`pointerUp ${LiftIsMoveS && UpOrDown.current == "Up"? "pointerUp_activ" : ''}`}></span></div>
                <div className='pointerDown_box'><span className={`pointerDown ${LiftIsMoveS && UpOrDown.current == "Down" ? "pointerDown_activ" : ''}`}></span></div>
                
              </div>
            </div>

            <div className='elevatorPanel'>        
              <div className='elevatorPanel_part'>
                <button onClick={() => tapOnButton(2)} className='elevatorButton'>2</button>
                <button onClick={() => tapOnButton(3)} className='elevatorButton'>3</button>
                <button onClick={() => tapOnButton(4)} className='elevatorButton'>4</button>
                <button onClick={() => tapOnButton(5)} className='elevatorButton'>5</button>
                <button onClick={() => tapOnButton(6)} className='elevatorButton'>6</button>
              </div>
              <div className='elevatorPanel_part'>
                <button onClick={() => tapOnButton(7)} className='elevatorButton'>7</button>
                <button onClick={() => tapOnButton(8)} className='elevatorButton'>8</button>
                <button onClick={() => tapOnButton(9)} className='elevatorButton'>9</button>
                <button onClick={() => tapOnButton(10)} className='elevatorButton'>10</button>
                <button onClick={() => tapOnButton(11)} className='elevatorButton'>11</button>
              </div>

              <button onClick={() => tapOnButton(1)} className='elevatorButton'>1</button>
            </div>
          </div>
        </div>

        <div className='outsideElevator'>
          <div className='outButton'>
            <button onClick={() => tapOnButtonLP(1)} className='elevatorButton'>1</button>
            <button onClick={() => tapOnButtonLP(2)} className='elevatorButton'>2</button>
            <button onClick={() => tapOnButtonLP(3)} className='elevatorButton'>3</button>
            <button onClick={() => tapOnButtonLP(4)} className='elevatorButton'>4</button>
            <button onClick={() => tapOnButtonLP(5)} className='elevatorButton'>5</button>
            <button onClick={() => tapOnButtonLP(6)} className='elevatorButton'>6</button>
            <button onClick={() => tapOnButtonLP(7)} className='elevatorButton'>7</button>
            <button onClick={() => tapOnButtonLP(8)} className='elevatorButton'>8</button>
            <button onClick={() => tapOnButtonLP(9)} className='elevatorButton'>9</button>
            <button onClick={() => tapOnButtonLP(10)} className='elevatorButton'>10</button>
            <button onClick={() => tapOnButtonLP(11)} className='elevatorButton'>11</button>
          </div>
        </div>
      </section>


    </>
  )
}

export default App
