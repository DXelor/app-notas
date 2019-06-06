const express = require('express');
const router = express.Router();

const Note = require('../models/Notes');
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res)=>{
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated,  async (req, res)=>{
    const {title, description} = req.body; //extraigo del post el titulo y las descripcion almacenandolos en constantes
    const errores = [];
    if(!title){
        errores.push({text: 'Porfavor inserte titulo'})
    }
    if(!description){
        errores.push({text: 'porfavor inserte una descripcion'})
    }
    if(errores.length > 0){
        res.render('notes/new-note', {
            errores,
            title,
            description
        })
    }else{
        const newNote = new Note({ title, description });
        await newNote.save();
        req.flash('success_msg', "Nota Agregada");
        res.redirect('/notes');
    }
    
});

router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find().sort({date: 'desc'});
    res.render('notes/all-notes', { notes } );
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res)=>{
    const note = await Note.findById(req.params.id);
    res.render('notes/edit-note', {note})
})

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res)=>{
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, description});
    req.flash('success_msg', "Nota Editada")
    res.redirect('/notes')
})

router.delete('/notes/delete/:id', isAuthenticated,async (req, res)=>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', "Nota Eliminada")
    res.redirect('/notes')
})

module.exports = router;