const express = require('express');
const bookdata = require('./src/model/bookdata');
const cors = require('cors');
const jwt=require('jsonwebtoken');
var bodyparser=require('body-parser');
var app = new express();
app.use(cors());
app.use(bodyparser.json())
username="admin"
password="12345"


function verifyToken(req,res,next)
{
    if(!req.headers.authorization)
    {
    return res.status(401).send('Unauthorized Request')
    }
    let token=req.headers.authorization.split('')[1]
    if (token=='null')
    {
    return res.status(401).send('Unauthorized Request')
    }
    let payload=jwt.verify(token,'secretKey request')
    console.log(payload)
    if (!payload)
    {
    return res.status(401).send('Unauthorized Request')
    }
    req.userId=payload.subject
    next()
}


app.post('/login',(req,res)=>{
    let userData = req.body
    
    if(username !== userData.username){
        res.status(401).send('Invalid Username')
    } else
    if(password !== userData.password){
        res.status(401).send('Invalid Password')
    } else { 
        let payload={subject:username+password}
        let token=jwt.sign(payload,'secretKey')
        res.status(200).send({token}) 
    }
})

app.get('/books',function(req,res){
    res.header("Access-Control-Allow-Orgin","*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTION');
    bookdata.find()
        .then(function(books){
            res.send(books);
        });

});

app.post('/insert',function(req,res){
    res.header("Access-Control-Allow-Orgin","*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTION'); 
    console.log(req.body);
    var book = {
        bookId : req.body.book.bookId,
        bookName : req.body.book.bookName,
        age : req.body.book.age,
        description : req.body.book.description,
        date : req.body.book.date,
        doc : req.body.book.doc,
        contact : req.body.book.contact,
    }
    var book = new bookdata(book);
    book.save();
});

app.delete('/remove/:id',(req,res)=>{
   
    id = req.params.id;
    bookdata.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('success')
        res.send();
    })
  })

  app.post('/admin',(req,res)=>{

    let userdata=req.body;

    if(username !=userdata.uname){
        res.status(401).send('invalid username')
    }else if(password != userdata.password){
        res.status(401).send('invalid password')
    }else{
        res.status(200).send()
    }

});

app.listen(3000);