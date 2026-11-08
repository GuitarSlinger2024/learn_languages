import React, { act, useContext, useEffect, useState } from 'react'
import { SettingsContext } from '../contexts/SettingsContext'
import RightSideChars from './RightSideChars'
import buzzer from '../sound_fx/buzzer.mp3'
import { returnBlob } from '../database/indexedDB'
import FitText from '../components/FitText'

function MultipleChoice({
  setGameInPlay,
  numOfChars,
  includePhonetic,
  gameInPlay,
  questions,
  setQuestions,
  answers,
  setAnswers,
}) {
  const { shuffle } = useContext(SettingsContext)
  const [list, setList] = useState([])
  const [currentListIndex, setCurrentListIndex] = useState(0)
  const [readyForNext, setReadyForNext] = useState(false)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [totalAnswers, setTotalAnswers] = useState(0)
  const [enlargeTimeout, setEnlargeTimeout] = useState(null)
  const [keyDownTimer, setKeyDownTimer] = useState(Date.now())
  const [answered, setAnswered] = useState(false)

  const buzzerAudio = new Audio(buzzer)
  const answerContainer = document.getElementById('rightSide')
  const game1 = document.getElementById('game-1')

  useEffect(() => {
    console.log('%c Ready For Next was changed', 'color:purple;font-size: 20px')
    const phraseList = window.PHRASE_DATA.filter(
      phrase => phrase.chin.length == numOfChars
    )
    //  SHUFFLE the list fist
    shuffle(phraseList)
    //  Set the list
    setList(phraseList)
  }, [])

  useEffect(() => {
    console.log({ list })
    if (list.length > 0) getNextFour()
  }, [list])

  async function getNextFour(startingIndex = currentListIndex) {
    const qs = {}
    const as = {}
    const answerIDs = await shuffle(['1', '2', '3', '4'])
    const questionIDs = await shuffle(['1', '2', '3', '4'])

    console.log('%c ids', 'font-size: 20px', answerIDs, questionIDs)

    for (let x = 0; x < 4; x++) {
      let actualIndex = startingIndex + x
      actualIndex =
        actualIndex <= list.length - 1 ? actualIndex : actualIndex - list.length
      console.log(actualIndex)
      console.log(list)
      console.log(list[actualIndex])
      console.log(list[actualIndex])
      const question = {
        chin: list[actualIndex].chin,
        eng: list[actualIndex].eng,
      }
      qs['q' + String(questionIDs[x])] = question
      await returnBlob({ chinese: list[actualIndex].chin }).then(blobs => {
        console.log(list[actualIndex].chin, blobs, 'whatever')
        const audio = new Audio()
        audio.src = URL.createObjectURL(blobs[0].blob)

        const answer = {
          chin: list[actualIndex].chin,
          phon: list[actualIndex].phon,
          aud: audio,
        }
        as['a' + String(answerIDs[x])] = answer
        if (x === 3) {
          setQuestions(qs)
          setAnswers(as)
        }
      })
    }
  }

  function incrementIndex() {
    let startingIndex = currentListIndex + 4
    if (startingIndex > list.length - 1)
      startingIndex = startingIndex - list.length
    document
      .querySelectorAll('#game-1 .dim')
      .forEach(dim => dim.classList.remove('dim'))
    setReadyForNext(false)
    setCurrentListIndex(startingIndex)
    getNextFour(startingIndex)
  }

  function leftSideClicked(target, audio) {
    const leftSide = document.getElementById('leftSide')
    highlightClicked(leftSide, target, audio)
  }

  function highlightClicked(side, target, audio) {
    // if (target.classList.contains('dim')) return
    const picked = side.querySelector('.clicked')
    if (picked === target || target.classList.contains('dim')) {
      if (audio && side.id === 'rightSide') audio.play() //  play when unhighlighting
      console.log('right here...')
      target.classList.remove('clicked')
      return
    }
    //  New item is highlighted
    for (let x = 0; x <= 3; x++) {
      side.children[x].classList.remove('clicked')
    }
    target.classList.add('clicked')
    checkAnswer(side, audio)
  }

  function checkAnswer(side, audio) {
    const leftSidePick = document.querySelector('#leftSide .clicked')
    const rightSidePick = document.querySelector('#rightSide .clicked')
    //  If it is the first pick - only play the right side...
    if (!leftSidePick || !rightSidePick) {
      console.log('now here...')
      if (audio && side.id === 'rightSide') audio.play()
      return
    }

    game1.style.pointerEvents = 'none'
    const leftChinese = leftSidePick.getAttribute('data')
    const rightChinese = rightSidePick.querySelector('div').innerHTML
    console.log(leftChinese, rightChinese)
    const isAnswerRight = leftChinese === rightChinese
    setTimeout(() => {
      leftSidePick.classList.remove('clicked', 'wrong', 'rightAnswer')
      rightSidePick.classList.remove('clicked', 'wrong', 'rightAnswer')
      game1.style.pointerEvents = 'all'
    }, 1000)

    if (isAnswerRight) {
      Object.values(answers)
        .find(answ => answ.chin === leftChinese)
        .aud.play()
      leftSidePick.classList.add('rightAnswer')
      rightSidePick.classList.add('rightAnswer')
      setTimeout(() => {
        rightAnswer(leftSidePick, rightSidePick)
      }, 1000)
    } else wrongAnswer(leftSidePick, rightSidePick)
  }

  // function getNextFour() {
  //   console.log('get next four')
  // }

  function rightAnswer(leftPick, rightPick) {
    leftPick.classList.add('dim')
    rightPick.classList.add('dim')
    const totalLeft = leftPick.parentElement.querySelectorAll('.dim').length
    const totalRight = rightPick.parentElement.querySelectorAll('.dim').length
    console.log(
      '%c Total: ',
      'color:red;font-size: 20px',
      totalLeft,
      totalRight
    )
    setTotalAnswers(prev => prev + 1)
    if (totalLeft + totalRight < 8) return

    // All four matches have been made
    console.log('%c You win!!!', 'color:green;font-size: 20px')
    setReadyForNext(true)
  }

  function wrongAnswer(leftPick, rightPick) {
    buzzerAudio.play()
    leftPick.classList.add('wrong')
    rightPick.classList.add('wrong')
    setTotalAnswers(prev => prev + 1)
    setWrongAnswers(prev => prev + 1)
  }

  function rightSideMouseDown(e, origin) {
    let target = e.target
    if (!target.classList.contains('answer')) target = target.parentElement

    console.log('mouse down - touch start')

    clearTimeout(enlargeTimeout)
    setKeyDownTimer(Date.now())
    console.log(Date.now())
    setEnlargeTimeout(
      setTimeout(() => {
        if (answerContainer.classList.contains('makeSpace')) {
          answerContainer.querySelectorAll('.answer').forEach(answer => {
            if (answer !== target) {
              console.log(answer)
              answer.style.transition = 'transform 1s, opacity .5s .5s'
            }
          })
        } else {
          target.style.transition = 'transform 1s .2s'
          answerContainer.querySelectorAll('.answer').forEach(answer => {
            if (answer !== target) {
              console.log(answer)
              answer.style.transition = 'transform 1s, opacity .5s 0s'
            }
          })
        }
        target.style.transformOrigin = origin
        target.classList.toggle('enlarge')
        target.parentElement.classList.toggle('makeSpace')
        setTimeout(() => {
          answerContainer.querySelectorAll('.answer').forEach(answer => {
            answer.style.transition = 'transform 1s'
          })
        }, 1100)
      }, 300)
    )
  }

  function rightSideMouseUp(e, audio) {
    const uptime = Date.now()
    let target = e.target
    if (!target.classList.contains('answer')) target = target.parentElement
    console.log(uptime)
    console.log(uptime - keyDownTimer)
    if (uptime - keyDownTimer < 300) {
      clearTimeout(enlargeTimeout)
      setEnlargeTimeout(null)
      const rightSide = document.getElementById('rightSide')
      highlightClicked(rightSide, target, audio)
    } else {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <>
      <div className="score noSelect">
        <h1
          className="exitGame"
          onClick={() => setGameInPlay(false)}
        >
          Back
        </h1>
        <h1 className="wrong">
          Wrong: <span>{wrongAnswers}</span>
        </h1>
        <h1 className="correct">
          Out of: <span>{totalAnswers}</span>
        </h1>
        <h1
          className={`next ${readyForNext ? '' : 'disabled'}`}
          onClick={() => {
            incrementIndex()
          }}
        >
          Next
        </h1>
      </div>
      <div id="game-1">
        <div
          className="left"
          id="leftSide"
        >
          <FitText
            text={questions.q1.eng}
            line={'question-1'}
            initialFontSize={1}
            initialMinEm={0.75}
            data={questions.q1.chin}
            onClick={e => {
              leftSideClicked(e.target, answers.a1.aud)
            }}
          />

          <FitText
            text={questions.q2.eng}
            line={'question-2'}
            initialFontSize={1}
            initialMinEm={0.75}
            data={questions.q2.chin}
            onClick={e => {
              leftSideClicked(e.target, answers.a2.aud)
            }}
          />

          <FitText
            text={questions.q3.eng}
            line={'question-3'}
            initialFontSize={1}
            initialMinEm={0.75}
            data={questions.q3.chin}
            onClick={e => {
              leftSideClicked(e.target, answers.a3.aud)
            }}
          />

          <FitText
            text={questions.q4.eng}
            line={'question-4'}
            initialFontSize={1}
            initialMinEm={0.75}
            data={questions.q4.chin}
            onClick={e => {
              leftSideClicked(e.target, answers.a4.aud)
            }}
          />
        </div>

        <div
          className="right chin"
          id="rightSide"
        >
          <RightSideChars
            numOfChars={numOfChars}
            answer={answers.a1}
            includePhonetic={includePhonetic}
            answerNum={1}
            onMouseDown={e => rightSideMouseDown(e, 'top left')}
            onTouchStart={e => rightSideMouseDown(e, 'top left')}
            onMouseUp={e => rightSideMouseUp(e, answers.a1.aud)}
            onTouchEnd={e => rightSideMouseUp(e, answers.a1.aud)}
          />

          <RightSideChars
            numOfChars={numOfChars}
            answer={answers.a2}
            includePhonetic={includePhonetic}
            answerNum={2}
            onMouseDown={e => rightSideMouseDown(e, 'top right')}
            onTouchStart={e => rightSideMouseDown(e, 'top right')}
            onMouseUp={e => rightSideMouseUp(e, answers.a2.aud)}
            onTouchEnd={e => rightSideMouseUp(e, answers.a2.aud)}
          />

          <RightSideChars
            numOfChars={numOfChars}
            answer={answers.a3}
            includePhonetic={includePhonetic}
            answerNum={3}
            onMouseDown={e => rightSideMouseDown(e, 'bottom left')}
            onTouchStart={e => rightSideMouseDown(e, 'bottom left')}
            onMouseUp={e => rightSideMouseUp(e, answers.a3.aud)}
            onTouchEnd={e => rightSideMouseUp(e, answers.a3.aud)}
          />

          <RightSideChars
            numOfChars={numOfChars}
            answer={answers.a4}
            includePhonetic={includePhonetic}
            answerNum={4}
            onMouseDown={e => rightSideMouseDown(e, 'bottom right')}
            onTouchStart={e => rightSideMouseDown(e, 'bottom right')}
            onMouseUp={e => rightSideMouseUp(e, answers.a4.aud)}
            onTouchEnd={e => rightSideMouseUp(e, answers.a4.aud)}
          />
        </div>
      </div>
    </>
  )
}

export default MultipleChoice
