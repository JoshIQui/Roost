const models = require('../models');
const File = require('../models/Filestore');

const { Video } = models;

// Renders the studio handlebar.
const uploaderPage = async (req, res) => res.render('studio');

// Saves the uploaded video to the server as a video model
const uploadVideo = async (req, res) => {
  if (!req.body.title || !req.body.description || !req.files.file) {
    return res.status(400).json({ error: 'Title, description, and file are required!' });
  }

  const newFile = new File(req.files.file);

  const videoData = {
    title: req.body.title,
    description: req.body.description,
    name: newFile.name,
    data: newFile.data,
    size: newFile.size,
    mimetype: newFile.mimetype,
    owner: req.session.account._id,
    ownerName: req.session.account.username,
  };

  try {
    const newVideo = new Video(videoData);
    await newVideo.save();
    return res.status(201).json({ message: 'Uploaded Successfully' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Video already exists!' });
    }
    return res.status(500).json({ error: 'An error occured uploading this video!' });
  }
};

// const deleteVideo = async (req, res) => {
//   console.log(req.body.id);
//   try {
//     await Video.deleteOne({ _id: req.body.id });
//     return res.status(200).json({ message: 'DELETED' });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: 'An error occured deleting this video!' });
//   }
// };

// Returns all videos owned by the session's account.
const getOwnedVideos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Video.find(query).select('title owner ownerName').lean().exec();
    return res.json({ videos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving videos!' });
  }
};

// Returns all videos owned by the specified account.
const getAccountVideos = async (req, res) => {
  try {
    const docs = await Video.find({ owner: req.headers.id }).select('title owner ownerName').lean().exec();
    return res.json({ videos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving videos!' });
  }
};

// Gets the video information from an ID
const getVideo = async (req, res) => {
  if (!req.headers.id) {
    return res.status(404).json({ error: 'Video not found' });
  }

  try {
    const docs = await Video.findOne({ _id: req.headers.id }).exec();
    return res.json({ player: docs, redirect: 'viewer' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving video!' });
  }
};

// Renders the viewer handlebar.
const getVideoPage = async (req, res) => res.render('viewer');

// Gets specific video information.
const getPlayer = async (req, res) => {
  if (!req.query._id) {
    return res.status(400).json({ error: 'Missing file id!' });
  }

  let docs;

  try {
    docs = await Video.findOne({ _id: req.query._id }).exec();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving video!' });
  }

  if (!docs) {
    return res.status(404).json({ error: 'Video not found!' });
  }

  res.set({
    'Content-Type': docs.mimetype,
    'Content-Length': docs.size,
    'Content-Disposition': `filename="${docs.title}`,
  });

  return res.send(docs.data);
};

module.exports = {
  uploaderPage,
  uploadVideo,
  getOwnedVideos,
  getAccountVideos,
  getVideo,
  getVideoPage,
  getPlayer,
  //deleteVideo,
};
