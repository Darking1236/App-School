//Vamos a requerir el modulo express y seguido a eso ponemos el objeto que nos devuelve en la variable router.
const express=require('express');
const router=express.Router();

//Con router.get() vamos a regresar lo primero que queremos que mire el usuario
router.get('/',(req,res)=>{
    res.send('SOY LA PRIMERA VISTA');
})


//Exportamos el modulo router
module.exports=router;  