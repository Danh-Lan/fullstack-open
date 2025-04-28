import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('blog only render title and author at the beginning', () => {
  const blog = {
    title: 'Blog',
    author: 'Bob',
    url: '/clickbait',
    likes: 0
  }

  render(<Blog blog={blog}/>)

  const titleElement = screen.getByTestId('title')
  const authorElement = screen.getByTestId('author')
  expect(titleElement).toHaveTextContent(blog.title)
  expect(authorElement).toHaveTextContent(blog.author)

  const urlElement = screen.queryByTestId('url')
  const likesElement = screen.queryByTestId('likes')
  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()
})

test('blog show also the url and likes if show button is clicked', async () => {
  const blog = {
    title: 'Blog',
    author: 'Bob',
    url: '/clickbait',
    likes: 0,
    user: { id: 0, name: 'Not important' }
  }

  const fakeUser = { name: 'Not important' }

  render(<Blog blog={blog} user={fakeUser}/>)

  const user = userEvent.setup()
  const button = screen.getByTestId('toggle-visibility')
  await user.click(button)

  const urlElement = screen.getByTestId('url')
  const likesElement = screen.getByTestId('likes')
  expect(urlElement).toHaveTextContent(blog.url)
  expect(likesElement).toHaveTextContent(blog.likes)
})

test('Click `like` button twice call `handleUpdateBlog` twice', async () => {
  const blog = {
    id: 0,
    title: 'Blog',
    author: 'Bob',
    url: '/clickbait',
    likes: 0,
    user: { id: 0, name: 'Not important' }
  }

  const fakeUser = { name: 'Does not matter' }
  const handleLikeBlog = vi.fn()

  render(<Blog blog={blog} handleLikeBlog={handleLikeBlog} user={fakeUser}/>)

  const user = userEvent.setup()
  const toggleVisibilityButton = screen.getByTestId('toggle-visibility')
  await user.click(toggleVisibilityButton)

  const likeButton = screen.getByTestId('like-button')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(handleLikeBlog.mock.calls).toHaveLength(2)
})