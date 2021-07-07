const express = require('express');
const router  = express.Router();
const User = require('../models/users')
const passport = require('passport');

router.get('/register',(req,res)=>{
    res.render('campgrounds/register',{title:'signup'});
});
router.post('/register',async(req,res,next)=>{
    try{
    const {username,email,password} = req.body;
    const user = new User({username,email});
    const newUser =await User.register(user,password);
     req.login(newUser, err =>{
         if(err) return next(err);
     })
    req.flash('success','you have successfully registered');
    res.redirect('/campground');
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
});
router.get('/login',(req,res)=>{
    res.render('campgrounds/login',{title:'login'});
})
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    const returnto = req.session.returnTo || "/campground"
    delete req.session.returnTo;
    req.flash('success','welcome back to yelpcamp');
    res.redirect(returnto);
})
router.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/campground');
})
module.exports = router;