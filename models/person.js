const mongoose = require('mongoose')
require ('dotenv').config()

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB!')
    })
    .catch(error => {
        console.log('Error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        minLength: [3, 'Name must be at least 3 characters']},
    number: { 
        type: String,
        required: true,
        minLength: [8, 'Phone numbers must be at least 8 digits.'],
        validate: {
            validator: function(number) {
                return /\d{2,3}-\d{5,}/.test(number)
            },
            message: `Phone numbers must be in the format 12-345678`
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)