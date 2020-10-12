require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const sanitizeHtml = require('sanitize-html');

app.use(express.json());
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));
app.use(cors());
app.use(express.static('build'));

let persons = [];

app.get('/api/info', (req, res) => {
    const currentDate = new Date();
    Person.find({}).then(persons => {
        persons.map(person => person.toJSON());
        const content =  `<div>
                            <p>Phonebook has info for ${persons.length} people</p>
                        </div>
                        <div>
                            <p>${currentDate}</p>
                        </div>`;
        res.send(content);
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()));
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person.toJSON());
    })
})

const checkIfNameExists = (newName) => {
    return persons.filter((person) => {
      return person.name === newName
    });
}
  
app.post('/api/persons', (request, response) => {
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
  
    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON());
    })
})

app.delete("/api/persons/:id", (request, response) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end();
      })
      .catch(error => console.log(error));
});
  
const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
 })