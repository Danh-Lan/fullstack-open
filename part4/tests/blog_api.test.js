const bcrypt = require('bcryptjs')
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    await User.deleteMany({})

    // create a user
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

    // login to get the token
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    token = loginResponse.body.token
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs contain id', async () => {
    const blogs = await helper.blogsInDb()

    for (let blog of blogs) {
      assert(blog.hasOwnProperty('id'))
    }
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'New Blog',
        author: "Author",
        url: "https://example.com",
        likes: 4,
      }
  
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const blogsAtEnd = await helper.blogsInDb()
      assert(blogsAtEnd.length === helper.initialBlogs.length + 1)
  
      // check that the new blog is in the response and is the same as newBlog
      const createdBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
  
      assert(createdBlog)
      assert(createdBlog.title === newBlog.title)
      assert(createdBlog.author === newBlog.author)
      assert(createdBlog.url === newBlog.url)
      assert(createdBlog.likes === newBlog.likes)
    })

    test('without likes, default the like to 0', async () => {
      const newBlog = {
        title: 'New Blog without likes',
        author: "New Author",
        url: "https://example.com"
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      const createdBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
      assert(createdBlog.likes === 0)
    })

    test(`fails with status code 400 if there's no title`, async () => {
      const newBlogWithoutTitle = {
        author: "New Author",
        url: "https://example.com",
        likes: 0
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogWithoutTitle)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert(blogsAtEnd.length === helper.initialBlogs.length)
    })

    test(`fails with status code 400 if there's no url`, async () => {
      const newBlogWithoutUrl = {
        title: 'New Blog',
        author: 'New author',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogWithoutUrl)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert(blogsAtEnd.length === helper.initialBlogs.length)
    })

    test('fail with status code 401 if there is no auth token', async () => {
      const newBlog = {
        title: 'New Blog',
        url: "https://example.com",
      }
  
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })
  })

  describe('update of a blog', () => {
    test('the amount of likes', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updatedLikes = 2000

      const updatedBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...blogToUpdate, likes: updatedLikes })
        .expect(200)

      assert(updatedBlog.body.likes === updatedLikes)
    })

    test('fails 404 if blog does not exist', async () => {
      const badId = await helper.nonExistingId()

      await api
        .put(`/api/blogs/${badId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(helper.initialBlogs[0])
        .expect(404)
    })
  })

  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert(blogsAtEnd.length === blogsAtStart.length - 1)

    assert(!blogsAtEnd.some(blog => blog.id === blogToDelete.id))
  })
})

after(async () => {
  await mongoose.connection.close()
})