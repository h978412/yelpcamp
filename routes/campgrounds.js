const express = require('express');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/errorclass');
const {isLoggedIn}  = require('../middileware');
const multer = require('multer');
const {storage} = require('../cloudinary/index');

const upload = multer({ storage })


const router = express.Router();
const {isValideCampground} = require('../validators/campgroundschemavalidator.js');

//showing all campground to user....No need to login in order to access this route
router.get('/',async (req,res)=>{
    const allcamps = await Campground.find({});
    res.render('campgrounds/allcamp',{allcamps,title:'all camps'});
  });

  router.get('/new',isLoggedIn,(req,res)=>{
    res.render('campgrounds/new',{title:'add a campground'});
  })

router.post('/',isLoggedIn,upload.array('image'),isValideCampground, catchAsync( async(req,res)=>{
  
  const {campground} = req.body;
    campground.author = req.user._id;
    campground.images = req.files.map(f =>({url:f.path,fileName:f.filename}))
   
    const camp = new Campground(campground);
    const data = await camp.save();
    req.flash('success','campground succesfully created');
    res.redirect(`campground/${camp._id}`);
   
   }));
module.exports = router;