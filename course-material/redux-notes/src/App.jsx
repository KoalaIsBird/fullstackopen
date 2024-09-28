import { useDispatch } from 'react-redux'
import NewNote from './components/NewNote.jsx'
import Notes from './components/Notes.jsx'
import VisibilityFilter from './components/VisibilityFilter.jsx'
import { useEffect } from 'react'
import { initializeNotes, setNotes } from './reducers/noteReducer.js'
import noteService from './services/notes.js'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeNotes())
  }, [])

  return (
    <div>
      <NewNote />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}

export default App
