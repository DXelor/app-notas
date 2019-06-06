//Requires
const express =  require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodO = require('method-override');

const session = require('express-session');
const flash = require('connect-flash'); //modulo de alertas

const passport = require('passport');



//Init
const app = express();
require('./database');
require('./config/passport');

//Settings
app.set('port',process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views')); //__dirname
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir:path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Middlewares

app.use(express.urlencoded({extended:false}));
app.use(methodO('_method'));
app.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session())

app.use(flash()); //middleware de alerta

//Global Var

app.use( (req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next()
})

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//Static Files
app.use(express.static(path.join(__dirname, 'public'), {
    index: false,
    inmutable: true,
    cacheControl:true,
}));

//server listen
app.listen(app.get('port'), ()=>{
    console.log('Server on port', app.get('port'));
});
