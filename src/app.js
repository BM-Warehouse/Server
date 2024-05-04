require('module-alias/register'); // untuk alias path, jadi kita bisa pakai @constants/, @middleware, dst untuk path waktu pakai require 
const express = require('express');
const errorHandler = require('@middlewares/errorHandler');
const notFound = require('@middlewares/notFound');
const ClientError = require("@exceptions/clientError");

const app = express();

// ping server
app.get("/", async (req, res, next) => {
    try{
        res.send("ok");
    }
    catch(err){
        next(new ClientError());
    }
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
