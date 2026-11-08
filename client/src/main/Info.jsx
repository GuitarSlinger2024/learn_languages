import '../styles/instructions.css'
import { useContext } from 'react'
import { SettingsContext } from '../contexts/SettingsContext'
import backToSettingsIcon from '../_img/bkBtn.png'
import playSoundIcon from '../_img/playSound.png'

export default function Info({ numOfPhrases }) {
  const { setTabName, tabName } = useContext(SettingsContext)

  return (
    <div
      className={`tab-content-info tab-div ${
        tabName !== 'info' ? 'hidePage' : ''
      }`}
    >
      <div id="about-info">
        <img
          src={backToSettingsIcon}
          alt="back button"
          id="back-icon-info"
          onClick={() => setTabName('settings')}
        />

        <h3  className="info-heading">Great News!</h3>
        <p>
          This is the new, improved app created with expressJs and React! Most of it pretty close to what it was with a few minor improvements. The biggest improvement is that the sound clips are downloaded onto your device. Fist go to the site, then turn off the wi-fi and/or mobile data! This app is flexable, find whatever settings work for you the best. Scroll down for some tips on getting started right away.
        </p>

        <h3 className="info-heading">Quick Start</h3>
        <ul>
          <li>
            There are {numOfPhrases} words and phrases to look through.
            Favorites can be used for your favorites (of course), but can also
            be used for words that need practice, words that are similar or
            whatever you might think of. A list can also be made by searching
            for specific english words. Note that not all the translations are word-for-word.
          </li>
          <li>
            There are three preset modes. Each preset is geared toward a
            different approach. Any of the three lines (English, phonetic or Chinese) can be hidden as each new phrase shows up. You can set delay time (number of seconds) for these lines to whatever you like. Click or tap each line for it to appear early.
          </li>
          <li>
            For listening start by checking autoplay, but DON'T click the [Start] button. The phrase will play each time the [Next] or
            [Back] button is clicked. The sound button (
            <img
              src={playSoundIcon}
              alt=""
              className="small-play-icon"
              style={{
                position: 'relative',
                top: '.25em',
                margin: '0 .2em'
              }}
            />
            ) can also be clicked to hear the phrase at any time. Use this mode to build a
            vocalulary and then to test your pinyin.
          </li>
          <li>
            For speaking (translating from English) and reading autoplay should NOT be checked in order
            to translate the English or the Chinese characters BEFORE hearing them...right?.
          </li>

          {numOfPhrases > 500 && false && (
            <li>
              <span style={{ fontWeight: 900, textDecoration: 'underline' }}>
                Great News!
              </span>
              &nbsp;&nbsp;Since there are {numOfPhrases} words and phrases to go
              through you {numOfPhrases < 500 ? 'might not' : "probably won'"}
              go through them all in one sitting. To keep from having to reset
              the index number you were on, all the phrase settings and the
              current phrase are reset for you each time you log on.
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
