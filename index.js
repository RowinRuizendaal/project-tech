
const express = require('express');
// const slug = require('slug');
const bodyParser = require('body-Parser');
const mongodb = require('mongodb');
require('dotenv').config();
const app = express();
const port = 3000;


let db = null;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`;


mongodb.MongoClient.connect(uri, {useUnifiedTopology: true},
    function(err, client) {
      if (err) throw err;
      db = client.db(process.env.DB_NAME);
    });


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.post('/add', register); // Register function
app.post('/login', login); // Validate if user exist


app.get('/index', (req, res) => {
  res.render('index.ejs');
});

app.get('/inloggen', (req, res) => {
  res.render('inloggen.ejs');
});

app.get('/registeren', (req, res) => {
  res.render('registeren.ejs');
});

app.get('/profile', (req, res) => {
  res.render('profile.ejs');
});

app.get('/list', (req, res) => {
  db.collection('Users').find().toArray(push); // promise pending

  function push(err, data) {
    if (err) console.log(err);
    res.render('list.ejs', {data: data});
  }
});


function register(req, res) {
  if (req.body.password == req.body.password2) {
    console.log('wachtwoorden overeen');
    db.collection('Users').insertOne({
      'username': req.body.name,
      'email': req.body.email,
      'password': req.body.password,
    });
    console.log(`A new user has registered #awesome! : ${req.body.email}`);
    res.redirect('/list');
  } else res.redirect('/registeren');
}


function login(req, res) {
  db.collection('Users').findOne({
    email: req.body.email,
    password: req.body.password,
  }, function(error, response) {
    if (error) throw error;
    if (response) res.redirect('/profile'); // Adding session later
    else res.redirect('/inloggen');
  });
};


app.listen(port, () => console.log(`Dating-app listening at http://localhost:${port}`));
