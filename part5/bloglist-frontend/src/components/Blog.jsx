import { useState } from 'react'

const Blog = ({ blog, handleLikeBlog, handleRemoveBlog, user }) => {
  const [blogVisible, setBlogVisible] = useState(false)
  
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  
  return (
    <div data-testid='blog' style={blogStyle} className='blog'>
      <div>
        <span data-testid="title">{blog.title}</span>{' '}
        <span data-testid="author">{blog.author}</span>
        <button data-testid='toggle-visibility' type='button' onClick={() => setBlogVisible(!blogVisible)}>
          {blogVisible ? 'hide' : 'show'}
        </button>
      </div>
      {blogVisible && (
        <div>
          <span data-testid="url">{blog.url}</span><br />
          <span data-testid="likes">likes {blog.likes}</span><button data-testid='like-button' type='button' onClick={() => handleLikeBlog(blog)}>like</button><br />
          {blog.user.name}<br />
          {(user.name === blog.user.name) && <button onClick={() => handleRemoveBlog(blog)}>remove</button>}
        </div>
      )}
    </div>
  )
}

export default Blog