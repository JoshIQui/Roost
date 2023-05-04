const models = require('../models');
const File = require('../models/Filestore');

const { Video } = models;

const uploaderPage = async (req, res) => res.render('studio');

const uploadVideo = async (req, res) => {
  if (!req.body.title || !req.body.description || !req.body.file) {
    return res.status(400).json({ error: 'Title, description, and file are required!' });
  }

  const newFile = new File(req.body.file);

  console.log(newFile);

  const videoData = {
    title: req.body.title,
    description: req.body.description,
    file: newFile,
    owner: req.session.account._id,
  };

  try {
    const newVideo = new Video(videoData);
    await newVideo.save();
    return res.status(201).json({ title: newVideo.title, description: newVideo.description, file: newVideo.file });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Video already exists!' });
    }
    return res.status(500).json({ error: 'An error occured uploading this video!' });
  }
};

const deleteVideo = async (req, res) => {
  try {
    await Video.deleteOne({ _id: req.body.id });
    return res.status(200).json({ message: 'DELETED' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured deleting this video!' });
  }
};

const getOwnedVideos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Video.find(query).select('title owner views').lean().exec();
    return res.json({ videos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving videos!' });
  }
};

const getVideo = async (req, res) => {
  try {
    //console.log(req.headers.id);
    const docs = await Video.findOne({ _id: req.headers.id }).exec();
    return res.json({ player: docs, redirect: 'viewer' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving video!' });
  }
};

const getVideoPage = async (req, res) => res.render('viewer');

const getPlayer = async (req, res) => {
  try{
    const docs = await Video.findOne({ _id: req.headers.id }).exec();
    return res.json({ player: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving video!' });
  }
};

module.exports = {
  uploaderPage,
  uploadVideo,
  getOwnedVideos,
  getVideo,
  getVideoPage,
  getPlayer,
  deleteVideo,
};
