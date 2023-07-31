import './Note.css'

const Note = ({ note, toggleImportanceOf, errorMessage }) => {
  return (
    <>
      <li className="note">{note.content}</li>
      <button onClick={toggleImportanceOf}>{note.important ? 'change to not important' : 'change to important'}</button>
    </>
  )
}

export default Note