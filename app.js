const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStratergy = require('passport-local');
const ejsMate = require('ejs-mate');
const methodoverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

const campgroundRoute = require('./routes/campgrounds');
const idcampgroundRoute = require('./routes/idcampground');
const Campground = require('./models/campground');
const Review = require('./models/reviewes');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/errorclass');
const User = require('./models/users');
const userRoute = require('./routes/user')


require('./mongoose');
const app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.engine('ejs',ejsMate);
app.use(express.urlencoded({extended:true}));
app.use(methodoverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig = {
    secret:'Harsh@2001',
    resave:false,
    saveUninitialized:true,
    cookie:{
       httpOnly : true,
       expires: Date.now + 1000*60*60*24*7,
       maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/',userRoute);
app.use('/campground',campgroundRoute);
app.use('/campground/:id',idcampgroundRoute);

app.get('/',(req,res)=>{
   res.render('home',{title:"home"});
});

app.all('*',catchAsync(async(req,res)=>{
    res.render('campgrounds/nopage',{title:'pagenotfound'});
}))

app.use((err,req,res,next)=>{
    const {message="something went wrong",statuscode=500} = err;
    res.status(statuscode).render('campgrounds/error',{err,title:'error'});
})

app.listen(3000,(req,res)=>{
    console.log('local server created');
})