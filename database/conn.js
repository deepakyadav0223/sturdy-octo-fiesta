const mongoose = require('mongoose');
const DB = `mongodb+srv://Deepak:Deepak%40123@cluster0.sgrqi.mongodb.net/shoppingCart?retryWrites=true&w=majority`
mongoose.connect(DB,{
    useNewUrlParser: true, 

    useUnifiedTopology: true 
}).then(()=>{
    console.log('Connected With database');
}).catch((err)=>{
    //alert('Error In DataBase Connection');
    console.log(err);
});