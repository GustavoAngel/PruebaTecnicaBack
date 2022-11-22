const express=require ('express');
const morgan = require('morgan');
const mongoose= require('mongoose');
var cors = require('cors')

const app= express();

var corsOptions = {
    origin: 'http://localhost:8080/',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

  app.use(cors());
//mongodb+srv://Kumamon001:xMwrPx241EdZ093p@cluster0.xowycrk.mongodb.net/?retryWrites=true&w=majority
//mongodb://127.0.0.1:27017/employees
  mongoose.connect('mongodb+srv://Kumamon001:xMwrPx241EdZ093p@cluster0.xowycrk.mongodb.net/?retryWrites=true&w=majority')
    .then(db=> console.log('DB is connected'))
    .catch(function (err) {
        console.log('Error controlado');
        console.log(err);
    });

//Settings
app.set('port',process.env.PORT || 3000);

//Middleware
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/ApiMain',require('./routes/apiMain'));

//static files
const dir = __dirname+'/public';

app.use(express.static(dir));

//Server listening
app.listen(app.get('port'),()=>{
    console.log("Server up", app.get('port'));
});

console.log(dir);