const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }
  
  const maxLike = Math.max(...blogs.map(blog => blog.likes))
  return blogs.find(blog => blog.likes === maxLike)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }
  
  const authors = _.groupBy(blogs, 'author')
  const authorWithMostBlogs = _.maxBy(Object.keys(authors), author => authors[author].length)

  return {
    author: authorWithMostBlogs,
    blogs: authors[authorWithMostBlogs].length
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  const authors = _.groupBy(blogs, 'author')
  const authorWithMostLikes = _.maxBy(Object.keys(authors), author => {
    // reuse the totalLikes function to calculate the total likes of each author
    return totalLikes(authors[author])
  })

  return {
    author: authorWithMostLikes,
    likes: totalLikes(authors[authorWithMostLikes])
  }
  
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}