const Campground = require('./models/campground')
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        if(req.method==="GET"){
        req.session.returnTo = req.originalUrl;
        }
        req.flash('error','you must be logged in first');
        return res.redirect('/login');
    }
    next(); 
}

module.exports.isAuthor = async(req,res,next) =>{
    const id = req.params.id;
    const camp = await Campground.findById(id);
    if(!req.user.equals(camp.author)){
        req.flash('error','you are not creater of this campground');
        return res.redirect(`/campground/${id}`);
    }
   next();
  
}

