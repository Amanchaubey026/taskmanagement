const express = require("express");
const { userModel } = require("../models/user.schema");
const userRouter = express.Router();
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


/**
 * @swagger
 * tags:
 *  name:Users
 *  description: User management routes
 */

/**
 * @swagger
 * /signup:
 *    post:
 *      summary: Create a new user
 *      tags: [Users]
 *      requestBody:
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      username:
 *                          type: string
 *                      email:
 *                          type: string
 *                      password:
 *                          type: string
 *                      role:
 *                          type: string
 *      responses:
 *          '201':
 *              description: User created successfully
 *          '500':
 *              description: Internal server error
 */


userRouter.post('/signup',async(req,res)=>{
    const {username,email,password,role} = req.body;
    try {
        const hash = await bcrypt.hash(password,10);
        const newUser = new userModel({username,email,password:hash,role});
        await newUser.save();
        res.status(201).send({message:'Signup successful! ', user : newUser})
    } catch (error) {
        console.log(error);
        res.status(500).send({message: error.message});
    }
})


/**
 * @swagger
 * /login:
 *    post:
 *      summary: Login to user account
 *      tags: [Users]
 *      requestBody:
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      email:
 *                          type: string
 *                      password:
 *                          type: string
 *      responses:
 *          '201':
 *              description: Login successfully
 *          '401':
 *              description: Wrong credential
 *          '500':
 *              description: Internal server error
 */
userRouter.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send('User does not exist try signing up')
        }
        bcrypt.compare(password,user.password,(err,result)=>{
            if(err){
                return res.status(401).send("Wrong credentials - Enter correct credentials");
            }
            if(result){
                const jwt_payload = {userID:user._id,role:user.role};
                const token = jwt.sign(jwt_payload,process.env.JWT_Secret,{expiresIn:"1hr"});
                res.status(200).send({message:"Login successful",token:token})
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({message: error.message});
    }
})


module.exports = {
    userRouter
}