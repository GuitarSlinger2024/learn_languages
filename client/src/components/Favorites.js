import { useState } from 'react'
import goldStar from '../_img/gold_star.png'

const Favorites = ({ actualIndex, setFavorites, uncheckFavorites }) => {
  function toggleFavorite() {
    window.PHRASE_DATA[actualIndex].favorite =
      !window.PHRASE_DATA[actualIndex].favorite

    //  Get and set a new array of favorites
    const newFavorites = window.PHRASE_DATA.filter(
      clip => clip.favorite === true
    ).map(clip => clip.phraseId)
    console.log({ newFavorites })
    setFavorites(newFavorites)

    //  Do this IF isFav set to false
    if (!window.PHRASE_DATA[actualIndex].favorite) {
      //  Uncheck favorites IF there are no favorites left
      if (newFavorites.len === 0) {
        uncheckFavorites()
      }
    }
    console.log({ newFavorites })

    //  Fetch - send data to server
    localStorage.setItem(
      `${window.languageChoice}_favorites`,
      JSON.stringify(newFavorites)
    )
  }

  return (
    <div
      className={`gold-star phrase icon noSelect ${
        !window.PHRASE_DATA[actualIndex]?.favorite && 'not-this'
      }`}
      onClick={toggleFavorite}>
      <img
        src={goldStar}
        alt=""
      />
      <p>favorite</p>
    </div>
  )
}

export default Favorites
