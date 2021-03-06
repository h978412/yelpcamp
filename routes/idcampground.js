const express = require('express');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/errorclass');
const Review = require('../models/reviewes');
const Campground = require('../models/campground');
const {isLoggedIn,isAuthor}  = require('../middileware');
const {isValideReview} = require('../validators/reviewschemavalidator')
const {isValideCampground} = require('../validators/campgroundschemavalidator')
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});


const router = express.Router({mergeParams:true});



router.get('/',isLoggedIn,catchAsync(async(req,res,next)=>{
    const id = req.params.id;
    
    try{
     const camp = await Campground.findById(id).populate({
      path:'review',
      populate:{
        path:'author'
      }
    }).populate('author');
    res.render('campgrounds/show',{camp,title:`${camp.title}`});
  }catch(e){
    req.flash('error','cannot find your campground');
    return res.redirect('/campground');
  }
  }));

  router.put('/',isLoggedIn,isAuthor,upload.array('image'),isValideCampground,catchAsync(async(req,res)=>{
    const id = req.params.id;

    const camp = req.body.campground;
    const imgs = req.files.map(f =>({url:f.path,fileName:f.filename}));
    camp.images = imgs;
    await Campground.findByIdAndUpdate(id,camp);
    req.flash('success','campground succesfully updated');
    res.redirect(`/campground/${id}`);
  }));
  
  router.get('/edit',isLoggedIn,isAuthor, catchAsync(async(req,res)=>{
    const id = req.params.id;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit',{camp,title:'update a form'});
  }));
  
  router.delete('/',isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const id = req.params.id;
    const camp = await Campground.findById(id);
    await Campground.findByIdAndDelete(id);
    req.flash('success','campground succesfully deleted');
    res.redirect('/campground');
    
  }));

  router.post('/review',isLoggedIn,isValideReview,catchAsync(async(req,res)=>{
    const id = req.params.id;
    const {review} = req.body;
    review.author = req.user._id;
    const reviews = new Review(review);
    camp  = await Campground.findById(id);
    camp.review.push(reviews._id);
    await camp.save();
    await reviews.save();
    req.flash('success','review succesfully created');
    res.redirect(`/campground/${id}`);
   }));
  
   router.delete('/review/:reviewId',isLoggedIn,catchAsync(async(req,res)=>{
     const {id,reviewId} = req.params;
     await Campground.findByIdAndUpdate(id,{$pull:{review:reviewId}});
     await Review.findByIdAndDelete(reviewId);
     req.flash('success','review succesfully deleted');
     res.redirect(`/campground/${id}`);
   }))
module.exports = router;
