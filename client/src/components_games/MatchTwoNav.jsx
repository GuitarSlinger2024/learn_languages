import React from 'react'

function MatchTwoNav({setGameInPlay, youWin, newGame, totalTime, bestTime}) {
  return (
    <div className="score">
      <h1 className="exitGame"
      onClick={() => setGameInPlay(false)}
      >Back</h1>
      <h1 className="time">
        Time:
        <span>
          <span className="timerMinutes">{Math.floor(totalTime / 60)}</span>
          <span className="timerColon">:</span>
          <span className="timerTens">{Math.floor((totalTime % 60 / 10))}</span>
          <span className="timerSeconds">{Math.floor(totalTime % 10)}</span>
        </span>
      </h1>
      <h1 className="bestTime">
        Best:
        <span>
        <span className="timerMinutes">{Math.floor(bestTime / 60)}</span>
          <span className="timerColon">:</span>
          <span className="timerTens">{Math.floor((bestTime % 60 / 10))}</span>
          <span className="timerSeconds">{Math.floor(bestTime % 10)}</span>
        </span>
      </h1>
      <h1 className={`next ${!youWin ? 'disabled' : ''}`}
        onClick={newGame}
      >Again</h1>
    </div>
  )
}

export default MatchTwoNav
