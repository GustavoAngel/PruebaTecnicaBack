const express=require ('express');
const morgan = require('morgan');
const mongoose= require('mongoose');
var cors = require('cors')

const app= express();

var corsOptions = {
    origin: '',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
//   app.use(cors({
//     origin: ['https://vermillion-rolypoly-82ef9b.netlify.app/', 'http://192.168.1.157:8080/']
// }));
// Add headers before the routes are defined
// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'https://vermillion-rolypoly-82ef9b.netlify.app/');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });

app.use(cors());
//mongodb+srv://Kumamon001:xMwrPx241EdZ093p@cluster0.xowycrk.mongodb.net/?retryWrites=true&w=majority
  mongoose.connect('mongodb+srv://Kumamon001:xMwrPx241EdZ093p@cluster0.xowycrk.mongodb.net/?retryWrites=true&w=majority')
    .then(db=> console.log('DB is connected'))
    .catch(function (err) {
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