const sendEmail = require("../../../common/email");
const postModel = require("../../../DB/post.model");
const userModel = require("../../../DB/user.model");

const addPost =async (req,res) => {

    let { desc, title, tagsLink } = req.body;
    let allImages = [];
   
    if (req.files && req.files.length) {
      for (let i = 0; i < req.files.length; i++) {
        let imageURL = `${req.protocol}://${req.headers.host}/${req.files[i].path}`;
        allImages.push(imageURL);
      }
    }

    let tagedEmails= '' // for send emails
    let validId = [] // for database
    if (tagsLink.length >0) {
        for (let i = 0; i < tagsLink.length; i++) {
            let findUser = await userModel.find({});
            console.log(findUser);
            if (findUser) {
                validId.push(tagsLink[i]);
                if (tagedEmails.length) {
                  tagedEmails = tagedEmails + "," + findUser.email;
                } else {
                  tagedEmails = findUser.email;
                }
            }
        }
    }

    console.log(validId);

    let addPost = new postModel({ desc, title, tags: validId, images: allImages });
    let added =await addPost.save()

    

    res.json({ message: "Done", added });
}



const likePost = async (req, res) => {
  // get id
  
  try {
    let { id } = req.params;
    let post = await postModel.findById(id)
    if (post) {
    let userLiked =   post.likes.find((ele) => {
        return ele.toString() === req.user._id.toString()
    })
      if (userLiked) {
         res.status(400).json({ message: "you cannot like twice" });
      } else {
        post.likes.push(req.user._id);
        let updatedPost = await postModel.findByIdAndUpdate(id, { likes: post.likes }, { new: true });
        
  res.json({ message: "Done", updatedPost });
      }
      
    } else {
       res.status(404).json({ message: "post not found" });
    }

    
  } catch (error) {
    res.status(500).json({message: "error", error})
  }

  // 

}




const createComment = async (req, res) => {
  let { desc, tags } = req.body;
  let {id} = req.params
     let tagedEmails= '' // for send emails
    let validId = [] // for database
    if (tags.length >0) {
        for (let i = 0; i < tags.length; i++) {
            let findUser = await userModel.findOne({_id: tags[i]});
            if (findUser) {
                validId.push(tags[i]);
                if (tagedEmails.length) {
                  tagedEmails = tagedEmails + "," + findUser.email;
                } else {
                  tagedEmails = findUser.email;
                }
            }
        }
    }
  if (tagedEmails.length) {
    sendEmail(
      tagedEmails,
      `<h2>you are taged in a comment</h2>
      <br/>
      <a href="http://localhost:8888/post/${id}"> click here to view the post </a>      
    `,
      []
    );

  }

  let post = await postModel.findOne({ _id: id })
  if (post) {
    post.comments.push({ desc, tags: validId, userId: req.user._id });
    let updated = await postModel.findByIdAndUpdate(post._id, { comments: post.comments }, { new: true });
    res.json({message:"Done", updated})
    
  } else {
     res.status(404).json({ message: "post Not found" });
  }


  
  res.send("Asdasd")
}
const getSinglePost = async (req, res) => {
  let { id } = req.params
  if (!id) {
    res.status(400).json({ message: "invalid id", });
  } else {
    let post = await postModel.findById(id);
    if (post) {
      res.status(200).json({ message: "Done", post });
    } else {
        res.status(404).json({ message: "post Not found" });
    }
    }

}

module.exports = { addPost, likePost, createComment, getSinglePost };