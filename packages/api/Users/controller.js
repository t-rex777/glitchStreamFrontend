const User = require("./model");
const Video = require("../Video/model");
const { extend, concat, union } = require("lodash");
const { Mongoose } = require("mongoose");

//fining user by Id
exports.getUserById = async (req, res, next, userId) => {
  try {
    const user = await User.findById(userId)
      .populate("likedVideos")
      .populate("history");
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

//Read
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .populate("likedVideos")
      .populate("history");
    res.send(users);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    await res.send(req.user);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Create
exports.signUp = async (req, res) => {
  try {
    const user = await new User(req.body);
    await user.save((err, user) => {
      if (err) {
        return res.status(400).json({
          message: "User didn't save",
        });
      }
      res.send(user);
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    const user = await req.body;
    const { email, password } = user;
    const userEmail = email;
    await User.findOne({ email: userEmail }).populate("likedVideos")
    .populate("history").exec((err, user) => {
      if (err) {
        return res.status(400).json({
          // NOTE: check for error
          message: "user does not exists!",
        });
      }
      res.json(user);
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

//Update
exports.updateUser = async (req, res) => {
  try {
    let updatedUser = req.body;
    const { user } = req;
    updatedUser = await extend(user, updatedUser);
    updatedUser.save((err, updatedUser) => {
      if (err) {
        return res.status(400).json({
          message: "User didn't updated",
        });
      }
      res.send(updatedUser);
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.updateUserPlaylist = async (req, res) => {
  try {
    const newPlaylist  = req.body;  //Note:check for destructure
    let { user } = req;
    // user.playlists.forEach(playlist=>{
    //   if(playlist.name === newPlaylist.name){
    //     console.log("playlist already exists!")
    //     playlist.videos.forEach(id=>{
    //       if(newPlaylist.videos.includes(id)){
    //         console.log("id also included from same playlist")
    //         return;
    //       }
    //       console.log("playlist exists but not id")
    //     })
       
    //     return;
    //   }
    //   console.log(newPlaylist,"newplaylist");

    // })
    user = extend(user, {
      playlists: concat(user.playlists,newPlaylist),
    });
    user.save((err, updatedUser) => {
      if (err) {
        return res.status(400).json({
          message: "playlist didn't updated",
        });
      }
      res.send(updatedUser);
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


exports.updateUserSuscription = async (req, res) => {
  try {
    const { suscriptions } = req.body;
    let { user } = req;
    console.log(suscriptions);
    user = extend(user, {
      suscriptions: concat(user.suscriptions, suscriptions),
    });
    user.save((err, updatedUser) => {
      if (err) {
        return res.status(400).json({
          message: "suscription didn't updated",
        });
      }
      res.send(updatedUser);
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.updateUserLikedVideos = async (req, res) => {
  try {
    const { videoId } = req.params;
    let { user } = req;
    user = extend(user, {
      likedVideos: concat(user.likedVideos, videoId),
    });
    user.save((err, updatedUser) => {
      if (err) {
        return res.status(400).json({
          message: "likedVideos didn't updated",
        });
      }
      res.send(updatedUser);
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.updateUserHistory = async (req, res) => {
  try {
    const { videoId } = req.params;
    let { user } = req;

    user = extend(user, {
      history: concat(user.history, videoId),
    });
    user.save((err, updatedUser) => {
      if (err) {
        return res.status(400).json({
          message: "history didn't updated",
        });
      }
      res.send(updatedUser);
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Delete
exports.deleteUser = (req, res) => {
  try {
    const { user } = req;
    user.deleteOne((err, user) => {
      if (err) {
        return res.status(400).json({
          message: "user didn't delete!",
        });
      }
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
