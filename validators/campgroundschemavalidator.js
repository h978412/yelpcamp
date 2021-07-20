const joi = require('joi');

const campgroundSchema = joi.object({
    location : joi.string()
           
            
            .required(),
    title : joi.string()
        
         
         .required(),
    
    price : joi.number().min(0).required(),
    
    description : joi.string()
                
                .required()
}).required();



module.exports.isValideCampground = (req,res,next) =>{
  const { error} = campgroundSchema.validate(req.body.campground);
  
  if(error){
    req.flash('error',error.message);
    return res.redirect(`/campground/new`);
  }
  next();
}

