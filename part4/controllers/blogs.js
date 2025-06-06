const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  // response.json will automatically call toJSON method in the model
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }
  
  if (!body.likes) {
    body.likes = 0
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)

  await user.save()

  const responseData = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })

  response.status(201).json(responseData)
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const blog = await Blog.findById(request.params.id)
  
  if (!blog) {
    return response.status(404).end()
  }

  blog.likes = likes
  await blog.save()

  const updatedBlog = await Blog.findById(blog.id).populate('user', { username: 1, name: 1 })

  response.json(updatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  
  await Blog.findByIdAndDelete(request.params.id)
  
  user.blogs = user.blogs.filter((blogId) => {
    return blogId.toString() !== request.params.id
  })
  await user.save()

  response.status(204).end()
})

module.exports = blogsRouter