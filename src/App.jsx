import { useRef, useState } from 'react'
import './App.css'
import sound from "./assets/music/elevator-music.mp3"



function App() {
  
  let floor = useRef(Number(localStorage.getItem('floor')) || 0);
  let [floorS, setfloorS] = useState(floor.current)
  let CorrectFloor = useRef(0);
  let Buttonfloor = useRef(1);
  let LiftIsMove = useRef(false);
  let UpOrDown = useRef(undefined);
  
  let Music = new Audio(sound)
  let [triger, settriger] = useState(0)

  
  
  
  let Move = (timer) =>{
    
    if (CorrectFloor.current < floor.current) {
      floor.current = floor.current-1
    } else {
      floor.current = floor.current+1
    }
    if (CorrectFloor.current == floor.current) {
      clearInterval(timer)
      LiftIsMove.current = false 
      Music.pause()
      
    }
    localStorage.setItem('floor', floor.current);
    setfloorS(floor.current)
  }

  let liftMove = () => {
    LiftIsMove.current = true
    
    CorrectFloor.current > floor.current ? UpOrDown.current = 'Up' : UpOrDown.current = 'Down' 

    let timerTransfer = setInterval(() => Move(timerTransfer), 1000);
  }

  let tapOnButton = (num) => {
    settriger()
    Buttonfloor.current = num

    if (!LiftIsMove.current) {
      CorrectFloor.current = Buttonfloor.current 
      liftMove()
      Music.play()
      
    } else {
      
      if (UpOrDown.current == 'Down' && CorrectFloor.current < Buttonfloor.current) {
        CorrectFloor.current = Buttonfloor.current
      }
    }

  }


  return (
    <>
      <section className='Padik'>
        <div className='elevator'>
          <div className='elevator_leftPart'></div>

          <div className='elevator_rightPart'>
            <div className='display'>
              {floorS}
              <div className='pointers'>
                {triger ? '' : ''}
                <div className='pointerUp_box'><span className={`pointerUp ${LiftIsMove.current && UpOrDown.current == "Up"? "pointerUp_activ" : ''}`}></span></div>
                <div className='pointerDown_box'><span className={`pointerDown ${LiftIsMove.current && UpOrDown.current == "Down" ? "pointerDown_activ" : ''}`}></span></div>
                
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

        </div>
      </section>


    </>
  )
}

export default App
