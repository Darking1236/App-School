//Requerimos mysql y nuestra base de datos del archivo keys.js
const mysql= require('mysql');
const {database}=require('./keys');
const {promisify}= require('util');

//Usamos el createPool()
const pool= mysql.createPool(database);
//Con getconnection podemos obtener o un error o la conexion con nuestra bd
pool.getConnection((err,Connection)=>{
    if(err){
        if(err.code=='PROTOCOL_CONNECTIONS_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');

        }
        if(err.code==='ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err.code ==='ECONNREFUSED'){
            console.error ('DATABASE CONNECTION WAS REFUSED')
        }

    }
    if(Connection){ Connection.release()}
    console.log('ESTAMOS CONECTADOS A LA BASE DE DATOS');

})

//CONVERTIMOS NUESTRAS QUERYS EN PROMESAS para poder usar async y await
pool.query= promisify(pool.query);

module.exports=pool;