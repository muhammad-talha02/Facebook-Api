const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// update user

router.put("/:id", async (req, res) => {
    console.log(req.body)
    if (req.body.userId === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (error) {
                return res.status(500).res.json(error)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.status(200).json("Account has been updated")
        } catch (error) {
            return res.status(500).res.json(error)
        }
    }
    else {
        return res.status(403).json("You can update only your account")
    }
})

// delete user

router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.deleteOne({ _id: req.params.id })
            res.status(200).json("Account has been deleted")
        } catch (error) {
            return res.status(500).json(error)
        }
    }
    else {
        return res.status(403).json("You can delete only your account")
    }
})

// get a user

router.get("/", async (req, res) => {
    const userId = req.query.userId
    const username = req.query.username
try {
    const user = userId ? await User.findById(userId) : await User.findOne({username:username});
    // console.log(req.query)
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(other)
    } catch (error) {
        return res.status(403).json("User not found")
    }
})


//follow a user

router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $push: {
                        following: req.body.userId
                    }
                })
                await currentUser.updateOne({
                    $push: {
                        followers: req.params.id
                    }
                })
                res.status(200).json("user has been followed")
            }
            else {
                res.status(403).json('You already follow this user')
            }

        } catch (error) {
            res.status(500).json(error)
        }
    }
    else {
        res.status(403).json("You can't follow yourself.")
    }
})


//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId);
            if (user.following.includes(req.body.userId)) {
                await user.updateOne({
                    $pull: {
                        following: req.body.userId
                    }
                })
                await currentUser.updateOne({
                    $pull: {
                        followers: req.params.id
                    }
                })
                res.status(200).json("user has been unfollowed")
            }
            else {
                res.status(403).json('You are not follow this user')
            }

        } catch (error) {
            res.status(500).json(error)
        }
    }
    else {
        res.status(403).json("You can't unfollow yourself.")
    }
});



router.get("/", (req, res) => {
    res.send("Welcome to users Router")
})

module.exports = router;