import '../styles/search.css'
import { useContext, useEffect, useState } from 'react'
import { SettingsContext } from '../contexts/SettingsContext'
import SearchNavBar  from '../components/SearchNavBar'

import KeyBoard from '../components/KeyBoard.jsx'

export default function Search({ WORD_LIST }) {
  //  Context
  const { setTabName, tabName, searchTerm, setSearchTerm } = useContext(SettingsContext)

  //  State
  const [checkScroll, setCheckScroll] = useState(true)
  const [checkFilter, setCheckFilter] = useState(false)
  const [showKeyBoard, setShowKeyboard] = useState(false)
  const [highlightInput, setHighlightInput] = useState(false)

  const isPortable = 'ontouchstart' in document.documentElement

  useEffect(() => {
    if (!checkScroll) return
    const scrollDiv = document.querySelector('.tab-content-search .selections')
    let wordIndex = 0
    for (const word of WORD_LIST) {
      if (word.localeCompare(searchTerm) > -1)  break; // IMPORTANT: Exit the loop to avoid unnecessary iterations
      else wordIndex++
    }
    const scrollPos = Math.floor(wordIndex / 4) * 36.8
    scrollDiv.scrollTo({
      top: scrollPos,
      left: 0,
      behavior: "smooth",
    })
    checkIfThere(searchTerm)
  }, [checkScroll, searchTerm])

  
  function letterWasClicked(key) {
    if (key === 'enter') {
      setShowKeyboard(false)
      return
    }
    let term
    if (key === 'back') {
      term =searchTerm.slice(0, searchTerm.length - 1)
    } else {
      term = searchTerm + key
    }
    setSearchTerm(term)
  }

  function checkIfThere(text) {
    let bold = false
    if (searchTerm >= ''){
    const words = Array(WORD_LIST)[0]
    words.map(word => {
      if (word.toLowerCase() === text.toLowerCase()) bold = true
    })}
    setHighlightInput(bold)
    if (showKeyBoard)
    document.getElementById('searchTermInput').focus()
  }

  function handleKeyboard(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.keyCode === 13) letterWasClicked('return')
    if (e.keyCode === 8) letterWasClicked('back')
    if (e.keyCode >= 65 && e.keyCode <= 90) letterWasClicked(e.key)
  }

  function handleShowKeyboard() {
    if (isPortable)
    setShowKeyboard(true)
  }

  return (
    <div
      className={`tab-content-search tab-div ${
        tabName !== 'search' ? 'hidePage' : ''
      }`}
    >

      <SearchNavBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm} 
        checkScroll={checkScroll} 
        setCheckScroll={setCheckScroll} 
        checkFilter={checkFilter} 
        setCheckFilter={setCheckFilter} 
        highlightInput={highlightInput} 
        handleShowKeyboard={handleShowKeyboard} 
        handleKeyboard={handleKeyboard} 
        setTabName={setTabName}
      />

      <KeyBoard showKeyBoard={showKeyBoard} letterWasClicked={letterWasClicked}/>

      <div className="selections">
        {WORD_LIST.filter(word => {
          return word.indexOf(searchTerm.toLowerCase()) === 0 || checkScroll
        }).map((word2, i) => {
          return (
            <div
              key={word2}
              className="word"
              onClick={() => {
                setSearchTerm(word2)
                setShowKeyboard(false)
              }}
            >
              {word2}
            </div>
          )
        })}
      </div>
    </div>
  )
}
