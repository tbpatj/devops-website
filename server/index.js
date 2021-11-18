const express = require("express");
const path = require('path');
const cors = require('cors');

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '03e554d4b00744acab4c379ab4ed8ead',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4545;

const students = ["Jeddy"];

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
    rollbar.info(`Sent user the html file`, {context: `sent user ip of ${req.ip}`});
});

app.get("/api/students", (req, res) => {
    rollbar.info(`someone loaded students`, {context: `user with ip of ${req.ip}`});
    res.status(200).send(students);
});

app.post("/api/students", (req,res) => {
    let {name} = req.body;
    name = name.trim();
    const index = students.findIndex( studentName => studentName === name);
    if(index === -1 && name !== ""){
        students.push(req.body.name);
        rollbar.log("Student added successfully", {author: "Tj", type: "manual entry", context: `User with ip of ${req.ip} added a student: ${name}`})
    } else if(name === ""){
        rollbar.error("no name given", {context: `a goober with the ip of ${req.ip} didn't put anything in`});
        res.status(400).send("Must provide a name");
    } else {
        rollbar.error("student already exists", {context: `well thats akward user with ip: ${req.ip} tried sending in a duplicate`});
        res.status(400).send("that student already exists");
    }
    res.status(200).send(students);
})
app.delete("/api/students/:id", (req,res) => {
    let {id} = req.params;
    if(id < students.length && id >= 0){
        let name = students[id];
        students.splice(id,1);
        rollbar.log(`Student deleted`, {context: `student with name ${name} with index ${id}`});
        res.status(200).send(students);
    } else {
        rollbar.error("Student id does not exist", {context: `I don't know how user ${req.ip} sent a delete request`});
        res.status(400).send("No id of input was found in data");
    }
    
})

app.use(rollbar.errorHandler());


// record a generic message and send it to Rollbar
//rollbar.log('Hello world!')


app.listen(port, () => {
    console.log(`Cover your butts, the port has been opened: ${port}`);
})