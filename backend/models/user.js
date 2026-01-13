const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name :  { type: String, required: true},
        user_name : { type: String, required: true, unique: true },
        email : { type: String, required: true, unique: true },
        password : { type: String, required: true },
        role: { 
            type: String, 
            enum: ['student', 'instructor', 'admin'], 
            default: 'student' 
        },
    },
    {
        timestamps: true,
    }
)

userSchema.methods.toJSON = function() {
    const userObject = this.toObject()
    delete userObject.password
    return userObject
}

const user = mongoose.model('User', userSchema)
module.exports = user