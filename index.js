
const express = require('express');
const slug = require('slug');
const bodyParser = require('body-Parser');
const app = express();
const port = 3000;
const data = [
  {
    id: 'evil-dead',
    title: 'Evil Dead',
    // eslint-disable-next-line max-len
    plot: 'Five friends travel to a cabin in the woods, where they unknowingly release flesh-possessing demons.',

    // eslint-disable-next-line max-len
    description: 'Five friends head to a remote cabin, where the discovery of a Book of the Dead leads them to unwittingly summon up demons living in the nearby woods. The evil presence possesses them until only one is left to fight for survival.',
  },
  {
    id: 'the-shawshank-redemption',
    title: 'The Shawshank Redemption',
    // eslint-disable-next-line max-len
    plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    // eslint-disable-next-line max-len
    description: 'Andy Dufresne is a young and successful banker whose life changes drastically when he is convicted and sentenced to life imprisonment for the murder of his wife and her lover. Set in the 1940’s, the film shows how Andy, with the help of his friend Red, the prison entrepreneur, turns out to be a most unconventional prisoner.',
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
  const id = slug(req.body.title).toLowerCase();

  data.push({
    id: id,
    title: req.body.title,
    plot: req.body.plot,
    description: req.body.description,
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
