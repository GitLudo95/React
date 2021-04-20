const countBy = require('lodash.countby');

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    const reducer = (accumulator, currentBlog) => accumulator + currentBlog.likes;
    return blogs.reduce(reducer, 0);
}

const favoriteBlog = (blogs) => {
    const favorite =  blogs.reduce((prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    });
    return { title: favorite.title, author: favorite.author, likes: favorite.likes };
}

const mostBlogs = (blogs) => {
    const authors = blogs.map((blog) => blog.author);
    const rankings = countBy(authors);
    const entries = Object.entries(rankings);
    const map = entries.map((entry) => entry = {author: entry[0], blogs: entry[1]});
    return map.reduce((prev, current) => {
        return (prev.blogs > current.blogs) ? prev : current
    });
}

const mostLikes = (blogs) => {
    const authors = blogs.map((blog) => blog.author);
    const unique = [...new Set(authors)];
    const rankings = [];
    unique.forEach((author) => {
        const likes = blogs.reduce((accumulator, currentBlog) => {
            if(currentBlog.author === author) {
                accumulator += currentBlog.likes;
            }
            return accumulator;
        }, 0);
        rankings.push({ author: author, likes: likes });
    })
    return rankings.reduce((prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    });
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}