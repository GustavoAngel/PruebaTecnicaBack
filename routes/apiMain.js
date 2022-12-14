const { json } = require('express');
const express= require('express');
const employees = require('../models/employees');
const router=express.Router();

router.get('/',async function(req,res)  {
    try {
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
    } catch (error) {
        res.json("Status",error);
    }    
});

router.get('/Usuarios',async function  (req,res) {
    try {
        function onlyUnique(value, index, self) {
            //console.log(value,index);
            return true;
        }
        //Se realiza la busqueda de todos los turnos de los empleados
        const employeesList=await employees.find();
        //Order item for date most recent
        const data=employeesList.map(item => new employees(item)).filter(onlyUnique);
        const resultado=[];
        const map2 = new Map();
        for (const item of data) {
            if(!map2.has(item.userId)){
                map2.set(item.userId, true);    // set any value to Map
                resultado.push(item);
            }
        }  
        //Send result to client side
        res.json(resultado);
    } catch (error) {
        res.json("Status",error);
    }    
});

router.get('/UsuariosTurnos/:id',async function  (req,res) {
    try {
        const userId= req.params.id;
        //Se realiza la busqueda de todos los turnos de los empleados
        const employeesList=await employees.find();

        //Order item for date most recent
        const data=employeesList.map(item => new employees(item));
      

        let resultado=[];

        resultado= data.filter(function (value,index,s) {
            return value.userId==userId;
        });
     
        console.log(resultado.length);
        
        //Send result to client side
        res.json(resultado);
    } catch (error) {
        console.log(error);
        res.json(error);
    }    
});

router.get('/GetTurno/:id',async function  (req,res) {
    try {
        const userId= req.params.id;

        employees.findById(userId, (err,docs) => {
            if (err){
                res.status(400).send({ error: 'Hubo un error al buscar!!!'})
            } 
            else{
                console.log(typeof docs.PunchIn);
                res.json(docs);
            }
        });
        
    } catch (error) {
        res.json(error);
    }    
});

//Function for post request
router.post('/',async function (req,res){
    //Variable for status of request
    let status='';
  
    //Start try for this method
    try {
        //if body only contains 1 item                 
        if (req.body.length===1) {
            //parse object jason to object js
            let employee= new employees(req.body[0]);
            //Time cast utility
            const timeAux =req.body[0].PunchIn.split(':');
            //Time cast utility
            const timeAuxOut =req.body[0].PunchOut.split(':');

            //Replace value PunchIn
            employee.PunchIn = new Date(
                employee.date.getFullYear(),
                employee.date.getMonth(),
                employee.date.getDate(),
                timeAux[0],    
                timeAux[1],0,0
                );
              // console.log( Number.parseInt(timeAux[0])+6);
            
            //Replace value PunchIn
            employee.PunchOut = new Date(
                employee.date.getFullYear(),
                employee.date.getMonth(),
                employee.date.getDate(),
                timeAuxOut[0],    
                timeAuxOut[1]
                );
            console.log(employee);
            //Save item                 
            await employee.save();   
        }
        else if (req.body.length>0) {
            

          

            req.body.forEach(async item => {
                try {
                    const employee= new employees(item);
                         //Time cast utility
               const timeAux =req.body[0].PunchIn.split(':');
               //Time cast utility
               const timeAuxOut =req.body[0].PunchOut.split(':');
   
               //Replace value PunchIn
               employee.PunchIn = new Date(
                   employee.date.getFullYear(),
                   employee.date.getMonth(),
                   employee.date.getDate(),
                   timeAux[0],    
                   timeAux[1],0,0
                   );
                 // console.log( Number.parseInt(timeAux[0])+6);
               
               //Replace value PunchIn
               employee.PunchOut = new Date(
                   employee.date.getFullYear(),
                   employee.date.getMonth(),
                   employee.date.getDate(),
                   timeAuxOut[0],    
                   timeAuxOut[1]
                   );
            console.log(item);
                   
                    await employee.save();    
                } catch (err) {
                    console.error(err);
                }                
            });    
        }
       status= "Task saved";
    } catch (err) {
        status= err;
    }
    finally{
        //Result the request
        res.json({
            status:status
        });
    }   
});

router.put('/:id',async function (req,res) {
    let status='';
    try {
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
        //Mongosse
        await employees.findByIdAndUpdate(req.params.id,employee);
        //Update message successful
        status ='successful';
    } catch (error) {
        status=error;
    }
    finally{
        
        //Message to client
        res.json({
            status:status
        });
    }
});

router.delete('/:id',async function (req,res) {
    //Variable for message
    let status='';
    try {
        //Delete item for de bd
        await employees.findByIdAndRemove(req.params.id);       
        //Update message successful
        status ='successful';
    } catch (error) {
        status= error;
    }
    finally{
        //Message to client
        res.json({
            status:status
        });
    }
});
//Export module
module.exports= router;