import { useContext, useEffect, useState } from 'react'
import Checkbox from '../components/Checkbox'
import { SettingsContext } from '../contexts/SettingsContext'
import '../styles/settings.css'
import infoIcon from '../_img/info.png'
import KeyPad from '../components/KeyPad'
import Wheel from '@uiw/react-color-wheel'

//  Images
import colorIcon from '../_img/color_picker_icon.png'

//    Documentation for Wheel can be found at:
//    https://www.npmjs.com/package/@uiw/react-color-wheel

export default function Settings({
  favorites,
  setFavorites,
  setLanguageChoice,
  hsva,
  setHsva,
}) {
  const {
    checkAllPhrases,
    setCheckAllPhrases,
    checkAutoPlay,
    setCheckAutoPlay,
    checkRandom,
    setCheckRandom,
    checkFavorites,
    setCheckFavorites,
    checkSearch,
    setCheckSearch,
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
    setTabName,
    tabName,
    setSettingsDisplay,
    currentListName,
    setCurrentListName,
    handleDisEverything,
  } = useContext(SettingsContext)

  const isPortable = 'ontouchstart' in document.documentElement

  const messages = {
    defaultMsg: 'Have fun!',
    noFavsMsg: 'There are no favorites at this time.',
  }

  const [currentMsg, setCurrentMsg] = useState(messages.defaultMsg)
  const [timeoutId, setTimeoutId] = useState(null)
  const [showDelayKeypad, setShowDelayKeypad] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [pickerTimeout, setPickerTimeout] = useState(null)
  const [languageInputValue, setLanguageInputValue] = useState(
    window.languageChoice
  )

  const inputEl = document.getElementById('delay-input')

  useEffect(() => {
    const display = ['settings', 'info', 'search'].includes(tabName)
      ? tabName
      : null
    if (display) setSettingsDisplay(display)
  }, [tabName])

  useEffect(() => {
    clearTimeout(timeoutId)
    setTimeoutId(
      setTimeout(() => {
        setCurrentMsg(messages.defaultMsg)
      }, 2000)
    )

    if (currentMsg !== messages.defaultMsg) uncheckFavorites()

    // Cleanup function to clear the timeout if the component unmounts
    return () => {
      clearTimeout(timeoutId)
    }
  }, [currentMsg])

  function uncheckFavorites() {
    console.log('%c Unchecking Favs', 'font-size: 30px;color:red')
    console.log(currentMsg)
    console.trace()
    //  First just uncheck it...
    setCheckFavorites(false)
    //  Then return to the previously checked
    if (currentListName === 'all' || currentListName === 'favorites') {
      setCheckAllPhrases(true)
    } else if (currentListName === 'search') {
      setCheckSearch(true)
    }
  }

  ////////////////////////////////////////////////////////
  //////////     Input from actual keyboard     //////////

  //  The language input is temporary - It should be a dropdown menu

  function checkForEnter(e) {
    if (e.keyCode === 13) e.target.blur()
  }

  function languageInputHandler(e) {
    setLanguageInputValue(e.target.value)
    if (e.target.value === 'Chinese' || e.target.value === 'French')
      setLanguageChoice(e.target.value)
  }

  //////////////////////////////////////////////
  //////////     keypad functions     //////////

  function handleDelete() {
    console.log('handle delete')
    inputEl.value = inputEl.value.slice(0, inputEl.value.length - 1)
  }

  function handleEnter() {
    console.log('handle enter')
    setShowDelayKeypad(false)
    setDelayTime(+inputEl.value || 0)
    handleDisEverything('remove')
  }

  function handleAddDigit(digit) {
    console.log(`Enter digit: ${digit}`)
    if (String(inputEl.value).length < 3) inputEl.value += digit
  }

  function btnWasClicked(key) {
    if (key === 'enter') handleEnter()
    else if (key === 'back') handleDelete()
    else handleAddDigit(key)
  }

  //////////////////////////////////////////////
  //////////     Color Picker     //////////

  function toggleShowPicker() {
    console.log('toggling...')
    console.log(showColorPicker)
    const startShowing = !showColorPicker
    setShowColorPicker(startShowing)
    if (startShowing) {
      handleDisEverything('add')
      handlePickerTimeout()
    } else handleDisEverything('remove')
  }

  function handlePickerTimeout() {
    //  //  Somehow do this only AFTER the last event in the timer
    //  //  This means being able to detect anytime the colorpicker is changed, nbd.
    //  //  Also remember to remove 'disableEverything'
    clearTimeout(pickerTimeout)
    setPickerTimeout(
      setTimeout(() => {
        setShowColorPicker(false)
        handleDisEverything('remove')
      }, 10000)
    )
  }

  useEffect(() => {
    handlePickerTimeout()
  }, [hsva])

  return (
    <>
      {isPortable && (
        <KeyPad
          showKeypad={showDelayKeypad}
          btnWasClicked={btnWasClicked}
        />
      )}

      <div
        className={`tab-content-1 tab-div noSelect ${
          tabName !== 'settings' ? 'hidePage' : ''
        }`}>
        <img
          src={colorIcon}
          alt=""
          id="colorPickerIcon"
          onClick={() => toggleShowPicker()}
        />

        <Wheel
          color={hsva}
          onChange={color => setHsva({ ...hsva, ...color.hsva })}
          width={150}
          height={150}
          id="theColorPicker"
          className={showColorPicker && 'active'}
        />
        <div className="tab-div">
          <img
            src={infoIcon}
            alt="info icon"
            id="info-icon"
            onClick={() => setTabName('info')}
          />

          <div className="messages">
            <h2 className="intro-message">{currentMsg}</h2>

            <div className="languageChoice">
              <label htmlFor="languageChoice">Language:</label>
              <input
                readOnly={true}
                id="languageChoice"
                type="text"
                tabIndex="-1"
                onChange={languageInputHandler}
                value={languageInputValue}
                onKeyDown={checkForEnter}
              />
            </div>
          </div>

          <div className="outer-wrapper">
            <div className="options lists">
              <h3 className="heading noSelect">Lists</h3>

              <Checkbox
                label="All Phrases"
                mode="light"
                checked={checkAllPhrases}
                setChecked={setCheckAllPhrases}
                radio={[setCheckFavorites, setCheckSearch]}
                setCurrentListName={setCurrentListName}
                name="all"
              />

              <Checkbox
                label="Favorites"
                mode="light"
                checked={checkFavorites}
                setChecked={setCheckFavorites}
                radio={[setCheckAllPhrases, setCheckSearch]}
                // only include this param if it is needed - then instant return
                showNewMsg={
                  !favorites.length
                    ? () => setCurrentMsg(messages.noFavsMsg)
                    : null
                }
                setFavorites={setFavorites}
                setCheckFavorites={setCheckFavorites}
                uncheckFavorites={uncheckFavorites}
                setCurrentListName={setCurrentListName}
                name="favorites"
                className={!favorites.length && 'dim'}
              />

              {/* Find Word */}
              <Checkbox
                label="Search..."
                mode="light"
                checked={checkSearch}
                setChecked={setCheckSearch}
                radio={[setCheckFavorites, setCheckAllPhrases]}
                setCurrentListName={setCurrentListName}
                name="search"
                onclick={() => {
                  setTabName('search')
                }}
              />
            </div>

            <div className="options settings">
              <h3 className="heading noSelect noSelect">Play Mode</h3>

              {/* Auto Play */}
              <Checkbox
                label="Auto-play"
                mode="light"
                checked={checkAutoPlay}
                setChecked={setCheckAutoPlay}
              />

              {/* Randomize */}
              <Checkbox
                label="Random"
                mode="light"
                checked={checkRandom}
                setChecked={setCheckRandom}
              />

              {/* Repeat Mode
            <Checkbox
              label="Repeat Mode"
              mode="light"
              checked={checkRepeat}
              setChecked={setCheckRepeat}
              opacity={.2}
            /> */}
            </div>

            <div class="options delay-controls">
              <div className="options ph">
                <h3 className="heading noSelect">Delay Text</h3>

                <Checkbox
                  label="English"
                  mode="light"
                  checked={delayEng}
                  setChecked={setDelayEng}
                />

                {window.phoneticIncluded.includes(window.languageChoice) && (
                  <Checkbox
                    label="Phonetic"
                    mode="light"
                    checked={delayPhon}
                    setChecked={setDelayPhon}
                  />
                )}

                <Checkbox
                  label={window.languageChoice}
                  mode="light"
                  checked={delayPhraseText}
                  setChecked={setDelayPhraseText}
                />
              </div>
              <div className="delay-time">
                <label
                  htmlFor="delay-input"
                  id="delay-input-label">
                  Time:
                </label>
                <input
                  id="delay-input"
                  type="number"
                  min="0"
                  tabIndex="-1"
                  value={+delayTime > 5 || delayTime === '' ? delayTime : 5}
                  onFocus={() => {
                    setShowDelayKeypad(true)
                    if (isPortable) handleDisEverything('add')
                  }}
                  onBlur={() => {
                    if (!delayTime || +delayTime < 5) setDelayTime(5)
                    if (!isPortable) handleDisEverything('remove')
                  }}
                  onChange={e => setDelayTime(e.target.value)}
                  onKeyDown={checkForEnter}
                  //  readOnly prevents the virtual keyboard on portable devices
                  //    This should not be used if it is not a portable device
                  readOnly={isPortable}
                />
              </div>
            </div>

            <div className="options presets">
              <h3 className="heading noSelect">Pre-sets</h3>

              {/* Listening */}
              <Checkbox
                label="Listening"
                mode="light"
                checked={listening}
                setChecked={setListening}
                radio={[setSpeaking, setReading]}
                onclick={listeningPreset}
                showBox="none"
              />

              {/* Speaking */}
              <Checkbox
                label="Speaking"
                mode="light"
                checked={speaking}
                setChecked={setSpeaking}
                radio={[setListening, setReading]}
                onclick={speakingPreset}
                showBox="none"
              />

              {/* Reading */}
              <Checkbox
                label="Reading"
                mode="light"
                checked={reading}
                setChecked={setReading}
                radio={[setListening, setSpeaking]}
                onclick={readingPreset}
                showBox="none"
              />

              <button
                id="clearSettings"
                onClick={resetAll}>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
