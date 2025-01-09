const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((accumulator, currentBlog) => accumulator + currentBlog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.length !== 0
        ? blogs.reduce((current, favorite) => current.likes > favorite.likes ? current : favorite)
        : undefined
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return undefined

    const blogPairs = []
    blogs.forEach(blog => {
        // find blogPair with same author as blog, increment it's blogs, else create it
        const pairIndex = blogPairs.findIndex(blogPair => blogPair.author === blog.author)
        pairIndex !== -1
            ? blogPairs[pairIndex].blogs += 1
            : blogPairs.push({ author: blog.author, blogs: 1 })
    })
    return blogPairs.reduce((mostBlogs, current) => current.blogs > mostBlogs.blogs ? current : mostBlogs)
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return undefined

    const pairs = []
    blogs.forEach(blog => {
        // find pair with same author as blog, increment it's likes, else create it
        const pairIndex = pairs.findIndex(pair => pair.author === blog.author)
        pairIndex !== -1
            ? pairs[pairIndex].likes += blog.likes
            : pairs.push({ author: blog.author, likes: blog.likes })
    })
    return pairs.reduce((mostLikedPair, currentPair) => (
        currentPair.likes > mostLikedPair.likes ? currentPair : mostLikedPair))
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}