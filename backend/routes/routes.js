const express = require('express');
const Post = require("../models/user");
const multer= require("multer");

const IMAGE_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage= multer.diskStorage({
    destination: (req, file, cb)=>{
        const isValid= IMAGE_TYPE[file.mimetype];
        let error = new Error("invalid mime type");
            if(isValid){
                error= null;
            }
        cb(null, "backend/images")
    },
    filename: (req, file, cb)=>{
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext= IMAGE_TYPE[file.mimetype];
        cb(null, name+'-'+Date.now()+'.'+ ext);
    }
})

const router = express.Router();

router.post('/api/createUser', multer({storage: storage}).single("image") , async  (req, res, next)=>{
    const url = req.protocol+'://'+req.get("host");

    const post= new Post({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        imagePath: url + "/images/" +req.file.filename
    });
    console.log(post);
    //db.posts.createIndex( { "_id": 1 }, { unique: true } )

    const result= await post.save();

    if(result){
        res.status(200).json({
            message: "Post added with success",
            post:{
                ...result,
                postId: result._id
            }
        })
    }
    else{
        res.status(500).json({
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
});

router.put('/api/user/:id', multer({storage: storage}).single("image") , async(req, res, next)=>{

    let imagePath = req.body.imagePath;
    
        const url = req.protocol+'://'+req.get("host");
        imagePath= url + "/images/" +req.file.filename;
    
    const post= new Post({
        _id: req.body.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        imagePath: imagePath
    });
    const result = await Post.updateOne({ _id: req.params.id}, post);
    // console.log(result);
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