import React, { useContext } from 'react'
import { SettingsContext } from '../contexts/SettingsContext'
import Checkbox from '../components/Checkbox.js'
import backToSettingsIcon from '../_img/bkBtn.png'

function SearchNavBar({
  highlightInput,
  handleShowKeyboard,
  handleKeyboard,
  checkScroll,
  setCheckScroll,
  setCheckFilter,
  checkFilter,
  setTabName,
}) {
  const { searchTerm, setSearchTerm } = useContext(SettingsContext)
  return (
    <div
      className="searchNavbar"
      styles={{ display: 'flex' }}
    >
      <input
        type="text"
        name="searchTerm"
        id="searchTermInput"
        autoComplete="off"
        value={searchTerm}
        style={{
          fontWeight: `${highlightInput ? '600' : '400'}`,
          letterSpacing: `${highlightInput ? '.05em' : '.1em'}`,
        }}
        onFocus={() => {
          handleShowKeyboard()
        }}
        onKeyDown={e => {
          handleKeyboard(e)
        }}
        placeholder="Search Term"
        readOnly={true}
      />
      <div
        className="clearInputIcon"
        htmlFor="searchTermInput"
        onClick={() => setSearchTerm('')}
      >
        X
      </div>
      <div className="checkBoxes">
        <Checkbox
          label="scroll"
          mode="light"
          checked={checkScroll}
          setChecked={setCheckScroll}
          radio={[setCheckFilter]}
          className="checkBox"
          name="scroll"
        />

        <Checkbox
          label="filter"
          mode="light"
          checked={checkFilter}
          setChecked={setCheckFilter}
          radio={[setCheckScroll]}
          className="checkBox"
        />
      </div>

      <img
        src={backToSettingsIcon}
        alt="back button"
        id="back-icon-search"
        onClick={() => setTabName('settings')}
      />
    </div>
  )
}

export default SearchNavBar
