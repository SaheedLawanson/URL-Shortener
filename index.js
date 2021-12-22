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



// Pseudo data base to store all shortened sites
let urls = []
// An id for each site, increases by one once current value is taken
let id = 1


app.post('/api/shorturl', bodyParser.urlencoded({extended: false}), (req, res) => {
  // Empty object to temporarily store the original and short url before migrating
  // to pseudo database
  let obj= {}
  // User input url collected and stored
  let url = req.body.url
  // the "https://" prefix is removed from url
  let strippedUrl = url.replace(/https?:\/\//, "")
 
  // Checks to see if url provided exists
  dns.lookup(strippedUrl, error => {
    // If it doesnt exist return an error
    if(error){return res.json({error: "invalid url"})}
  })

  // store the url inputed by the user in the empty object
  obj['original_url'] = url
  // assign it an id which would be used as a shortcut to lookup the site
  obj['short_url'] = id

  // Save the object in the database
  urls.push({original_url: url, short_url: id})
  // Generate a new id by increasing the value of the current id by one
  id++

  return res.json(obj)
})

// a get request to a certain id
app.get('/api/shorturl/:id', (req, res) => {

  // Find the object which has the same id as the one supplied in the get request
  let correctUrl = urls.find(urrl => urrl.short_url == req.params.id)

  // redirect the page to the url that has the searched id
  res.redirect(correctUrl.original_url)
})

// Run server
app.listen(port, () => {
    console.log(`App is listening on port ${port} ...`)
})