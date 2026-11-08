import './styles/startingPage.css'
import Tabs from './main/Tabs'
import { SettingsProvider } from './contexts/SettingsContext'
import {
  indexedDBinit,
  getByCharacters,
  getByIndex,
  getByEnglish,
} from './database/indexedDB'

import Settings from './main/SettingsPage'
import Phrases from './main/Phrases'
// import Games from './main/Games'
import Info from './main/Info'
import Search from './main/Search'
import { useState, useEffect, useRef } from 'react'
import Checkbox from './components/Checkbox'
import Games from './main/Games'
import NoGame from './components_games/NoGame'

function App() {
  //  State
  const [favorites, setFavorites] = useState([])
  const [wordList, setWordList] = useState([])
  const [def, setDef] = useState('')
  const [english, setEnglish] = useState(null)
  const [loading, setLoading] = useState(true)
  const [percent, setPercent] = useState(0)
  const [progBarWidth, setProgBarWidth] = useState('20%')

  const [languageChoice, setLanguageChoice] = useState('')
  const [languageNames, setLanguageNames] = useState([])
  const [languageChecked, setLanguageChecked] = useState('')
  const [rememberMostRecent, setRememberMostRecent] = useState(true)
  const [hsva, setHsva] = useState({})

  //  Error display ref
  const [errorMsg, setErrorMsg] = useState('wtf')

  useEffect(() => {
    const colorTheme = JSON.parse(localStorage.getItem('colorTheme')) || {
      h: 200,
      s: 43,
      v: 90,
      a: 1,
    }
    setHsva(colorTheme)

    window.languageNames = null
    window.phoneticIncluded = ['Chinese']
  }, [])

  //  Getting Languages
  useEffect(() => {
    fetch(`/get_languages`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(data => data.json())
      .then(data => {
        console.log({ 'languages from server': data })
        window.languageNames = data
        setLanguageNames(data)

        //  This sets the first choice as being checked
        const rememberRecent = JSON.parse(
          localStorage.getItem('rememberRecentLanguage')
        )
        const remember = rememberRecent ? rememberRecent[0] : false
        setRememberMostRecent(remember)
        if (remember) {
          const checked = JSON.parse(localStorage.getItem('resentLanguage'))
          setLanguageChecked(checked[0] || null)
        }
      })

    //  Getting Color Theme - might not be needed, it's in settingConte
  }, [])

  useEffect(() => {
    localStorage.setItem('colorTheme', JSON.stringify(hsva))
    document.body.style.setProperty('--primary-hue', hsva.h)
    document.body.style.setProperty('--primary-saturation', hsva.s + '%')
  }, [hsva])

  useEffect(() => {
    if (!languageChecked.length) return
    localStorage.setItem('resentLanguage', JSON.stringify([languageChecked]))
  }, [languageChecked])

  function toggleRemember() {
    setRememberMostRecent(!rememberMostRecent)
    localStorage.setItem(
      'rememberRecentLanguage',
      JSON.stringify([!rememberMostRecent])
    )
    if (!rememberMostRecent) {
      const recent = JSON.parse(localStorage.getItem('resentLanguage'))
      if (recent) setLanguageChecked(recent[0])
    }
  }

  function startHandler() {
    console.log(languageChecked)
    setLanguageChoice(languageChecked)
    window.languageChoice = languageChecked
    window.lingoAbbr = languageChecked.toLowerCase().slice(0, 4)
    window.PHRASE_DATA = require(`./database/${window.languageChoice.toLowerCase()}_database.json`)
    initIndexedDB()
  }

  async function initIndexedDB() {
    if (!window.languageChoice) return
    console.log(window.languageChoice, Boolean(!window.languageChoice))
    console.log('Getting info...')
    fetch(`/get_phrase_errors/${window.languageChoice.toLowerCase()}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(data => data.json())
      .then(reportedErrorsArray => {
        console.log({
          reportedErrorsArray,
          PHRASE_DATA: window.PHRASE_DATA,
          languageChoice: window.languageChoice,
          lingoAbbr: window.lingoAbbr,
        })

        //  Add flagged properties to phrases with errors reported
        window.PHRASE_DATA.forEach((clip, i) => {
          if (
            reportedErrorsArray
              .map(phrase => phrase.phraseId)
              .includes(String(clip.phraseId))
          ) {
            window.PHRASE_DATA[i].flagged = 'true'
          }
        })

        //  Create indexedDB databases
        try {
          indexedDBinit(
            loading,
            setLoading,
            setProgBarWidth,
            setPercent,
            setErrorMsg
          )
        } catch (error) {
          setErrorMsg(error.message)
        }

        console.log(window.PHRASE_DATA)
      })

    //  Get favorites from localStorage
    const favorites = JSON.parse(
      localStorage.getItem(`${window.languageChoice}_favorites`)
    ) || {
      favorites: [],
    }

    setFavorites(favorites)
    window.PHRASE_DATA.forEach(clip => {
      //  Add favorites prop to each clip
      clip.favorite = favorites.includes(clip.phraseId)
    })

    async function getAllWords() {
      const words = await getWords(window.PHRASE_DATA)
      setWordList([...words])
      console.log({ words })
    }

    //  Get all english words
    const allWords = getAllWords(window.PHRASE_DATA)

    console.log({ PHRASE_DATA: window.PHRASE_DATA })
    console.log({ allWords })
  }

  // useEffect(() => {
  //   console.log(getByIndex(14))
  //   console.log(getByCharacters('数学'))
  //   getByEnglish('2 dogs', setEnglish, window.languageChoice)
  // }, [])

  return (
    <div className="App">
      {loading ? (
        <aside>
          {loading !== true ? (
            <>
              <h1>
                Loading Data...
                <span
                  id="loadingProgressBar"
                  style={{
                    inlineSize: progBarWidth + '%',
                  }}></span>
              </h1>
              <span>
                <br />
                <h3 style={{ textAlign: 'center' }}>{`${percent}%`}</h3>
                <br />
                {/* <p>{clipId}</p> */}
                <br />
                {/* {errorMsg} */}
              </span>
            </>
          ) : (
            languageNames && (
              <div id="startTheApp">
                <h2 className="message">
                  Which language would you like to start with today?
                </h2>
                <ul>
                  {languageNames.map((language, i) => (
                    <li>
                      <Checkbox
                        key={i}
                        label={language}
                        mode="light"
                        checked={languageChecked === language}
                        setChecked={setLanguageChecked.bind(null, language)}
                      />
                    </li>
                  ))}
                </ul>

                <button
                  className="button"
                  disabled={!Boolean(languageChecked)}
                  onClick={startHandler}>
                  {/* // disabled={true}> */}
                  Start
                </button>
                <div className="rememberMostRecent">
                  <Checkbox
                    label="Remember most recent"
                    mode="light"
                    checked={rememberMostRecent}
                    setChecked={toggleRemember}
                  />
                </div>
              </div>
            )
          )}
        </aside>
      ) : (
        <main id="main">
          <SettingsProvider>
            <Tabs />
            <Settings
              favorites={favorites}
              setFavorites={setFavorites}
              setLanguageChoice={setLanguageChoice}
              hsva={hsva}
              setHsva={setHsva}
            />
            <Phrases
              favorites={favorites}
              setFavorites={setFavorites}
              def={def}
              setDef={setDef}
            />
            <Games
              PHRASE_DATA={window.PHRASE_DATA}
              language={languageChoice}
            />
            <NoGame
              PHRASE_DATA={window.PHRASE_DATA}
              language={languageChoice}
            />
            <Search WORD_LIST={wordList} />
            <Info numOfPhrases={window.PHRASE_DATA.length} />
          </SettingsProvider>
        </main>
      )}
    </div>
  )
}

export default App

async function getWords(phraseData) {
  const words = []
  phraseData.map(clip => {
    const wordArray = clip.eng.split(' ')
    words.push(
      ...wordArray
        .filter(word => {
          let newWord = [...word]
            .filter(letter => {
              return letter.match(/[a-zA-Z]/i)
            })
            .join('')
          return newWord.length > 1
        })
        .map(word => {
          return word.toLowerCase().replace(/[^a-zA-Z']/gi, '')
        })
    )
  })

  const uniqueWords = [...new Set(words)].sort((a, b) => {
    if (a < b) {
      return -1
    }
    if (a > b) {
      return 1
    }
    return 0
  })
  return uniqueWords.filter(word => {
    return true
  })
}
