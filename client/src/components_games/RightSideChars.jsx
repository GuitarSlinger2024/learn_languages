import React from 'react'
import FitText from '../components/FitText'
import ReportError from '../components/ReportError'

function RightSideChars({
  numOfChars,
  answer,
  includePhonetic,
  onClick,
  answerNum,
  onMouseDown,
  onTouchStart,
  onMouseUp,
  onTouchEnd
}) {
  // const downfunc = 'ontouchstart' in document.documentElement ? onTouchStart : onMouseDown
  // const upfunc = 'ontouchend' in document.documentElement ? onTouchEnd : onMouseUp

  let touchStartFunc 
  let touchEndFunc 
  let mouseDownFunc 
  let mouseUpFunc 

  if ('ontouchstart' in document.documentElement) {
    touchStartFunc = onTouchStart
    touchEndFunc = onTouchEnd
    mouseDownFunc = () => {}
    mouseUpFunc = () => {}
  } else {
    touchStartFunc = () => {}
    touchEndFunc = () => {}
    mouseDownFunc = onMouseDown
    mouseUpFunc = onMouseUp
  }


  return (
    <div
      className={`answer noSelect`}
      onClick={onClick}
      onMouseDown={mouseDownFunc}
      onMouseUp={mouseUpFunc}
      onTouchStart={touchStartFunc}
      onTouchEnd={touchEndFunc}
    >
      <div
        className={`${numOfChars === 3 ? 'threeChars' : ''}${
          numOfChars === 4 ? 'fourChars' : ''
        } noSelect`}
      >
        {answer.chin}
      </div>
      <FitText
        text={answer.phon}
        initialFontSize={.7}
        line={`answer-${answerNum}`}
        initialMinEm={0.5}
        hideText={!includePhonetic}
      />
    </div>
  )
}

export default RightSideChars

{
  /* <FitText
text={questions.q4.eng}
data={questions.q4.chin}
onClick={e => {
  leftSideClicked(e.target, answers.a4.aud)
}} */
}
