const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helpers = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helpers.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs contain id', async () => {
  const response = await api.get('/api/blogs')
  for (let blog of response.body) {
    assert(blog.hasOwnProperty('id'))
  }
})

test('create a new blog sucessfully', async () => {
  const newBlog = {
    title: 'New Blog',
    author: "Author",
    url: "https://example.com",
    likes: 4,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  assert(response.body.length === helpers.initialBlogs.length + 1)

  const createdBlog = response.body.find(blog => blog.title === newBlog.title)

  assert(createdBlog)
  assert(createdBlog.title === newBlog.title)
  assert(createdBlog.author === newBlog.author)
  assert(createdBlog.url === newBlog.url)
  assert(createdBlog.likes === newBlog.likes)
})

test('new blog without likes, default the like to 0', async () => {
  const newBlog = {
    title: 'New Blog without likes',
    author: "New Author",
    url: "https://example.com"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const createdBlog = response.body.find(blog => blog.title === newBlog.title)

  assert(createdBlog.likes === 0)
})

test('new blog without title should get 400 Bad Request', async () => {
  const newBlogWithoutTitle = {
    author: "New Author",
    url: "https://example.com",
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlogWithoutTitle)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert(response.body.length === helpers.initialBlogs.length)
})

test('new blog without url should get 400 Bad Request', async () => {
  const newBlogWithoutUrl = {
    title: 'New Blog',
    author: 'New author',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlogWithoutUrl)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert(response.body.length === helpers.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})