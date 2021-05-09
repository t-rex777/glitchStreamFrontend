const express = require("express");
const {
  getUserById,
  signUp,
  signIn,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
  updateUserLikedVideos,
  updateUserHistory,
  updateUserSuscription,
  updateUserPlaylist
} = require("./controller");
const router = express.Router();

// middleware
router.param("userId", getUserById);
// router.param("videoId");

// routes
router.get("/users", getAllUsers);
router.post("/signup", signUp);
router.post("/signIn", signIn);

router.route("/user/:userId").get(getUser).post(updateUser).delete(deleteUser);

// router.get("/user/:userId/likedvideos/",getAllLikedVideos);
router.post("/user/:userId/likedvideo/:videoId",updateUserLikedVideos);
router.post("/user/:userId/suscription",updateUserSuscription);
router.post("/user/:userId/history/:videoId",updateUserHistory);
router.post("/user/:userId/playlist",updateUserPlaylist);

module.exports = router;
