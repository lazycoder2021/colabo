const express = require('express'); 
const app = express(); 
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authroutes = require('./routes/authroutes');
const docroutes = require('./routes/documentroutes');
const reviewroutes = require('./routes/reviewroutes'); 
const approveroutes = require('./routes/approveroutes'); 

require('dotenv').config(); 

mongoose.connect('mongodb://localhost:27017/writerDB'); 

mongoose.connection.on('open', function (req, res) {
    console.log('db connected...')
})

app.use(express.json());
app.use(cors());
app.use('/', authroutes);
app.use('/', docroutes);
app.use('/', reviewroutes);
app.use('/', approveroutes);




app.listen(process.env.PORT, function () {
    console.log('server up and running...')
})
