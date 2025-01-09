const likeBlog = async blog => {
    await blog.getByRole('button', { name: 'like' }).click()
}

const getY = async blog => {
    return (await blog.boundingBox()).y
}

module.exports = { likeBlog, getY }