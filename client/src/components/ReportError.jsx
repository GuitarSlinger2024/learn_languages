import redFlag from '../_img/red_flag.png'
import OfflineMsg from './OfflineMsg'
import { useState, useEffect } from 'react'

const ReportError = ({ actualIndex, clip }) => {
  const [isReported, setIsReported] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    console.warn('loading new actualIndex in the ReportError module')
    //  actualIndex and isReported are both initialized as null or false
    if (actualIndex) {
      setIsReported(clip.flagged || false)
    }
  }, [actualIndex])

  function toggleReported() {
    console.warn('toggle report error')
    const newFlagState = !Boolean(isReported)
    // setIsReported(newFlagState)
    if (!window.navigator.onLine) {
      //  Display 'You are currently off-line'
      setShowModal(true)
    } else {
      fetch(`/report_error/${clip.phraseId}/${newFlagState}/${window.languageChoice.toLowerCase()}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(data => data.json())
        .then(data => {
          setIsReported(data.params.iserror === 'true')
          clip.flagged = data.params.iserror === 'true'
        })
    }
  }

  return (
    <>
      <div
        className={`red-flag phrase icon noSelect ${!isReported && 'not-this'}`}
        onClick={() => {
          toggleReported()
        }}
      >
        <img
          src={redFlag}
          alt="report error"
        />
        <p>report error</p>
      </div>
      <OfflineMsg
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  )
}

export default ReportError
