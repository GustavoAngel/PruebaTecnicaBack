 const mongoose=require('mongoose');
 const {Schema} = mongoose;

 const employees =new Schema({
    userId:String,
    userNme:String,
    date: Date,
    PunchIn: Date,
    PunchOut: Date,  
 });

 module.exports = mongoose.model('employeesTurn',employees);