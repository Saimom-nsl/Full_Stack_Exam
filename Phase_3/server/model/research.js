const {Schema, model} = require("mongoose");
const autopopulate = require('mongoose-autopopulate')
const researchSchema = Schema({
    title: {
        type: String,
    },
    publishYear: {
        type: String,
    },
    description: {
        type: String
    },
    // result: {
    //     type: Object,
    // },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        autopopulate: {select: 'name nslId role -_id'}
    }

}, {timestamps: true});
researchSchema.plugin(autopopulate)

const Research = model('research', researchSchema);

module.exports.Research = Research;