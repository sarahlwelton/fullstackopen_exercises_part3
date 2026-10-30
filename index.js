const express = require ('express')
const app = express()
const morgan = require ('morgan')

app.use(express.static('dist'))

app.use(express.json())
app.use(morgan((tokens, req, res) => [
  tokens.method(req, res),
  tokens.url(req, res),
  tokens.status(req, res),
  '-',
  tokens['response-time'](req, res),
  'ms',
  JSON.stringify(req.body)
].join(' ')))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const total = persons.length
  const date = Date()

  response.send(`<p>The phonebook currently has ${total} entries.</p><p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  return response.status(204).end()
})

const generateId = (min) => {
  const maxId = 100000000 
  return Math.floor(Math.random() * ((maxId - 1) - min + 1)) + min
}

app.post('/api/persons', (request, response) => {
  const newPerson = request.body

  if (!newPerson.name || !newPerson.number) {
    return response.status(400).json({
      error: 'Name and phone number are required.'
    })
  } else if (persons.find((person) => person.name === newPerson.name)) {
    return response.status(400).json({
      error: `${newPerson.name} already exists in the phonebook.`
    })
  }

  const person = {
    id: generateId(persons.length),
    name: newPerson.name,
    number: newPerson.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)