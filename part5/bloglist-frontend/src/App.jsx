import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [notification, setNotification] = useState({ message: null})

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm 
        handleCreateBlog={handleCreateBlog}
      />
    </Togglable>
  )

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // sort blogs by descending order of likes
  const sortBlogsByLikes = (blogA, blogB) => { 
    return blogB.likes - blogA.likes 
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      const sortedBlogs = blogs.sort(sortBlogsByLikes)
      setBlogs(sortedBlogs)
    }

    fetchBlogs()
  }, [])

  const notifyWith = (message, isError = false) => {
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification({ message: null })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notifyWith(`welcome ${user.name}`)
    } catch (exception) {
      notifyWith(`wrong username or password`, true)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setUsername('')
    setPassword('')
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const handleCreateBlog = async (blog) => {
    try {
      const createdBlog = await blogService.create(blog)

      setBlogs([...blogs, createdBlog].sort(sortBlogsByLikes))
      blogFormRef.current.toggleVisibility()
      
      notifyWith(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
    } catch (exception) {
      notifyWith(`error with the server, please try again`, true)
      console.log('error :', exception.message)
    }
  }

  const handleLikeBlog = async (blog) => {
    const blogToUpdate ={
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    try {
      const updatedBlog = await blogService.update(blog.id, blogToUpdate)
      setBlogs((prevBlogs) => {
        const updatedBlogs = prevBlogs.map(b => b.id === updatedBlog.id ? updatedBlog : b)
        return updatedBlogs.sort(sortBlogsByLikes)
      })
    } catch (error) {
      console.error('Error updating blog:', error)
    }
  }

  const handleRemoveBlog = async (blog) => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        await blogService.remove(blog.id)

        const blogsAfterRemove = blogs.filter(b => b.id !== blog.id)
        setBlogs(blogsAfterRemove)
      }
    } catch (error) {
      console.error('Error removing blog:', error)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>{user.name} logged in<button data-testid='logout-button' onClick={handleLogout}>logout</button></p>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id}
          blog={blog}
          handleLikeBlog={handleLikeBlog}
          handleRemoveBlog={handleRemoveBlog}
          user={user}
        />
      )}
    </div>
  )
}

export default App