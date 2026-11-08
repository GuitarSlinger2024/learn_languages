import '../styles/games.css'
import { useContext, useEffect, useState } from 'react'
import { SettingsContext } from '../contexts/SettingsContext'
import GameOptions from '../components_games/GameOptions'
import MultipleChoiceCtrl from '../components_games/MultipleChoiceCtrl'
import MatchCtrl from '../components_games/MatchTwoCtrl'

export default function Games({language}) {
  const { tabName } = useContext(SettingsContext)
  const [gameOption, setGameOption] = useState(null)

  console.log({language, tabName})
  // useEffect(() => {
  // }, [])

  // if (language === 'Chinese')
  return (
    <div
      className={`tab-content-3 tab-div ${
        tabName !== 'games' || language !== 'Chinese'
          ? 'hidePage'
          : ''
      }`}>


      {gameOption === null && language==='Chinese' && <GameOptions setGameOption={setGameOption} />}

      {gameOption === 'multiChoice' && (
        <MultipleChoiceCtrl
          gameOption={gameOption}
          setGameOption={setGameOption}
        />
      )}

      {gameOption === 'matchTwo' && <MatchCtrl setGameOption={setGameOption} />}

    </div>
  )
  // else return <h1>What?</h1>
}

// <div className={`tab-content-3 tab-div ${tabName !== 'games' ? 'hidePage' : ''}`}>
//   <h1>Games</h1>
//   <h2>Under Construction</h2>
//   <h4>These still need to be translated over to React.</h4>
// </div>
