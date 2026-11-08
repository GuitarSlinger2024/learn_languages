import '../styles/dropdown.css'
import React, { useEffect, useRef, useState } from 'react'

function Dropdown_Menu({ setLanguageChoice }) {

  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const dataListRef = useRef(null)

  const [dropdownValue, setDropdownValue] = useState('')

  //  Show / hide dropdown menu
  useEffect(() => {
    if (!dataListRef || !dataListRef.current) return
    inputRef.current.onfocus = () => {
      dataListRef.current.classList.add('showList')
    }

    inputRef.current.onblur = () => {
      if (!dataListRef.current) return
      console.log('%cdataListRef', 'font-size:15px;color:red', dataListRef.current)
      setTimeout(() => {
        if (!dataListRef.current) return
        console.log('%cdataListRef', 'font-size:15px;color:red', dataListRef.current)
        dataListRef.current.classList.remove('showList')
      }, 200);
    }
  }, [dataListRef.current])


  // function changeLanguage(e) {
  //   setDropdownValue(e.target.value)
  //   if (window.dataList.length > 0 && e.target.value !== ''){
  //     window.languageChoice = e.target.value
  //     setDropdownValue(e.target.value)
  //   }
  // }

  //        Create Options

  useEffect(() => {
    function createOptions() {
      console.log({ languageNames: window.languageNames })
      const options = [...window.languageNames]

      dataListRef.current.innerHTML = ''
      for (let opt of options) {
        let option = createOption(opt)
        dataListRef.current.append(option)
      }

      //  Only create 'End Of List' if the list is long enough
      if (options.length > 0 && !options[0].emptyDiv) {
        let option = createOption('End Of List')
        dataListRef.current.append(option)
      }
    }

    createOptions()
  }, [])

  function createOption(option) {
    const div = document.createElement('div')
    div.className = 'option'
    div.innerHTML = option

    if (option === 'End Of List') {
      div.classList.add('endOfList')
      div.innerHTML = 'End Of List'
    } else {
      div.dataset.info = option
      div.onclick = e => {
        console.log('%c Input value was changed to: ' + option, 'color: red')
        setDropdownValue(option)
        setLanguageChoice(option)
        window.languageChoice = option
        closeDatalist()
      }
    }

    return div
  }

  return (
    <div
      className="dropdown-container"
      ref={containerRef}>
      <label
        id="languageLabel"
        htmlFor="languageInput">
        Language:{' '}
      </label>
      <input
        id="languageInput"
        ref={inputRef}
        type="text"
        autocomplete="off"
        // onChange={changeLanguage}
        value={dropdownValue}
        placeholder="Choose"></input>

      <div className="dataList-container">
        <div
          className="dataList"
          ref={dataListRef}></div>        
      </div>

    </div>
  )
}

export default Dropdown_Menu
