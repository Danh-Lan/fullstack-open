import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const [blogVisible, setBlogVisible] = useState(false)
  
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleUpdateLikes = async () => {
    const blogToUpdate ={
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    try {
      const updatedBlog = await blogService.update(blog.id, blogToUpdate)
      updateBlog(updatedBlog)
    } catch (error) {
      console.error('Error updating blog:', error)
    }
  }

  const handleRemoveBlog = async () => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        await blogService.remove(blog.id)
        removeBlog(blog.id)
      }
    } catch (error) {
      console.error('Error removing blog:', error)
    }
  }
  
  return (
    blogVisible ? (
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={() => setBlogVisible(false)}>hide</button><br/>
        {blog.url}<br/>
        likes {blog.likes} <button onClick={handleUpdateLikes}>like</button><br/>
        {blog.user.name}<br/>
        {(user.name === blog.user.name) && <button onClick={handleRemoveBlog}>remove</button>}
      </div>
    ) : (
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={() => setBlogVisible(true)}>show</button>
      </div>
    )
  )
}

export default Blog