import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import usersService from '../services/users'

const UserView = () => {
  const [user, setUser] = useState(null)
  const id = useParams().id

  useEffect(() => {
    usersService.getUser(id).then(res => setUser(res))
  }, [])

  if (!user) {
    return <div>loading users...</div>
  }

  return (
    <div>
      <h2 className='text-xl font-bold'>{user.name}</h2>
      <h3 className='font-semibold'>Added blogs:</h3>
      <ul className='list-disc list-inside'>
        {user.blogs.map(blog => (
          <li className='list-item' key={blog.id}>
            {blog.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserView
