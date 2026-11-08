import React from 'react'

function GameOptions({setGameOption}) {
  return (
    <div className='gameOptionsContainer'>
      <div className="gameOption">
        <button className="play multi button"
          onClick={() => setGameOption('multiChoice')}
        >Play</button>
        <h2>Multiple Choice</h2>
      </div>
      <br />
      <div className="gameOption">
        <button className="play match button"
          onClick={() => setGameOption('matchTwo')}
        >Play</button>
        <h2>Match Two</h2>
      </div>
      <br />
    </div>
  )
}

export default GameOptions
