
const express = require('express');
// const slug = require('slug');
const bodyParser = require('body-Parser');
const mongodb = require('mongodb');
require('dotenv').config();
const app = express();
const port = 3000;


let db = null;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}-hdvet.azure.mongodb.net/test?retryWrites=true&w=majority`;

mongodb.MongoClient.connect(uri, function(err, client) {
  if (err) {
    throw err;
  }
  db = client.db(process.env.DB_NAME);
});

app.use(bodyParser.urlencoded({extended: true}));
app.post('/', add);
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.set('views', 'views');


app.get('/index', (req, res) => {
  res.render('index.ejs');
  const url = req.headers.host + req.url; // Logging the url we went to
  console.log(url);
});

app.get('/inloggen', (req, res) => {
  res.render('inloggen.ejs');
});

app.get('/registeren', (req, res) => {
  res.render('registeren.ejs');
});


app.get('/list', (req, res) => {
  db.collection('Users').find().toArray(push); // promise pending


  function push(err, data) {
    if (err) next(err);
    console.log(data);
    res.render('list.ejs', {data: data});
  }
});


app.get('/add', (req, res) => {
  res.render('add.ejs');
});


function add(req, res) {
  data.push({
    id: data.length + 1,
    Name: req.body.name,
    Email: req.body.email,
    Password: req.body.password,
  });

  res.redirect('/list');
}


app.get('/detail', (req, res) => {
  res.render('detail.ejs', {data: data});
});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
