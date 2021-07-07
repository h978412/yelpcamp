const joi = require('joi');
const { validate } = require('../models/campground');

const reviewSchema = joi.object({
    comment : joi.string()
            .min(5)
            
            
            .required(),
    rating : joi.number()
         .min(1)
         .max(5)
         .integer()
         .required(),
    
   
}).required();



module.exports.isValideReview = (req,res,next) =>{
  const { error} = reviewSchema.validate(req.body.review);
  
  if(error){
    req.flash('error',error.message);
    return res.redirect(`/campground/${req.params.id}`);
  }
  next();
}

