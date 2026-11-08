import React, { useState } from 'react'
import { useEffect } from 'react'

function IndexInput({ indexInfo, inputFocussed }) {
  // const { setCurrentPhraseId, currentListName, changeIndex } =
  //   useContext(SettingsContext)

  const [returnIndexSize, setReturnIndexSize] = useState(false)
  const inputEl = document.querySelector('span.indexInput')

  useEffect(() => {
    if (inputEl) {
      console.log('%c Find a good focus logic, right?', 'color: purple')
      const parent = inputEl.parentElement.parentElement
      if (inputFocussed) {
        inputEl.classList.add('focus')
        setReturnIndexSize(prev => {
          console.log(prev)
          console.log(!parent.classList.contains('show-index'))
          return !parent.classList.contains('show-index')
        })
        parent.classList.add('show-index')
      } else {
        //
        inputEl.classList.remove('focus')
        if (returnIndexSize) parent.classList.remove('show-index')
      }
    }
  }, [inputFocussed])

  window.onkeydown = () => handleKeyDown

  function handleKeyDown(e) {
    e.preventDefault()
    if (e.repeat === true) return false

    //  Handle Number
    // if (e.keyCode > keycode('1'))
    console.log(e.keyCode)

    //  Handle 'Enter'
    if (e.key === 'Enter' || e.keyCode === 13 || e.code === 'Enter') {
      // inputEl.innerHtml = inputEl.innerHTML.slice(0, inputEl.innerHTML.length - 2)
      let brs = inputEl.getElementsByTagName('br')
      while (brs.length) {
        brs[0].parentNode.removeChild(brs[0])
      }
      const value = inputEl.innerHTML
      console.log(value)
      inputEl.blur()
      return false
    }
  }

  let blurTimeout = null
  return (
    <div className="index">
      <span
        className="indexInput"
        id="indexInput"
      >
        {indexInfo?.index || ''}
      </span>
      {inputFocussed && <span className="blinkingCursor">|</span>}
      {!inputFocussed && <span className="slash">/</span>}
      {!inputFocussed && <span>{indexInfo?.length || ''}</span>}
    </div>
  )
}

export default IndexInput
