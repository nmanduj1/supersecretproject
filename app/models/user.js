var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: String,
	lastName: String,
	userName: String,
    email: String  
    // DOB
    
});
    
module.exports = mongoose.model('User', UserSchema);