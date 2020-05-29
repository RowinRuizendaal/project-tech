const express = require('express');
const bodyParser = require('body-Parser');
const mongodb = require('mongodb');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
const port = 3000;


let db = null;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`;


mongodb.MongoClient.connect(uri, {
  useUnifiedTopology: true,
},
(err, client) => {
  if (err) throw err;
  db = client.db(process.env.DB_NAME);
});


app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(cookieParser());
app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000,
      },
    }),
);


app.get('/', (_req, res) => {
  res.render('index.ejs');
});

app.get('/inloggen', (_req, res) => {
  res.render('inloggen.ejs');
});

app.get('/registeren', (req, res) => {
  res.render('registeren.ejs');
});

app.get('/profile', (req, res) => {
  if (req.session.user) {
    res.render('profile', {
      data: req.session.user,
    }); // set session data
  } else res.redirect('/inloggen');
});

app.get('/list', (req, res) => {
  db.collection('Users')
      .find()
      .toArray((err, data) => {
        if (err) console.log(err);
        console.log(data);
        res.render('list.ejs', {data: data});
      });
});

app.post('/login', (req, res) => {
  const username = req.body.email;
  const password = req.body.password;

  db.collection('Users').findOne({
    email: username.toLowerCase(),
    password: password,
  }, (err, result) => {
    if (err) console.log(err);
    if (result) {
      console.log(result);
      req.session.user = result;
      req.session.save(function(err) {
        res.redirect('/profile');
      });
    } else res.redirect('/inloggen');
  });
});


app.post('/add', (req, res) => {
  db.collection('Users').findOne({
    email: req.body.email.toLowerCase(),
  }, (err, user) => {
    // IF THERE IS A ERROR LOG IT
    if (err) console.log(err);
    // IF EMAIL/USER ALREADY EXIST
    if (user) {
      console.log('Email already exist');
      res.redirect('/registeren');
      // IF PASSWORDS ARE THE SAME
    } else if (req.body.password == req.body.password_repeat) {
      db.collection('Users').insertOne({
        'username': req.body.name.toLowerCase(),
        'email': req.body.email.toLowerCase(),
        'password': req.body.password,
      });
      console.log(`A new user has registered #awesome! : ${req.body.email}`);
      res.redirect('/inloggen');
    } else res.redirect('/registeren'); // handling error message later
  });
});


app.listen(port, () => console.log(`Dating-app listening at http://localhost:${port}`));
