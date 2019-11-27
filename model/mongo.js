var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/userDB');
// create instance of Schema
var mongoSchema =   mongoose.Schema;
// create schema
var userSchema  = new mongoSchema({
    email : String,
    password : String
});
// create model if not exists.
module.exports = mongoose.model('userDB',userSchema);