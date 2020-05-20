
const express = require('express');
const slug = require('slug');
const bodyParser = require('body-Parser');
const app = express();
const port = 3000;
const data = [
  {
    id: 1,
    Name: 'Rowin Ruizendaal',
    Email: 'Rowin_ruizendaal@hotmail.com',
    Password: '!4.JpE+sC~8~6JRj',
  },
  {
    id: 2,
    Name: 'Sam de Kanter',
    Email: 'Moffelpiertje69@gmail.com',
    Password: 'rSvU>a2+@M%,>`Gj',
  },
  {
    id: 3,
    Name: 'Mike hovernier',
    Email: 'Mikehov@gmail.com',
    Password: '9}Zk>"[QewtMaMCH',
  },
];

app.use(bodyParser.urlencoded({extended: true}));
app.post('/', add);
app.delete('/:id', remove);
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
  res.render('list.ejs', {data: data});
});


app.get('/add', (req, res) => {
  res.render('add.ejs');
});


// eslint-disable-next-line require-jsdoc
function add(req, res) {
  data.push({
    id: req.body.Id,
    Name: req.body.Name,
    Email: req.body.Email,
    Password: req.body.Password,
  });

  res.redirect('/list');
}


app.get('/detail', (req, res) => {
  res.render('detail.ejs', {data: data});
});

// eslint-disable-next-line require-jsdoc
function remove(req, res) {
  const id = req.params.id;

  data = data.filter(function(value) {
    return value.id !== id;
  });

  res.json({status: 'ok'});
  res.redirect('/list');
}


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
