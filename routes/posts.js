const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
// Create a Post

router.post("/", async (req, res) => {
    console.log(req.body)
    const newPost = await new Post(req.body)

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(500).json(error)
    }
})

// update a post

router.put("/:id", async (req, res) => {
    try {

        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.updateOne({
                $set: req.body
            })
            res.status(200).json("Post Updated Successfully")
        }
        else {
            res.status(403).json("You can update only your post")
        }
    }
    catch (error) {
        res.status(500).json(error)
    }

})
// delete a post

router.delete("/:id", async (req, res) => {
    try {

        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.deleteOne()
            res.status(200).json("Post Deleted Successfully")
        }
        else {
            res.status(403).json("You can delete only your post")
        }
    }
    catch (error) {
        res.status(500).json(error)
    }

})

// like & dislike a post

router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log(post)
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({
                $push: {
                    likes: req.body.userId
                }
            })
            res.status(200).json("liked post")
        }
        else {
            await post.updateOne({
                $pull: {
                    likes: req.body.userId
                }
            })
            res.status(200).json("unliked post")
        }
    } catch (error) {
        res.status(500).json(error)
    }

})
// get a post

router.get("/:id", async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
})

// get timeline post

router.get("/timeline/:userId", async (req, res)=>{
    console.log(req.params.userId)
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPost = await Post.find({userId:currentUser._id});
        const friendPosts =await Promise.all(           
            currentUser.following.map((friendId)=>{
                return Post.find({userId:friendId})
            })
            )
        res.status(200).json(userPost.concat(...friendPosts))
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/", (req, res) => {
    res.send("post")
})
module.exports = router