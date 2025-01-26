import { useMutation, useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import { CHANGE_BIRTH_YEAR, GET_AUTHORS } from './components/queries'
import Authors from './components/Authors'

function AuthorSelector(props) {
  if (props.loading) {
    return <div>loading authors...</div>
  }

  return (
    <select
      value={props.author ? props.author : 'no-selected'}
      onChange={({ target }) => props.setAuthor(target.value)}
    >
      <option disabled value='no-selected'>
        select an author
      </option>
      {props.allAuthors.map(a => (
        <option value={a.name} key={a.id}>
          {a.name}
        </option>
      ))}
    </select>
  )
}

const ChangeBirthYear = props => {
  const [author, setAuthor] = useState('')
  const [bornYear, setBornYear] = useState('')

  const [changeBornYear, { data }] = useMutation(CHANGE_BIRTH_YEAR)
  const { loading, data: authorsData } = useQuery(GET_AUTHORS)

  useEffect(() => {
    if (data && data.editAuthor === null) {
      alert('author does not exist')
    }
  }, [data])

  if (!props.show) {
    return null
  }

  const submit = async event => {
    event.preventDefault()
    changeBornYear({ variables: { name: author, birthYear: bornYear } })
    setBornYear('')
    setAuthor('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <AuthorSelector
          author={author}
          setAuthor={setAuthor}
          loading={loading}
          allAuthors={authorsData.allAuthors}
        />

        <div>
          born
          <input
            type='number'
            value={bornYear}
            onChange={({ target }) => setBornYear(parseInt(target.value))}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default ChangeBirthYear
