exports.home = (req,res,next)=>{
    account=req.session.account;
      res.render('home/home',{title: "Home",account:account});
  }
  