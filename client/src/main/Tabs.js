import '../styles/tabs.css'
import { useContext, useState } from 'react'
import { SettingsContext } from '../contexts/SettingsContext'
import IndexInput from '../components/IndexInput'
import KeyPad from '../components/KeyPad.jsx'

const Tabs = ({}) => {
  //  setStartAutoplay is set to false when another tab is clicked (stops autoplay)
  const {
    tabName,
    setTabName,
    handleAddFadeIn,
    indexInfo,
    settingsDisplay,
    setStartAutoplay,
    changeIndex,
    handleDisEverything,
  } = useContext(SettingsContext)

  const [mouseDownTimeout, setMouseDownTimeout] = useState(null)
  const [inputFocussed, setInputFocussed] = useState(false)
  const [showIndexKeypad, setShowIndexKeypad] = useState(false)
  const [dblTouchTimer, setDblTouchTimer] = useState(10000)

  const inputEl = document.getElementsByClassName('indexInput')[0]

  const isPortable = 'ontouchstart' in document.documentElement

  function toggleIndex(from) {
    if (isPortable && from === 'onClick') return
    console.log('toggling label/index sizes')
    document.querySelector('.tabs .phrase-tab').classList.toggle('show-index')
  }

  //
  //
  //

  function handleEnter() {
    console.log('handle enter')

    let newIndex = inputEl.innerHTML
    if (newIndex === '' || +newIndex > +indexInfo.length)
      newIndex = indexInfo.index
    inputEl.innerHTML = String(newIndex)
    changeIndex(newIndex - 1)
    setInputFocussed(false)
    setShowIndexKeypad(false)
    document.getElementById('main').classList.remove('disableEverything')
    document
      .getElementsByClassName('button-container')[0]
      .classList.remove('disableEverything')
    window.onkeyup = null
  }

  function handleDelete() {
    console.log('handle delete')
    inputEl.innerHTML = inputEl.innerHTML.slice(0, inputEl.innerHTML.length - 1)
  }

  function handleAddDigit(digit) {
    const len = String(indexInfo['length'])
    //  HTML.length reflects before the new digit is applied
    if (inputEl.innerHTML.length < len.length) {
      inputEl.innerHTML += digit
      console.log('adding a digit')
    }
  }

  function btnWasClicked(key) {
    if (key === 'enter') handleEnter()
    else if (key === 'back') handleDelete()
    else handleAddDigit(key)
  }

  function handleKeyboradInput(e) {
    if (e.key === 'Enter' || e.keyCode === 13 || e.code === 'Enter')
      handleEnter()
    else if (e.key === 'Backspace' || e.keyCode === 8 || e.code === 'Backspace')
      handleDelete()
    else handleAddDigit(e.key)
  }

  return (
    <>
      <KeyPad
        showKeypad={showIndexKeypad}
        btnWasClicked={btnWasClicked}
      />

      <div className="tabs">
        {/* Settings */}
        <input
          type="radio"
          id="homeDiv"
          name="tabs"
          onClick={() => {
            setTabName(settingsDisplay)
            setStartAutoplay(false)
            console.log('settingsDisplay: ', settingsDisplay)
          }}
        />
        <label
          htmlFor="homeDiv"
          className="noSelect"
        >
          Settings
        </label>

        {/* Phrases */}
        <input
          type="radio"
          id="phrasesDiv"
          name="tabs"
          newphrase="false"
        />
        <label
          htmlFor="phrasesDiv"
          className="phrase-tab noSelect"
          onDoubleClick={() => toggleIndex('dblClick')}
          onClick={() => {
            if (tabName !== 'phrases') {
              setTabName('phrases')
              handleAddFadeIn()
            }
          }}
          onMouseDown={e => {
            if (tabName !== 'phrases') {
              setTabName('phrases')
              handleAddFadeIn()
            } else {
              clearTimeout(mouseDownTimeout)
              setMouseDownTimeout(
                setTimeout(() => {
                  console.log('One half second')
                  setInputFocussed(true)
                  console.log(indexInfo)
                  // setShowIndexKeypad(true)
                  handleDisEverything('add')
                  window.onkeyup = e => {
                    handleKeyboradInput(e, e.key)
                  }
                }, 500)
              )
            }
          }}
          onTouchStart={e => {
            if (tabName !== 'phrases') {
              setTabName('phrases')
              handleAddFadeIn()
            } else {
              const diff = Date.now() - dblTouchTimer
              console.log(diff)
              if (diff < 300) {
                toggleIndex('touchStart')
                clearTimeout(mouseDownTimeout)
              } else {
                setDblTouchTimer(Date.now())
                clearTimeout(mouseDownTimeout)
                setMouseDownTimeout(
                  setTimeout(() => {
                    console.log('One half second')
                    handleDisEverything('add')
                    setShowIndexKeypad(true)
                    setInputFocussed(true)
                    console.log(indexInfo)
                  }, 500)
                )
              }
            }
          }}
          onMouseUp={e => {
            e.preventDefault()
            e.stopPropagation()
            clearTimeout(mouseDownTimeout)
          }}
          onTouchEnd={e => {
            e.stopPropagation()
            clearTimeout(mouseDownTimeout)
          }}
        >
          <p className="tab-name">Phrases</p>
          <IndexInput
            indexInfo={indexInfo}
            inputFocussed={inputFocussed}
            setInputFocussed={setInputFocussed}
          />
        </label>

        {/* Games */}
        <input
          type="radio"
          id="charactersDiv"
          name="tabs"
          onClick={() => {
            setStartAutoplay(false)
            setTabName('games')
          }}
        />
        <label
          htmlFor="charactersDiv"
          className="noSelect"
        >
          Games
          <span className="char-index"></span>
        </label>
      </div>
    </>
  )
}

export default Tabs
