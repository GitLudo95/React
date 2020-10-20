require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const sanitizeHtml = require('sanitize-html');

const logger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
};

app.use(express.json());
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));
app.use(cors());
app.use(express.static('build'));
app.use(logger);

let persons = [];

app.get('/api/info', (request, response, next) => {
    const currentDate = new Date();
    Person.find({})
        .then(persons => {
            persons.map(person => person.toJSON());
            const content =  `<div>
                                <p>Phonebook has info for ${persons.length} people</p>
                            </div>
                            <div>
                                <p>${currentDate}</p>
                            </div>`;
            response.send(content);
        })
        .catch(error => next(error));
});

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons.map(person => person.toJSON()));
        })
        .catch(error => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(person.toJSON());
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

const checkIfNameExists = (newName) => {
    return persons.filter((person) => {
      return person.name === newName;
    });
};

app.post('/api/persons', (request, response, next) => {
    const body = request.body;

    if (!body.name || !body.number) {
      return response.status(400).json({
        error: 'content missing'
      });
    } else if(checkIfNameExists(body.name).length > 0) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        });
    }
  
    const person = new Person({
      name: sanitizeHtml(body.name),
      number: sanitizeHtml(body.number),
    })
  
    person.save()
        .then(savedPerson => {
            response.json(savedPerson.toJSON());
        })
        .catch(error => next(error));
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'content missing' 
        });
    }

    const person = {
        name: sanitizeHtml(body.name),
        number: sanitizeHtml(body.number),
    }

    Person.findByIdAndUpdate(request.params.id, person, { new : true })
        .then(updatedPerson => {
            response.json(updatedPerson.toJSON());
        })
        .catch(error => next(error));
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end();
      })
      .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({error : 'unknown endpoint'});
}

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if(error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({error : 'malformatted id'});
    } else if (error.name === 'ValidationError') {    
        return response.status(400).json({ error: error.message });
    }

    next(error);
}

app.use(errorHandler);
  
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
 })