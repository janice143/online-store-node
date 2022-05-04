const mongoose = require('mongoose')

// category schema
const CategorySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String,
    }
  });

const Category = mongoose.model('category', CategorySchema);
module.exports = Category;
