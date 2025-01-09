import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'
import Blog from './Blog'

test('title and author rendered, url or likes not rendered by default', async () => {
  render(
    <Blog
      blog={{
        title: 'The 10 Most Big Rockets',
        author: 'Elon Musk',
        url: 'spacex.com',
        likes: 10,
        user: { name: 'KoalaIsBird' }
      }}
    />
  )

  screen.getByText('The 10 Most Big Rockets Elon Musk')
  expect(screen.queryByText('likes 10', { exact: false })).toBeNull()
  expect(screen.queryByText('spacex.com', { exact: false })).toBeNull()
})

test('url and likes are shown when button has been clicked', async () => {
  render(
    <Blog
      blog={{
        title: 'The 10 Most Big Rockets',
        author: 'Elon Musk',
        url: 'spacex.com',
        likes: 10,
        user: { name: 'KoalaIsBird' }
      }}
    />
  )

  const user = userEvent.setup()

  const button = screen.getByRole('button', { name: 'view' })
  await user.click(button)

  await screen.findByText('likes 10', { exact: false })
  await screen.findByText('spacex.com', { exact: false })
})

test('if like button is clicked twice, onlike is called twice', async () => {
  const handleLike = vi.fn()

  render(
    <Blog
      blog={{
        title: 'The 10 Most Big Rockets',
        author: 'Elon Musk',
        url: 'spacex.com',
        likes: 10,
        user: { name: 'KoalaIsBird' }
      }}
      onLike={handleLike}
    />
  )

  const user = userEvent.setup()

  await user.click(screen.getByRole('button', { name: 'view' }))

  const likeButton = screen.getByRole('button', { name: 'like' })
  await user.click(likeButton)
  await user.click(likeButton)

  expect(handleLike.mock.calls.length).equals(2)
})
