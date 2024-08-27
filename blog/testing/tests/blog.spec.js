const { test, expect, beforeEach, describe } = require('@playwright/test')
const { likeBlog, getY } = require('./helpers.js')


describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                username: 'john',
                name: 'John Doe',
                password: '12345'
            }
        })
        await request.post('/api/users', {
            data: {
                username: 'koala',
                name: 'Koala Bird',
                password: '123'
            }
        })
        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByText('Log in to application')).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByText('Username').getByRole('textbox').fill('john')
            await page.getByText('Password').getByRole('textbox').fill('12345')
            await page.getByRole('button', { name: 'login' }).click()
            await expect(page.getByRole('button', { name: 'new blog' })).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByText('Username').getByRole('textbox').fill('john')
            await page.getByText('Password').getByRole('textbox').fill('12')
            await page.getByRole('button', { name: 'login' }).click()
            await expect(page.getByRole('button', { name: 'new blog' })).not.toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await page.getByText('Username').getByRole('textbox').fill('john')
            await page.getByText('Password').getByRole('textbox').fill('12345')
            await page.getByRole('button', { name: 'login' }).click()
        })

        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'new blog' }).click()

            await page.getByPlaceholder('write blog title here').fill('10 Best Rockets')
            await page.getByPlaceholder('write blog author here').fill('Elon Musk')
            await page.getByPlaceholder('write blog url here').fill('spacex.com')
            await page.getByRole('button', { name: 'create' }).click()

            await expect(page.getByText('10 Best Rockets Elon Musk')).toBeVisible()
            await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
        })

        describe('When a blog exists', () => {
            beforeEach(async ({ page }) => {
                await page.getByRole('button', { name: 'new blog' }).click()

                await page.getByPlaceholder('write blog title here').fill('10 Best Rockets')
                await page.getByPlaceholder('write blog author here').fill('Elon Musk')
                await page.getByPlaceholder('write blog url here').fill('spacex.com')
                await page.getByRole('button', { name: 'create' }).click()
            })

            test('a blog can be liked', async ({ page }) => {
                const blog = page.getByText('10 Best Rockets Elon Musk')
                await blog.getByRole('button', { name: 'view' }).click()
                await blog.getByRole('button', { name: 'like' }).click()

                await expect(blog.getByText('likes 1')).toBeVisible()
            })

            test('a blog can be deleted by logged in user', async ({ page }) => {
                const blog = page.getByText('10 Best Rockets Elon Musk')
                await blog.getByRole('button', { name: 'view' }).click()

                page.on('dialog', async dialog => await dialog.accept())
                await blog.getByRole('button', { name: 'remove' }).click()

                await expect(blog).not.toBeVisible()
            })

            test('only author of blog can see its delete button', async ({ page }) => {
                await page.getByText('10 Best Rockets Elon Musk').waitFor()

                await page.getByRole('button', { name: 'logout' }).click()

                await page.getByText('Username').getByRole('textbox').fill('koala')
                await page.getByText('Password').getByRole('textbox').fill('123')
                await page.getByRole('button', { name: 'login' }).click()

                await page.getByRole('button', { name: 'new blog' }).click()

                await page.getByPlaceholder('write blog title here').fill('Are koalas birds?')
                await page.getByPlaceholder('write blog author here').fill('Koala Bird')
                await page.getByPlaceholder('write blog url here').fill('example.com')
                await page.getByRole('button', { name: 'create' }).click()

                const foreignBlog = page.getByText('10 Best Rockets')
                await foreignBlog.getByRole('button', { name: 'view' }).click()
                await expect(foreignBlog.getByRole('button', { name: 'remove' })).not.toBeVisible()

                const domesticBlog = page.getByText('Are koalas birds?')
                await domesticBlog.getByRole('button', { name: 'view' }).click()
                await expect(domesticBlog.getByRole('button', { name: 'remove' })).toBeVisible()
            })

            test('blogs are arranged according to likes', async ({ page }) => {
                await page.getByRole('button', { name: 'new blog' }).click()

                await page.getByPlaceholder('write blog title here').fill('10 gardening tips')
                await page.getByPlaceholder('write blog author here').fill('John Doe')
                await page.getByPlaceholder('write blog url here').fill('example.com')
                await page.getByRole('button', { name: 'create' }).click()

                const article1 = page.getByText('10 Best Rockets Elon Musk')
                const article2 = page.getByText('10 gardening tips John Doe')

                await article1.getByRole('button', { name: 'view' }).click()
                await article2.getByRole('button', { name: 'view' }).click()

                await likeBlog(article2)
                await article2.getByText('likes 1').waitFor()

                expect(await getY(article2)).toBeLessThan(await getY(article1))

                await likeBlog(article1)
                await article1.getByText('likes 1').waitFor()
                await likeBlog(article1)
                await article1.getByText('likes 2').waitFor()

                expect(await getY(article1)).toBeLessThan(await getY(article2))

            })
        })
    })
})