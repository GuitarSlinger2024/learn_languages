import { readFile, writeFileSync, existsSync, readdirSync } from 'fs'
import {fileURLToPath} from 'url';
import express from 'express'

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express()
//  Starting with Node.js 20.11 / 21.2, you can use
const __dirname = import.meta.dirname
// serve up production assets
app.use(express.static('client/build'))
// let the react app to handle any unknown routes
// serve up the index.html if express does'nt recognize the route

import cors from 'cors'
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import path from 'path'

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})

app.post('/get_languages', async (req, res) => {
  const directories = listDirectories('./audio').map(dir => capitalizeFirstLetter(dir))
  // directories.forEach(element => {
    
  // });
  res.send(directories);
})

function listDirectories(pth) {
  return readdirSync(pth, {withFileTypes: true})
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

// Source - https://stackoverflow.com/a/1026087
// Posted by Steve Harrison, modified by community. See post 'Timeline' for change history
// Retrieved 2026-11-07, License - CC BY-SA 4.0

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}


app.post(`/getBlob/:lingo/:title`, (req, res) => {
  const title = req.params.title + '.mp3'
  const language = req.params.lingo
  const folder = title.split('_clipId-')[0]

  const url = `./audio/${req.params.lingo}/${folder}/${title}`

  readFile(url, (err, data) => {
    if (err) {
      console.error('Error reading file:', err)
      return
    }
    res.send(data)
  })
})

app.post('/get_phrase_errors/:lingo', (req, res) => {
  const url = `./report_error/${req.params.lingo}_errorLog.json`
  const exists = existsSync(url)
  if (!exists) {
    writeFileSync(url, JSON.stringify([]))
  }

  readFile(url, 'utf8', function (err, data) {
    if (err) {
      // error handling
    }
    const jsonData = JSON.parse(data)
    res.send(jsonData)
  })
})

app.post('/report_error/:id/:iserror/:lingo', (req, res) => {
  console.log(req.params)
  const id = +req.params.id
  // // const path = path.resolve('client', 'src', 'scripts', '_database.json')
  const url = `./report_error/${req.params.lingo}_errorLog.json`
  readFile(url, 'utf8', function (err, data) {
    if (err) {
      // error handling
    }
    const jsonData = JSON.parse(data)
    const index = jsonData.findIndex(phrase => {
      console.log(phrase)
      return phrase && +phrase.phraseId === +id
    })

    if (index < 0)
      jsonData.push({
        phraseId: req.params.id,
      })
    else if (req.params.iserror !== 'true') delete jsonData[index]

    const newData = jsonData
      .filter(data => data)
      .sort((a, b) => +a.phraseId - +b.phraseId)
    writeFileSync(url, JSON.stringify(newData), 'utf8')
    res.send({ params: req.params, newData: newData, index: index })
  })
})

// if not in production use the port 5000
const PORT = process.env.PORT || 5001
app.listen(PORT, () =>
  console.log('server started at:', `http://localhost:${PORT}`)
)
