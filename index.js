const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('dist'))

app.use (express.json())

morgan.token('POST-request', function (request, response) {return JSON.stringify(request.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :POST-request'))

app.use(cors())

/* let persons = [
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
] */

app.get('/api/persons', (request, response) => {
    Person
      .find({})
      .then(persons => {
        response.json(persons)
      })
})

app.get('/info', (request, response) => {
    const entries = persons.length
    const date = new Date(Date.now())
    response.send(`Phonebook has info for ${entries} people <br/> ${date}`)
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  //.catch(error => next(error))
})

const generateID = (min, max) => {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)

  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled).toString() 
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: "Requests must contain a name."
    })
  } 

  if (!body.number) {
    return response.status(400).json({
      error: "Requests must contain a phone number."
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})