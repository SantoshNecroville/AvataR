// models/Project.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
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
  },
  text: {
    type: String,
    required:true, // store associated textual content
  },
  video: {
    type: String, 
    required:true,// store video file path or URL
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
