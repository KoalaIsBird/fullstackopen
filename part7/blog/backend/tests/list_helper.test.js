const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const exampleBlogs = require('../data/blogs')


test('returns one', () => {
    assert.strictEqual(listHelper.dummy([]), 1)
})

describe('totalLikes', () => {
    test('two blogs', () => {
        assert.strictEqual(
            listHelper.totalLikes([exampleBlogs[0], exampleBlogs[1]]),
            exampleBlogs[0].likes + exampleBlogs[1].likes)
    })
    test('one blogs', () => {
        assert.strictEqual(
            listHelper.totalLikes([exampleBlogs[2]]),
            exampleBlogs[2].likes)
    })
    test('no blogs', () => {
        assert.strictEqual(listHelper.totalLikes([]), 0)
    })
})


describe('favoriteBlog', () => {
    test('no blog', () => {
        assert.deepStrictEqual(listHelper.favoriteBlog([]), undefined)
    })
    test('one blog', () => {
        assert.deepStrictEqual(listHelper.favoriteBlog([exampleBlogs[0]]), exampleBlogs[0])
    })
    test('two blogs', () => {
        assert.deepStrictEqual(listHelper.favoriteBlog([exampleBlogs[1], exampleBlogs[2]]), exampleBlogs[2])
    })
})

describe('mostBlogs', () => {
    test('no blog', () => {
        assert.deepStrictEqual(listHelper.mostBlogs([]), undefined)
    })
    test('one blog', () => {
        assert.deepStrictEqual(
            listHelper.mostBlogs([exampleBlogs[0]]),
        {
            author: 'Michael Chan',
            blogs: 1
        })
    })
    test('many blogs', () => {
        assert.deepStrictEqual(
            listHelper.mostBlogs(exampleBlogs),
            {
                author: 'Robert C. Martin',
                blogs: 3
            })
    })
})

describe('mostLikes', () => {
    test('no blog', () => {
        assert.deepStrictEqual(listHelper.mostLikes([]), undefined)
    })
    test('one blog', () => {
        assert.deepStrictEqual(
            listHelper.mostLikes([exampleBlogs[0]]),
        {
            author: 'Michael Chan',
            likes: 7
        })
    })
    test('many blogs', () => {
        assert.deepStrictEqual(
            listHelper.mostLikes(exampleBlogs),
            {
                author: "Edsger W. Dijkstra",
                likes: 17
              })
    })
})