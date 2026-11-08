import '../styles/phrases.css'
import '../styles/icons.css'
import { getBlob } from '../database/indexedDB'
import { useContext, useEffect, useState } from 'react'
import { SettingsContext } from '../contexts/SettingsContext'

//  Images
import arrowLeft from '../_img/arrow-left.png'
import arrowRight from '../_img/arrow-right.png'
import playSound from '../_img/playSound.png'
import pauseBtn from '../_img/pause-button.svg'

//  Components
import PhraseBtns from '../components/PhraseBtns'
import ReportError from '../components/ReportError'
import Favorites from '../components/Favorites'
import DisplayText from '../components/DisplayText'

export default function Phrases({
  favorites,
  setFavorites,
  def,
  setDef
}) {
  const {
    checkAllPhrases,
    checkFavorites,
    checkSearch,
    checkRandom,
    tabName,
    getCharInfo,
    setCurrentBlobs,
    currentPhraseId,
    setCurrentPhraseId,
    changeIndex,
    currentList,
    setCurrentList,
    currentIndex,
    setCurrentIndex,
    currentClip,
    setCurrentClip,
    setIndexInfo,
    currentListName,
    setCurrentListName,
    audioEl,
    isPlaying,
    setIsPlaying,
    searchTerm
  } = useContext(SettingsContext)

  const [isPaused, setIsPaused] = useState(false)

  //   *******           Set states from local storage here             ********
  // *******           Create Current LIst             ********
  useEffect(() => {
    setCurrentListName(
      checkFavorites ? 'favorites' : checkSearch ? 'search' : 'all'
    ) //  all, favorites, search)
  }, [checkAllPhrases, checkFavorites, checkSearch])

  // Set current list
  useEffect(() => {
    if (currentListName[0] === '*') setCurrentListName(prev => prev.slice(1))
    const list =
      currentListName === 'all'
        ? [...window.PHRASE_DATA]
        : currentListName === 'search'
        ? getSearchList(searchTerm, [...window.PHRASE_DATA])
        : [...window.PHRASE_DATA].filter(clip => clip.favorite)

    //  Lists are randomized every time the list changes    the seach list never
    // needs to be randomized
    if (checkRandom) shuffle(list)
    setCurrentList(list)

    let index
    if (!checkRandom) {
      const id = currentPhraseId[currentListName]
      index =
        list.findIndex(phrase => phrase.phraseId === id) >= 0
          ? list.findIndex(phrase => phrase.phraseId === id)
          : 0

      const newId = list[index]?.phraseId
      if (!checkRandom)
        setCurrentPhraseId(prev => {
          const newObj = prev
          newObj[currentListName] = newId
          return newObj
        })
    } else {
      index = 0
    }

    setIndexInfo({
      index: index + 1,
      length: list.length,
    })
    setCurrentIndex(index)
    setCurrentClip(list[index])

    if (list[index] && list[index][window.lingoAbbr])
      getBlob({ phraseText: list[index][window.lingoAbbr], setCurrentBlobs: setCurrentBlobs, languageChoice: window.languageChoice })
  }, [currentListName, searchTerm, checkRandom, currentPhraseId])

  //  A little hack to re-render after the first render
  useEffect(() => {
    setCurrentListName(prev => '*' + prev)
  }, [])

  function getNewIndex(direction) {
    let newIndex = currentIndex + direction
    return newIndex
  }

  function getSearchList(word, list) {
    const newList = [...list].filter(phrase => {
      const engArray = phrase.eng
        .replace(/[^a-zA-Z ']/gi, '')
        .toLowerCase()
        .split(' ')
      const pass = engArray.includes(word) && word.length > 0
      return pass
    })

    return newList
  }

  function hideDefs(e) {
    // handleAddFadeIn(?) //  Just an idea - after looking at the defs, to hide text again
    document
      .querySelectorAll('.chinese span')
      .forEach(span => span.classList.remove('highlight'))
    setTimeout(() => {
      e.target.parentElement.classList.remove('hidingDefs')
    }, 1000)
    e.target.parentElement.classList.add('hidingDefs')
    e.target.parentElement.classList.remove('showingDefs')
  }

  function createDefText(defObj) {
    if (!defObj) return ''
    return (
      <p>
        <span>{defObj.pinyin[0]}</span>
        :&nbsp;&nbsp;
        <span>{defObj.definition}</span>
      </p>
    )
  }

  function changeCharacter(direction) {
    const charContainer = document.querySelector('.chinese')
    const char = charContainer.querySelector('.highlight')
    const numOfChars = charContainer.children.length
    const charIndex = [...charContainer.children].indexOf(char)
    const checkIndex = charIndex + direction
    const newIndex =
      checkIndex < 0
        ? numOfChars - 1
        : checkIndex > numOfChars - 1
        ? 0
        : checkIndex
    const newSpan = [...charContainer.children][newIndex]
    char.classList.remove('highlight')
    newSpan.classList.add('highlight')
    setDef(getCharInfo(newSpan.innerHTML))
  }

  function handlePlayPause() {
    if (!isPlaying) {
      audioEl.play()
      setIsPlaying(true)
    } else {
      if (isPaused) {
        audioEl.play()
        setIsPlaying(true)
      } else audioEl.pause()
      setIsPaused(prev => !prev)
    }
  }

  return (
    <div
      className={`tab-content-2 tab-div noSelect ${
        tabName !== 'phrases' ? 'hidePage' : ''
      }`}
    >
      <button
        id="hideDefsBtn"
        className="button"
        onClick={hideDefs}
      >
        Done
      </button>
      <button
        className={'extraPlayBtn button'}
        onClick={handlePlayPause}
      >
        {isPlaying ? (
          <img
            src={pauseBtn}
            alt=""
            className={isPaused ? 'blink' : ''}
          />
        ) : (
          <img
            src={playSound}
            alt=""
          />
        )}
        <div className="voices"></div>
      </button>
      <img
        src={arrowRight}
        alt="right arrow"
        className="right-arrow noSelect"
        onClick={() => changeCharacter(1)}
      />
      <img
        src={arrowLeft}
        alt="left arrow"
        className="left-arrow"
        onClick={() => changeCharacter(-1)}
      />
      <ReportError
        actualIndex={currentList[currentIndex]?.phraseId - 1}
        clip={currentList[currentIndex]}
      />
      <Favorites
        actualIndex={currentList[currentIndex]?.phraseId - 1}
        currentList={currentList}
        currentListIndex={currentIndex}
        favorites={favorites}
        setFavorites={setFavorites}
      />{' '}
      {currentClip?.eng ? (
        <DisplayText
          currentClip={currentClip}
          def={def}
          setDef={setDef}
        />
      ) : (
        <h1 className="noClipsMsg">Invalid Search</h1>
      )}
      <div className="multipleDefs">{createDefText(def)}</div>
      <PhraseBtns
        getNewIndex={getNewIndex}
        changeIndex={changeIndex}
        handlePlayPause={handlePlayPause}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
      />
    </div>
  )
}

function shuffle(array) {
  let currentIndex = array.length

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.;
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }
}
