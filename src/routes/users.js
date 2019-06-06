const express = require('express');
const router = express.Router();

const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
})

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash:true
}))

router.get('/users/signup', (req, res) => {
    res.render('users/signup')
});

router.post('/users/signup', async (req, res)=>{
    const {name, email, password, password_c} = req.body;
    const errores = [];
    if(name.length <=0){
        errores.push({text: 'porfavor inserte su nombre'});
    }
    if(email.length <=0){
        errores.push({text: 'porfavor inserte su email'});
    }
    if(password.length <=0){
        errores.push({text: 'porfavor inserte su contraseña'});
    }
    if(password != password_c){
        errores.push({text: 'escriba la misma contraseña'});
    }
    if(password.length < 4){
        errores.push({text: 'la contraseña debe ser mayor a 4 caracteres'})
    }
    if(errores.length > 0){
        res.render('users/signup', {errores, name, email, password, password_c});
    }else{
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error_msg', 'el email ya esta en uso');
            res.redirect('/users/signup');
        }
        const newUser = new User ({name, email, password});
        newUser.password = await newUser.encryptPassword(password)
        await newUser.save();
        req.flash('success_msg', 'estas registrado');
        res.redirect('/users/signin');
    }
})

router.get('/users/signout', (req, res)=>{
    req.logout();
    res.redirect('/')
})

module.exports = router;