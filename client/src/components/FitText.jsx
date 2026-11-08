import { useEffect, useContext } from 'react'
import { SettingsContext } from '../contexts/SettingsContext'

const FitText = ({ text, line, onClick, language, initialFontSize, initialMinEm, data, hideText }) => {

  // console.log({ text, line, onClick, language, initialFontSize, initialMinEm, data, hideText })
  //  This is used to set startAutoplay to false when a character definition is looked at. 
  const { setStartAutoplay } = useContext(SettingsContext)
  useEffect(() => {
    const anyDiv = document.querySelector(`.${line}`)
    anyDiv.classList.remove('split-line')

    //  Text is already added to the div, whick is always already in the DOM.
    let fontSize = initialFontSize || 1.8 //  this should be the initial em set in styles.css
    // console.log(initialFontSize)
    anyDiv.style.fontSize = `${fontSize}em`
    const divWidth = anyDiv.clientWidth
    const divScroll = anyDiv.scrollWidth
    // console.log('%here!', `font-size: ${fontSize}em`, divScroll, divWidth)
    if (divScroll > divWidth) {
      fontSize *= Number(divWidth) / Number(divScroll)
      anyDiv.style.fontSize = `${fontSize}em`

      //  font-size is too small, split into two lines with min font-size
      const minEm = initialMinEm || 1.25
      if (fontSize < minEm) {
        anyDiv.style.fontSize = `${minEm}em`
        anyDiv.classList.add('split-line')

        const divHeight = anyDiv.clientHeight
        const evenSmaller = 1.05
        // console.log('%c divHeight', 'font-size: 25px', divHeight)
        if (divHeight > 48) {
          anyDiv.style.fontSize = `${evenSmaller}em`
        }
      }
    }
  }, [text])

  function createCharSpans(text) {
    return [...text].map((char, index) => (
      <span
        key={index}
        className="chineseChar"
        onClick={() => {
          setStartAutoplay(false)
        }}
      >
        {char}
      </span>
    ))
  }

  return (
    <div
      className={`${line} ${language || ''} fit-my-Text noSelect`}
      onClick={onClick}
      data={data}
    >
      {language === 'chinese'
        ? createCharSpans(text)
        : text}
    </div>
  )
}

export default FitText
