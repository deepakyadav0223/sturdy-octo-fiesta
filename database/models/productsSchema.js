

const mongoose = require('mongoose');
const validator=  require('validator');
const jwt = require('jsonwebtoken')

var signup = new mongoose.Schema({
    email:
    {
      type:String ,
       required:true,
       unique:[true,"Email is Already Present"],
      validate(value){
        if(!validator.isEmail(value))
        {
          throw new Error("Invalid Email Address")
        }
      }
      
    },
    name: 
    {
      type:String
      
    },
    phone :
    {
      type :Number,
      unique:true,
     // min:[10 ,"Phone number alteast 10 digits"]
      
    },
    password:{
      type:String,
      required:true
    },
    address:
    {
      type:String,

    },
    tokens:[{
      token:{
        type:String,
        required:true
      }
    }]
})


signup.methods.generateAuthToken = async function(){
  try {
    const token  = jwt.sign({_id:this._id.toString()},`ddbjefghbhegcwegjfegjheghjegefgfsdwesssszmkjnjhuyutyvfhgdhghjdchsdvhgyhefehyefhgyrh`);
    //console.log(token);
    this.tokens = this.tokens.concat({token:token});
    await this.save();
    return token;
    
  } catch (error) {
   console.log(error);
   res.send(error);
    
  }

}

var sign = mongoose.model('shoppingCart', signup);

module.exports = sign;