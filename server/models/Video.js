const mongoose = require('mongoose');
const _ = require('underscore');
const File = require('./Filestore.js')

const setTitle = (title) => _.escape(title);

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    set: setTitle,
  },
  description: {
    type: String,
  },
  file: {
    type: File,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  views: {
    type: Number,
    min: 0,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

VideoSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  description: doc.description,
  file: doc.file,
});

const VideoModel = mongoose.model('Video', VideoSchema);
module.exports = VideoModel;
