import React, { useState } from 'react'
import MatchTwoOptions from './MatchTwoOptions'
import MatchTwo from './MatchTwo'

import img01 from '../_img/cardPics/01.png'
import img02 from '../_img/cardPics/02.png'
import img03 from '../_img/cardPics/03.png'
import img04 from '../_img/cardPics/04.png'
import img05 from '../_img/cardPics/05.png'
import img06 from '../_img/cardPics/06.png'
import img07 from '../_img/cardPics/07.png'
import img08 from '../_img/cardPics/08.png'
import img09 from '../_img/cardPics/09.png'
import img10 from '../_img/cardPics/10.png'

function MatchTwoCtrl({ setGameOption }) {
  const [numOfSquares, setNumOfSquares] = useState(12)
  const [cover, setCover] = useState(1)
  const [cardCovers, setCardCovers] = useState([
    img01,
    img02,
    img03,
    img04,
    img05,
    img06,
    img07,
    img08,
    img09,
    img10,
  ])
  const [gameInPlay, setGameInPlay] = useState(false)
  const [bestTime, setBestTime] = useState({
    squares12: 0,
    squares18: 0,
    squares26: 0,
  })

  function changeCardCover() {
    const currentCover = cover + 1 < cardCovers.length ? cover + 1 : 0
    setCover(currentCover)
  }

  return (
    <>
      {!gameInPlay && (
        <MatchTwoOptions
          setGameInPlay={setGameInPlay}
          gameInPlay={gameInPlay}
          numOfSquares={numOfSquares}
          setNumOfSquares={setNumOfSquares}
          cover={cover}
          setCover={setCover}
          cardCover={cardCovers[cover]}
          changeCardCover={changeCardCover}
          setGameOption={setGameOption}
        />
      )}

      {gameInPlay && (
        <MatchTwo
          setGameInPlay={setGameInPlay}
          cardCover={cardCovers[cover]}
          numOfSquares={numOfSquares}
          bestTime={bestTime}
          setBestTime={setBestTime}
        />
      )}
    </>
  )
}

export default MatchTwoCtrl
