import { createContext, useEffect, useState } from 'react'
import DICTIONARY from '../components/dictionary.js'
import { getBlob } from '../database/indexedDB.js'

export const SettingsContext = createContext()

export function SettingsProvider({ children }) {
  const storageData = {}
  const currentLanguage = window.languageChoice.toLowerCase()

  for (const name of window.languageNames) {
    const data = JSON.parse(localStorage.getItem(name.toLowerCase()))
    storageData[name.toLowerCase()] = data ? data : {}
  }

  //  Play Lists
  const [checkAllPhrases, setCheckAllPhrases] = useState(
    Boolean(storageData[currentLanguage].checkAllPhrases) ||
      //  if BOTH checkFavorites and checkSearch are unchecked,
      //  then checkAllPhrases should be checked.
      (!Boolean(storageData[currentLanguage].checkFavorites) &&
        !Boolean(storageData[currentLanguage].checkSearch))
  )
  const [checkFavorites, setCheckFavorites] = useState(
    Boolean(storageData[currentLanguage].checkFavorites)
  )
  const [checkSearch, setCheckSearch] = useState(
    Boolean(storageData[currentLanguage].checkSearch)
  )
  //  Play Mode
  const [checkAutoPlay, setCheckAutoPlay] = useState(
    Boolean(storageData[currentLanguage].checkAutoPlay)
  )
  const [checkRandom, setCheckRandom] = useState(
    Boolean(storageData[currentLanguage].checkRandom)
  )
  const [checkRepeat, setCheckRepeat] = useState(
    Boolean(storageData[currentLanguage].checkRepeat)
  )
  //  Delay Text
  const [delayEng, setDelayEng] = useState(
    Boolean(storageData[currentLanguage].delayEng)
  )
  const [delayPhon, setDelayPhon] = useState(
    Boolean(storageData[currentLanguage].delayPhon)
  )
  const [delayPhraseText, setDelayPhraseText] = useState(
    Boolean(storageData[currentLanguage].delayPhraseText)
  )
  const initialDelay = storageData[currentLanguage].delayTime || 30
  const [delayTime, setDelayTime] = useState(initialDelay)
  //  Presets - these don't need to be reset from storageData
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [reading, setReading] = useState(false)
  //  What tab is being displayed
  const [tabName, setTabName] = useState('settings')
  const [settingsDisplay, setSettingsDisplay] = useState('search')
  const [fadeInTimeOut, setFadeInTimeOut] = useState(null)

  const phraseId = storageData[currentLanguage].currentPhraseId || {
    all: 1,
    favorites: 1,
    search: 1,
  }

  const [currentBlobs, setCurrentBlobs] = useState(null)
  const [currentPhraseId, setCurrentPhraseId] = useState(phraseId)

  function resetAll() {
    //  Play List   -                 I decided not to change the list
    // setCheckAllPhrases(true) setCheckFavorites(false) setCheckSearch(false)  Play
    // Mode
    setCheckAutoPlay(false)
    setCheckRandom(false)
    setCheckRepeat(false)
    setDelayTime(initialDelay)
    //  Delay Text
    setDelayEng(false)
    setDelayPhon(false)
    setDelayPhraseText(false)
    //  Presets
    setListening(false)
    setSpeaking(false)
    setReading(false)
  }

  function listeningPreset() {
    setDelayEng(true)
    setDelayPhraseText(false)
    setCheckAutoPlay(true)
    setDelayPhon(false) //  Does not matter
  }

  function speakingPreset() {
    setDelayEng(false)
    setCheckAutoPlay(false)
    
    //  Changes when phonetics are included (like with Chinese)
    if (window.phoneticIncluded.includes(window.languageChoice)) {
      setDelayPhon(true)
      setDelayPhraseText(false)  //  Used with non-Latin characters
    } else {
      setDelayPhon(false) //  Does not matter
      setDelayPhraseText(true)  //  Hide with Latin alphabet
    }
  }

  function readingPreset() {
    setCheckAutoPlay(false)
    setDelayEng(true)

    //  Changes when phonetics are included (like with Chinese)
    if (window.phoneticIncluded.includes(window.languageChoice)) {
      setDelayPhraseText(false)
      setDelayPhon(true)
    } else {
      setDelayPhraseText(false)
      setDelayPhon(false) //  Does not matter
    }
  }

  function handleAddFadeIn(classArray) {
    //  The possible array elements are: ['english', 'phonetic', 'phraseText']
    const divs = {}
    ;['english', 'phonetic', 'phraseText'].forEach(line => {
      const div = document.querySelector(`.${line}`)
      divs[line] = div
      if (div) {
        div.classList.remove('showTextBackground')
        div.classList.remove('fadeIn')
        //  Returns a boolean as to wheather the text is dalayed or not
        const delayed =
          line === 'english'
            ? delayEng
            : line === 'phonetic'
            ? delayPhon
            : delayPhraseText

        if (delayed) {
          div.classList.add('showTextBackground')
          div.classList.remove('fadeIn')
          //  Add 'fadeIn' to the lines that are not delayed
        } else {
          div.classList.add('fadeIn')
          div.classList.remove('showTextBackground')
        }

        //  Always add 'fadeIn' when clicked
        div.onclick = () => {
          div.classList.add('fadeIn')
          div.classList.remove('showTextBackground')
          div.onclick = null
        }
      }
    })
    clearTimeout(fadeInTimeOut)
    if (startAutoplay) {
      //  If autoplay, then autoplay handles the fadeIn times
      setFadeInTimeOut(null)
    } else {
      //  Otherwise, setTimeout is needed -
      //  This adds fadeIn to all 3 lines - easier to cover it that way.
      setFadeInTimeOut(
        setTimeout(
          () => {
            ;['english', 'phonetic', 'phraseText'].forEach(line => {
              divs[line]?.classList.add('fadeIn')
              divs[line]?.classList.remove('showTextBackground')
            })
          },
          Boolean(delayEng || delayPhon || delayPhraseText)
            ? delayTime * 1000
            : 0
        )
      )
    }
  }

  function handleDisEverything(action) {
    if (action === 'remove') {
      document.getElementById('main').classList.remove('disableEverything')
      document
        .getElementsByClassName('button-container')[0]
        .classList.remove('disableEverything')
    } else {
      document.getElementById('main').classList.add('disableEverything')
      document
        .getElementsByClassName('button-container')[0]
        .classList.add('disableEverything')
    }
  }

  //  Get the definitions
  function getCharInfo(char) {
    const def = DICTIONARY.find(eachDef => {
      if (eachDef.character) return eachDef.character.match(char)
      return false
    })
    return def
  }

  const [currentList, setCurrentList] = useState(
    storageData[currentLanguage].currentList || []
  )
  const [currentIndex, setCurrentIndex] = useState(
    storageData[currentLanguage].currentIndex || null
  )
  const [currentClip, setCurrentClip] = useState(
    storageData[currentLanguage].currentClip || null
  )

  const [indexInfo, setIndexInfo] = useState(
    storageData[currentLanguage].indexInfo || []
  )

  const [searchTerm, setSearchTerm] = useState(
    storageData[currentLanguage].searchTerm || ''
  )

  const [currentListName, setCurrentListName] = useState(
    storageData[currentLanguage].currentListName || 'all'
  )

  const [startAutoplay, setStartAutoplay] = useState(null) //  start playing each clip auotomatically.

  //  setAudioEl is never used, just the src value is changed.
  const [audioEl, setAudioEl] = useState(new Audio())

  const [isPlaying, setIsPlaying] = useState(false)

  async function changeIndex(newIndex) {
    newIndex =
      newIndex < 0
        ? currentList.length - 1
        : newIndex > currentList.length - 1
        ? 0
        : newIndex

    await getBlob({
      phraseText: currentList[newIndex][window.lingoAbbr],
      setCurrentBlobs: setCurrentBlobs,
    })

    setCurrentIndex(newIndex)
    setCurrentClip(currentList[newIndex])
    setIndexInfo({ index: newIndex + 1, length: currentList.length })
    if (
      currentList[newIndex] &&
      currentList[newIndex][window.lingoAbbr] &&
      !checkRandom
    )
      setCurrentPhraseId(prev => {
        const newObj = prev
        const newId = currentList[newIndex]?.phraseId
        newObj[currentListName] = newId
        return newObj
      })
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

    return array
  }

  useEffect(() => {
    //    storageData is already there
    //      Lists
    storageData[currentLanguage].checkAllPhrases = checkAllPhrases
    storageData[currentLanguage].checkFavorites = checkFavorites
    storageData[currentLanguage].checkSearch = checkSearch
    storageData[currentLanguage].searchTerm = searchTerm
    //      Play mode
    storageData[currentLanguage].checkAutoPlay = checkAutoPlay
    storageData[currentLanguage].checkRandom = checkRandom
    storageData[currentLanguage].checkRepeat = checkRepeat //  not currently used
    //      Delay values
    storageData[currentLanguage].delayEng = delayEng
    storageData[currentLanguage].delayPhon = delayPhon
    storageData[currentLanguage].delayPhraseText = delayPhraseText
    storageData[currentLanguage].delayTime = delayTime

    //     Phrase controls
    storageData[currentLanguage].currentPhraseId = currentPhraseId
    storageData[currentLanguage].currentList = currentList
    storageData[currentLanguage].currentIndex = currentIndex
    storageData[currentLanguage].currentClip = currentClip
    storageData[currentLanguage].currentListName = currentListName
    storageData[currentLanguage].indexInfo = indexInfo

    localStorage.setItem(
      currentLanguage,
      JSON.stringify(storageData[currentLanguage])
    )
  }, [
    checkAllPhrases,
    checkFavorites,
    checkSearch,
    checkAutoPlay,
    checkRandom,
    checkRepeat,
    delayEng,
    delayPhon,
    delayPhraseText,
    delayTime,
    currentPhraseId,
    currentList,
    currentIndex,
    currentClip,
    currentListName,
    indexInfo,
    searchTerm,
  ])

  return (
    <SettingsContext.Provider
      value={{
        checkAllPhrases,
        setCheckAllPhrases,
        checkRandom,
        setCheckRandom,
        checkAutoPlay,
        setCheckAutoPlay,
        checkFavorites,
        setCheckFavorites,
        checkSearch,
        setCheckSearch,
        checkRepeat,
        setCheckRepeat,
        delayEng,
        setDelayEng,
        delayPhon,
        setDelayPhon,
        delayPhraseText,
        setDelayPhraseText,
        delayTime,
        setDelayTime,
        listening,
        setListening,
        speaking,
        setSpeaking,
        reading,
        setReading,
        resetAll,
        listeningPreset,
        speakingPreset,
        readingPreset,
        tabName,
        setTabName,
        settingsDisplay,
        setSettingsDisplay,
        handleAddFadeIn,
        getCharInfo,
        currentBlobs,
        setCurrentBlobs,
        currentPhraseId,
        setCurrentPhraseId,
        currentList,
        setCurrentList,
        currentIndex,
        setCurrentIndex,
        currentClip,
        setCurrentClip,
        changeIndex,
        currentListName,
        setCurrentListName,
        setIndexInfo,
        indexInfo,
        startAutoplay,
        setStartAutoplay,
        audioEl,
        isPlaying,
        setIsPlaying,
        handleDisEverything,
        shuffle,
        searchTerm,
        setSearchTerm,
      }}>
      {children}
    </SettingsContext.Provider>
  )
}
