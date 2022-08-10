const passport= require('passport');
const localstrategy=require('passport-local').Strategy;
const pool= require('../database');
const helpers=require('../lib/helpers');
passport.use('local.signin',new localstrategy({
    usernameField: 'nombreUsuario',
    passwordField: 'password',
    passReqToCallback: true

},async(req,username,password,done)=>{
    console.log(req.body);
    console.log(username);
    console.log(password);

   const rows= await pool.query('SELECT * FROM alumno WHERE nombreUsuario =?',[username]);
    if(rows.length>0){
        const user=rows[0];
       const valid= await helpers.matchPassword(password,user.password)
        if(valid){
            done(null,user,req.flash('Success','welcome',user.nombreUsuario));
        }else{
            done(null,false, req.flash('message','Contraseña invalida'))
        }
    }else{
        return done(null,false, req.flash('message','El usuario no existe'));
    }
    
}));

passport.use('local.signup',new localstrategy({
    usernameField:'nombreUsuario',
    passwordField: 'password',
    passReqToCallback: true

},async (req,nombreUsuario,password,done)=>{
   const {nombreCompleto,correo,escuela}=req.body;
   console.log(req.body,nombreUsuario,password)
    const newUser={
       nombreUsuario,
       password,
       nombreCompleto,
       correo,
       escuela
   };
  console.log(newUser);
   newUser.password= await helpers.encryptPassword(password);
  
   const result= await pool.query('INSERT INTO alumno set ?',[newUser]);
   newUser.id=result.insertId;
   return done(null, newUser);

}));


passport.serializeUser((usr,done)=>{
    done(null, usr.id);

});

passport.deserializeUser(async (id,done)=>{
   const rows= await pool.query('SELECT * FROM alumno WHERE id=?',[id]);
    done(null,rows[0]);
})