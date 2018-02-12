const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String,
  id: Number
})

const args = process.argv.length

if (args === 2) {
  Person
    .find({})
    .then(persons => {
      console.log('Puhelinluettelo:')
      persons.forEach(p => console.log(p.name, p.number))
      mongoose.connection.close()
    })
}
if (args === 4) {

  let name = process.argv[2]
  let number = process.argv[3]

  console.log(`Lisätään henkilö ${name} numero ${number} luetteloon`)

  const person = new Person({
    name: name,
    number: number
  })
  
  person
    .save()
    .then(response => {
      console.log(`Numero ${response.number} lisätty henkilölle ${response.name}!`)
      mongoose.connection.close()
    })
}
