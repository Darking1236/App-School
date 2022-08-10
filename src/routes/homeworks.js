const express=require('express');
const routerH=express.Router();
const pool= require('../database');
const { isloggedIn } = require('../lib/auth');

//Aqui iran las ruta para agregar, editar y eliminar tareas
routerH.get('/addHomework',isloggedIn,async(req,res)=>{
        
        const nombreMateria= await pool.query('SELECT * FROM materia');
       // console.log(nombreMateria);
        res.render('matters/homeworks/addHomework',{links:nombreMateria});

});

routerH.post('/addHomework',isloggedIn,async(req,res)=>{
        const {nombreTarea,nombre_Materia,fecha_entrega,estado,descripcion}= req.body;
        
        const newTarea={
            nombreTarea,
            nombre_Materia,
            fecha_entrega,
            estado,
            descripcion,
        };
        console.log(newTarea);
        //Aqui hacemos la insercion de datos y le pasamos el objeto con los valores
        await pool.query('INSERT INTO tarea set ?',[newTarea]);
        
        req.flash('Success','La tarea se ha guardado correctamente');
        res.redirect('/homeworks');  



});

routerH.get('/delete/:id',isloggedIn,async(req,res)=>{
        const {id}=req.params;
        await pool.query('DELETE FROM tarea where id=?',[id]);
        req.flash('message','La tarea se ha eliminado correctamente');

        res.redirect('/homeworks')

}); 

routerH.get('/edit/:id',isloggedIn,async(req,res)=>{
        const {id}= req.params;
        const homeworks= await pool.query("SELECT *,Date_Format(fecha_entrega,'%Y-%m-%d') as fecha_entrega  FROM tarea WHERE id=?",[id]);
        const matters= await pool.query('SELECT * FROM materia');
        console.log(homeworks[0]);
        res.render('matters/homeworks/edit',{links:homeworks[0],link:matters});
})
    
routerH.post('/edit/:id',isloggedIn,async(req,res)=>{
        const {id}=req.params;
        
        const {nombreTarea,descripcion,nombre_Materia,fecha_entrega,estado}=req.body;
        const newMateria={
                nombreTarea,
                descripcion,
                nombre_Materia,
                fecha_entrega,
                estado
        };
        await pool.query('UPDATE tarea set? where id=?',[newMateria,id]);
        req.flash('Success','La tarea se ha modificado correctamente');

        res.redirect('/Homeworks');
})

routerH.get('/',isloggedIn,async(req,res)=>{
        const listaTareas= await pool.query('SELECT * FROM tarea');
      //  console.log(listaMaterias);
        res.render('matters/homeworks/listHomeworks',{ links: listaTareas});
    
    })
module.exports=routerH;