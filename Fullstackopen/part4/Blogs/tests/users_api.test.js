const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const bcrypt = require('bcrypt');
const User = require('../models/user');

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('secret', 10);
        const user = new User({ username: 'root', passwordHash });

        await user.save();
    });

    test('creation succeeds with a fresh username', async () => {
        let response = await api.get('/api/users');
        const usersAtStart = response.body;

        const newUser = {
            username: 'Ludo',
            name: 'Ludo Pieterse',
            password: 'Password',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        response = await api.get('/api/users');
        expect(response.body).toHaveLength(usersAtStart.length + 1);

        const usernames = response.body.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    });

    test('Cannot create same user multiple times', async () => {
        const newUser = {
            username: 'Ludo',
            name: 'Ludo Pieterse',
            password: 'Password',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(response.body.error).toContain('User validation failed: username: Error, expected `username` to be unique.')
    })

    test('Cannot create user without username', async () => {
        const newUser = {
            name: 'Ludo Pieterse',
            password: 'Password',
        }
    
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(response.body.error).toContain('User validation failed: username: Path `username` is required.')
    })

    test('Cannot create user without password', async () => {
        const newUser = {
            username: 'Ludo',
            name: 'Ludo Pieterse',
        }
    
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(response.body.error).toContain('password missing or too short')
    })

    test('Cannot create user with password under 3 characters', async () => {
        const newUser = {
            username: 'Ludo',
            name: 'Ludo Pieterse',
            password: 'Pa',
        }
    
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(response.body.error).toContain('password missing or too short')
    })

    test('Cannot create user with username under 3 characters', async () => {
        const newUser = {
            username: 'Lu',
            name: 'Ludo Pieterse',
            password: 'Password',
        }
    
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(response.body.error).toContain('User validation failed: username: Path `username`')
    })
})

afterAll(() => {
    mongoose.connection.close();
})