const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helpers')

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')

    await request.post('/api/users', {
      data: {
        name: 'André Yurchenko',
        username: 'andrew',
        password: '12345',
      },
    })

    await page.goto('/')
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'andrew', '123')

    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('Wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('André Yurchenko logged in')).not.toBeVisible()
  })

  test('front page can be opened', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: 'Notes' })
    ).toBeVisible()
    await expect(
      page.getByText(
        'Note app, Department of Computer Science, University of Helsinki 2024'
      )
    ).toBeVisible()
  })

  test('can login', async ({ page }) => {
    await loginWith(page, 'andrew', '12345')

    await expect(page.getByText('André Yurchenko logged in')).toBeVisible()
  })

  describe('when logged in', async () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByTestId('username').fill('andrew')
      await page.getByTestId('password').fill('12345')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright')
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'another note by playwright')

        test('importance can be changed', async ({ page }) => {
          await page.getByRole('button', { name: 'make not important' }).click()
          await expect(page.getByText('make important')).toBeVisible()
        })
      })
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })

      test('one of those can be made nonimportant', async ({ page }) => {
        await page.pause()
        const secondNoteElement = await page.getByText('second note').locator('..')
        await secondNoteElement.getByRole('button', { name: 'make not important' }).click()
        await expect(secondNoteElement.getByText('make important')).toBeVisible()
      })
    })
  })
})

// test('a new note can be created', async ({ page }) => {

// })
