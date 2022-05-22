const {Schema, model} = require("mongoose");
const {ObjectId} = Schema.Types
const autopopulate = require('mongoose-autopopulate')
const projectSchema = new Schema({
    title: {
        type: String,
    },
    
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date
    },
    description: {
        type: String
    },
    teamLead: {
        type:ObjectId,
        ref:'user',
        autopopulate: {select: 'name nslId role '}
    },
    members: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        autopopulate: {select: 'name nslId role '}
    },
    // reports: {
    //     type: Buffer
    // },
    // research:{
    //     type: [Schema.Types.ObjectId],
    //     ref: 'research'
    // }


}, {timestamps: true});

projectSchema.plugin(autopopulate)

const Project = model('project', projectSchema);

module.exports.Project = Project;