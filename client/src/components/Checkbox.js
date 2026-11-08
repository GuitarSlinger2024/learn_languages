//      The docs for reactjs-stylesheet can be found at:
//      https://www.npmjs.com/package/reactjs-stylesheet#reactjs-stylesheet

import Stylesheet from 'reactjs-stylesheet'
import goldCheck from '../_img/gold.png'
import blackCheck from '../_img/black.png'

const Checkbox = ({
  label,
  mode,
  checked,
  setChecked,
  showBox = 'block',
  radio = [],
  showNewMsg = null,
  setCurrentListName = null,
  name,
  uncheckFavorites,
  onclick
}) => {
  // const [showCheckbox, setShowCheckbox] = useState(true)
  function toggle() {
    if (showNewMsg) {
      showNewMsg()
      uncheckFavorites(name === 'favorites' ? 'all' : name)
      return
    }
    
    if (onclick) onclick()

    //       RETURN if showNewMsg !== null
    //    So far this is only used for the favorites radio btn

    //  This condition checks if it is a radio btn
    if (radio.length > 0) {
      if (setCurrentListName) setCurrentListName(name)
      //  RETURN if it is a radio btn && already checked
      if (checked) return
      //  Reset other checkboxes
      radio.forEach(box => box(false))
    }

    //  Set new checked value
    setChecked(!checked)
  }

  return (
    <div
      style={styles.container}
      // onChange={toggle}
      onClick={toggle}
      className="checkbox noSelect"
    >
      <div style={{...styles.box, display: showBox}}>
        {checked && (
          <img
            src={mode !== 'dark' ? blackCheck : goldCheck}
            alt="check"
            style={styles.img}
          />
        )}
      </div>
      <label
        style={{...styles.label, marginLeft: showBox === 'none' ? '.4em' : '0'}}
        className="checkbox"
      >
        {label}
      </label>
    </div>
  )
}

export default Checkbox

const styles = Stylesheet.create({
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    inlineSize: 'fit-content',
    userSelect: 'none',
  },
  box: {
    position: 'relative',
    boxSizing: 'border-box',
    border: '1px solid black',
    marginInlineEnd: ' .5em',
    blockSize: '1em',
    inlineSize: '1em'
  },
  img: {
    position: 'absolute',
    inlineSize: '170%',
    top: '-.4em',
    left: '-.25em',
  },
  label: {
    userSelect: 'none',
    whiteSpace: 'nowrap',
    lineHeight: 0.5,
  },
})
