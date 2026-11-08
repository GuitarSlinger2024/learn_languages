import '../styles/keypad.css'
import React from 'react'

function KeyPad({showKeypad, btnWasClicked}) {

  return (
    <div className={`tab-content-0 tab-div`}>
      <div id="key-pad" className={`time-input ${showKeypad ? 'active' : ''}`}>
        <button className='numb' onClick={() => btnWasClicked('9')}>9</button>
        <button className='numb' onClick={() => btnWasClicked('8')}>8</button>
        <button className='numb' onClick={() => btnWasClicked('7')}>7</button>
        <button className='numb' onClick={() => btnWasClicked('6')}>6</button>
        <button className='numb' onClick={() => btnWasClicked('5')}>5</button>
        <button className='numb' onClick={() => btnWasClicked('4')}>4</button>
        <button className='numb' onClick={() => btnWasClicked('3')}>3</button>
        <button className='numb' onClick={() => btnWasClicked('2')}>2</button>
        <button className='numb' onClick={() => btnWasClicked('1')}>1</button>
        <button onClick={() => btnWasClicked('enter')}>enter</button>
        <button className='numb' onClick={() => btnWasClicked('0')}>0</button>
        <button onClick={() => btnWasClicked('back')}>back</button>
      </div>
    </div>
  )
}

export default KeyPad
