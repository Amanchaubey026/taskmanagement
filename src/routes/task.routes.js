const express = require("express");
const { taskModel } = require("../models/task.schema");
const { auth } = require("../middlewares/auth.middleware");
const { access } = require("../middlewares/access.middleware");
const taskRouter = express.Router();

/**
 * @swagger
 * tags:
 *  name:Tasks
 *  description: Task management routes
 */


/**
 * @swagger
 * /addTask:
 *    post:
 *      summary: Add a new task
 *      tags: [Tasks]
 *      requestBody:
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      title:
 *                          type: string
 *                      description:
 *                          type: string
 *                      priority:
 *                          type: string
 *                          enum: [low,medium,high]
 *                      deadline:
 *                          type: string
 *                          format: date-time
 *      responses:
 *          '200':
 *              description: Task created successfully
 *          '500':
 *              description: Internal server error
 */

taskRouter.post("/addTask",auth,access('Admin'), async (req, res) => {
    const createdBy = req.userID;
    console.log(req.userID);
  const {
    title,
    description,
    priority,
    deadline,
    dependencies,
    isRecurring
  } = req.body;
  try {
    const  newTask = new taskModel({
        title,
        description,
        priority,
        deadline,
        dependencies,
        isRecurring,
        createdBy,
        assignedTo:createdBy
      });
      await newTask.save();
      res.status(200).send({message:'task Added',newTask:newTask})
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});


/**
 * @swagger
 * /updatetask/{id}:
 *    patch:
 *      summary: update a new task
 *      tags: [Tasks]
 *      requestBody:
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      title:
 *                          type: string
 *                      description:
 *                          type: string
 *                      priority:
 *                          type: string
 *                          enum: [low,medium,high]
 *                      deadline:
 *                          type: string
 *                          format: date-time
 *      responses:
 *          '200':
 *              description: Task created successfully
 *          '404':
 *              description: Task not found
 *          '500':
 *              description: Internal server error
 */
taskRouter.patch('/updatetask/:id',auth,access('Admin','Members'),async(req,res)=>{
    const taskID = req.params.id;
    const {title,description,priority,deadline,dependencies} = req.body
    try {
            const updatedTask = await taskModel.findByIdAndUpdate(taskID,{title,description,priority,deadline,dependencies},{new:true});
            if(!updatedTask){
                return res.status(404).send({message:'Task does not exist.'});
            }
            res.status(200).send(updatedTask);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
})


/**
 * @swagger
 * /deletetask/{id}:
 *    delete:
 *      summary: update a new task
 *      tags: [Tasks]
 *      responses:
 *          '200':
 *              description: Task created successfully
 *          '404':
 *              description: Task not found
 *          '500':
 *              description: Internal server error
 */
taskRouter.delete('/deletetask/:id',auth,access('Admin','Managers','Members'),async(req,res)=>{
    const taskID = req.params.id;
    try {
        const task = await taskModel.findById(taskID);
        if(!task){
            return res.status(404).send({message:'Task does not exist.'});
        }
        if(task.createdBy.toString() !== req.userID ){
            return res.status(404).send({message:'Unauthorized.'});
        }
        await taskModel.findByIdAndDelete(taskID);
        res.send({message:'Deleted successfully',task:task});

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
})

/**
 * @swagger
 * /alltask:
 *    get:
 *      summary: Get all task
 *      tags: [Tasks]
 *      responses:
 *          '200':
 *              description: List of all the task 
 *          '500':
 *              description: Internal server error
 */
taskRouter.get('/alltask',auth,access('Admin'),async(req,res)=>{
  try {
      const tasks = await taskModel.find({});
      res.status(200).send(tasks);
  } catch (error) {
      console.log(error);
        res.status(500).send({ message: error.message });
  }
})
module.exports = {
  taskRouter,
};
