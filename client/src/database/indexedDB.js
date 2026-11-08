const versNum = 11

export async function indexedDBinit(
  loading,
  setLoading,
  setProgBarWidth,
  setPercent,
  setErrorMsg
) {
  console.log(
    '%cInitializing Database',
    'font-size: 15px;font-weight: 900;color: green',
    { languageChoice: window.languageChoice }
  )
  //  Handle indexedDB
  const indexedDB = window.indexedDB || window.webkitIndexedDB //  || window.msIndexedDB || window.mozIndexedDB ||window.shimIndexedDB

  // Open (or create) the database
  const request = indexedDB.open(`learn${window.languageChoice}`, versNum)

  request.onerror = function (event) {
    setErrorMsg('An error occurred with IndexedDB')
    console.error('An error occurred with IndexedDB')
    console.error(event)
  }

  // Create the schema on create and version upgrade
  request.onupgradeneeded = async function () {
    const db = request.result
    //  store is like a table or collection
    const dataStore = db.createObjectStore('phraseData', {
      keyPath: 'phraseId',
    })
    //  Create indexes to query
    dataStore.createIndex(
      window.languageChoice.toLowerCase(),
      [window.lingoAbbr],
      {
        unique: false,
      }
    )
    dataStore.createIndex('english', ['eng'], { unique: false })

    //  store is like a table or collection
    const blobStore = db.createObjectStore('blobData', { keyPath: 'title' })
    //  Create indexes to query
    blobStore.createIndex(
      window.languageChoice.toLowerCase(),
      [window.languageChoice.toLowerCase()],
      { unique: false }
    )
  }

  request.onsuccess = function () {
    console.log('Database opened successfully')

    const db = request.result

    db.onerror = e => {
      console.error('Error loading database')
      console.log(e)
    }
    //  transactions (used to create 'store') happen all at once - if one fails they
    // all fail  Example: removing data won't happen if it fails to store somewhere
    // else  Multibple transactins can be created to group actions that MUST pass or
    // fail all together
    const transaction = db.transaction('phraseData', 'readwrite')
    const store = transaction.objectStore('phraseData')

    // Add some data - extra data items can be added but can't be queried without
    // a query index
    const checkDatabase = store.count()
    checkDatabase.onsuccess = function () {
      //  Do this if data needs to be added
      if (checkDatabase.result < window.PHRASE_DATA.length) {
        console.log('Adding data', {
          'Already in database:': checkDatabase.result,
          'PHRASE_DATA.length:': window.PHRASE_DATA.length,
        })

        //  Add to the phraseData store
        window.PHRASE_DATA.forEach(async (phrase, i) => {
          store.put(phrase)
          // console.log(phrase)
        })

        //  This data is used in the progress bar
        setLoading(window.PHRASE_DATA.length)

        let count = 0
        window.PHRASE_DATA.forEach(async (phrase, i) => {
          //  Add to the phraseData store
          const clip = phrase.vocals[0]
          const title = clip.title
          const english = phrase.eng
          const phonetic = phrase.phon
          const phraseText = phrase[window.lingoAbbr]

          if (i < 3) {
            console.log('%cphrase', 'font-size:15px;font-weight:700', {
              clip,
              title,
              english,
              phonetic,
              phraseText,
            })
          }

          //  Fetch the audio for storing in indexedDB
          setTimeout(() => {
            fetch(`/getBlob/${window.languageChoice}/${title}`, {
              method: 'POST',
            })
              .then(data => data.blob())
              .then(async blob => {
                count++
                setPercent(
                  ((count / +window.PHRASE_DATA.length) * 100).toFixed(2)
                )
                setProgBarWidth((count / +window.PHRASE_DATA.length) * 100)
                storeBlob(blob, title, english, phonetic, phraseText)
                if (loading && count === window.PHRASE_DATA.length)
                  setLoading(false)
                if (i === window.PHRASE_DATA.length - 1) {
                  transaction.oncomplete = function () {
                    db.close()
                  }
                }
              })
              .catch(error => {
                if (typeof error.json === 'function') {
                  error
                    .json()
                    .then(jsonError => {
                      console.log('Json error from API')
                      console.log(jsonError)
                    })
                    .catch(genericError => {
                      console.log('Generic error from API')
                      console.log(error.statusText)
                    })
                } else {
                  console.log('Fetch error')
                  console.log(error)
                }
              })
          }, 200 * i)
        })
      } else {
        console.log(`Data is already there: ${checkDatabase.result} Items`)
        setLoading(false)
      }

      // transaction.oncomplete = function () {
      //   db.close()
      // }
    }
  }

  function storeBlob(blob, title, english, phonetic, phraseText) {
    const blobObj = {
      blob,
      title,
      english,
      phonetic,
      [window.languageChoice.toLowerCase()]: phraseText,
    }

    const indexedDB =
      window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB
    const request = indexedDB.open(`learn${window.languageChoice}`, versNum)

    request.onsuccess = function () {
      const db = request.result
      const transaction = db.transaction('blobData', 'readwrite')
      const store = transaction.objectStore('blobData')
      //  This check if blob exists is probably not necessary
      const idQuery = store.get(blobObj[window.languageChoice.toLowerCase()])
      idQuery.onsuccess = () => {
        const result = idQuery.result
        if (result === undefined) store.put(blobObj)
      }
      transaction.oncomplete = function () {
        db.close()
      }
    }
  }
}

