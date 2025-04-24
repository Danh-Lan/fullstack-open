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
        title={title}
        author={author}
        url={url}
        handleTitleChange={({ target }) => setTitle(target.value)}
        handleAuthorChange={({ target }) => setAuthor(target.value)}
        handleUrlChange={({ target }) => setUrl(target.value)}
        handleSubmit={handleCreateBlog}
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
  const sortBlogs = (blogA, blogB) => { 
    return blogB.likes - blogA.likes 
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      const sortedBlogs = blogs.sort(sortBlogs)
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

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    try {
      const createdBlog = await blogService.create({
        title, author, url
      })

      setBlogs([...blogs, createdBlog].sort(sortBlogs))
      setTitle('')
      setAuthor('')
      setUrl('')
      blogFormRef.current.toggleVisibility()
      
      notifyWith(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
    } catch (exception) {
      notifyWith(`error with the server, please try again`, true)
      console.log('error :', exception.message)
    }
  }

  const updateBlog = (updatedBlog) => {
    const updatedBlogs = blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
    updatedBlogs.sort(sortBlogs)
    setBlogs(updatedBlogs)
  }

  const removeBlog = (blogId) => {
    const blogsAfterRemove = blogs.filter(blog => blog.id !== blogId)
    blogsAfterRemove.sort(sortBlogs)
    setBlogs(blogsAfterRemove)
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
      <p>{user.name} logged in<button onClick={handleLogout}>logout</button></p>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} 
          blog={blog}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
          user={user}
        />
      )}
    </div>
  )
}

export default App