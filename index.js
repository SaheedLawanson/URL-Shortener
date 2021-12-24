const express = require('express');
const app = express()

const bodyParser = require('body-parser')
const dns = require('dns')

const port = 3000

// Render the html page
app.use('/', express.static('.'))
app.get('/', (req, res) => {
    res.sendFile(__dirname+"/index.html")
})



// THE APP

/* 
  Post request to /api/shorturl
  return a json object with original and short url
  The short url must redirect to long url 
*/
// Initiate a pseudo database
let db = []
// Initiate a starting id
let id = 1

// Create post request to /api/shorturl
app.post('/api/shorturl', 
  bodyParser.urlencoded({extended: false}),
  (req, res) => {
  // Initiate an empty response object
  let responseObj = {}

  // Use body parser to extract the original url
  let original_url = req.body.url

  // Check if the url host exists
  let urlHost = new URL(original_url).hostname

  dns.lookup(urlHost, (error, address, family) => {
    // if original url supplied doesn't follow http format, force it to fail dns validation
    let rgx = /https?:\/\//
    if(!rgx.test(original_url)){error = 1}

    // if it doesnt return {error: 'invalid url'}
    if(error){
      responseObj['error'] = 'invalid url'
    } 
    
    // If it exists
    else {
      // Search through the db to see if an object with the same original url exists
      let repetition = undefined
      if(db.length > 0) {
        repetition = db.find(item => item.original_url == original_url)
      }
      
      // If it does
      if(repetition) {
        // Set the response object to the repeated object
        responseObj = repetition
      }

      // If it doesn't
      else {
        // Add the url and the current id to the response object
        responseObj['original_url'] = original_url
        responseObj['short_url'] = id
        // Generate a new id
        id++
        // Push it to the database
        db.push(responseObj)
      }
    }

  // return the response object
  res.json(responseObj)
  })
})

/*
  Get request to /api/shorturl/<shorturl>
  redirect to original url
  if original url is not correct
  return {error: "invalid url"}
*/
// Create the get request to /api/shorturl/:id
app.get('/api/shorturl/:id', (req, res) => {
  // Initiate a responseObj
  let responseObj = {}

  // Find the object in the db that has the requested id
  let requestObj = db.find(item => item.short_url == req.params.id)

  // if it exists   
  if(requestObj) {
    // response object = the object
    responseObj = requestObj

    // redirect user to the object's original url
    res.redirect(responseObj.original_url)
  }
  
  // If there's no object with the id
  else {
    // response object = {error: 'invalid id'}
    return res.json({error: 'invalid id'})
  }
})


// Run server
app.listen(port, () => {
    console.log(`App is listening on port ${port} ...`)
})