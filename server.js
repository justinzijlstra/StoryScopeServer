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
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

app.put('/loadOriginalSprite',(request, response)=>{ 

    db.collection('jzOriginalSprite').find({sprite: request.body.sprite}).toArray()
    .then(result => 
    {
        db.collection('jzCol').updateOne(
        {
            character: request.body.character,
            sprite: request.body.sprite
        },
        {
            $set: 
            {
                dataURI: result[0].dataURI
            }
        },
        {
            upsert: true
        })
        .catch(error => console.error(error))
        response.json('original sprite loaded')
    })
    .catch(error => console.log(error))
})

app.put('/saveSprite', (request, response) => { 

    db.collection('jzCol').updateOne(
        {
            character: request.body.character,
            sprite: request.body.sprite
        },
        {
            $set: 
            {
                dataURI: request.body.dataURI
            }
        },
        {
            upsert: true
        }).then(result=>{
            response.json('sprite saved to database')
        })
        .catch(error => console.error(error))
})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})