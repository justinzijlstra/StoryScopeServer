const express = require('express')
const Db = require('mongodb/lib/db')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'JZDB'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
.then(client => {
    console.log(`Connected to ${dbName} Database`)
    db = client.db(dbName)
})
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.get('/',(request, response)=>{ //TODO: dit stuurt naar de index loop dus als er 0 in de DB zit loopt die niet

    db.collection('jzCol').find().toArray()
    .then(data => {
        response.render('index.ejs', { picture: String(data[0].itsMyData) })//TODO:dit moet naar een img
    })
    .catch(error => console.error(error))
})

app.post('/saveDrawing', (request, response) => {
    db.collection('jzCol').deleteOne({ID: request.body.ID})
    .then(result => {
        response.json('Rapper Deleted')
    })
    db.collection('jzCol').insertOne({
        name : request.body.name,
        ID : request.body.ID,
        itsMyData: request.body.itsMyData
    })
})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})