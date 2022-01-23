
3 About the project
This project serves as an api that can be used to shorten web links. The root page has a text box which expects to receive a link to a valid web page, if the correct link is provided, an id is generated and assignedto the provided link. The id can be used as a shortcut to link to the page it was assigned to by making a get request to ```/api/<id>```. Use cases:

- If the url "https://www.google.com" inputted into the text-box and then the "Shorten" button is clicked on, then a json object like {'original_url': "https://www.google.com", 'short_url': 1} is returned.

- If an invalid url is inputted and the "Shorten" button is clicked on, then an error is returned like so {'error': 'Invalid URL'}

- If a get request like ```/api/1``` is sent, the url that has that id is returned, in this case "https://www.google.com"


# Built with

- Node.js

- Express.js

- dotenv

- body-parser




# Getting Started 

To get a local copy up and running, follow these simple steps.



## Prerequisites

- npm



## Installation & Usage

- Clone the repo: git clone https://github.com/SaheedLawanson/URL-Shortener.git

- Install node: run in cmd ```npm install node```

- Open cmd in the project root folder and run ```node index.js```

- On your preferred browser, visit "localhost:3000"

- Use the API as specified
