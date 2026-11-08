import React from 'react'

function OfflineMsg({showModal, setShowModal}) {
  return (
    <div className={`offlineMsg ${showModal ? 'show' : ''}`} onClick={() => setShowModal(false)}>
      Go back online to<br/>report this error
    </div>
  )
}

export default OfflineMsg
