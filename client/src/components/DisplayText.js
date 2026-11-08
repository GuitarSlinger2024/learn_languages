import { useContext, useEffect } from 'react'
import { SettingsContext } from '../contexts/SettingsContext'
import FitText from './FitText'

// //  Get the definitions
// function getCharInfo(char) {
//   const def = DICTIONARY.find(eachDef => {
//     if (eachDef.character) return eachDef.character.match(char);
//     return false;
//   });
//   return def;
// }

const DisplayText = ({ currentClip, def, setDef }) => {
  const { handleAddFadeIn, getCharInfo, startAutoplay } = useContext(SettingsContext)

  function clickedChars(e) {
    const parent = e.target.classList.contains('phraseText')
      ? e.target
      : e.target.parentElement

    parent.querySelectorAll('span').forEach(element => {
      element.classList.remove('highlight')
    })
    if (!parent.classList.contains('fadeIn')) {
      parent.classList.remove('showTextBackground')
      parent.classList.add('fadeIn')
    } else {
      if (e.target.classList.contains('chineseChar')) {
        parent.parentElement.parentElement.classList.add('showingDefs')
        console.log(e.target)
        e.target.classList.add('highlight')
      }
      const define = getCharInfo(e.target.innerHTML)
      setDef(define)
    }
  }

  useEffect(() => {
    if (!startAutoplay)
    handleAddFadeIn()
  }, [currentClip])

  function showText(e) {
    if (!e.target.classList.contains('phraseText')) {
      e.target.classList.add('fadeIn')
      e.target.classList.remove('showTextBackground')
    } else {
      console.log(e.target)
    }
  }

  return (
    <>
      {currentClip?.eng && (
        <div className="container-outer display-container">
          <FitText
            text={currentClip.eng}
            line="english"
            onClick={showText}
          ></FitText>

          {window.phoneticIncluded.includes(window.languageChoice) && (<FitText
            text={currentClip.phon}
            line="phonetic"
            onClick={showText}
          ></FitText>)}

          <FitText
            text={currentClip[window.lingoAbbr]}
            line="phraseText"
            language={window.languageChoice.toLowerCase()}
            onClick={!window.languageChoice === 'Chinese' ? showText : clickedChars}
          ></FitText>
        </div>
      )}
    </>
  )
}

export default DisplayText
