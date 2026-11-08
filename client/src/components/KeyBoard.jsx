import '../styles/keyBoard.css'
import React from 'react'
import deleteBtn from '../_img/delete-icon-size_256.png'

function KeyBoard({showKeyBoard, letterWasClicked}) {

  return (
    <div className={`keyBoard ${showKeyBoard ? 'active' : ''}`}>
      <div id="key-board" className={`time-input`}>

        <div className="keyboard-line keyboard-first-line">
          <button className='letterKey key' onClick={() => letterWasClicked('q')}>q</button>
          <button className='letterKey key' onClick={() => letterWasClicked('w')}>w</button>
          <button className='letterKey key' onClick={() => letterWasClicked('e')}>e</button>
          <button className='letterKey key' onClick={() => letterWasClicked('r')}>r</button>
          <button className='letterKey key' onClick={() => letterWasClicked('t')}>t</button>
          <button className='letterKey key' onClick={() => letterWasClicked('y')}>y</button>
          <button className='letterKey key' onClick={() => letterWasClicked('u')}>u</button>
          <button className='letterKey key' onClick={() => letterWasClicked('i')}>i</button>
          <button className='letterKey key' onClick={() => letterWasClicked('o')}>o</button>
          <button className='letterKey key' onClick={() => letterWasClicked('p')}>p</button>
        </div>

        <div className="keyboard-line keyboard-second-line">
          <button className='letterKey key' onClick={() => letterWasClicked('a')}>a</button>
          <button className='letterKey key' onClick={() => letterWasClicked('s')}>s</button>
          <button className='letterKey key' onClick={() => letterWasClicked('d')}>d</button>
          <button className='letterKey key' onClick={() => letterWasClicked('f')}>f</button>
          <button className='letterKey key' onClick={() => letterWasClicked('g')}>g</button>
          <button className='letterKey key' onClick={() => letterWasClicked('h')}>h</button>
          <button className='letterKey key' onClick={() => letterWasClicked('j')}>j</button>
          <button className='letterKey key' onClick={() => letterWasClicked('k')}>k</button>
          <button className='letterKey key' onClick={() => letterWasClicked('l')}>l</button>
        </div>

        <div className="keyboard-line keyboard-third-line">
          <button className='back key' onClick={() => letterWasClicked('back')}>
            <img src={deleteBtn} alt="delete button icon" srcset="" />
          </button>
          <button className='letterKey key' onClick={() => letterWasClicked('z')}>z</button>
          <button className='letterKey key' onClick={() => letterWasClicked('x')}>x</button>
          <button className='letterKey key' onClick={() => letterWasClicked('c')}>c</button>
          <button className='letterKey key' onClick={() => letterWasClicked('v')}>v</button>
          <button className='letterKey key' onClick={() => letterWasClicked('b')}>b</button>
          <button className='letterKey key' onClick={() => letterWasClicked('n')}>n</button>
          <button className='letterKey key' onClick={() => letterWasClicked('m')}>m</button>
          <button className='enter key' onClick={() => letterWasClicked('enter')}>
            <p>hide keys</p>
          </button>
        </div>

      </div>
    </div>
  )
}

export default KeyBoard