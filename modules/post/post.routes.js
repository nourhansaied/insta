const {auth} = require("../../middleware/auth");
const { addPost, likePost, createComment, getSinglePost } = require("./controller/posts.controller");
const endPoints = require("./endPoints");
 
const router = require("express").Router();


router.post("/addPost", auth(endPoints.post), addPost);
router.get("/post/:id", getSinglePost);

router.patch("/likes/:id", auth(endPoints.post), likePost);

router.post("/comment/:id", auth(endPoints.post), createComment);


module.exports = router;
