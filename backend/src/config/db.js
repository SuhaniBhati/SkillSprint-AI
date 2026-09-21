const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB Connected');

    }
    catch(err){
        console.error('Error connecting to MongoDB:', err);
    }

}

module.exports = connectDB;