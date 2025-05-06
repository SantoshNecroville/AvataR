// models/Project.js
const mongoose = require('mongoose');

const DefaultSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  image: {
    type: String, 
    required:true,
  },
  audio: {
    type: String, 
    required:true,// store audio file path or URL
  }
});

module.exports = mongoose.model('Default', DefaultSchema);
