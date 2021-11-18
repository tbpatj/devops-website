const express = require("express");
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4545;

const students = ["Jeddy"];

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
    rollbar.log(`Sent user ${req.ip} the html file`);
});

app.get("/api/students", (req, res) => {
    res.status(200).send(students);
});

app.post("/api/students", (req,res) => {
    students.push(req.body.name);
    res.status(200).send(students);
})



// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '03e554d4b00744acab4c379ab4ed8ead',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')


app.listen(port, () => {
    console.log(`Cover your butts, the port has been opened: ${port}`);
})