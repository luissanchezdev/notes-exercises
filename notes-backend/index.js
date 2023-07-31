const express = require('express')
const cors = require('cors')

let notes = [
  {
    id: 1,
    content: "HTML is easy and great",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]

const genId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
  return maxId + 1
}

const app = express()
app.use(cors())

// used: create new notes with post method
app.use(express.json())

// Allow that express verify first on build directory
app.use(express.static('build'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)


app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note  = notes.find( note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
    
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    id : genId(),
    content: body.content,
    important: body.important || false,
    date: new Date()
  }

  notes = notes.concat(note)
  response.json(note)
})

app.put('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const newNotes = notes.filter(note => note.id !== id)
  const oldNote = notes.find(note => note.id === id)

  if (oldNote !== undefined) {
    const updateNote = {...oldNote, important: !oldNote.important}
    notes = newNotes.concat(updateNote)
    return response.json(updateNote)
  } else {
    return response.status(400).json({
      error: "note not udpate"
    })
  }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter( note => note.id !== id)
    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)