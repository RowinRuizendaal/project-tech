
const express = require('express');
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


app.get('/mp3', (req, res) => {
  res.sendFile(__dirname + '/Cool-Song.mp3');
});


app.get('/new', (req, res) => {
  res.render('new.ejs', {data: data});
});


app.get('*', (req, res) => {
  res.render('not-found.ejs');
});


// app.get('/about', (req, res) => res.send('This is the about page'))
// app.get('/contact', (req, res) => res.send('This is the contact page'))


// http://localhost:3000/users/:2/books/:3 returns data in json format
// app.get('/users/:userId/film/:filmId', function (req, res) {
//     console.log(`De gekozen userid is: ${req.params.userId}`)

//     if (req.params.userId === 'Rowin') {
//         console.log('welkom Rowin');
//     }
//     res.send(req.params)
// })
// app.get('*', (req, res) => res.send('ERROR 404'))


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
