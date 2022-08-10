//Aqui solo exportamos modulos
const express= require('express');
const morgan= require('morgan');
const path= require('path');
const { engine } = require('express-handlebars');
const flash= require('connect-flash');
const session= require('express-session');
const expressMsq= require('express-mysql-session');
const { database }=require('./keys');
const passport= require('passport');
//Inicializaciones
const app= express();
require('./lib/passport')

//CONFIGURACIONES
app.set('port', process.env.PORT || 4000); //Aqui definimos un puerto en el sistema si no existe entonces agarra el 4000
app.set('views',path.join(__dirname,'views'));//Aqui solo juntamos la ruta absoluta del sistema con el archivo que queremos correr para que lo reconozca

app.engine('.hbs',engine({
    //Aqui estamos haciendo uso de los handlebars para llamar a los archivos
    //Que mandaremos al usuario donde contenemos los htmls de esta manera
    defaultLayout: 'main', //El archivo por defecto sera main
    layaoutsDir: path.join(app.get('views'),'layouts'),//Unimos la ruta donde podemos encontrar main
    partialsDir: path.join(app.get('views'),'partials'),//Unimos la ruta donde encontraremos partials(Codigo reusable)
    extname:'.hbs', //Solo eligira archivos con terminación .hbs
    helpers: require('./lib/handlebars') //Y utilizaremos helpers para el formato del tiempo
})); 

//Views engine al parecer es la palabra reservada para hacerlo funcionar
app.set('view engine', '.hbs');//Con esto podemos hacer funcionar los handlebars diciendo utiliza el motor que ya definimos como .hbs


//MIDDLEWARS
app.use(session({
    secret:'user',
    resave:false,
    saveUninitialized: false,
    store:new expressMsq(database)
}))
app.use(flash());//Se usa para mostrar los mensajes de exito
app.use(morgan('dev')); // Es para recibir un tipo de mensaje por consola , nos ayuda a ver de forma mas clara lo que nos llegar al servidor
app.use(express.urlencoded({extended: false}));//Este metodo de express es para decir que solo se aceptaran formatos sencillos como strings
app.use(express.json()); //Este ayudara a recibir mas datos que no sean strings
app.use(passport.initialize());
app.use(passport.session());

//Global variables
app.use((req,res,next)=>{
    app.locals.Success =req.flash('Success');
    app.locals.message=req.flash('message');
    next();
});
//Aqui definiremos que variables pueden ser accedidas desde el navegador
app.use((req,res,next)=>{
    //Req : Nos da la información que manda el usuario, resp: lo que nosotros respondemos y next: sigue con el codigo siguiente
    next();
});


//ROUTES-> aqui definimos las urls que visitara el usuario en nuestra web
app.use(require('./routes'));//Aqui lo que hacemos es pedir la ruta de lo que queremos que mire el usuario en la direccion inicial. 
//Es importante saber que las rutas no pueden estar vacias por lo que debes exportar algo valido para poder requerirlas un enrutador
app.use(require('./routes/authentication'));
//Nota importante es que con /materias estamos diciendo que este tendra que comenzar su ruta con esa direccion
app.use('/matters',require('./routes/matters'));

app.use('/homeworks', require('./routes/homeworks'));
//PUBLIC ->todo el codigo donde el servidor pueda acceder
app.use(express.static(path.join(__dirname,'public')));
//LISTENING SERVER
app.listen(app.get('port'),()=>{
    console.log('El servidor esta en linea en el puerto',app.get('port'));//Aqui estamos haciendo uso de lo que definimos anterior mente con set para utilizar el puerto 4000

});

