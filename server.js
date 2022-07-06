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

app.get('/',(request, response)=>{ //dit stuurt naar de index.ejs loop dus als er 0 in de DB zit loopt die niet

    db.collection('jzCol').find().toArray() //dit moet dus originele characters laden 
    .then(data => {
        response.render('index.ejs', { info: data })//TODO:
        //console.log(data)
    })
    .catch(error => console.error(error))
})

app.post('/loadOriginalSprite',(request, response)=>{ 
    console.log(request)
    console.log("JEZUS")
    // console.log(request.body.name);
    // db.collection('jzOriginalSprite').find({name: request.body.name}).toArray()
    // .then(result => {
    //     response.json(result)
    // })
})

app.post('/saveSprite', (request, response) => {  //Er komt wat binnen en gaat wat naar main.js

    console.log(request.body.sprite)
    // db.collection('jzCol').findOne({ //doorzoek de collectie 
    //     name : request.body.name, //naar deze naam
    // })
    // .then(result =>{ //het resultaat
    //     if(result != null) //als het resultaat niet niks is
    //     {
    //         db.collection('jzCol').deleteOne({ //verwijder dan het resultaat
    //             name: request.body.name //met deze naam
    //         })
    //         .then(result => {
    //             response.json('Rapper Deleted')
    //         })
    //     }
    // })
    // db.collection('jzCol').insertOne({ //stop er de nieuwe tekening in 
    //     name : request.body.name,
    //     itsMyData: request.body.itsMyData
    // })
})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})