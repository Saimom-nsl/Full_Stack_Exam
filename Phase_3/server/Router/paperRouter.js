const express = require('express');
const _ = require('lodash');
const cookieParser = require('cookie-parser');
const router = express.Router();
const app = express();
const {Paper} = require('../model/paperSchema')
const auth = require('../Middleware/authorization');

app.use(cookieParser())


const uploadFile =async (req,res) =>{
    const {title,paperLink,contributerName} = req.body
    // console.log(req.body);
    if (!paperLink||!title ) return res.status(400).json({ message: "Fill All the fields" })

    const paper = new Paper({title,paperLink,contributerName})
    await paper.save()
    return res.status(200).json({ message: "Paper Posted Succesfully" })
} 

const getPaper = async(req,res)=>{
    const paper = await Paper.find()
    if(!paper) return res.status(400).json({message:"There is no paper to show"})

    return res.status(200).send(paper)
}
const deletePaper =async (req,res)=>{
    const id = req.params.id
    try{
        const paper = await Paper.findByIdAndDelete(id)
        if(!paper) return res.status(400).json({message:"paper Not Found"})
        return res.status(200).send(paper)
    }catch(err){
        return res.status(400).send("Paper Not Found")
    }
}

const getContribution = async(req,res)=>{
    const result = await Paper.aggregate([
        {
            $group:{
                _id:"$contributerName",
                total:{$sum:1}
            }
        }
    ])
    return res.status(200).send(result)
}
router.route('/uploadpaper')
    .post(auth,uploadFile)
router.route('/getpaper')
    .get(auth,getPaper)
router.route('/deletepaper/:id')
    .delete(deletePaper)
router.route('/getpaperContribution')
    .get(getContribution)
module.exports = router