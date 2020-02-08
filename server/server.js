const express = require('express')
const path = require('path')
const port = process.env.PORT || 5000
const app = express()
// this assumes that all your app files
// `public` directory relative to where your server.js is
app.use(express.static(__dirname + '/dist'))

app.get('*', function (request, response){
  console.log('hello');
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

app.listen(port)
console.log("Server started on port " + port)