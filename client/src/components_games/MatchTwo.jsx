import React, { useEffect, useState, useContext } from 'react'
import { SettingsContext } from '../contexts/SettingsContext'
import MatchTwoNav from './MatchTwoNav'
import { returnBlob } from '../database/indexedDB'

function MatchTwo({
  setGameInPlay,
  numOfSquares,
  cardCover,
  bestTime,
  setBestTime,
}) {
  //  useContent
  const { shuffle } = useContext(SettingsContext)
  //  useState
  const [chars, setChars] = useState([])
  const [squareContent, setSquareContent] = useState([])

  const [youWin, setYouWin] = useState(false)
  const [timerInterval, setTimerInterval] = useState(null)
  const [totalTime, setTotalTime] = useState(0)

  useEffect(() => {
    const characters = window.PHRASE_DATA.filter(
      phrase => phrase.chin.length === 1
    ).map(phrase => phrase.chin)
    setChars(characters)
    newGame()
  }, [])

  useEffect(() => {
    if (chars.length > 0) newGame()
  }, [chars])

  function newGame() {
    setYouWin(false)
    document
      .querySelectorAll('.show')
      .forEach(match => match.classList.remove('show'))
    setTimeout(() => {
      document
        .querySelectorAll('.matched')
        .forEach(match => match.classList.remove('matched'))
      setCharList(chars)
    }, 1000)
    setTotalTime(0)
    clearInterval(timerInterval)
    setTimerInterval(
      setInterval(() => {
        setTotalTime(prev => prev + 1)
      }, 1000)
    )
  }

  async function setCharList(chars) {
    const newList = shuffle(chars)
    const content = []
    for (let x = 0; x < Math.floor(numOfSquares / 2); x++) {
      const blob = await returnBlob({ chinese: newList[x] })
      console.log(blob)
      const data = { img: cardCover, char: newList[x], blob: blob[0].blob }
      content.push(data, data)
    }
    console.log(content)
    setSquareContent(shuffle(content))
  }

  function showCard(index, blob) {
    console.log(blob)
    const audio = new Audio()
    audio.src = URL.createObjectURL(blob)
    const cardsShowing = document.querySelectorAll(
      '.flip-card.show:not(.matched)'
    )
    const cardContainer = document.querySelector('#card-container')
    if (cardContainer.children[index].classList.contains('show')) return
    if (cardsShowing.length < 2) {
      cardContainer.children[index].classList.add('show')
      audio.play()
    }

    if (cardsShowing.length === 1) {
      const cardText_1 = cardsShowing[0].querySelector('p').innerHTML
      const cardText_2 =
        cardContainer.children[index].querySelector('p').innerHTML

      if (cardText_1 === cardText_2)
        theyMatch(cardsShowing[0], cardContainer.children[index])
      else {
        setTimeout(() => {
          cardsShowing[0].classList.remove('show')
          cardContainer.children[index].classList.remove('show')
        }, 1000)
      }
    }
  }

  function theyMatch(card1, card2) {
    setTimeout(() => {
      card1.classList.add('matched')
      card2.classList.add('matched')
    }, 1000)
    checkIfWin()
  }

  function checkIfWin() {
    const cardsMatched = document.querySelectorAll('.matched')
    console.log(cardsMatched, numOfSquares)
    console.log(cardsMatched.length === numOfSquares)
    //  The last matches have a setTimeout of 1 second before adding '.matched'
    const newBestTime = bestTime
    if (cardsMatched.length === numOfSquares - 2) {
      clearInterval(timerInterval)
      setYouWin(true)
      if (
        bestTime[`squares${numOfSquares}`] > totalTime ||
        bestTime[`squares${numOfSquares}`] === 0
      )
        newBestTime[`squares${numOfSquares}`] = totalTime
      setBestTime(newBestTime)
      console.log(newBestTime)
    }
  }

  return (
    <>
      <MatchTwoNav
        setGameInPlay={setGameInPlay}
        youWin={youWin}
        newGame={newGame}
        totalTime={totalTime}
        bestTime={bestTime[`squares${numOfSquares}`]}
      />

      <div
        id="card-container"
        className={`squares${numOfSquares}`}
      >
        {squareContent.length > 5 &&
          squareContent.map((squareData, i) => (
            <div
              className="flip-card"
              onClick={showCard.bind(null, i, squareData.blob)}
              key={i}
            >
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <p>{`${squareData.char}`}</p>
                </div>
                <div className="flip-card-back">
                  <img
                    src={cardCover}
                    alt=""
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  )
}

export default MatchTwo
