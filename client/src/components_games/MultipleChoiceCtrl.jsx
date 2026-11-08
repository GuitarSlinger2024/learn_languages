import React, { useState } from 'react'
import MultiChoiceOptions from './MultipleChoiceOptions'
import MultibpleChoice from './MultipleChoice'

function MultipleChoiceCtrl({setGameOption}) {
  const [gameInPlay, setGameInPlay] = useState(false)
  const [numOfChars, setNumOfChars] = useState(1)
  const [toChinese, setToChinese] = useState(true)
  const [includePhonetic, setIncludePhonetic] = useState(true)

  const [questions, setQuestions] = useState({
    q1: 'Question One (1)',
    q2: 'Question Two (2)',
    q3: 'Question Three (3)',
    q4: 'Question Four (4)',
  })
  const [answers, setAnswers] = useState({
    a1: {
      chin: '有名',
      phon: 'yǒu míng',
    },
    a2: {
      chin: '有名',
      phon: 'yǒu míng',
    },
    a3: {
      chin: '有名',
      phon: 'yǒu míng',
    },
    a4: {
      chin: '有名',
      phon: 'yǒu míng',
    },
  })

  return (
    <>
      {!gameInPlay && (
        <MultiChoiceOptions
          numOfChars={numOfChars}
          setNumOfChars={setNumOfChars}
          toChinese={toChinese}
          setToChinese={setToChinese}
          includePhonetic={includePhonetic}
          setIncludePhonetic={setIncludePhonetic}
          gameInPlay={gameInPlay}
          setGameInPlay={setGameInPlay}
          setGameOption={setGameOption}
        />
      )}

      {gameInPlay && (
        <MultibpleChoice
          setGameInPlay={setGameInPlay}
          numOfChars={numOfChars}
          toChinese={toChinese}
          includePhonetic={includePhonetic}
          questions={questions}
          setQuestions={setQuestions}
          answers={answers}
          setAnswers={setAnswers}
        />
      )}
    </>
  )
}

export default MultipleChoiceCtrl
