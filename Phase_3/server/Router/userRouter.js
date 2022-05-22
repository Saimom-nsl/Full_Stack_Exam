const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const router = express.Router();
const app = express();
const  { User} = require('../model/user')
const auth = require('../Middleware/authorization')

app.use(cookieParser())

//User Signup 
const signUp = async(req,res) => {
    try{
        const {name,nslId,password,cpassword,role} =req.body

        //All fields must be filled checking
        //same email login checking
        //password and confirm password match checking
        if(!name||!nslId||!password||!cpassword||!role) return res.status(400).json({message:"Fill all the fields"})
    
        var user = await User.findOne({nslId:nslId})
        if(user) return res.status(400).json({message:"User Id is already exist"})
    
        if(password!==cpassword) return res.status(400).json({message:"Password doesn't match"})
    
        //if all checking is ok then register the user to the database
        user = new User({name,nslId,password,cpassword,role})
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.cpassword = await bcrypt.hash(user.cpassword, salt);
    
        const confirmUser = await user.save()
    
        // return res.status(200).send({
        //     data:_.pick(confirmUser,['name','nslId','role'])
        // })
        return res.status(200).json({message:"User created successfully"})
    }catch(err){
        return res.status(400).json({message:"Role field must be admin teamlead user"})
    }
    
}

//user Login
const signIn = async (req,res)=>{
    const { nslId, password } = req.body
    if (!nslId || !password) return res.status(400).json({ message: "fill the empty field" });
    const user = await User.findOne({ nslId: req.body.nslId })
    if (!user) return res.status(400).json({ message: "incorrect userId or password" });
    const pass = await bcrypt.compare(req.body.password, user.password);
    if (!pass) return res.status(400).json({ message: "incorrect userId or password" });

    const token = user.generateJWT();

    res.cookie("jwtooken", token, {
        expires: new Date(Date.now() + 25892000000)
        // httpOnly: true
    });
    const result = await user.save();

    res.status(200).send({
        // token:token,
        data: _.pick(result, ['_id','name', 'nslId','role'])
    })

}

//Updating Password
const updatePassword = async(req,res)=>{
    const id = req.params.id
    const updatedData = req.body
    if (updatedData.password !== updatedData.cpassword) {
        return res.status(400).json({message:"Pasword does not match"})
    }else if(updatedData.password === "" || updatedData.cpassword === ""){
        return res.status(400).json({message:"No field should be empty"})
    }
    else{
        const salt = await bcrypt.genSalt(10);
        updatedData.password = await bcrypt.hash(updatedData.password, salt);
        updatedData.cpassword = await bcrypt.hash(updatedData.cpassword, salt);
        const user = await User.findByIdAndUpdate(id,updatedData,{new:true})
        if (!user) return res.status(400).json({ message: "Id Not Found" })
        return res.status(200).json({message:"Password updated Successfully"})
    }
}

//getting user

const getUser = async(req,res)=>{
    const queryStatus = req.query.status
    if(queryStatus==="all"){
        const user = await User.find()
        return res.status(200).send(user)
    }
    if(queryStatus === 'teamlead'){
        const user = await User.find({role:queryStatus})
        return res.status(200).send(user)
    }
    if(queryStatus === 'user'){
        const user = await User.find({role:queryStatus})
        return res.status(200).send(user)
    }
}

//Getting Authenticate login user info
const getAuthData = async(req,res)=>{
    res.status(200).send({
        data: _.pick(req.rootUser,['_id','nslId','name','role'])
    })
}

//All Api Related to user Schema
router.route('/userSignup')
    .post(signUp)
router.route('/userSignin')
    .post(signIn)
router.route('/updatePassword/:id')
    .put(auth,updatePassword)
router.route('/protecteddata')
    .get(auth,getAuthData)
router.route('/getUser')
    .get(auth,getUser)
module.exports = router