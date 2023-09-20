const express = require("express");
const bodyParser = require('body-parser');
const Nexmo = require('nexmo');
const mongoose = require("mongoose");

const connectDb = async() => {
    try {
        const connect = mongoose.connect('mongodb://localhost/27017/nodeProject', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });

        console.log("Mongoose DB connected");

    }catch(err){
        console.log(err)
    }
}

const app = express(); 

app.listen(3005, () => {
    console.log("express server")
})

connectDb();