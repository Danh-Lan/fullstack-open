import { useState } from 'react'

const Blog = ({ blog }) => {
  const [blogVisible, setBlogVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  
  return (
    blogVisible ? (
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={() => setBlogVisible(false)}>hide</button><br/>
        {blog.url}<br/>
        likes {blog.likes} <button>like</button><br/>
        {blog.user.name}<br/>
      </div>
    ) : (
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={() => setBlogVisible(true)}>show</button>
      </div>
    )
  )
}

export default Blog