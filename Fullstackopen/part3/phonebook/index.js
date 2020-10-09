const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(express.json());
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));
app.use(cors());
app.use(express.static('build'));

const generateId = () => {
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c==='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

let persons = [
    { id: generateId(), name: 'Arto Hellas', number: '040-123456' },
    { id: generateId(), name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: generateId(), name: 'Dan Abramov', number: '12-43-234345' },
    { id: generateId(), name: 'Mary Poppendieck', number: '39-23-6423122' },
]

app.get('/api/info', (req, res) => {
    const currentDate = new Date();
    const content = `<div>
                        <p>Phonebook has info for ${persons.length} people</p>
                    </div>
                    <div>
                        <p>${currentDate}</p>
                    </div>`;
    res.send(content);
})

app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id)
    if(person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
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
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person);
  
    response.json(person);
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})
  
const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
 })