const express= require('express');
const { redirect } = require('express/lib/response');
const router= express.Router();

const pool= require('../database');
const { isloggedIn } = require('../lib/auth');

//Aqui estara la ruta para agregar materias 
router.get('/add',isloggedIn,(req,res)=>{
    res.render('matters/add');
    
});


//Para usar await necesitas hacerlo asyncronos
router.post('/add',isloggedIn,async (req,res)=>{

    const {nombreMateria, nombreProfesor, horaEntrada, horaSalida}= req.body;
    const newMateria={
        nombreMateria,
        nombreProfesor,
        horaEntrada,
        horaSalida,
    };
    //Aqui hacemos la insercion de datos y le pasamos el objeto con los valores
    await pool.query('INSERT INTO materia set ?',[newMateria]);
    req.flash('Success','La materia se ha agregado correctamente');

    res.redirect('/matters');  
});

router.get('/delete/:id',isloggedIn,async(req,res)=>{
    const {id}=req.params;
    await pool.query('DELETE FROM materia where id=?',[id]);
    req.flash('message','La materia se ha eliminado correctamente');
    res.redirect('/matters')
})

router.get('/edit/:id',isloggedIn,async(req,res)=>{
    const {id}= req.params;
    const matters= await pool.query('SELECT * FROM materia WHERE id=?',[id]);
    res.render('matters/edit',{links:matters[0]});
});

router.post('/edit/:id',isloggedIn,async(req,res)=>{
    const {id}=req.params;
    const {nombreMateria,nombreProfesor,horaEntrada,horaSalida}=req.body;
    const newMateria={
        nombreMateria,
        nombreProfesor,
        horaEntrada,
        horaSalida
    }
    await pool.query('UPDATE materia set? where id=?',[newMateria,id]);
    req.flash('Success','La materia se ha modificado correctamente');

    res.redirect('/matters');
});
router.get('/',isloggedIn,async (req,res)=>{
    const listaMaterias= await pool.query('SELECT * FROM materia');
  //  console.log(listaMaterias);
    res.render('matters/list',{ links: listaMaterias});

})
module.exports=router;