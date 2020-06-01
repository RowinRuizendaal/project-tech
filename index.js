const express = require('express');
const bodyParser = require('body-Parser');
const mongodb = require('mongodb');
const objectId = mongodb.ObjectID;
const flash = require('express-flash');
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
      resave: true,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000,
      },
    }),
);
app.use(flash());


app.get('/', (req, res) => {
  res.render('index.ejs');
});


app.get('/list', (req, res) => {
  db.collection('Users')
      .find()
      .toArray((err, data) => {
        if (err) console.log(err);
        console.log(data);
        res.render('list.ejs', {
          data: data,
        });
      });
});


// Registeren
app.get('/registeren', (req, res) => {
  res.render('registeren.ejs');
});

app.post('/register', (req, res) => {
  const createUsername = req.body.name;
  const createEmail = req.body.email.toLowerCase();
  const createPassword = req.body.password;
  const createPassword2 = req.body.password_repeat;


  db.collection('Users').findOne({
    email: createEmail,
  },
  (err, user) => {
    if (err) console.log(err);
    if (user) {
      req.flash('error', 'Email already exist please try a diffrent one');
      res.redirect('/registeren');
    } else if (createPassword == createPassword2) {
      db.collection('Users').insertOne({
        'username': createUsername,
        'email': createEmail,
        'password': createPassword,
      });
      console.log(`A new user has registered #awesome! : ${req.body.email}`);
      req.flash('succes', 'Your account has been made please log in');
      res.redirect('/inloggen');
    } else {
      req.flash('error', 'Passwords are not the same');
      res.redirect('/registeren');
    }
  });
});
// Einde registeren

// inloggen
app.get('/inloggen', (req, res) => {
  res.render('inloggen.ejs');
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
      req.session.user = result;
      req.session.save(function(err) {
        res.redirect('/profile');
      });
    } else {
      req.flash('error', 'Account not found');
      res.redirect('/inloggen');
    }
  });
});
// Einde van inloggen


// Profiel - updaten profiel
app.get('/profile', (req, res) => {
  if (req.session.user) {
    res.render('profile', {
      data: req.session.user,
    });
  } else res.redirect('/inloggen');
});

app.get('/edit', (req, res) => {
  if (req.session.user) {
    res.render('edit', {
      data: req.session.user,
    });
    console.log(req.session.user);
  } else res.redirect('/inloggen');
});

app.post('/edit-profile', (req, res) => {
  console.log(req.session.user._id);
  const newdata = {
    id: req.session.user._id,
    username: req.body.username,
    email: req.body.email.toLowerCase(),
    password: req.body.password,
  };
  db.collection('Users').updateOne({
    '_id': objectId(newdata.id),
  }, {
    $set: {
      'username': newdata.username,
      'email': newdata.email,
      'password': newdata.password,
    },
  }, (err, result) => {
    if (err) console.log(err);
    if (result) {
      req.session.user = newdata;
      req.session.save(function(err) {
        req.session.reload(function(err) {
          res.render('profile', {
            data: req.session.user,
          });
        });
      });
    }
  });
});

// Einde profiel - updaten profiel


// Delete van account
app.get('/delete', (req, res) => {
  const sessionsid = req.session.user.id;
  db.collection('Users').deleteOne({
    '_id': objectId(sessionsid),
  }, (err, result) => {
    if (err) console.log(err);
    if (result) {
      req.session.destroy();
      res.redirect('/');
    } else console.log('Something went wrong');
  });
});
// Einde deleten

// uitloggen
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/inloggen');
});
// Einde uitloggem


app.listen(port, () => console.log(`Dating-app listening at http://localhost:${port}`));
