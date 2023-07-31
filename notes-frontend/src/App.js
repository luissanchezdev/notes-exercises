import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid';

import Note from './components/Note'
import Togglable from './components/Togglable';
import LoginForm from './components/Form';
import Notification from './components/Notification'
import noteService from './services/notes'
import './App.css'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const noteFormRef = useRef()

  useEffect(() => {
    noteService
      .getAll()
      .then( initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const addNote = (event) => {
    noteFormRef.current.toggleVisibility(false)
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    }
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  const toggleImportanceOf = (id) => {
    const note = notes.find( n => n.id === id )
    const changeNote = {...note, important: !note.important}
    
    noteService
      .update(id, changeNote)
      .then(returnedNote => {
        return setNotes(notes.map( note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(`the note '${note.content}' was already deleted from server`)
        setTimeout(() => {
          setErrorMessage(null)
        },5000)
        setNotes(notes.filter(n => n.id !== id))
      })
    
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification 
        errorMessage={errorMessage}
      />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div> 
      <ul>
        <ul>
          {notesToShow.map(note => {
            return (
              <Note 
                key={uuidv4()} 
                note={note} 
                toggleImportanceOf={() => toggleImportanceOf(note.id)}  
                errorMessage={errorMessage}
              />
            )
          }
            
          )}
        </ul>
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <div>
        <h3>Form example login</h3>
        <Togglable buttonLabel={'Example Form'} ref={ noteFormRef }>
          <LoginForm />
        </Togglable>
      </div>
    </div>
  )
}

export default App
