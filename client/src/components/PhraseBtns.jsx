import '../styles/buttonContainer.css'
import { useContext, useEffect, useState } from 'react'
import { SettingsContext } from '../contexts/SettingsContext'

//  Images
import playSound from '../_img/playSound.png'
import pauseBtn from '../_img/pause-button.svg'

const PhraseBtns = ({
  getNewIndex,
  changeIndex,
  handlePlayPause,
  isPaused,
  setIsPaused,
}) => {
  const {
    currentBlobs,
    checkAutoPlay,
    tabName,
    startAutoplay,
    setStartAutoplay,
    audioEl,
    handleAddFadeIn,
    isPlaying,
    setIsPlaying,
  } = useContext(SettingsContext)

  const [autoplayTimeout, setAutoplayTimeout] = useState(null)

  window.onkeydown = e => {
    if (
      tabName === 'phrases' &&
      (e.key === 'ArrowRight' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown')
    ) {
      // console.log(e.key)
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          {
            clearTimeout(autoplayTimeout)
            setAutoplayTimeout(null)
            changeIndex(getNewIndex(1))
          }
          break
        case 'ArrowLeft':
        case 'ArrowDown':
          {
            clearTimeout(autoplayTimeout)
            setAutoplayTimeout(null)
            changeIndex(getNewIndex(-1))
          }
          break
      }
    }
  }

  useEffect(() => {
    const startBtn = document.querySelector('.audioBtn') //  audio icon btn
    if (startAutoplay) {
      continueAutoPlay()
      if (startBtn) startBtn.setAttribute('disabled', true)
    } else {
      clearTimeout(autoplayTimeout)
      setAutoplayTimeout(null)
      handleAddFadeIn()
      audioEl.onended = () => {
        // console.log(`setIsPlaying: ${setIsPlaying}`)
        setIsPlaying(false)
        setIsPaused(false)
      }
      if (startBtn) startBtn.removeAttribute('disabled')
      //  The normal fadeIn time will apply when autoplay is stopped
    }

    function continueAutoPlay() {
      audioEl.play()
      // setIsPlaying(true)
      //  'if (startAutoPlay)' is not needed here
      handleAddFadeIn()
      audioEl.onended = () => {
        // console.log(audioEl.duration * 1000)
        setIsPlaying(false)
        setIsPaused(false)
        setAutoplayTimeout(
          setTimeout(() => {
            // console.warn("1st timeout!!!")
            //  Show hidden text for one second before moving on
            ;['english', 'phonetic', 'phraseText'].forEach(text => {
              // console.log(document.querySelector(`.${text}`))
              const el = document.querySelector(`.${text}`)
              if (el) {
                el.classList.add('fadeIn')
                el.classList.remove('showTextBackground')
              }
  
            })
            
            clearTimeout(autoplayTimeout)
            setAutoplayTimeout(
              setTimeout(() => {
                // console.error("2nd timeout!!!")
                handleAddFadeIn()
                //  an extra second or so to read text
                // console.log('Start Auto Play: ' + startAutoplay)
                document.getElementById('next').click()
              }, 2000)
            )
          }, audioEl.duration * 1000)
        )
      }
    }
  }, [startAutoplay])

  useEffect(() => {
    if (currentBlobs && currentBlobs.length > 0) {

      audioEl.src = URL.createObjectURL(currentBlobs[0].blob)

      if (checkAutoPlay && tabName === 'phrases') {
        audioEl.play()
        if (!startAutoplay) setIsPlaying(true)
      }
    }
  }, [currentBlobs])

  return (
    <div className="button-container noSelect">
      <button
        id="back"
        className="button"
        onClick={() => {
          clearTimeout(autoplayTimeout)
          changeIndex(getNewIndex(-1))
        }}
      >
        Back
      </button>

      {checkAutoPlay && (
        <button
          id="startBtn"
          className="button"
          onClick={() => setStartAutoplay(prev => !Boolean(prev))}
        >
          {startAutoplay ? 'Stop' : 'Start'}
        </button>
      )}

      {/* <button className="button">
        <Timer />
      </button> */}
      <button
        className={'audioBtn button'}
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

      <button
        id="next"
        className="button"
        onClick={() => {
          clearTimeout(autoplayTimeout)
          changeIndex(getNewIndex(1))
        }}
      >
        Next
      </button>
    </div>
  )
}

export default PhraseBtns
