import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'
import CreateBlogForm from './CreateBlogForm'

test('new blog event handler receives the correct info from form', async () => {
  const handleCreate = vi.fn()

  render(<CreateBlogForm onCreate={handleCreate} />)

  const user = userEvent.setup()
  await user.type(
    screen.getByPlaceholderText('write blog title here'),
    '10 Biggest Rockets'
  )
  await user.type(screen.getByPlaceholderText('write blog author here'), 'Elon Musk')
  await user.type(screen.getByPlaceholderText('write blog url here'), 'spacex.com')
  await user.click(screen.getByRole('button', { name: 'create' }))

  expect(handleCreate.mock.calls[0]).toEqual([
    '10 Biggest Rockets',
    'Elon Musk',
    'spacex.com'
  ])
})
