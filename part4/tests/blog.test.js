const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const emptyList = []

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const listWithMultipleBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]


test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes(emptyList), 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5)
  })

  test('of a bigger list is calculated right', () => {
    assert.strictEqual(listHelper.totalLikes(listWithMultipleBlogs), 36)
  })
})

describe('blog with most likes', () => {
  test('of empty list is empty', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(emptyList), {})
  })

  test('when list has only one blog, equals that blog', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(listWithOneBlog), listWithOneBlog[0])
  })

  test('of a bigger list is calculated right', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(listWithMultipleBlogs), listWithMultipleBlogs[2])
  })
})

describe('author with most blogs', () => {
  test('of empty list is empty', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(emptyList), {})
  })

  test('when list has only one blog, return the author and blog count of 1', () => {
    const expectedResult = {
      author: 'Edsger W. Dijkstra',
      blogs: 1
    }
    assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), expectedResult)
  })
  
  test('of a bigger list is calculated right', () => {
    const expectedResult = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    assert.deepStrictEqual(listHelper.mostBlogs(listWithMultipleBlogs), expectedResult)
  })
})

describe('author with most likes', () => {
  test('of empty list is empty', () => {
    assert.deepStrictEqual(listHelper.mostLikes(emptyList), {})
  })

  test('when list has only one blog, return the author and likes count of that blog', () => {
    const expectedResult = {
      author: 'Edsger W. Dijkstra',
      likes: 5
    }

    assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), expectedResult)
  })

  test('of a bigger list is calculated right', () => {
    const expectedResult = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }

    assert.deepStrictEqual(listHelper.mostLikes(listWithMultipleBlogs), expectedResult)
  })
})