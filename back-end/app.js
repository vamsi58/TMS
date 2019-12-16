const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const userRoutes = require("./api/user");


const server = 'localhost:27017'; // Localhost:Default Port
const database = 'tms-db1';       // Test Database Name 

const app = express();

mongoose
    .connect(
    `mongodb://${server}/${database}`, { useNewUrlParser: true }
    )
    .then(() => {
        console.log("Connected to database!");
    })
    .catch((err) => {
        console.log("Connection Failed!" + err);
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});


app.use("/api/user", userRoutes);
//app.use("/api/question", questionRoutes);
//app.use("/api/questiontype", questiontypeRoutes);
//app.use("/api/competencearea", competenceareaRoutes);
//app.use("/api/course", courseRoutes);

module.exports = app;
