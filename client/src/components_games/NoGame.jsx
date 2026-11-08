import '../styles/games.css'
import { useContext, useState } from 'react'
import { SettingsContext } from '../contexts/SettingsContext'

export default function Games({ language }) {
  const { tabName } = useContext(SettingsContext)

  console.log({ language, tabName })

  return (
    <div
      className={`tab-content-3 tab-div ${
        tabName !== 'games' || language === 'Chinese' ? 'hidePage' : ''
      }`}>
      <h1 style={{lineHeight: 1}}>{language} Word Games</h1>
      <h3 style={{textDecoration: 'underline', marginBottom: '1em'}}>Currently Under Construction</h3>
      <h3 className='no-game-text'>The only games that are worked out so far are for Chinese / Mandarin.</h3>
    </div>
  )
}
