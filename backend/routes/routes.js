const express = require('express');
const Post = require("../models/user");

const router = express.Router();

router.post('/api/createUser',async  (req, res, next)=>{
    const post= new Post({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone
    });
    console.log(post);
    //db.posts.createIndex( { "_id": 1 }, { unique: true } )

    const result= await post.save();

    if(result){
        res.status(200).json({
            message: "Post added with success",
            postId: result._id
        })
    }
    else{
        res.status(400).json({
            message:"User with email id already exist"
        })
    }

});


router.get('/api/userList', async (req, res, next)=>{
    const result = await Post.find();
    if(!result) return;

    res.status(200).json({
        message:'Success',
        posts: result                
    })
});

router.get('/api/user/:id', async(req, res, next)=>{
    console.log(req.params.id)
    const result = await Post.findById(req.params.id);
    console.log(result);
    if(!result) {
        return res.status(404).json({
        message:"User not found"
    })}
    else{
        res.status(200).json(result)
    }
    // Post.findById(req.params.id).then(()=>{
    //     res.status(200).json(result);
    // })
})

router.put('/api/user/:id', async(req, res, next)=>{
    const post= new Post({
        _id: req.params.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone
    });
    const result = await Post.updateOne({ _id: req.params.id}, post);
    console.log(result);
    if(!result) return

    res.status(200).json({
        message: "Success",
        result: result
    })
})

router.delete('/api/user/:id', async (req, res)=>{
    console.log(req.params.id);
    const result= await Post.deleteOne({_id:req.params.id})
    res.status(200).json({
        message: "Post deleted"
    })
});

module.exports= router;