// Query the blob table
export async function getBlob({ title, phraseText, setCurrentBlobs }) {
  console.log({
    title,
    phraseText,
    languageChoice: window.languageChoice,
  })
  const indexedDB =
    window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB
  const request = indexedDB.open(`learn${window.languageChoice}`, versNum)
  request.onsuccess = function () {
    const db = request.result
    const transaction = db.transaction('blobData', 'readwrite')
    const store = transaction.objectStore('blobData')
    if (title) {
      console.log('getting by title')
      const idQuery = store.get(title)
      idQuery.onsuccess = () => success([idQuery.result])
    } else if (phraseText) {
      const chiIndex = store.index(window.languageChoice.toLowerCase())
      const idQuery = chiIndex.getAll([phraseText])
      //  Get index (query) reference(s)
      idQuery.onsuccess = () => success(idQuery.result)
    }

    function success(result) {
      setCurrentBlobs(result)
    }
    transaction.oncomplete = function () {
      db.close()
    }
  }
}

// Query the blob table
export async function returnBlob({ chinese }) {
  return new Promise((res, rej) => {
    const indexedDB =
      window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB
    const request = indexedDB.open(`learn${window.languageChoice}`, versNum)
    request.onsuccess = function () {
      const db = request.result
      const transaction = db.transaction('blobData', 'readwrite')
      const store = transaction.objectStore('blobData')
      if (chinese) {
        console.log('getting by character - ' + chinese)
        const chiIndex = store.index('chinese')
        const idQuery = chiIndex.getAll([chinese])
        //  Get index (query) reference(s)
        idQuery.onsuccess = () => success(idQuery.result)
      }

      function success(result) {
        console.log('Blob', result)
        // if (setBlobs) setBlobs(result)
        //  else
        res(result)
      }
      transaction.oncomplete = function () {
        db.close()
      }
    }
  })
}

// Query the index
export function getByIndex(index) {
  console.log('Get by index: ' + index)
  const indexedDB = window.indexedDB || window.webkitIndexedDB
  const request = indexedDB.open(`learn${window.languageChoice}`, versNum)
  request.onsuccess = function () {
    const db = request.result
    const transaction = db.transaction('phraseData', 'readwrite')
    const store = transaction.objectStore('phraseData')
    const idQuery = store.get(index)
    idQuery.onsuccess = function () {
      console.log(
        '%cGet by index',
        'text-decoration: underline;font-weight: 900;font-size: 15px',
        idQuery.result
      )
    }
    transaction.oncomplete = function () {
      db.close()
    }
  }
  request.onerror = e => {
    console.log('error')
    console.log(e)
  }
}

// Query the English Text
export function getByEnglish(text, setEnglish) {
  const indexedDB =
    window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB
  const request = indexedDB.open(`learn${window.languageChoice}`, versNum)
  request.onsuccess = function () {
    const db = request.result
    const transaction = db.transaction('phraseData', 'readwrite')
    const store = transaction.objectStore('phraseData')
    //  Get index (query) reference(s)
    const engIndex = store.index('english')
    const idQuery = engIndex.get([text])
    idQuery.onsuccess = function () {
      setEnglish(idQuery.result)
    }
    transaction.oncomplete = function () {
      db.close()
    }
  }
}

// Query the Chinese chars
export function getByCharacters(chars) {
  const indexedDB =
    window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB
  const request = indexedDB.open(`learn${window.languageChoice}`, versNum)
  request.onsuccess = function () {
    const db = request.result
    const transaction = db.transaction('phraseData', 'readwrite')
    const store = transaction.objectStore('phraseData')
    //  Get index (query) reference(s)
    const charIndex = store.index('chinese')
    const idQuery = charIndex.get([chars])
    idQuery.onsuccess = function () {
      console.log(
        '%cGet by character(s)',
        'text-decoration: underline;font-weight: 900;font-size: 15px',
        idQuery.result
      )
    }
    transaction.oncomplete = function () {
      db.close()
    }
  }
}
