import React from 'react'
import Checkbox from '../components/Checkbox'

function MatchTwoOptions({ cardCover, numOfSquares, setNumOfSquares, setGameOption, gameInPlay, setGameInPlay, changeCardCover }) {

  return (
    <div
      id="game-opts-2"
      className={`${gameInPlay && 'hidePage'}`}
    >
      <h2 className="title">Match Two</h2>
      <section>
        <ul className="numOfSquares">
          <Checkbox
            checked={numOfSquares === 12}
            label="12 squares"
            setChecked={setNumOfSquares.bind(null, 12)}
          ></Checkbox>
          <Checkbox
            checked={numOfSquares === 18}
            label="18 squares"
            setChecked={setNumOfSquares.bind(null, 18)}
          ></Checkbox>
          <Checkbox
            checked={numOfSquares === 26}
            label="26 squares"
            setChecked={setNumOfSquares.bind(null, 26)}
          ></Checkbox>
        </ul>
        <div className='cardSelector'>
          <img
            src={cardCover}
            alt="card-back pic options"
            onClick={changeCardCover}
          />
        </div>
      </section>

      <div className="buttons">
        <button
          className="exitGame button"
          onClick={() => setGameOption(null)}
        >
          Back
        </button>
        <button
          className="play button"
          onClick={() => setGameInPlay(true)}
        >
          Start
        </button>
      </div>
    </div>
  )
}

export default MatchTwoOptions
