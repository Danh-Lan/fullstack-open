const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByTestId('login-button').click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByTestId('form-title').fill(title)
  await page.getByTestId('form-author').fill(author)
  await page.getByTestId('form-url').fill(url)
  await page.getByTestId('create').click()
}

export { loginWith, createBlog }