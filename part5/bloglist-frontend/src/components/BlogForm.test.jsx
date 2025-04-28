import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test.only('<BlogForm /> calls the event handler correctly when submit create blog', async () => {
  const handleCreateBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm handleCreateBlog={handleCreateBlog} />)

  const titleInput = screen.getByPlaceholderText('write title')
  const authorInput = screen.getByPlaceholderText('write author')
  const urlInput = screen.getByPlaceholderText('write url')

  const title = 'random title'
  const author = 'random author'
  const url = 'random url'

  const sendButton = screen.getByTestId('create')

  await user.type(titleInput, title)
  await user.type(authorInput, author)
  await user.type(urlInput, url)
  await user.click(sendButton)

  expect(handleCreateBlog.mock.calls).toHaveLength(1)
  expect(handleCreateBlog.mock.calls[0][0].title).toBe(title)
  expect(handleCreateBlog.mock.calls[0][0].author).toBe(author)
  expect(handleCreateBlog.mock.calls[0][0].url).toBe(url)
})