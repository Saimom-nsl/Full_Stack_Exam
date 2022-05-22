
const { Schema, model } = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    nslId: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "teamlead", "user"],
        default: 'user'
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }
    ]
},{ timestamps: true })

userSchema.methods.generateJWT = function () {
    const token = jwt.sign({
        _id: this._id,
        name: this.name,
        role:this.role
    }, process.env.SECRET_KEY)
    this.tokens = this.tokens.concat({ token: token });

    return token;
}

const User = model('user', userSchema);

module.exports.User = User;
