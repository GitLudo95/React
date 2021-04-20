const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 });
    if(blog) {
        response.json(blog);
    } else {
        response.status(404).end();
    }
});
  
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body;
    const user = request.user;

    if(!body.title && !body.url) {
        return response.status(400).end();
    }

    body.user = user._id;

    const blog = new Blog(body);
    if(!blog.likes) {
        blog.likes = 0;
    }
    
    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();

    response.status(201).json(result);
});

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body;

    if(!request.body.title && !request.body.url) {
        return response.status(400).end();
    }

    const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const blog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new : true });
    response.json(blog);
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    console.log('blog', blog);
    const user = request.user;
    console.log('user', user);
    if (blog.user.toString() === user._id.toString()) {
        await blog.remove();
        response.status(204).end();
    } else {
        response.status(404).end();
    }
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({error : 'unknown endpoint'});
}

module.exports = blogsRouter