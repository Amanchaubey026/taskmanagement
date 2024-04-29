const express = require('express');
const { connectionToDb } = require('./src/config/db.config');
const { userRouter } = require('./src/routes/user.routes');
const { taskRouter } = require('./src/routes/task.routes');
const app = express();
require('dotenv').config();
const PORT = process.env.port; 
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Task Management System',
        version: '1.0.0',
      },
      servers:[
        {
            url: "http://localhost:8080"
        }
      ]
    },
    apis: ['./src/routes/*.js'], 
  };
  
  const openapiSpecification = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(express.json());
app.use('/users',userRouter);
app.use('/task',taskRouter);

app.get('/',(req,res)=>{
    res.send('Server is up!! ')
})

app.listen(PORT,async()=>{
    try {
        await connectionToDb();
        console.log(`The app is listening on port http://localhost:${PORT}`);
        
    } catch (error) {
        console.log(error);
    }
})