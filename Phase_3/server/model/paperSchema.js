const {Schema, model} = require("mongoose");

const paperSchema = new Schema({
    title: {
        type: String,
    },
    
    paperLink:{
        type: String,
        required: true
    },
    contributerName:{
        type: String,
    }

}, {timestamps: true});


const Paper = model('paper',paperSchema );

module.exports.Paper = Paper;