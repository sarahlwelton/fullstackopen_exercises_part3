const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

if (process.argv.length < 3) {
    console.log('Give a password, name and phone number as arguments')
    process.exit(1)
} if (process.argv.length > 3 && process.argv.length < 5) {
    console.log('Give a name and phone number as arguments')
    process.exit(1)
}

const Person = mongoose.model('Person', personSchema)

const password = process.argv[2]

const url = `mongodb+srv://sarahwelton:${password}@fullstackopen-part3.rsmpm.mongodb.net/phonebook?retryWrites=true&w=majority&appName=fullstackopen-part3`

mongoose.set('strictQuery', false)

mongoose.connect(url).catch(error => console.log(error))

mongoose.connection.on('connected', () => {
    console.log('connected!')
    if (process.argv.length === 3) {
        Person
            .find({})
            .then(result => {
                console.log("phonebook:")
                result.forEach(person => {
                    console.log(person.name, person.number)
                })
                mongoose.connection.close()
            })
    } if (process.argv.length === 5) {
        const person = new Person({
            name: process.argv[3],
            number: process.argv[4]
        })
        person.save().then(result => {
            console.log(`Added ${result.name} ${result.number} to the phonebook!`)
            mongoose.connection.close()
        })
    }
})



