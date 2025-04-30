const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

const user = {
  name: 'Saitama',
  username: 'admin',
  password: 'admin'
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: user 
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = page.getByTestId('login-form')
    await expect(loginForm).toBeVisible()
  })

  describe('login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, user.username, user.password)

      await expect(page.getByText(`welcome ${user.name}`)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'hacker', 'password')

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, user.username, user.password)
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
  })
})