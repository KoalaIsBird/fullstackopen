// const initialBlogs = [
//   {
//     _id: "5a422a851b54a676234d17f7",
//     title: "React patterns",
//     author: "Michael Chan",
//     url: "https://reactpatterns.com/",
//     likes: 7,
//     __v: 0
//   },
//   {
//     _id: "5a422aa71b54a676234d17f8",
//     title: "Go To Statement Considered Harmful",
//     author: "Edsger W. Dijkstra",
//     url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
//     likes: 5,
//     __v: 0
//   },
//   {
//     _id: "5a422b3a1b54a676234d17f9",
//     title: "Canonical string reduction",
//     author: "Edsger W. Dijkstra",
//     url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
//     likes: 12,
//     __v: 0
//   },
//   {
//     _id: "5a422b891b54a676234d17fa",
//     title: "First class tests",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
//     likes: 10,
//     __v: 0
//   },
//   {
//     _id: "5a422ba71b54a676234d17fb",
//     title: "TDD harms architecture",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
//     likes: 0,
//     __v: 0
//   },
//   {
//     _id: "5a422bc61b54a676234d17fc",
//     title: "Type wars",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
//     likes: 2,
//     __v: 0
//   }
// ]


const initialUsers = [
  {
    "_id": "66b3804a127bb3d95922da9e",
    "username": "andrew",
    "name": "Andrew",
    "passwordHash": "$2b$10$STxv2lV8Rmnbh8PG7ewJx.jGI/27abZcTHPQGYeF88zdoK9fwDUga",
    "blogs": [
      "66b38069127bb3d95922daa6",
      "66b38069127bb3d95922daaa"
    ],
    "__v": 3
  },
  {
    "_id": "66b380a1127bb3d95922dab7",
    "username": "koala",
    "name": "Andrew",
    "passwordHash": "$2b$10$RgcRnmiPJpyWxYNffY2R0ePbyUZkVbg0o0rDMxq2ZgKmNZiH/oGCG",
    "blogs": [
      "66b3828e8da1f888caed26ef",
      "66b382948da1f888caed26f3"
    ],
    "__v": 2
  }
]

const initialBlogs = [
  {
    "_id": "66b38069127bb3d95922daa6",
    "title": "super blog 2",
    "author": "andrew",
    "url": "example.com/myblog2",
    "likes": 0,
    "user": "66b3804a127bb3d95922da9e",
    "__v": 0
  },
  {
    "_id": "66b38069127bb3d95922daaa",
    "title": "super blog 2",
    "author": "andrew",
    "url": "example.com/myblog2",
    "likes": 0,
    "user": "66b3804a127bb3d95922da9e",
    "__v": 0
  },
  {
    "_id": "66b3828e8da1f888caed26ef",
    "title": "hello",
    "author": "koala",
    "url": "example.com/myblog2",
    "likes": 0,
    "user": "66b380a1127bb3d95922dab7",
    "__v": 0
  },
  {
    "_id": "66b382948da1f888caed26f3",
    "title": "hello 2",
    "author": "koala",
    "url": "example.com/myblog2",
    "likes": 0,
    "user": "66b380a1127bb3d95922dab7",
    "__v": 0
  }
]



module.exports = {
  initialBlogs, initialUsers
}