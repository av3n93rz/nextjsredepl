const express = require('express')
const {protect, admin} = require('../middlewares/authMiddleware')
const multer = require('multer')
const ImageKit = require("imagekit");

const router = express.Router()

const imagekit = new ImageKit({
    publicKey : "public_NIgiENDcwRcldcqTvAhgfYoksmU=",
    privateKey : "private_pQDEscKzdfHjKxkt6Zn7IbRC0EU=",
    urlEndpoint : "https://ik.imagekit.io/yy12fco4k5/"
});

const readImg = (image) =>{
  return new Promise(function(resolve, reject){
    imagekit.upload({
      file : image, //required
      fileName : "AvisProShop", //required
      useUniqueFileName: true,
    }, function(error, result) {
      if(error) reject(error);
      else resolve(result);
    })
})}

const storage = multer.memoryStorage();
const upload = multer({
  storage
})

router.post('/', protect, admin, upload.array('image'), async(req, res)=>{
  let urls =[]
  for(file in req.files){
    const imgurl = await readImg(req.files[file].buffer.toString('base64'))
    urls.push({url: imgurl.url, fileId: imgurl.fileId})
  }
  res.send(urls)
})

module.exports = router