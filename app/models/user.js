var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    userName: String,
    name: String,
    // email: String  
    // DOB
    
});
    
module.exports = mongoose.model('User', UserSchema);