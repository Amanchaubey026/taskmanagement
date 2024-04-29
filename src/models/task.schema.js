const mongoose = require('mongoose');


const taskSchema = mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    priority:{type:String,enum:["low","medium","high"],default:"low"},
    deadline:{type:Date},
    dependencies:{type:mongoose.Schema.Types.ObjectId,ref:'task'},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    isRecurring:{type:Boolean,default:false},
    assignedTo:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    approvedByManager:{type:Boolean,default:false}
},{
    versionKey:false
})

const taskModel = mongoose.model('task',taskSchema);

module.exports ={
    taskModel
}