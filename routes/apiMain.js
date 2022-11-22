const express= require('express');
const employees = require('../models/employees');

const router=express.Router();

router.get('/',async function (req,res) {
    //Se realiza la busqueda de todos los turnos de los empleados
    const employeesList=await employees.find();
    //Order item for date most recent
    let data=employeesList.map(item=>new employees(item)).sort(function (a,b) {
        if (a.date>b.date) {
            return -1;    
        }
        else{
            return 1;
        }
    });
    
    //Send result to client side
    res.json(data);
});

//Function for post request
router.post('/',async (req,res) =>{
    //Variable for status of request
    let status='';
    try {
        
        if (req.body.length===1) {
            
            let employee= new employees(req.body[0]);
            
            const timeAux =req.body[0].PunchIn.split(':');
            const timeAuxOut =req.body[0].PunchOut.split(':');

            employee.PunchIn = new Date(
                employee.date.getFullYear(),
                employee.date.getMonth(),
                employee.date.getDate(),
                timeAux[0],    
                timeAux[1],0,0
                );

            employee.PunchOut = new Date(
                employee.date.getFullYear(),
                employee.date.getMonth(),
                employee.date.getDate(),
                timeAuxOut[0],    
                timeAuxOut[1]
                );
                
            await employee.save();   
        }
        else if (req.body.length>0) {
            req.body.forEach(async item => {
                try {
                    const employee= new employees(item);
                    await employee.save();    
                } catch (err) {
                    console.error(err);
                }                
            });    
        }
       status= "Task saved";
    } catch (err) {
        console.error(err);
        status= err;
    }
    finally{
        res.json({
            status:status
        });
    }   
});

router.put('/:id',async function (req,res) {
    
    let employee=new employees(req.body[0]);
    const timeAux =req.body[0].PunchIn.split(':');
    const timeAuxOut =req.body[0].PunchOut.split(':');

    employee.PunchIn = new Date(
        employee.date.getFullYear(),
        employee.date.getMonth(),
        employee.date.getDate(),
        timeAux[0],    
        timeAux[1],0,0
        );

    employee.PunchOut = new Date(
        employee.date.getFullYear(),
        employee.date.getMonth(),
        employee.date.getDate(),
        timeAuxOut[0],    
        timeAuxOut[1]
        );

    await employees.findByIdAndUpdate(req.params.id,employee);

    res.json({
        status:"Task updated"
    });

});

router.delete('/:id',async function (req,res) {
    console.log(req.params.id);
    try {
        await employees.findByIdAndRemove(req.params.id)       
    } catch (error) {
        console.log(error);
    }
     

    res.json({
        status:"Task deleted"
    });
});

module.exports= router;