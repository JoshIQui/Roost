const mongoose = require('mongoose');
const _ = require('underscore');

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
  data: {
    type: Buffer,
  },
  size: {
    type: Number,
  },
  mimetype: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  ownerName: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// VideoSchema.statics.toAPI = (doc) => ({
//   title: doc.title,
//   description: doc.description,
//   file: doc.file,
// });

const VideoModel = mongoose.model('Video', VideoSchema);
module.exports = VideoModel;
