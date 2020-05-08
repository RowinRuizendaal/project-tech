const express = require('express')
const app = express()
const port = 3000

// app.get('/about', (req, res) => res.send('This is the about page'))
// app.get('/contact', (req, res) => res.send('This is the contact page'))
// app.get('*', (req, res) => res.send('ERROR 404'))




app.use(express.static(__dirname + ''));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


