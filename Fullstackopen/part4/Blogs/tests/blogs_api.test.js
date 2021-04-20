const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);
const Blog = require('../models/blog');

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const config = require('../utils/config');

const initialBlogs = [
    {
        title: 'Test1',
        author: 'Ludo',
        url: 'test1.nl',
        likes: 15
    },
    {
        title: 'Test2',
        author: 'Ludo',
        url: 'test2.nl',
        likes: 10
    }
];

let token = "";
let userForToken = {};

beforeEach(async () => {
    await Blog.deleteMany({});
    console.log('cleared');

    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();

    userForToken = {
        username: user.username,
        id: user._id,
    }
    
    // token expires in 60*60 seconds, that is, in one hour
    token = jwt.sign(    
        userForToken,     
        config.SECRET,    
        { expiresIn: 60*60 }  
    );
    initialBlogs.forEach((blog) => {
        blog.userId = userForToken.id;
    });
    const blogObjects = initialBlogs.map(blog => new Blog(blog));
    const promiseArray = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArray);

})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
  
    expect(response.body).toHaveLength(initialBlogs.length);
})
  
test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');
  
    const titles = response.body.map(blogs => blogs.title);
    expect(titles).toContain('Test1');
})

test('blogs have a unique identifier property called id', async () => {
    const response = await api.get('/api/blogs');
  
    const ids = response.body.map(blogs => blogs.id);
    ids.forEach((id) => {
        console.log('id', id)
        expect(id).toBeDefined();
    })
})

test('a new blog can be added by using HTTP POST', async () => {
    const userId = userForToken.id.toString();
    const newBlog = {
        "title": "Test3",
        "author": "Ludo",
        "url": "blablabla.nl",
        "likes": 20,
        "userId": userId
    }

    await api
        .post('/api/blogs')
        .set({'Authorization': `bearer ${token}`})
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs');
  
    expect(response.body).toHaveLength(initialBlogs.length + 1);

    const expectedBlogs = [...initialBlogs].concat(newBlog);
    expectedBlogs.map((expectedBlog) => {
        delete expectedBlog.userId;
    })
    const retrievedBlogs = [...response.body].map((receivedBlog) => {
        delete receivedBlog.id;
        delete receivedBlog.user;
        return receivedBlog;
    })

    console.log('expected', expectedBlogs);
    console.log('retrieved', retrievedBlogs);
    expect(retrievedBlogs.sort()).toEqual(expectedBlogs.sort());
})

test('likes always default to 0 if property is missing from request', async () => {
    const newBlog = {
        "title": "Test3",
        "author": "Ludo",
        "url": "blablabla.nl",
        "userId": userForToken.id.toString()
    }

    await api
        .post('/api/blogs')
        .set({'Authorization': `bearer ${token}`})
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs');
  
    const retrievedBlog = response.body.filter((blog) => blog.title === newBlog.title);
    console.log('retrievedBlog', retrievedBlog);
    expect(retrievedBlog[0].likes).toEqual(0);
})

test('backend responds with status code 400 bad request if title and url are missing', async () => {
    const newBlog = {
        "author": "Ludo",
        "likes": 20
    }

    await api
        .post('/api/blogs')
        .set({'Authorization': `bearer ${token}`})
        .send(newBlog)
        .expect(400)
})

test('a blog can be updated by HTTP PUT', async () => {
    let response = await api.get('/api/blogs');

    const blogBefore = response.body.filter((blog) => blog.title === 'Test1')[0];

    expect(blogBefore.likes).toEqual(15);

    const blogAfter = {
        title: 'Test1',
        author: 'Ludo',
        url: 'test1.nl',
        likes: 17
    }

    await api
        .put(`/api/blogs/${blogBefore.id}`)
        .send(blogAfter)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(initialBlogs.length);

    let editedBlog = response.body.filter((blog) => blog.title === 'Test1')[0];
  
    expect(editedBlog.likes).toEqual(17);
})

test('a blog can be deleted by HTTP DELETE', async () => {
    const newBlog = {
        "title": "Test3",
        "author": "Ludo",
        "url": "blablabla.nl",
        "likes": 20,
        "userId": "607d693f0a9df64922365abd"
    }

    await api
        .post('/api/blogs')
        .set({'Authorization': `bearer ${token}`})
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    let response = await api.get('/api/blogs');

    const blogToDelete = response.body.filter((blog) => blog.title === 'Test3')[0];

    expect(response.body).toHaveLength(initialBlogs.length + 1);

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({'Authorization': `bearer ${token}`})
        .expect(204)

    response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(initialBlogs.length);

    const deletedBlog = response.body.filter((blog) => blog.title === 'Test3');

    expect(deletedBlog).toHaveLength(0);
})

afterAll(() => {
  mongoose.connection.close()
})