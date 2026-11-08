import React, { useState, useEffect } from 'react'
import Checkbox from '../components/Checkbox'

function MultipleChoiceOptions({
  gameInPlay,
  setGameInPlay,
  numOfChars,
  setNumOfChars,
  toChinese,
  setToChinese,
  includePhonetic,
  setIncludePhonetic,
  setGameOption,
}) {
  useEffect(() => {
    console.log('Number of Characters: ' + numOfChars)
  }, [numOfChars])

  return (
    <div
      id="game-opts-1"
      className={`${gameInPlay && 'hidePage'}`}
    >
      <h2 className="title">Multiple Choice</h2>
      <section>
        <ul className="numOfChars">
          <Checkbox
            checked={numOfChars === 1}
            label="One Character"
            setChecked={setNumOfChars.bind(null, 1)}
            // numOfChars={1}
          ></Checkbox>
          <span className='displayNum'>{`${
            window.PHRASE_DATA.filter(phrase => phrase.chin.length === 1).length
          }`}</span>
          <br />
          <Checkbox
            checked={numOfChars === 2}
            label="Two Characters"
            setChecked={setNumOfChars.bind(null, 2)}
            // numOfChars={2}
          ></Checkbox>
          <span className='displayNum'>{`${
            window.PHRASE_DATA.filter(phrase => phrase.chin.length === 2).length
          }`}</span>
          <br />
          <Checkbox
            checked={numOfChars === 3}
            label="Three Characters"
            setChecked={setNumOfChars.bind(null, 3)}
            // numOfChars={3}
          ></Checkbox>
          <span className='displayNum'>{`${
            window.PHRASE_DATA.filter(phrase => phrase.chin.length === 3).length
          }`}</span>
          <br />
          <Checkbox
            checked={numOfChars === 4}
            label="Four Characters"
            setChecked={setNumOfChars.bind(null, 4)}
            // numOfChars={4}
          ></Checkbox>
          <span className='displayNum'>{`${
            window.PHRASE_DATA.filter(phrase => phrase.chin.length === 4).length
          }`}</span>
          <br />
        </ul>

        <div id="multiChoiceSettngs">
          {/* <ul className="toFrom">
            <Checkbox
              checked={toChinese}
              label="English to Characters"
              setChecked={setToChinese.bind(null, true)}
            ></Checkbox>
            <Checkbox
              checked={!toChinese}
              label="Characters to English"
              setChecked={setToChinese.bind(null, false)}
            ></Checkbox>
          </ul> */}

          <Checkbox
            checked={includePhonetic}
            label="Include Phonetic"
            setChecked={setIncludePhonetic.bind(null, !includePhonetic)}
          ></Checkbox>
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

export default MultipleChoiceOptions
