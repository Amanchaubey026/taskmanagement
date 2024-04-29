const mongoose = require('mongoose');
require('dotenv').config();


async function connectionToDb(){
    try {
        await mongoose.connect(process.env.mongoURI);
        console.log('Connected to the database successfully!');
    } catch (error) {
        console.error(error.message);
    }   
}

module.exports = {
    connectionToDb
}