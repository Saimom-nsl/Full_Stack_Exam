const express = require('express');
const _ = require('lodash');
const cookieParser = require('cookie-parser');
const router = express.Router();
const app = express();
const  { Research} = require('../model/research')
const auth = require('../Middleware/authorization');
const {User} = require('../model/user')
app.use(cookieParser())


const searchPaper =async(req,res)=>{
    const {searchText} = req.body
    if(!searchText) return res.status(400).json({message:"Field Is Empty"})
    console.log(searchText)
    const result = await Research.find({title:new RegExp('^'+'.*'+searchText,'i')})
    if(result.length===0||result===undefined)return res.status(200).json({message:'There Is No Data To Show'})
    else return res.status(200).send(result)
}
const createPaper = async(req,res)=>{
    const {title, publishYear, description, addedBy } = req.body
    if (!title||!publishYear ||!description ||!addedBy) {
        return res.status(400).json({message:"All fields must be filled up"})
    }

    const paper = new Research({...req.body})
    await paper.save()
    return res.status(200).json({message:"Paper uploaded successfully"})
}

const getContribution = async(req,res)=>{
    const result = await Research.aggregate([
        {
            $group:{
                _id:"$contributerName",
                total:{$sum:1}
            }
        }
    ])
    return res.status(200).send(result)
}

router.route('/searchpaper')
    .post(searchPaper)
router.route('/createpaper')
    .post(createPaper)
router.route('/getcontribution')
    .get(getContribution)
module.exports = router
