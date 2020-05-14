const express = require('express')
const app = express()
const port = 3000




app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs')
app.set('views', 'views')



app.get('/index', (req, res) => {
    res.render('index.ejs');
    const url = req.headers.host + '/' + req.url; //Logging the url we went to
    console.log(url);
})

app.get('/inloggen', (req, res) => {
    res.render('inloggen.ejs');
})

app.get('/registeren', (req, res) => {
    res.render('registeren.ejs');
})



app.get('*', (req, res) => {
    res.render('not-found.ejs');
})



// app.get('/about', (req, res) => res.send('This is the about page'))
// app.get('/contact', (req, res) => res.send('This is the contact page'))

// app.get('/index', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
//     const url = req.headers.host + '/' + req.url; //Logging the url we went to
//     console.log(url);
// })


//http://localhost:3000/users/:2/books/:3 returns data in json format 
// app.get('/users/:userId/film/:filmId', function (req, res) {
//     console.log(`De gekozen userid is: ${req.params.userId}`)

//     if (req.params.userId === 'Rowin') {
//         console.log('welkom Rowin');
//     }
//     res.send(req.params)
// })






// app.get('*', (req, res) => res.send('ERROR 404'))





app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))