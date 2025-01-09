import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import usersService from '../services/users'

const UsersView = () => {
  const [users, setUsers] = useState(null)

  useEffect(() => {
    usersService.getUsers().then(res => setUsers(res))
  }, [])

  if (!users) {
    return <div>loading user...</div>
  }

  return (
    <div>
      <h2 className='text-xl font-bold'>Users</h2>
      <table className='table'>
        <thead>
          <tr>
            <td></td>
            <td className='font-bold'>blogs created</td>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className='link'>
                <Link to={user.id}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersView
