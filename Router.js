const express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require("path");
const signupschema =require('./database/models/signupSchema');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


router.use(express.json());

router.use(cookieParser());

const auths = async (req,res,next)=>{
    try {
        const token = req.body.token;
        //console.log("inside auths" + token)
        const verify =  jwt.verify(token,`ddbjefghbhegcwegjfegjheghjegefgfsdwesssszmkjnjhuyutyvfhgdhghjdchsdvhgyhefehyefhgyrh`);
        const userd =  await signupschema.findOne({_id:verify._id});
       // console.log(userd);
       if(userd === undefined || userd === null || userd === "" || userd == ''){
         res.status(404).json({message : "not valid"})
       }
        req.user = userd;
        req.token = token;
        next();
        
        
    } catch (error) {
        res.status(404).json({message :`${error}`})
      
      }
  }
router.post('/cart', auths , async(req,res)=>{
  console.log("hello")
  console.log(req.body.products)
  req.user.products = req.body.products 
  
 
   req.user.totalItemsInCart = req.body.totalItemsInCart ;
 
   req.user.totalCartCost = req.body.totalCartCost;
  console.log(req)
  await req.user.save();
  res.status(200).json({
    message: "Cart Items Updated"
  })
})  

router.post("/updatingaddress" ,auths ,  async(req,res)=>{
  let address = req.body.address;
  req.user.shippingAddress = address ;
  await req.user.save();
  res.status(200).json({
    message : "Shipping Address Updated"
  });

})

router.post("/getaddress" ,auths, async(req,res)=>{
  let result;
  if(req.user.shippingAddress == null || req.user.shippingAddress == undefined){
    result = {
      line:"",

    city: "",
    pincode: "",
    state : "",
    name : req.user.name,
    email: req.user.email,
    phone:req.user.phone
    }
  }
  else{
   result = {

    line:req.user.shippingAddress.Shipping_street,

    city: req.user.shippingAddress.shipping_city,
    pincode: req.user.shippingAddress.shipping_zip,
    state : req.user.shippingAddress.shipping_state,
    name : req.user.name,
    email: req.user.email,
    phone:req.user.phone
  }
}
  res.status(200).json(result);

})


router.post('/getcart', auths , async(req,res)=>{
  console.log("hello")
  let products = req.user.products ;
  let totalItemsInCart = req.user.totalItemsInCart;
  let totalCartCost = req.user.totalCartCost;
  let result = {
      products : products,
      totalCartCost : totalCartCost,
      totalItemsInCart : totalItemsInCart
  }
  res.status(200).json(result)
}) 
  
router.post('/logout' ,auths , async (req,res)=>{
   try{   
     req.user.tokens = req.user.tokens.filter((curr)=>{
        return curr.token != req.token;
     })
    //res.clearCookie("jwt");
   // await req.user.save();
    res.status(200).json({message :`See You Soon ✋                    
    🌟 User Logout Sucessfully 🌟`,
  status: 200});
   }
   catch(err)
   {
    // console.log(err);
    res.status(404).json({message:`${err}`})
   }
  });
  


router.post('/login', async (req, res) => {
    var result=  null ;
    var password = req.body.password;
    var email = req.body.email;
    try
    {
         result = await signupschema.findOne({email:email});
            if(result == null)
            {
                res.status(404).json({message : `Invalid Credentials 😢`,
                valid:"false"});
            }
    }
    catch(err)
    {
     // console.log(err);
      res.status(400).json({message : ` Please Try After Some Time 🙋`,
      valid:"false"});
    }
    
    const isMatch = await bcrypt.compare(password,result.password);


    const token  =  await result.generateAuthToken();
    if (isMatch) {
        console.log(token + "________________" + result.name);
        res.status(200).json({message : `Login Sucessfully 🌟`,
    valid:"true",
    token:token,
    status:200,
    
    name :result.name
  });
     
    }
    else {
      //console.log(result);
      res.status(404).json({message : `Invalid Credentials 😢`,
    valid:"false"});
    }

  
});
router.post('/signup', async (req, res) => {
    console.log("Hello");
    try {
        let  Hashpassword = await bcrypt.hash(req.body.password,10);
        req.body.password = Hashpassword;
        const user = new signupschema(req.body);
        try{
        const d = await user.save();
        }
        catch(e)
        {
          res.status(401).json({message :`${e}`});
        }
        console.log("saved");
       res.status(201).json({message : "User Registered Sucessfully",status:200});
      
    }
    catch (err) {
       // console.log(err);
        res.status(400).send(err);
    }
  
});





module.exports = router;