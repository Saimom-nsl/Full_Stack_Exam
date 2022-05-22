const express = require('express');
const _ = require('lodash');
const cookieParser = require('cookie-parser');
const router = express.Router();
const app = express();
const  { Project} = require('../model/project')
const auth = require('../Middleware/authorization');

app.use(cookieParser())

//creating a new project
const createProject =async (req,res) => {
    const {title , startDate, endDate, description, teamLead, members, research} = req.body
    console.log(req.body);

    if(!title || !startDate || !endDate || !description || !teamLead ||!members){
        return res.status(400).json({message:"Required Fileds must be filled"})
    }
    var project = new Project({...req.body})
    await project.save()
    // return res.status(200).send(project)
    return res.status(200).json({message:"Project created Successfully"})
}

//Getting Project
const getProject= async(req,res)=>{
    const projects = await Project.find()
    if (!projects) {
        return res.status(400).json({message:"There is no project"})
    }
    return res.status(200).send(projects)
}

//Modify Project
const updateProject = async(req,res) =>{
    const id = req.params.id
    const updatedData = req.body
    const {title, startDate, endDate , description, teamLead,members,research} = req.body

    if((title ==="" || startDate==="" || endDate === "" || description==="" || teamLead==="" || members === "" )){
        return res.status(400).json({message:"All field must be filled up"})
    }
    else{
        const project = await Project.findByIdAndUpdate(id,updatedData,{new:true})
        if (!project) return res.status(400).json({ message: "Id Not Found" })
        return res.status(200).send(project)
    }
}

const deleteProject = async(req,res)=>{
        const id = req.params.id
        try{
            const project = await Project.findByIdAndDelete(id)
            if(!project) return res.status(400).json({message:"project Not Found"})
            return res.status(200).send(project)
        }catch(err){
            return res.status(400).send("Project Not Found")
        }
}

const searchProject = async(req,res) =>{
    const {searchText} = req.body
    console.log(searchText);
    if(!searchText) return res.status(400).json({message:"Field Is Empty"})
    // +'.*'
    const result = await Project.find({title:new RegExp('^'+searchText,'i')})
    if(result.length===0||result===undefined)return res.status(400).json({message:'There Is No Data To Show'})
    else return res.status(200).send(result)
}

//All Api Related to project Schema
router.route('/createproject')
    .post(auth,createProject)
router.route('/getproject')
    .get(auth,getProject)
router.route('/updateProject/:id')
    .put(auth,updateProject)
router.route('/deleteproject/:id')
    .delete(auth,deleteProject)
router.route('/searchproject')
    .post(auth,searchProject)
module.exports = router