const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  Person
  .find({})
  .then(persons => {
    res.send(`Puhelinluettelossa ${persons.length} henkilön tiedot <br> ${new Date()}`)
  })
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(Person.format))
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person)
        res.json(Person.format(person))
      else
        res.status(404).end()
    })
    .catch(error => {
      res.status(400).send({ error: 'malformatted id' })
    })
})
  
app.post('/api/persons', (req, res) => {

  const body = req.body

  if (body.name === undefined)
    return res.status(400).json({error: 'name missing'})
  if (body.number === undefined)
    return res.status(400).json({error: 'number missing'})

  const personToAdd = new Person({
    name: body.name,
    number: body.number
  })

  Person
    .find({name: personToAdd.name})
    .then(people => {
      if (people.length === 0) {
        personToAdd
          .save()
          .then(person => {
            res.json(Person.format(person))
          })
      } else {
        res.status(400).json({error: 'name must be unique'})
      }
    })
})

app.put('/api/persons/:id', (req, res) => {

  const body = req.body

  if (body.name === undefined)
    return res.status(400).json({error: 'name missing'})
  if (body.number === undefined)
    return res.status(400).json({error: 'number missing'})

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true })
    .then(person => {
      res.json(Person.format(person))
    })
    .catch(error => {
      res.status(400).send({error: 'malformatted id'})
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      res.status(400).send({error: 'malformatted id'})
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})