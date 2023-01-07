const express = require('express');
const port = process.env.PORT || 80;
const app = express();
const cors = require('cors');
const Route = require('./Router.js');

const cookieParser = require('cookie-parser');
require ('./database/conn');

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use('/', Route);



app.listen(port ,()=>{
    console.log(`Server is Running at ${port}`);
});