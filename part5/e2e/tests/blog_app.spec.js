const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

const users = [
  {
    name: 'Saitama',
    username: 'admin',
    password: 'admin'
  },
  {
    name: 'King',
    username: 'user',
    password: 'user'
  }
]

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: users[0]
    })
    await request.post('http://localhost:3003/api/users', {
      data: users[1]
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = page.getByTestId('login-form')
    await expect(loginForm).toBeVisible()
  })

  describe('login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, users[0].username, users[0].password)

      await expect(page.getByText(`welcome ${users[0].name}`)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'hacker', 'password')

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, users[0].username, users[0].password)
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Playwright is great', 'David', '/playwright')

      await page.getByTestId('toggle-visibility').first().click()

      await expect(page.getByTestId('title').first()).toHaveText('Playwright is great')
      await expect(page.getByTestId('author').first()).toHaveText('David')
      await expect(page.getByTestId('url').first()).toHaveText('/playwright')
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Playwright is great', 'David', '/playwright')

      await page.getByTestId('toggle-visibility').first().click()

      await expect(page.getByTestId('likes').first()).toContainText('0')
      await page.getByTestId('like-button').first().click()
      await expect(page.getByTestId('likes').first()).toContainText('1')
    })

    test('only user who added a blog can delete it', async ({ page }) => {
      await createBlog(page, 'Playwright is great', 'David', '/playwright')

      await page.getByTestId('toggle-visibility').first().click()

      // need to define the action before clicking the button
      page.on('dialog', async (dialog) => {
        await dialog.accept()
      })

      await page.getByTestId('remove-blog-button').first().click()

      await expect(page.locator('blog')).toHaveCount(0)
    })

    test('only user who added a blog can see the delete button', async ({ page }) => {
      await createBlog(page, 'Playwright is great', 'David', '/playwright')

      await page.getByTestId('logout-button').click()

      await loginWith(page, users[1].username, users[1].password)

      await page.getByTestId('toggle-visibility').first().click()

      await expect(page.getByTestId('remove-blog-button').first()).not.toBeVisible()
    })

    test('blogs are ordered by likes', async ({ page }) => {
      await createBlog(page, 'Playwright is great', 'David', '/playwright')
      await createBlog(page, 'Cypress is great', 'David', '/cypress')

      const firstBlogLocator = page.locator('[data-testid="blog"]', { hasText: 'Playwright is great' })
      const secondBlogLocator = page.locator('[data-testid="blog"]', { hasText: 'Cypress is great' })

      await firstBlogLocator.getByTestId('toggle-visibility').click()
      await secondBlogLocator.getByTestId('toggle-visibility').click()

      // Like the first blog once
      await firstBlogLocator.getByTestId('like-button').click()
      await expect(firstBlogLocator.getByTestId('likes')).toContainText('1')

      // Like the second blog twice
      await secondBlogLocator.getByTestId('like-button').click()
      await expect(secondBlogLocator.getByTestId('likes')).toContainText('1')
      await secondBlogLocator.getByTestId('like-button').click()
      await expect(secondBlogLocator.getByTestId('likes')).toContainText('2')

      // Verify the blogs are ordered by likes
      await expect(page.getByTestId('blog').nth(0)).toContainText('Cypress is great')
      await expect(page.getByTestId('blog').nth(1)).toContainText('Playwright is great')
    })
  })
})