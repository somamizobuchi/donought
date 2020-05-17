const mongoose = require('mongoose');
const task = require('./Task');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstname: String, 
    lastname: String, 
    email: String,
    password: String,
    tasks: [task]
},{
    timestamps: true
});

userSchema.statics.generateHash = async (password) => {
    const saltRounds = 10;
    let hash;
    try{
        hash = await bcrypt.hash(password, saltRounds)
    }catch(err){
        throw new Error(err);
    }
    return hash
}

userSchema.statics.compareHash = async (password, hash) => {
    let same;
    try {
        same = await bcrypt.compare(password, hash);
    } catch (err) {
        throw new Error(err)
    }
    return same
    
}

module.exports = mongoose.model('user', userSchema)